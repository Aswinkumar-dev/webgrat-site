package com.webgrat.agency.project.service;

import com.webgrat.agency.project.dto.request.MediaRequest;
import com.webgrat.agency.project.dto.response.MediaResponse;

import java.util.List;
import java.util.UUID;

public interface MediaService {

    List<MediaResponse> getAllMedia();

    MediaResponse getMediaById(UUID id);

    List<MediaResponse> getMediaByUploader(UUID uploadedById);

    MediaResponse saveMedia(MediaRequest request);

    void deleteMedia(UUID id);
}