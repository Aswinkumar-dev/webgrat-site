package com.webgrat.agency.project.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Wraps Resend's Java SDK to send the three transactional emails our public
 * site needs:
 *   1. Admin notification when a contact form is submitted.
 *   2. Confirmation back to the customer who submitted the contact form.
 *   3. Welcome email when a visitor subscribes to the newsletter (and an
 *      optional admin ping for the same).
 *
 * Resend's free test sender (onboarding@resend.dev) only delivers to the
 * email address that owns the API key. Once a custom domain is verified
 * just flip {@code email.from} in application.properties.
 */
@Slf4j
@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${email.from}")
    private String fromEmail;

    @Value("${email.admin}")
    private String adminEmail;

    private Resend resend;

    @PostConstruct
    void init() {
        this.resend = new Resend(resendApiKey);
    }

    // ── Contact form: notify admin ───────────────────────────────

    public void sendContactNotification(String name,
                                        String email,
                                        String phone,
                                        String company,
                                        String service,
                                        String message) {
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(adminEmail)
                .replyTo(email)
                .subject("New contact form submission from " + name)
                .html(buildContactEmailHtml(name, email, phone, company, service, message))
                .build();

        try {
            resend.emails().send(request);
            log.info("Contact notification sent to admin for {}", email);
        } catch (ResendException e) {
            throw new RuntimeException("Failed to send contact notification", e);
        }
    }

    // ── Contact form: confirmation to customer ───────────────────

    public void sendContactConfirmation(String name, String customerEmail) {
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(customerEmail)
                .subject("We received your message — Webgrat")
                .html(buildContactConfirmationHtml(name))
                .build();

        try {
            resend.emails().send(request);
            log.info("Contact confirmation sent to {}", customerEmail);
        } catch (ResendException e) {
            // Don't fail the whole submission if the confirmation cannot go out.
            log.warn("Failed to send contact confirmation to {}: {}", customerEmail, e.getMessage());
        }
    }

    // ── Newsletter: welcome to subscriber ────────────────────────

    public void sendWelcomeEmail(String subscriberEmail) {
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(subscriberEmail)
                .subject("Welcome to the Webgrat newsletter")
                .html(buildWelcomeEmailHtml())
                .build();

        try {
            resend.emails().send(request);
            log.info("Welcome email sent to {}", subscriberEmail);
        } catch (ResendException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    // ── Newsletter: optional admin ping ──────────────────────────

    public void sendSubscriberNotification(String subscriberEmail) {
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(adminEmail)
                .subject("New newsletter subscriber")
                .html("<p>New subscriber: <strong>" + escape(subscriberEmail) + "</strong></p>")
                .build();

        try {
            resend.emails().send(request);
        } catch (ResendException e) {
            // Never fail the subscription because of an internal ping.
            log.warn("Failed to send admin subscriber notification: {}", e.getMessage());
        }
    }

    // ── HTML templates ───────────────────────────────────────────

    private String buildContactEmailHtml(String name,
                                         String email,
                                         String phone,
                                         String company,
                                         String service,
                                         String message) {
        String safePhone = (phone == null || phone.isBlank()) ? "—" : escape(phone);
        String safeCompany = (company == null || company.isBlank()) ? "—" : escape(company);
        String safeService = (service == null || service.isBlank()) ? "—" : escape(service);
        String safeMessage = escape(message).replace("\n", "<br>");

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background:#f4f4f7; margin:0; padding:24px; }
                .container { max-width: 620px; margin: 0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
                .header { background:#0b1120; color:#ffffff; padding:24px 28px; }
                .header h2 { margin:0; font-size:20px; }
                .content { padding:28px; }
                .field { margin-bottom:18px; }
                .label { font-weight:600; color:#555; font-size:13px; text-transform:uppercase; letter-spacing:0.04em; }
                .value { margin-top:6px; padding:12px 14px; background:#f7f9fc; border-left:3px solid #00ff88; border-radius:4px; word-break:break-word; }
                a { color:#0b66ff; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h2>New contact form submission</h2></div>
                <div class="content">
                  <div class="field"><div class="label">Name</div><div class="value">%s</div></div>
                  <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:%s">%s</a></div></div>
                  <div class="field"><div class="label">Phone</div><div class="value">%s</div></div>
                  <div class="field"><div class="label">Company</div><div class="value">%s</div></div>
                  <div class="field"><div class="label">Service</div><div class="value">%s</div></div>
                  <div class="field"><div class="label">Message</div><div class="value">%s</div></div>
                </div>
              </div>
            </body>
            </html>
            """.formatted(escape(name), escape(email), escape(email),
                          safePhone, safeCompany, safeService, safeMessage);
    }

    private String buildContactConfirmationHtml(String name) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color:#333; background:#f4f4f7; margin:0; padding:24px; }
                .container { max-width: 620px; margin: 0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
                .header { background: linear-gradient(135deg, #0b1120 0%%, #16213e 100%%); color:#ffffff; padding:32px 28px; text-align:center; }
                .header h1 { margin:0; font-size:22px; }
                .content { padding:32px 28px; }
                .footer { text-align:center; color:#888; font-size:12px; padding:18px 28px 28px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>Thanks for reaching out, %s!</h1></div>
                <div class="content">
                  <p>Hi %s,</p>
                  <p>Thanks for getting in touch with <strong>Webgrat</strong>. We've received your message and a member of our team will reply within <strong>1 business day</strong>.</p>
                  <p>In the meantime, feel free to reply to this email if you'd like to add anything to your enquiry.</p>
                  <p>— The Webgrat Team</p>
                </div>
                <div class="footer">© 2023 Webgrat. All rights reserved.</div>
              </div>
            </body>
            </html>
            """.formatted(escape(name), escape(name));
    }

    private String buildWelcomeEmailHtml() {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color:#333; background:#f4f4f7; margin:0; padding:24px; }
                .container { max-width: 620px; margin: 0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
                .header { background: linear-gradient(135deg, #0b1120 0%%, #16213e 100%%); color:#ffffff; padding:40px 28px; text-align:center; }
                .header h1 { margin:0; font-size:24px; }
                .header p { margin-top:8px; font-size:15px; opacity:0.85; }
                .content { padding:32px 28px; }
                .content ul { padding-left:20px; }
                .footer { text-align:center; color:#888; font-size:12px; padding:18px 28px 28px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Webgrat</h1>
                  <p>Weekly digital marketing insights, straight to your inbox.</p>
                </div>
                <div class="content">
                  <p>Hi there,</p>
                  <p>Thanks for subscribing — you're now part of the Webgrat community.</p>
                  <p><strong>What to expect:</strong></p>
                  <ul>
                    <li>Practical SEO tips and strategies</li>
                    <li>High-ROI advertising playbooks</li>
                    <li>Marketing automation and AI workflows</li>
                    <li>Real growth tactics from our client work</li>
                  </ul>
                  <p>One useful email a week. No spam, ever.</p>
                </div>
                <div class="footer">
                  You can unsubscribe anytime.<br>
                  © 2026 Webgrat. All rights reserved.
                </div>
              </div>
            </body>
            </html>
            """;
    }

    /** Minimal HTML escaping — enough to keep user input from breaking the template. */
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
