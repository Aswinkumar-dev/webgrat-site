package com.webgrat.agency.project.controller;

import com.webgrat.agency.project.dto.request.MediaRequest;
import com.webgrat.agency.project.dto.response.MediaResponse;
import com.webgrat.agency.project.service.MediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "${allowed.origins}")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<List<MediaResponse>> getAll() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(mediaService.getMediaById(id));
    }

    @GetMapping("/uploader/{uploadedById}")
    public ResponseEntity<List<MediaResponse>> getByUploader(@PathVariable UUID uploadedById) {
        return ResponseEntity.ok(mediaService.getMediaByUploader(uploadedById));
    }

    @PostMapping
    public ResponseEntity<MediaResponse> save(@RequestBody @Valid MediaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mediaService.saveMedia(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.noContent().build();
    }
}
