package com.webgrat.agency.project.service;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Converts the plain-text blog content captured by the admin's textarea into
 * clean HTML before it leaves the API. Both the React SPA (which uses
 * {@code dangerouslySetInnerHTML}) and the Thymeleaf SSR templates (which
 * use {@code th:utext}) consume the result directly.
 *
 * Why server-side? The admin form stores raw text with {@code \n} line
 * breaks and Markdown-ish bullets. HTML collapses every newline into
 * whitespace, so without this step paragraphs and lists run together as a
 * single wall of text. Doing the conversion in one place keeps both the
 * SPA and SSR pages identical and avoids shipping a Markdown parser to
 * the browser.
 *
 * If the stored content already looks like authored HTML (contains common
 * block-level tags), it is returned untouched — this lets us swap in a
 * rich-text editor later without double-encoding.
 */
@Component
public class BlogContentFormatter {

    private static final Pattern HTML_BLOCK = Pattern.compile(
            "<\\s*(p|h[1-6]|ul|ol|li|blockquote|pre|table|div|section|article|figure)\\b",
            Pattern.CASE_INSENSITIVE);

    // " - text" appearing 3+ times inline → break into separate lines so the
    // bullet detector below can promote it to a real <ul>.
    private static final Pattern INLINE_BULLET_RUN = Pattern.compile(
            "(\\s+-\\s+\\S[^\\n]*?){3,}", Pattern.DOTALL);

    private static final Pattern BULLET_LINE = Pattern.compile("^\\s*[-*•]\\s+(.*)$");
    private static final Pattern NUMBERED_LINE = Pattern.compile("^\\s*\\d+\\.\\s+(.*)$");

    // A line that *looks* like a heading: short, capitalised, and without the
    // trailing punctuation that would imply a sentence. Used to promote
    // unmarked section titles (e.g. "How It Works") into real <h2>s so the
    // rendered post has proper visual hierarchy.
    private static final String HEADING_TRAILING_BAN = ".?!;,";
    private static final int HEADING_MAX_CHARS = 80;
    private static final int HEADING_MAX_WORDS = 12;

    private static final Pattern BOLD = Pattern.compile("\\*\\*([^*\\n]+)\\*\\*");
    private static final Pattern ITALIC = Pattern.compile("(?<![*\\w])\\*([^*\\n]+)\\*(?![*\\w])");
    private static final Pattern AUTOLINK = Pattern.compile("(?<!\\]\\()(https?://[^\\s<]+)");

    public String toHtml(String raw) {
        if (raw == null || raw.isBlank()) return "";
        if (HTML_BLOCK.matcher(raw).find()) return raw;

        String src = raw.replace("\r\n", "\n").replace("\r", "\n").trim();
        src = breakInlineBulletRuns(src);

        StringBuilder out = new StringBuilder();
        for (String block : src.split("\\n\\s*\\n")) {
            String trimmed = block.strip();
            if (trimmed.isEmpty()) continue;
            renderBlock(trimmed, out);
        }
        return out.toString();
    }

    // ── block dispatcher ─────────────────────────────────────────

    private void renderBlock(String block, StringBuilder out) {
        String[] lines = block.split("\n");
        String first = lines[0].strip();

        if (first.startsWith("### ")) { heading(out, 3, first.substring(4)); return; }
        if (first.startsWith("## "))  { heading(out, 2, first.substring(3)); return; }
        if (first.startsWith("# "))   { heading(out, 1, first.substring(2)); return; }

        if (first.startsWith("> ")) {
            String body = Arrays.stream(lines)
                    .map(l -> l.strip().startsWith(">") ? l.strip().replaceFirst("^>\\s?", "") : l.strip())
                    .map(this::inline)
                    .collect(Collectors.joining("<br>"));
            out.append("<blockquote>").append(body).append("</blockquote>");
            return;
        }

        boolean allBullets   = Arrays.stream(lines).allMatch(l -> BULLET_LINE.matcher(l).matches());
        boolean allNumbered  = Arrays.stream(lines).allMatch(l -> NUMBERED_LINE.matcher(l).matches());

        if (allBullets) {
            list(out, "ul", lines, BULLET_LINE);
            return;
        }
        if (allNumbered) {
            list(out, "ol", lines, NUMBERED_LINE);
            return;
        }

        // Auto-promote pseudo-headings. Authors often type section titles on
        // their own line (e.g. "How It Works") without a markdown prefix,
        // which would otherwise be swallowed into the paragraph below. If the
        // first line is short, properly capitalised and followed by prose,
        // promote it to an <h2> and recurse on the remainder.
        if (lines.length >= 2 && looksLikeHeading(lines[0])) {
            heading(out, 2, lines[0].strip());
            String rest = Arrays.stream(lines, 1, lines.length)
                    .filter(l -> !l.strip().isEmpty())
                    .collect(Collectors.joining("\n"));
            if (!rest.isEmpty()) {
                renderBlock(rest, out);
            }
            return;
        }

        // Mixed block: first line(s) are prose, then a list begins. Render
        // the leading prose as a paragraph and the trailing bullets as a list
        // — this is the most common pattern from the textarea ("Intro: \n - A
        // \n - B").
        int firstListIdx = -1;
        for (int i = 0; i < lines.length; i++) {
            if (BULLET_LINE.matcher(lines[i]).matches() || NUMBERED_LINE.matcher(lines[i]).matches()) {
                firstListIdx = i;
                break;
            }
        }
        if (firstListIdx > 0) {
            String[] prose = Arrays.copyOfRange(lines, 0, firstListIdx);
            String[] rest  = Arrays.copyOfRange(lines, firstListIdx, lines.length);
            paragraph(out, prose);

            // Split rest into runs of consecutive bullet vs numbered lines.
            int i = 0;
            while (i < rest.length) {
                boolean bulletStart = BULLET_LINE.matcher(rest[i]).matches();
                int j = i + 1;
                while (j < rest.length
                        && (bulletStart ? BULLET_LINE.matcher(rest[j]).matches()
                                        : NUMBERED_LINE.matcher(rest[j]).matches())) {
                    j++;
                }
                list(out, bulletStart ? "ul" : "ol",
                        Arrays.copyOfRange(rest, i, j),
                        bulletStart ? BULLET_LINE : NUMBERED_LINE);
                i = j;
            }
            return;
        }

        paragraph(out, lines);
    }

