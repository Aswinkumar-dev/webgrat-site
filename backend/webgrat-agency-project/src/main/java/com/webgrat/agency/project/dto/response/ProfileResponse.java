package com.webgrat.agency.project.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ProfileResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String role;
}