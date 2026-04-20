package com.webgrat.agency.project.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {
    private String url;
    private String anonKey;
    private String serviceRoleKey;
    private String storage;
    private String jwtSecret;

    // nested class for storage bucket name
    @Data
    public static class Storage {
        private String bucket;
    }
}