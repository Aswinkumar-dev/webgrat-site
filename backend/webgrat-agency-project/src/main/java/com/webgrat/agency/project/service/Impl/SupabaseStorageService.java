package com.webgrat.agency.project.service.Impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.role.key}")
    private String serviceRoleKey;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Result of a successful upload to Supabase Storage.
     */
    public record UploadResult(String publicUrl, String storagePath) {}

    /**
     * Uploads a file to the Supabase Storage bucket.
     *
     * @param file     the uploaded MultipartFile from the request
     * @param folder   subfolder inside the bucket, e.g. "thumbnails"
     * @return the public URL + storage path of the uploaded file
     */
    public UploadResult upload(MultipartFile file, String folder) throws IOException {

        // Build a unique file name to avoid collisions
        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
        String uniqueFileName = folder + "/" + UUID.randomUUID() + extension;

        // Supabase Storage upload endpoint
        String uploadUrl = supabaseUrl
                + "/storage/v1/object/"
                + bucketName + "/"
                + uniqueFileName;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + serviceRoleKey);
        headers.setContentType(MediaType.parseMediaType(
                file.getContentType() != null ? file.getContentType() : "image/jpeg"
        ));
        headers.set("x-upsert", "true"); // overwrite if same name

        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

        ResponseEntity<String> response = restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Supabase upload failed: " + response.getBody());
        }

        // Build the public URL
        // Format: https://PROJECTID.supabase.co/storage/v1/object/public/BUCKET/path
        String publicUrl = supabaseUrl
                + "/storage/v1/object/public/"
                + bucketName + "/"
                + uniqueFileName;

        return new UploadResult(publicUrl, uniqueFileName);
    }

    /**
     * Backwards-compatible helper that just returns the public URL.
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        return upload(file, folder).publicUrl();
    }

    /**
     * Deletes a file from Supabase Storage using its public URL.
     *
     * @param publicUrl the full public URL returned when the file was uploaded
     */
    public void deleteFile(String publicUrl) {
        // Extract the storage path from the URL
        // URL format: https://PROJECTID.supabase.co/storage/v1/object/public/BUCKET/folder/file.jpg
        String marker = "/object/public/" + bucketName + "/";
        int idx = publicUrl.indexOf(marker);
        if (idx == -1) {
            log.warn("Could not parse storage path from URL: {}", publicUrl);
            return;
        }
        String filePath = publicUrl.substring(idx + marker.length());

        String deleteUrl = supabaseUrl
                + "/storage/v1/object/"
                + bucketName + "/"
                + filePath;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + serviceRoleKey);

        restTemplate.exchange(deleteUrl, HttpMethod.DELETE,
                new HttpEntity<>(headers), String.class);
    }
}