package com.webgrat.agency.project.controller;

import com.webgrat.agency.project.dto.request.ContactRequest;
import com.webgrat.agency.project.dto.request.SubscribeRequest;
import com.webgrat.agency.project.dto.response.MessageResponse;
import com.webgrat.agency.project.service.EmailService;
import com.webgrat.agency.project.service.SupabaseRestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public, unauthenticated endpoints used by the marketing site:
 *   POST /api/contact    – contact form
 *   POST /api/subscribe  – newsletter signup
 *
 * Both endpoints persist to Supabase via {@link SupabaseRestService} and
 * trigger transactional emails via {@link EmailService}.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${allowed.origins}")
@RequiredArgsConstructor
public class PublicFormController {

    private final EmailService emailService;
    private final SupabaseRestService supabaseRestService;

    @PostMapping("/contact")
    public ResponseEntity<MessageResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        try {
            // 1. Persist to Supabase. The DB schema only has name/email/message,
            //    so we fold the optional fields into the message body so the
            //    admin still has them when reviewing submissions in Supabase.
            String storedMessage = composeStoredMessage(request);
            supabaseRestService.saveContactSubmission(
                    request.getName(),
                    request.getEmail(),
                    storedMessage
            );

            // 2. Notify the admin (full details, including phone/company/service).
            emailService.sendContactNotification(
                    request.getName(),
                    request.getEmail(),
                    request.getPhone(),
                    request.getCompany(),
                    request.getService(),
                    request.getMessage()
            );

            // 3. Confirmation back to the customer (best-effort; never fails the request).
            emailService.sendContactConfirmation(request.getName(), request.getEmail());

            return ResponseEntity.ok(new MessageResponse(
                    "Message sent successfully. We'll get back to you within 1 business day.",
                    true
            ));
        } catch (Exception e) {
            log.error("Contact submission failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(
                            "Failed to send message. Please try again later.",
                            false
                    ));
        }
    }

    @PostMapping("/subscribe")
    public ResponseEntity<MessageResponse> subscribe(@Valid @RequestBody SubscribeRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        try {
            if (supabaseRestService.isEmailSubscribed(email)) {
                return ResponseEntity.ok(new MessageResponse(
                        "You're already subscribed. Check your inbox for our latest updates.",
                        false
                ));
            }

            supabaseRestService.addSubscriber(email);

            // Welcome email is core to the flow; surface failures.
            emailService.sendWelcomeEmail(email);

            // Best-effort admin ping; never fails the request.
            emailService.sendSubscriberNotification(email);

            return ResponseEntity.ok(new MessageResponse(
                    "Successfully subscribed. Check your email for a welcome message.",
                    true
            ));
        } catch (Exception e) {
            log.error("Newsletter subscription failed for {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(
                            "Subscription failed. Please try again later.",
                            false
                    ));
        }
    }

    private String composeStoredMessage(ContactRequest r) {
        StringBuilder sb = new StringBuilder();
        sb.append(r.getMessage()).append("\n\n--\n");
        if (r.getPhone() != null && !r.getPhone().isBlank()) {
            sb.append("Phone: ").append(r.getPhone()).append('\n');
        }
        if (r.getCompany() != null && !r.getCompany().isBlank()) {
            sb.append("Company: ").append(r.getCompany()).append('\n');
        }
        if (r.getService() != null && !r.getService().isBlank()) {
            sb.append("Service: ").append(r.getService()).append('\n');
        }
        return sb.toString().trim();
    }
}
