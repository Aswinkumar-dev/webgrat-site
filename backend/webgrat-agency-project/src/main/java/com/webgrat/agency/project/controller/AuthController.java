package com.webgrat.agency.project.controller;

import com.webgrat.agency.project.dto.response.ProfileResponse;
import com.webgrat.agency.project.model.Profile;
import com.webgrat.agency.project.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${allowed.origins}")
@RequiredArgsConstructor
public class AuthController {

    private final ProfileRepository profileRepository;

    /**
     * GET /api/auth/me
     * React calls this after login to get the current admin's profile
     * The JWT filter already validated the token — we just read the userId from it
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getCurrentUser(Authentication authentication) {
        // authentication.getName() = the UUID from the "sub" claim
        UUID userId = UUID.fromString(authentication.getName());

        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return ResponseEntity.ok(ProfileResponse.builder()
                .id(profile.getId())
                .email(profile.getEmail())
                .fullName(profile.getFullName())
                .avatarUrl(profile.getAvatarUrl())
                .role(profile.getRole())
                .build());
    }
}