package com.webgrat.agency.project.repository;


import com.webgrat.agency.project.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findByUploadedByIdOrderByCreatedAtDesc(UUID uploadedById);
}
