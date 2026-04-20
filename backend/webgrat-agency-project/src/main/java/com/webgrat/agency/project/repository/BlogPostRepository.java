package com.webgrat.agency.project.repository;

import com.webgrat.agency.project.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    Optional<BlogPost> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<BlogPost> findByCategoryIdOrderByCreatedAtDesc(UUID categoryId);

    @Query("SELECT b FROM BlogPost b JOIN b.tags t WHERE t.id = :tagId ORDER BY b.createdAt DESC")
    List<BlogPost> findByTagId(UUID tagId);

    @Query("SELECT b FROM BlogPost b WHERE b.publishedAt IS NOT NULL ORDER BY b.publishedAt DESC")
    List<BlogPost> findAllPublishedOrderByDate();
}
