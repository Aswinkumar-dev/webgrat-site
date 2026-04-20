package com.webgrat.agency.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class MediaRequest {

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Public URL is required")
    private String publicUrl;

    private String mimeType;

    private String altText;

    private UUID uploadedById;
}