package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.AIInteraction;
import com.exampal.model.User;
import com.exampal.repository.AIInteractionRepository;
import com.exampal.security.SecurityUtils;
import com.exampal.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;
    private final AIInteractionRepository aiInteractionRepository;

    public AiController(GeminiService geminiService, AIInteractionRepository aiInteractionRepository) {
        this.geminiService = geminiService;
        this.aiInteractionRepository = aiInteractionRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "errors",
                    List.of(Map.of("msg", "Message is required", "param", "message"))));
        }
        if (!geminiService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.fail("AI service is not configured. Please set GEMINI_API_KEY in your environment."));
        }

        String subject = body.get("subject");
        String context = body.get("context");
        String prompt = buildChatPrompt(message, subject, context);

        try {
            String aiResponse = geminiService.generateWithRetry(prompt, 3);
            User user = SecurityUtils.currentUser();
            Map<String, Object> data = new HashMap<>();
            data.put("message", aiResponse);
            data.put("timestamp", Instant.now());
            if (user != null) data.put("user", Map.of("id", user.getId(), "name", user.getName()));
            return ResponseEntity.ok(ApiResponse.ok(data));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
            if (msg.contains("api key")) {
                return ResponseEntity.status(500).body(ApiResponse.fail(
                        "AI service configuration error. Please verify GEMINI_API_KEY and restart the server."));
            }
            if (msg.contains("quota") || msg.contains("limit")) {
                return ResponseEntity.status(429).body(ApiResponse.fail("AI service rate limit exceeded. Please try again later."));
            }
            ApiResponse<Map<String, Object>> resp = ApiResponse.ok(Map.of(
                    "message", geminiService.buildFallbackResponse(message),
                    "timestamp", Instant.now(),
                    "fallback", true
            ));
            resp.setWarning(e.getMessage());
            return ResponseEntity.ok(resp);
        }
    }

    @PostMapping("/explain")
    public ResponseEntity<ApiResponse<Map<String, String>>> explain(@RequestBody Map<String, String> body) {
        String concept = body.get("concept");
        String subject = body.get("subject");
        String college = body.get("college");
        String level = body.getOrDefault("level", "intermediate");
        String prompt = "Explain " + concept + (subject != null ? " in " + subject : "") +
                " for " + (college != null ? college : "college") + " students at " + level +
                " level. Include definition, key points, examples, misconceptions, related concepts, and study tips.";
        String text = geminiService.generate(prompt);
        logInteraction("explain", body, prompt, text);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("explanation", text)));
    }

    @PostMapping("/quiz")
    public ResponseEntity<?> quiz(@RequestBody Map<String, Object> body) {
        String subject = (String) body.get("subject");
        String topic = (String) body.get("topic");
        String difficulty = (String) body.getOrDefault("difficulty", "intermediate");
        int count = body.get("count") != null ? ((Number) body.get("count")).intValue() : 5;
        String prompt = "Generate " + count + " " + difficulty + " MCQ questions in " + subject +
                (topic != null ? " on " + topic : "") + ".\nEach item: Question, Options A-D, Correct Answer, Explanation. Return as plain text list.";
        String text = geminiService.generate(prompt);
        if (text.startsWith("[AI unavailable]")) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.fail(text.replace("[AI unavailable]", "").trim()));
        }
        logInteraction("quiz", body, prompt, text);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("questions", text)));
    }

    @PostMapping("/cheat-sheet")
    public ResponseEntity<ApiResponse<Map<String, String>>> cheatSheet(@RequestBody Map<String, String> body) {
        String topic = body.get("topic");
        String subject = body.get("subject");
        String prompt = "Create a concise cheat-sheet for " + topic + (subject != null ? " in " + subject : "") +
                ". Include key formulas/definitions, common pitfalls, quick tips.";
        String text = geminiService.generate(prompt);
        logInteraction("cheat-sheet", body, prompt, text);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("cheatSheet", text)));
    }

    @PostMapping("/pyq")
    public ResponseEntity<ApiResponse<Map<String, String>>> pyq(@RequestBody Map<String, String> body) {
        String subject = body.get("subject");
        String topic = body.get("topic");
        String prompt = "Generate a set of previous-year-style questions for " + subject +
                (topic != null ? " on " + topic : "") + " with detailed solutions. Include exam tips.";
        String text = geminiService.generate(prompt);
        logInteraction("quiz", body, prompt, text);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("pyq", text)));
    }

    @PostMapping("/summarize")
    public ResponseEntity<ApiResponse<Map<String, String>>> summarize(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        String style = body.getOrDefault("style", "bullet");
        String prompt = "Summarize the following content in " + style + " style suitable for exam revision:\n" + content;
        String text = geminiService.generate(prompt);
        logInteraction("explain", body, prompt, text);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("summary", text)));
    }

    @PostMapping("/summarize-file")
    public ResponseEntity<?> summarizeFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("No file uploaded"));
            }
            String text = new String(file.getBytes(), StandardCharsets.UTF_8);
            if (text.length() < 30) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("File content too short or unsupported format"));
            }
            String prompt = "Summarize the following content into bullet points suitable for exam revision:\n" +
                    text.substring(0, Math.min(text.length(), 8000));
            String summary = geminiService.generate(prompt);
            logInteraction("explain", Map.of(), prompt, summary);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("summary", summary)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.fail("Failed to summarize file"));
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<Map<String, String>>> suggestions(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String topic) {
        String prompt = "Suggest 5 next study queries" +
                (subject != null ? " for subject " + subject : "") +
                (topic != null ? " focused on " + topic : "") +
                ". Keep them concise and actionable.";
        try {
            String text = geminiService.generate(prompt);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("suggestions", text)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of("suggestions",
                    String.join("\n", "Explain more about this topic", "Give me practice questions",
                            "Create a summary", "What are key concepts?", "Provide examples"))));
        }
    }

    @PostMapping("/generate-questions")
    public ResponseEntity<?> generateQuestions(@RequestBody Map<String, Object> body) {
        if (!geminiService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.fail("AI service is not configured. Please set GEMINI_API_KEY in your environment."));
        }
        String subject = (String) body.get("subject");
        String topic = (String) body.get("topic");
        String difficulty = (String) body.get("difficulty");
        int count = ((Number) body.get("count")).intValue();
        String prompt = "Generate " + count + " " + difficulty + " level practice questions for " + subject + " - " + topic + ".";
        String questions = geminiService.generate(prompt);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "subject", subject, "topic", topic, "difficulty", difficulty,
                "count", count, "questions", questions, "generatedAt", Instant.now()
        )));
    }

    @PostMapping("/explain-concept")
    public ResponseEntity<?> explainConcept(@RequestBody Map<String, String> body) {
        if (!geminiService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.fail("AI service is not configured. Please set GEMINI_API_KEY in your environment."));
        }
        String concept = body.get("concept");
        String subject = body.get("subject");
        String level = body.get("level");
        String prompt = "Explain the concept \"" + concept + "\" in " + subject + " at a " + level + " level.";
        String explanation = geminiService.generate(prompt);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "concept", concept, "subject", subject, "level", level,
                "explanation", explanation, "explainedAt", Instant.now()
        )));
    }

    private String buildChatPrompt(String message, String subject, String context) {
        StringBuilder prompt = new StringBuilder("You are ExamPal, an AI-powered exam preparation assistant for college students. ");
        if (subject != null) prompt.append("The student is studying ").append(subject).append(". ");
        if (context != null) prompt.append("Context: ").append(context).append(". ");
        prompt.append("Please provide a helpful, educational response to: \"").append(message).append("\".");
        return prompt.toString();
    }

    private void logInteraction(String queryType, Map<?, ?> context, String prompt, String response) {
        try {
            User user = SecurityUtils.currentUser();
            AIInteraction interaction = new AIInteraction();
            if (user != null) interaction.setUser(user.getId());
            interaction.setSessionId(String.valueOf(System.currentTimeMillis()));
            interaction.setQueryType(queryType);
            Map<String, Object> ctx = new HashMap<>();
            context.forEach((k, v) -> ctx.put(String.valueOf(k), v));
            interaction.setContext(ctx);
            interaction.setPrompt(prompt);
            interaction.setResponse(response);
            aiInteractionRepository.save(interaction);
        } catch (Exception ignored) {
        }
    }
}