    /**
     * Returns true when a line visually reads like a section title — short,
     * capitalised, without the sentence-terminating punctuation that would
     * betray it as prose. Deliberately conservative: it must also be clean
     * of list/quote markers and URLs so we don't hijack real content.
     */
    private boolean looksLikeHeading(String line) {
        String s = line == null ? "" : line.strip();
        int len = s.length();
        if (len < 2 || len > HEADING_MAX_CHARS) return false;

        char last = s.charAt(len - 1);
        if (HEADING_TRAILING_BAN.indexOf(last) >= 0) return false;

        if (s.startsWith("#") || s.startsWith("- ") || s.startsWith("* ")
                || s.startsWith("•") || s.startsWith("> ")) return false;
        if (NUMBERED_LINE.matcher(line).matches()) return false;

        // URLs, code, or anything with reserved markdown markers that should
        // stay inline (bold/italic/links) — leave them as prose.
        if (s.contains("http://") || s.contains("https://")) return false;
        if (s.contains("`")) return false;

        String[] words = s.split("\\s+");
        if (words.length == 0 || words.length > HEADING_MAX_WORDS) return false;

        // Must contain at least one uppercase letter. Most genuine titles are
        // at least sentence-cased ("Key Channels"), and skipping this check
        // caused single all-lowercase lines like "note" to be promoted.
        boolean hasUpper = false;
        for (int i = 0; i < len; i++) {
            if (Character.isUpperCase(s.charAt(i))) { hasUpper = true; break; }
        }
        return hasUpper;
    }

    private void heading(StringBuilder out, int level, String text) {
        out.append("<h").append(level).append(">")
           .append(inline(text.strip()))
           .append("</h").append(level).append(">");
    }

    private void list(StringBuilder out, String tag, String[] lines, Pattern marker) {
        out.append("<").append(tag).append(">");
        for (String line : lines) {
            Matcher m = marker.matcher(line);
            if (m.matches()) {
                out.append("<li>").append(inline(m.group(1).strip())).append("</li>");
            }
        }
        out.append("</").append(tag).append(">");
    }

    private void paragraph(StringBuilder out, String[] lines) {
        String body = Arrays.stream(lines)
                .map(String::strip)
                .filter(s -> !s.isEmpty())
                .map(this::inline)
                .collect(Collectors.joining("<br>"));
        if (!body.isEmpty()) {
            out.append("<p>").append(body).append("</p>");
        }
    }

    // ── inline formatting ────────────────────────────────────────

    private String inline(String text) {
        String s = escape(text);
        s = BOLD.matcher(s).replaceAll("<strong>$1</strong>");
        s = ITALIC.matcher(s).replaceAll("<em>$1</em>");
        s = AUTOLINK.matcher(s).replaceAll("<a href=\"$1\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>");
        return s;
    }

    private String escape(String s) {
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    // ── inline bullet pre-processor ──────────────────────────────

    /**
     * The user often types {@code "things include: - apple - banana - cherry"}
     * all on one line. Detect any run of 3+ {@code " - item"} fragments and
     * insert real newlines so the block dispatcher can promote them to a list.
     */
    private String breakInlineBulletRuns(String src) {
        Matcher m = INLINE_BULLET_RUN.matcher(src);
        if (!m.find()) return src;

        StringBuilder rebuilt = new StringBuilder();
        int last = 0;
        m.reset();
        while (m.find()) {
            rebuilt.append(src, last, m.start());
            String run = m.group();
            String reformatted = run.replaceAll("\\s+-\\s+", "\n- ");
            // The first item should sit on its own line, separated by a
            // paragraph break from whatever preceded it.
            if (!rebuilt.toString().endsWith("\n")) rebuilt.append("\n");
            rebuilt.append(reformatted.stripLeading());
            last = m.end();
        }
        rebuilt.append(src.substring(last));
        return rebuilt.toString();
    }
}
