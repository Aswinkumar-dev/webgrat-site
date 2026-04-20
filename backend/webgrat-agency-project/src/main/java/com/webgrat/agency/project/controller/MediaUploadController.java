package com.webgrat.agency.project.controller;

import com.webgrat.agency.project.dto.request.MediaRequest;
import com.webgrat.agency.project.repository.ProfileRepository;
import com.webgrat.agency.project.service.MediaService;
import com.webgrat.agency.project.service.Impl.SupabaseStorageService;
import com.webgrat.agency.project.service.Impl.SupabaseStorageService.UploadResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "${allowed.origins}")
@RequiredArgsConstructor
public class MediaUploadController {

    private final SupabaseStorageService storageService;
    private final MediaService mediaService;
    private final ProfileRepository profileRepository;

    /**
     * POST /api/upload/thumbnail
     * Content-Type: multipart/form-data
     * Form field: "file" → the image
     *
     * Pushes the file to Supabase Storage AND inserts a row into the
     * `media` table so we have an audit/trail of every upload.
     *
     * Returns: { "publicUrl": "https://..." }
     */
    @PostMapping("/thumbnail")
    public ResponseEntity<Map<String, String>> uploadThumbnail(
            @RequestParam("file") MultipartFile file) throws IOException {

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed"));
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must be under 5MB"));
        }

        UploadResult result = storageService.upload(file, "thumbnails");

        // Record this upload in the `media` table.
        try {
            MediaRequest req = new MediaRequest();
            req.setFileName(result.storagePath());
            req.setPublicUrl(result.publicUrl());
            req.setMimeType(contentType);
            req.setAltText(file.getOriginalFilename());
            req.setUploadedById(resolveCurrentProfileId());

            mediaService.saveMedia(req);
        } catch (Exception ex) {
            // Storage upload already succeeded — don't fail the request just
            // because the audit row couldn't be written. Log and move on.
            log.warn("Uploaded to storage but failed to insert media row: {}", ex.getMessage());
        }

        return ResponseEntity.ok(Map.of("publicUrl", result.publicUrl()));
    }

    /**
     * DELETE /api/upload/thumbnail
     * Body: { "publicUrl": "https://..." }
     */
    @DeleteMapping("/thumbnail")
    public ResponseEntity<Void> deleteThumbnail(@RequestBody Map<String, String> body) {
        String publicUrl = body.get("publicUrl");
        if (publicUrl != null) {
            storageService.deleteFile(publicUrl);
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Pull the Supabase user UUID out of the JWT principal. Returns null
     * if the user has no matching row in `profiles` yet — the FK on
     * media.uploaded_by would otherwise blow up.
     */
    private UUID resolveCurrentProfileId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) return null;

        try {
            UUID userId = UUID.fromString(auth.getPrincipal().toString());
            return profileRepository.existsById(userId) ? userId : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
