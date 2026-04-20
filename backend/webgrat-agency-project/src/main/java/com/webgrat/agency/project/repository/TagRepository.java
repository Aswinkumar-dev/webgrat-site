package com.webgrat.agency.project.repository;

import com.webgrat.agency.project.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

    Optional<Tag> findBySlug(String slug);

    Set<Tag> findByIdIn(Set<UUID> ids);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);
}