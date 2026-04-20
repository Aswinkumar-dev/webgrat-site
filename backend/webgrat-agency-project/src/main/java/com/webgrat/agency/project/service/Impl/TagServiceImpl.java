package com.webgrat.agency.project.service.Impl;

import com.webgrat.agency.project.Exception.ResourceNotFoundException;
import com.webgrat.agency.project.dto.request.TagRequest;
import com.webgrat.agency.project.dto.response.TagResponse;
import com.webgrat.agency.project.model.Tag;
import com.webgrat.agency.project.repository.TagRepository;
import com.webgrat.agency.project.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TagResponse getTagById(UUID id) {
        return toResponse(tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found: " + id)));
    }

    @Override
    @Transactional
    public TagResponse createTag(TagRequest request) {
        Tag tag = Tag.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .build();
        return toResponse(tagRepository.save(tag));
    }

    @Override
    @Transactional
    public TagResponse updateTag(UUID id, TagRequest request) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found: " + id));
        tag.setName(request.getName());
        tag.setSlug(request.getSlug());
        return toResponse(tagRepository.save(tag));
    }

    @Override
    @Transactional
    public void deleteTag(UUID id) {
        if (!tagRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tag not found: " + id);
        }
        tagRepository.deleteById(id);
    }

    private TagResponse toResponse(Tag t) {
        return TagResponse.builder()
                .id(t.getId()).name(t.getName()).slug(t.getSlug()).build();
    }
}
