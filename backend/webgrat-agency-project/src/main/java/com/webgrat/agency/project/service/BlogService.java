package com.webgrat.agency.project.service;

import com.webgrat.agency.project.dto.request.BlogPostRequest;
import com.webgrat.agency.project.dto.response.BlogPostResponse;

import java.util.List;
import java.util.UUID;

public interface BlogService {

    List<BlogPostResponse> getAllPosts();

    List<BlogPostResponse> getPublishedPosts();

    BlogPostResponse getPostById(UUID id);

    /**
     * Same as {@link #getPostById(UUID)} but returns the post's content as the
     * raw text stored in the database, without running the
     * {@link BlogContentFormatter} pass. The admin edit form needs the
     * original text so authors don't see their markdown converted to HTML
     * when they reopen a post.
     */
    BlogPostResponse getPostByIdRaw(UUID id);

    BlogPostResponse getPostBySlug(String slug);

    BlogPostResponse createPost(BlogPostRequest request);

    BlogPostResponse updatePost(UUID id, BlogPostRequest request);

    void deletePost(UUID id);

    List<BlogPostResponse> getPostsByCategory(UUID categoryId);

    List<BlogPostResponse> getPostsByTag(UUID tagId);
}
