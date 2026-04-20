package com.webgrat.agency.project.service;

import com.webgrat.agency.project.dto.request.TagRequest;
import com.webgrat.agency.project.dto.response.TagResponse;

import java.util.List;
import java.util.UUID;

public interface TagService {

    List<TagResponse> getAllTags();

    TagResponse getTagById(UUID id);

    TagResponse createTag(TagRequest request);

    TagResponse updateTag(UUID id, TagRequest request);

    void deleteTag(UUID id);
}
