package com.webgrat.agency.project.service.Impl;

import com.webgrat.agency.project.Exception.ResourceNotFoundException;
import com.webgrat.agency.project.dto.request.BlogPostRequest;
import com.webgrat.agency.project.dto.response.BlogPostResponse;
import com.webgrat.agency.project.dto.response.CategoryResponse;
import com.webgrat.agency.project.dto.response.TagResponse;
import com.webgrat.agency.project.model.BlogPost;
import com.webgrat.agency.project.model.Category;
import com.webgrat.agency.project.model.Profile;
import com.webgrat.agency.project.model.Tag;
import com.webgrat.agency.project.repository.BlogPostRepository;
import com.webgrat.agency.project.repository.CategoryRepository;
import com.webgrat.agency.project.repository.ProfileRepository;
import com.webgrat.agency.project.repository.TagRepository;
import com.webgrat.agency.project.service.BlogContentFormatter;
import com.webgrat.agency.project.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogPostRepository blogPostRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileRepository profileRepository;
    private final TagRepository tagRepository;
    private final SupabaseStorageService storageService;
    private final BlogContentFormatter contentFormatter;

    // ── Read ──────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostResponse> getAllPosts() {
        return blogPostRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostResponse> getPublishedPosts() {
        return blogPostRepository.findAllPublishedOrderByDate()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BlogPostResponse getPostById(UUID id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        return toResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogPostResponse getPostByIdRaw(UUID id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        return toResponse(post, /*formatContent*/ false);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogPostResponse getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));
        return toResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostResponse> getPostsByCategory(UUID categoryId) {
        return blogPostRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogPostResponse> getPostsByTag(UUID tagId) {
        return blogPostRepository.findByTagId(tagId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Write ─────────────────────────────────────────────

    @Override
    @Transactional
    public BlogPostResponse createPost(BlogPostRequest request) {
        BlogPost post = new BlogPost();
        mapRequestToEntity(request, post);
        // The admin form has no draft state — every submission goes live
        // immediately. If the request didn't carry an explicit publishedAt,
        // stamp "now" so the post shows up in /api/blogs/published and the
        // public listing.
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(OffsetDateTime.now());
        }
        return toResponse(blogPostRepository.save(post));
    }

    @Override
    @Transactional
    public BlogPostResponse updatePost(UUID id, BlogPostRequest request) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        String existingImageUrl = post.getCoverImageUrl();
        String newImageUrl = request.getCoverImageUrl();
        if (existingImageUrl != null
                && newImageUrl != null
                && !existingImageUrl.equals(newImageUrl)) {
            storageService.deleteFile(existingImageUrl);
        }
        mapRequestToEntity(request, post);
        return toResponse(blogPostRepository.save(post));
    }

    @Override
    @Transactional
    public void deletePost(UUID id) {
        if (!blogPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog post not found with id: " + id);
        }
        blogPostRepository.deleteById(id);
    }

    // ── Mapper helpers ────────────────────────────────────

    private void mapRequestToEntity(BlogPostRequest request, BlogPost post) {
        post.setTitle(request.getTitle());
        post.setSlug(request.getSlug());
        post.setExcerpt(request.getExcerpt());
        post.setContent(request.getContent());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setMetaTitle(request.getMetaTitle());
        post.setMetaDescription(request.getMetaDescription());
        // Only override publishedAt if the caller supplied one; never silently
        // unpublish a post by sending a request that omits it.
        if (request.getPublishedAt() != null) {
            post.setPublishedAt(request.getPublishedAt());
        }

        // Resolve category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
            post.setCategory(category);
        } else {
            post.setCategory(null);
        }

        // Resolve author
        if (request.getAuthorId() != null) {
            Profile author = profileRepository.findById(request.getAuthorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Profile not found with id: " + request.getAuthorId()));
            post.setAuthor(author);
        }

        // Resolve tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = tagRepository.findByIdIn(request.getTagIds());
            post.setTags(tags);
        } else {
            post.setTags(new HashSet<>());
        }
    }

    private BlogPostResponse toResponse(BlogPost post) {
        return toResponse(post, /*formatContent*/ true);
    }

    private BlogPostResponse toResponse(BlogPost post, boolean formatContent) {
        // Map category
        CategoryResponse categoryResponse = null;
        if (post.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(post.getCategory().getId())
                    .name(post.getCategory().getName())
                    .slug(post.getCategory().getSlug())
                    .description(post.getCategory().getDescription())
                    .build();
        }

        // Map author
        BlogPostResponse.AuthorInfo authorInfo = null;
        if (post.getAuthor() != null) {
            authorInfo = BlogPostResponse.AuthorInfo.builder()
                    .id(post.getAuthor().getId())
                    .fullName(post.getAuthor().getFullName())
                    .email(post.getAuthor().getEmail())
                    .avatarUrl(post.getAuthor().getAvatarUrl())
                    .build();
        }

        // Map tags
        Set<TagResponse> tagResponses = post.getTags() == null ? new HashSet<>() :
                post.getTags().stream()
                        .map(t -> TagResponse.builder()
                                .id(t.getId())
                                .name(t.getName())
                                .slug(t.getSlug())
                                .build())
                        .collect(Collectors.toSet());

        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .excerpt(post.getExcerpt())
                // Convert markdown-ish textarea content into clean HTML once,
                // here, so every consumer (React SPA + Thymeleaf SSR) gets the
                // same nicely rendered output. The admin edit endpoint opts
                // out so authors can re-edit the original source.
                .content(formatContent ? contentFormatter.toHtml(post.getContent()) : post.getContent())
                .coverImageUrl(post.getCoverImageUrl())
                .category(categoryResponse)
                .author(authorInfo)
                .tags(tagResponses)
                .metaTitle(post.getMetaTitle())
                .metaDescription(post.getMetaDescription())
                .readTimeMinutes(post.getReadTimeMinutes())
                .publishedAt(post.getPublishedAt())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
