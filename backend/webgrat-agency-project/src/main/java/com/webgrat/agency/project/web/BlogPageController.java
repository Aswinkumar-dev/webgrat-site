package com.webgrat.agency.project.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webgrat.agency.project.Exception.ResourceNotFoundException;
import com.webgrat.agency.project.dto.response.BlogPostResponse;
import com.webgrat.agency.project.dto.response.TagResponse;
import com.webgrat.agency.project.service.BlogService;
import com.webgrat.agency.project.service.TagService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * Server-rendered (Thymeleaf) replacement for the React {@code /blog} pages.
 *
 * Why both? The React SPA still ships the same routes — they remain useful in
 * local dev (Vite at :5173) and as a fallback. In production the recommended
 * setup is to proxy {@code /blog/*} on the apex domain to this Spring Boot
 * service so crawlers and social previews get fully populated HTML on the
 * first byte. Every other path keeps going to the SPA.
 *
 * Endpoints:
 *   GET /blog            — listing of published posts (optional ?tag=slug filter)
 *   GET /blog/{slug}     — single post page
 */
@Slf4j
@Controller
@RequestMapping("/blog")
@RequiredArgsConstructor
public class BlogPageController {

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH);

    private final BlogService blogService;
    private final TagService tagService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public String list(@RequestParam(required = false) String tag, Model model) {
        List<BlogPostResponse> allPublished = blogService.getPublishedPosts();

        List<BlogPostResponse> filtered = allPublished;
        TagResponse activeTagObj = null;

        if (tag != null && !tag.isBlank()) {
            String wanted = tag.trim().toLowerCase(Locale.ROOT);
            filtered = allPublished.stream()
                    .filter(p -> p.getTags() != null && p.getTags().stream()
                            .anyMatch(t -> wanted.equalsIgnoreCase(t.getSlug())))
                    .toList();

            activeTagObj = allPublished.stream()
                    .flatMap(p -> p.getTags() == null ? java.util.stream.Stream.empty() : p.getTags().stream())
                    .filter(t -> wanted.equalsIgnoreCase(t.getSlug()))
                    .findFirst()
                    .orElse(null);
        }

        // Pre-compute view-model bits so the template stays simple.
        Map<UUID, String> readTimes = new HashMap<>();
        Map<UUID, String> publishedDates = new HashMap<>();
        Map<UUID, String> categoryLabels = new HashMap<>();
        for (BlogPostResponse p : filtered) {
            readTimes.put(p.getId(), readTime(p));
            publishedDates.put(p.getId(), formatDate(p.getPublishedAt() != null ? p.getPublishedAt() : p.getCreatedAt()));
            categoryLabels.put(p.getId(), categoryLabel(p));
        }

        List<TagResponse> allTags;
        try {
            allTags = tagService.getAllTags();
        } catch (Exception e) {
            log.warn("Failed to load tags for blog listing: {}", e.getMessage());
            allTags = List.of();
        }

        model.addAttribute("posts", filtered);
        model.addAttribute("tags", allTags);
        model.addAttribute("activeTagSlug", tag);
        model.addAttribute("activeTag", activeTagObj);
        model.addAttribute("readTimes", readTimes);
        model.addAttribute("publishedDates", publishedDates);
        model.addAttribute("categoryLabels", categoryLabels);
        model.addAttribute("totalCount", allPublished.size());

        return "blog/list";
    }

    @GetMapping("/{slug}")
    public String detail(@PathVariable String slug, Model model, HttpServletResponse response) {
        try {
            BlogPostResponse post = blogService.getPostBySlug(slug);

            model.addAttribute("post", post);
            model.addAttribute("readTime", readTime(post));
            model.addAttribute("publishedDate",
                    formatDate(post.getPublishedAt() != null ? post.getPublishedAt() : post.getCreatedAt()));
            model.addAttribute("categoryLabel", categoryLabel(post));
            model.addAttribute("jsonLd", buildJsonLd(post));

            return "blog/detail";
        } catch (ResourceNotFoundException e) {
            // Status code matters for crawlers: a missing slug must be a real
            // 404, not a "soft 404" with a 200 body.
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            model.addAttribute("message", "This article was not found.");
            return "blog/not-found";
        }
    }

    // ── view-model helpers ───────────────────────────────────────

    private String buildJsonLd(BlogPostResponse post) {
        Map<String, Object> ld = new LinkedHashMap<>();
        ld.put("@context", "https://schema.org");
        ld.put("@type", "BlogPosting");
        ld.put("headline", post.getTitle());

        String desc = post.getMetaDescription() != null && !post.getMetaDescription().isBlank()
                ? post.getMetaDescription()
                : (post.getExcerpt() != null ? post.getExcerpt() : "");
        ld.put("description", desc);

        if (post.getCoverImageUrl() != null && !post.getCoverImageUrl().isBlank()) {
            ld.put("image", post.getCoverImageUrl());
        }

        Map<String, Object> author = new LinkedHashMap<>();
        author.put("@type", "Person");
        author.put("name",
                post.getAuthor() != null && post.getAuthor().getFullName() != null
                        ? post.getAuthor().getFullName()
                        : "Webgrat Team");
        ld.put("author", author);

        Map<String, Object> publisher = new LinkedHashMap<>();
        publisher.put("@type", "Organization");
        publisher.put("name", "Webgrat");
        ld.put("publisher", publisher);

        OffsetDateTime published = post.getPublishedAt() != null ? post.getPublishedAt() : post.getCreatedAt();
        if (published != null) ld.put("datePublished", published.toString());

        ld.put("mainEntityOfPage", "https://webgrat.com/blog/" + post.getSlug());

        try {
            return objectMapper.writeValueAsString(ld);
        } catch (JsonProcessingException e) {
            log.warn("Failed to render JSON-LD for {}: {}", post.getSlug(), e.getMessage());
            return "{}";
        }
    }

    private String readTime(BlogPostResponse post) {
        if (post.getReadTimeMinutes() != null && post.getReadTimeMinutes() > 0) {
            return post.getReadTimeMinutes() + " min read";
        }
        String content = post.getContent() == null ? "" : post.getContent().replaceAll("<[^>]+>", " ");
        int words = content.isBlank() ? 0 : content.trim().split("\\s+").length;
        int minutes = Math.max(1, (int) Math.ceil(words / 200.0));
        return minutes + " min read";
    }

    private String formatDate(OffsetDateTime when) {
        if (when == null) return "";
        try {
            return DATE_FMT.format(when);
        } catch (Exception e) {
            return "";
        }
    }

    private String categoryLabel(BlogPostResponse post) {
        if (post.getCategory() != null && post.getCategory().getName() != null) {
            return post.getCategory().getName();
        }
        if (post.getTags() != null && !post.getTags().isEmpty()) {
            return post.getTags().iterator().next().getName();
        }
        return "Article";
    }
}
