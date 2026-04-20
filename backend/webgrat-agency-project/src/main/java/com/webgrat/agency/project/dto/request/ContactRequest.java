package com.webgrat.agency.project.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name is too long")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email is too long")
    private String email;

    // Optional. Frontend enforces 10 digits but we keep it optional server-side.
    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    @Size(max = 255, message = "Company name is too long")
    private String company;

    @Size(max = 255, message = "Service is too long")
    private String service;

    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message is too long")
    private String message;
}
