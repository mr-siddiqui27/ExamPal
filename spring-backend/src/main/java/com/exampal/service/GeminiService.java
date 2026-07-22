package com.exampal.service;

import com.exampal.config.AppProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private static final List<String> FALLBACK_MODELS = List.of(
            "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"
    );

    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;
    private RestClient restClient;
    private volatile String activeModel;

    public GeminiService(AppProperties appProperties, ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void init() {
        restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
        activeModel = appProperties.getGeminiModel();
        if (isConfigured()) {
            testConnection();
        } else {
            log.warn("GEMINI_API_KEY not set. AI features will return fallback responses.");
        }
    }

    public boolean isConfigured() {
        String key = appProperties.getGeminiApiKey();
        return key != null && !key.isBlank() && !"your_gemini_api_key_here".equals(key);
    }

    public String generate(String prompt) {
        if (!isConfigured()) {
            return "[AI unavailable] Configure GEMINI_API_KEY to enable AI generated responses.";
        }

        Set<String> models = new LinkedHashSet<>();
        if (activeModel != null) models.add(activeModel);
        models.addAll(FALLBACK_MODELS);

        for (String model : models) {
            try {
                String text = callModel(model, prompt);
                if (text != null && !text.isBlank()) {
                    activeModel = model;
                    return text;
                }
            } catch (Exception e) {
                log.warn("Gemini model {} failed: {}", model, e.getMessage());
            }
        }
        return "[AI unavailable] Could not reach Gemini API.";
    }

    public String generateWithRetry(String prompt, int retries) {
        Exception last = null;
        for (int i = 0; i < retries; i++) {
            try {
                String result = generate(prompt);
                if (!result.startsWith("[AI unavailable]")) {
                    return result;
                }
            } catch (Exception e) {
                last = e;
                try {
                    Thread.sleep(1000L * (i + 1));
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
        if (last != null) {
            throw new RuntimeException(last.getMessage(), last);
        }
        return buildFallbackResponse(prompt);
    }

    public String buildFallbackResponse(String message) {
        String sanitized = message == null ? "" : message.replaceAll("\\s+", " ").trim();
        String topic = sanitized.length() > 80 ? sanitized.substring(0, 80) : (sanitized.isEmpty() ? "your exam topic" : sanitized);
        return """
                ⚠️ Live AI response unavailable – serving ExamPal study helper for "%s".
                
                Quick Revision Plan:
                1. Define the core concept in simple terms related to "%s".
                2. List 2-3 key facts, formulas, or steps students must remember.
                3. Give a quick example or mnemonic that helps during revision.
                
                Study Tip:
                • Practice two short questions on this topic.
                • Revisit your notes and create a flashcard with the essentials.
                • If time allows, explain the idea aloud to reinforce understanding.
                """.formatted(topic, topic);
    }

    private void testConnection() {
        try {
            generate("Say OK");
            log.info("Gemini API connection successful (model: {})", activeModel);
        } catch (Exception e) {
            log.error("Gemini API connection failed: {}", e.getMessage());
        }
    }

    private String callModel(String model, String prompt) throws Exception {
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "maxOutputTokens", appProperties.getGeminiMaxTokens(),
                        "temperature", appProperties.getGeminiTemperature()
                )
        );

        String response = restClient.post()
                .uri("/v1beta/models/{model}:generateContent?key={key}", model, appProperties.getGeminiApiKey())
                .body(body)
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(response);
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText("");
            }
        }
        JsonNode error = root.path("error").path("message");
        if (!error.isMissingNode()) {
            throw new RuntimeException(error.asText());
        }
        return "";
    }
}
