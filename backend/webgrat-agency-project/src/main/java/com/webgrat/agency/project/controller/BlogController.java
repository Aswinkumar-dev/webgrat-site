package com.webgrat.agency.project.controller;

import com.webgrat.agency.project.dto.request.BlogPostRequest;
import com.webgrat.agency.project.dto.response.BlogPostResponse;
import com.webgrat.agency.project.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "${allowed.origins}")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    // ── Public endpoints

    @GetMapping("/published")
    public ResponseEntity<List<BlogPostResponse>> getPublished() {
        return ResponseEntity.ok(blogService.getPublishedPosts());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPostResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPostBySlug(slug));
    }

    // ── Protected endpoints ───────────────────────────────

    @GetMapping
    public ResponseEntity<List<BlogPostResponse>> getAll() {
        return ResponseEntity.ok(blogService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(blogService.getPostById(id));
    }

    /**
     * Same as {@link #getById(UUID)} but with the post's content returned in
     * its original (unformatted) form. The admin edit form uses this so the
     * textarea is populated with the source the author originally typed.
     */
    @GetMapping("/{id}/edit")
    public ResponseEntity<BlogPostResponse> getForEdit(@PathVariable UUID id) {
        return ResponseEntity.ok(blogService.getPostByIdRaw(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BlogPostResponse>> getByCategory(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(blogService.getPostsByCategory(categoryId));
    }

    @GetMapping("/tag/{tagId}")
    public ResponseEntity<List<BlogPostResponse>> getByTag(@PathVariable UUID tagId) {
        return ResponseEntity.ok(blogService.getPostsByTag(tagId));
    }

    @PostMapping
    public ResponseEntity<BlogPostResponse> create(@RequestBody @Valid BlogPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.createPost(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid BlogPostRequest request) {
        return ResponseEntity.ok(blogService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }
}