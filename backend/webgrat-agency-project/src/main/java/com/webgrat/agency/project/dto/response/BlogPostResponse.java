package com.webgrat.agency.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class BlogPostResponse {

    private UUID id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImageUrl;
    private CategoryResponse category;
    private AuthorInfo author;
    private Set<TagResponse> tags;
    private String metaTitle;
    private String metaDescription;
    private Integer readTimeMinutes;
    private OffsetDateTime publishedAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @Data @Builder
    public static class AuthorInfo {
        private UUID id;
        private String fullName;
        private String email;
        private String avatarUrl;
    }
}

