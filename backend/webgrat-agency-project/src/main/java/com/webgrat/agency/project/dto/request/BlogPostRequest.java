package com.webgrat.agency.project.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
public class BlogPostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    private String coverImageUrl;

    private UUID categoryId;

    private UUID authorId;

    private Set<UUID> tagIds;

    private String metaTitle;

    private String metaDescription;

    /**
     * When the post should be considered "published". If omitted on create,
     * the service defaults this to <em>now</em>. On update, a {@code null}
     * value means "leave the existing date alone" — it never silently
     * unpublishes a post.
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime publishedAt;
}
