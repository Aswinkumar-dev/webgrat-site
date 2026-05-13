package com.webgrat.agency.project.config;

import com.webgrat.agency.project.Security.SupabaseJwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SupabaseJwtFilter jwtFilter;

    @Value("${allowed.origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ── Public endpoints (no token needed) ──────────
                        // The marketing blog page loads posts, tag tabs and
                        // tag/category filters without any auth — these GETs
                        // must stay open or visitors hit a 403 the moment
                        // they click a tag.
                        .requestMatchers(HttpMethod.GET,
                                "/api/blogs/published",
                                "/api/blogs/slug/**",
                                "/api/blogs/tag/**",
                                "/api/blogs/category/**",
                                "/api/categories",
                                "/api/categories/**",
                                "/api/tags",
                                "/api/tags/**",
                                "/api/blogs/health"
                        ).permitAll()
                        // ── Server-rendered (Thymeleaf) public blog ─────
                        // /blog and /blog/{slug} are served by BlogPageController.
                        // Static assets used by those pages also need to be open.
                        .requestMatchers(HttpMethod.GET,
                                "/blog",
                                "/blog/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/favicon.ico",
                                "/error"
                        ).permitAll()
                        // Public form submissions from the marketing site
                        .requestMatchers(HttpMethod.POST,
                                "/api/contact",
                                "/api/digital-growth-contact",
                                "/api/subscribe"
                        ).permitAll()
                        // Allow CORS preflight on every endpoint
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ── Profile self read: any logged-in user ──
                        // A pending user still needs /me to succeed so the
                        // React app can tell them their account is waiting
                        // for super admin approval.
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()

                        // ── Admin-only write endpoints ─────────────────
                        // Only users whose profiles.role is 'admin' or
                        // 'super_admin' can create, update or delete
                        // blog content, media, categories and tags.
                        // Pending users are blocked here even if they have
                        // a valid Supabase session.
                        .requestMatchers(HttpMethod.POST, "/api/blogs/**", "/api/media/**",
                                "/api/categories/**", "/api/tags/**",
                                "/api/upload/**")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/blogs/**", "/api/media/**",
                                "/api/categories/**", "/api/tags/**",
                                "/api/upload/**")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/blogs/**", "/api/media/**",
                                "/api/categories/**", "/api/tags/**",
                                "/api/upload/**")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // ── Everything else requires a valid Supabase JWT ──
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Split comma-separated origins from application.properties
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}