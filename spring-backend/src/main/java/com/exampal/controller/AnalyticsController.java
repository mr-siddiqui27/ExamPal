package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.AIInteraction;
import com.exampal.model.Feedback;
import com.exampal.model.User;
import com.exampal.repository.AIInteractionRepository;
import com.exampal.repository.FeedbackRepository;
import com.exampal.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    private final AIInteractionRepository aiInteractionRepository;

    public AnalyticsController(AIInteractionRepository aiInteractionRepository) {
        this.aiInteractionRepository = aiInteractionRepository;
    }

    @GetMapping("/analytics/ai-usage")
    public ResponseEntity<ApiResponse<Map<String, Object>>> aiUsage(@RequestParam(required = false) String user) {
        User current = SecurityUtils.requireUser();
        String filterUser = "admin".equals(current.getRole()) && user != null ? user : current.getId();

        List<AIInteraction> all = aiInteractionRepository.findAll().stream()
                .filter(i -> filterUser.equals(i.getUser()))
                .toList();

        Map<String, Map<String, Number>> byTypeMap = new HashMap<>();
        long tokenSum = 0;
        for (AIInteraction i : all) {
            byTypeMap.computeIfAbsent(i.getQueryType(), k -> {
                Map<String, Number> m = new HashMap<>();
                m.put("count", 0);
                m.put("tokens", 0);
                return m;
            });
            Map<String, Number> entry = byTypeMap.get(i.getQueryType());
            entry.put("count", entry.get("count").intValue() + 1);
            if (i.getTokenUsage() != null && i.getTokenUsage().get("totalTokens") != null) {
                tokenSum += i.getTokenUsage().get("totalTokens").longValue();
                entry.put("tokens", entry.get("tokens").longValue() + i.getTokenUsage().get("totalTokens").longValue());
            }
        }

        List<Map<String, Object>> byType = byTypeMap.entrySet().stream()
                .map(e -> Map.<String, Object>of("type", e.getKey(), "count", e.getValue().get("count"), "tokens", e.getValue().get("tokens")))
                .toList();

        double estimatedCost = Math.round(tokenSum * 0.000002 * 1_000_000.0) / 1_000_000.0;

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "totalInteractions", all.size(),
                "byType", byType,
                "tokenSum", tokenSum,
                "estimatedCost", estimatedCost
        )));
    }
}

@RestController
@RequestMapping("/api")
class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<Feedback>> submit(@RequestBody Map<String, Object> body) {
        User user = SecurityUtils.requireUser();
        Feedback feedback = new Feedback();
        feedback.setUser(user.getId());
        feedback.setSessionType((String) body.get("sessionType"));
        feedback.setRating(((Number) body.get("rating")).intValue());
        if (body.get("comments") != null) feedback.setComments((String) body.get("comments"));
        if (body.get("aiInteraction") != null) feedback.setAiInteraction(body.get("aiInteraction").toString());
        if (body.get("geminiResponseQuality") != null) {
            feedback.setGeminiResponseQuality(((Number) body.get("geminiResponseQuality")).intValue());
        }
        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(saved));
    }
}
