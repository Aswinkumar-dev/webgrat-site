package com.webgrat.agency.project.service.Impl;

import com.webgrat.agency.project.Exception.ResourceNotFoundException;
import com.webgrat.agency.project.dto.request.MediaRequest;
import com.webgrat.agency.project.dto.response.MediaResponse;
import com.webgrat.agency.project.model.Media;
import com.webgrat.agency.project.model.Profile;
import com.webgrat.agency.project.repository.MediaRepository;
import com.webgrat.agency.project.repository.ProfileRepository;
import com.webgrat.agency.project.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final ProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getAllMedia() {
        return mediaRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MediaResponse getMediaById(UUID id) {
        return toResponse(mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getMediaByUploader(UUID uploadedById) {
        return mediaRepository.findByUploadedByIdOrderByCreatedAtDesc(uploadedById)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MediaResponse saveMedia(MediaRequest request) {
        Media.MediaBuilder builder = Media.builder()
                .fileName(request.getFileName())
                .publicUrl(request.getPublicUrl())
                .mimeType(request.getMimeType())
                .altText(request.getAltText());

        if (request.getUploadedById() != null) {
            Profile uploader = profileRepository.findById(request.getUploadedById())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Profile not found: " + request.getUploadedById()));
            builder.uploadedBy(uploader);
        }

        return toResponse(mediaRepository.save(builder.build()));
    }

    @Override
    @Transactional
    public void deleteMedia(UUID id) {
        if (!mediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Media not found: " + id);
        }
        mediaRepository.deleteById(id);
    }

    private MediaResponse toResponse(Media m) {
        return MediaResponse.builder()
                .id(m.getId())
                .fileName(m.getFileName())
                .publicUrl(m.getPublicUrl())
                .mimeType(m.getMimeType())
                .altText(m.getAltText())
                .uploadedById(m.getUploadedBy() != null ? m.getUploadedBy().getId() : null)
                .uploadedByName(m.getUploadedBy() != null ? m.getUploadedBy().getFullName() : null)
                .createdAt(m.getCreatedAt())
                .build();
    }
}
