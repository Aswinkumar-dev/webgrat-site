package com.webgrat.agency.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class MediaResponse {
    private UUID id;
    private String fileName;
    private String publicUrl;
    private String mimeType;
    private String altText;
    private UUID uploadedById;
    private String uploadedByName;
    private OffsetDateTime createdAt;
}

