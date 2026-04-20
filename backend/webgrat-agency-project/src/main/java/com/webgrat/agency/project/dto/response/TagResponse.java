package com.webgrat.agency.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TagResponse {
    private UUID id;
    private String name;
    private String slug;
}

