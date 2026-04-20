package com.webgrat.agency.project.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Talks to Supabase via the PostgREST endpoint using the service-role key.
 * The service-role key bypasses Row Level Security, which is required so the
 * backend can write to the {@code subscribers} and {@code contact_submissions}
 * tables on behalf of anonymous website visitors.
 *
 * Scoped to the two tables the public site needs:
 *   - subscribers          (newsletter signups)
 *   - contact_submissions  (contact-form messages)
 */
@Slf4j
@Service
public class SupabaseRestService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.role.key}")
    private String serviceRoleKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Subscribers ──────────────────────────────────────────────

    /** Returns true if the email is already in the subscribers table. */
    @SuppressWarnings("rawtypes")
    public boolean isEmailSubscribed(String email) {
        String url = UriComponentsBuilder
                .fromUriString(baseUrl() + "/rest/v1/subscribers")
                .queryParam("email", "eq." + email)
                .queryParam("select", "id")
                .queryParam("limit", "1")
                .build()
                .toUriString();

        HttpEntity<Void> entity = new HttpEntity<>(authHeaders());

        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, List.class);
            List body = response.getBody();
            return body != null && !body.isEmpty();
        } catch (RestClientException e) {
            log.warn("Failed to check subscriber {}: {}", email, e.getMessage());
            // Treat unknown as "not subscribed" so we still attempt the insert.
            return false;
        }
    }

    public void addSubscriber(String email) {
        String url = baseUrl() + "/rest/v1/subscribers";

        HttpHeaders headers = authHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Prefer", "return=minimal");

        Map<String, Object> body = new HashMap<>();
        body.put("email", email);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(url, entity, String.class);
    }

    // ── Contact submissions ──────────────────────────────────────

    public void saveContactSubmission(String name, String email, String message) {
        String url = baseUrl() + "/rest/v1/contact_submissions";

        HttpHeaders headers = authHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Prefer", "return=minimal");

        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("email", email);
        body.put("message", message);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(url, entity, String.class);
    }

    // ── Helpers ──────────────────────────────────────────────────

    private String baseUrl() {
        return supabaseUrl.replaceAll("/$", "");
    }

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", serviceRoleKey);
        headers.set("Authorization", "Bearer " + serviceRoleKey);
        return headers;
    }
}
