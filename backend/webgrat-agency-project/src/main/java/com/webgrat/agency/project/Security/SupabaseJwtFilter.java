package com.webgrat.agency.project.Security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Set;

/**
 * Validates the Supabase access token that React sends as
 * `Authorization: Bearer <jwt>`.
 *
 * Supabase signs access tokens with an asymmetric key (ES256 / RS256) on
 * newer projects and with HS256 on legacy projects. We therefore verify
 * against Supabase's published JWKS endpoint
 *    {supabase.url}/auth/v1/.well-known/jwks.json
 * which works for all three algorithms. The Nimbus JWKSource caches the
 * keys in memory and refreshes them automatically on rotation.
 */
@Slf4j
@Component
public class SupabaseJwtFilter extends OncePerRequestFilter {

    @Value("${supabase.url}")
    private String supabaseUrl;

    private ConfigurableJWTProcessor<SecurityContext> jwtProcessor;

    @PostConstruct
    public void init() {
        String jwksUrl = supabaseUrl.replaceAll("/$", "")
                + "/auth/v1/.well-known/jwks.json";

        URL parsedUrl;
        try {
            parsedUrl = new URL(jwksUrl);
        } catch (MalformedURLException e) {
            throw new IllegalStateException(
                    "Invalid Supabase JWKS URL: " + jwksUrl, e);
        }

        JWKSource<SecurityContext> jwkSource = JWKSourceBuilder
                .create(parsedUrl)
                .retrying(true)
                .build();

        // Accept any of the algorithms Supabase may sign with. The key
        // selector picks the right key for each token based on its `kid`.
        Set<JWSAlgorithm> supported = Set.of(
                JWSAlgorithm.HS256,
                JWSAlgorithm.ES256,
                JWSAlgorithm.RS256
        );

        DefaultJWTProcessor<SecurityContext> processor = new DefaultJWTProcessor<>();
        JWSKeySelector<SecurityContext> keySelector =
                new JWSVerificationKeySelector<>(supported, jwkSource);
        processor.setJWSKeySelector(keySelector);

        this.jwtProcessor = processor;

        log.info("Supabase JWT filter initialised with JWKS: {}", jwksUrl);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // No token — pass through. SecurityConfig decides if the route is public.
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            JWTClaimsSet claims = jwtProcessor.process(token, null);

            // Supabase puts the user UUID in the "sub" claim
            String userId = claims.getSubject();

            // Supabase puts the role in the "role" claim. For authenticated
            // users this is "authenticated". Fall back defensively if missing.
            Object roleClaim = claims.getClaim("role");
            String role = roleClaim != null ? roleClaim.toString() : "authenticated";

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Invalid or expired token\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
