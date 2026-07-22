package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.User;
import com.exampal.security.SecurityUtils;
import com.exampal.service.MockDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final MockDataService mockDataService;

    public ExamController(MockDataService mockDataService) {
        this.mockDataService = mockDataService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String college,
            @RequestParam(defaultValue = "20") int limit) {

        List<Map<String, Object>> exams = mockDataService.getExams().stream()
                .filter(e -> subject == null || e.get("subject").toString().toLowerCase().contains(subject.toLowerCase()))
                .filter(e -> difficulty == null || difficulty.equals(e.get("difficulty")))
                .filter(e -> college == null || college.equals(e.get("college")))
                .limit(limit)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "exams", exams, "total", exams.size(),
                "filters", Map.of("subject", subject, "difficulty", difficulty, "college", college)
        )));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detail(@PathVariable String id) {
        Map<String, Object> exam = mockDataService.getExamDetail(id);
        if (exam == null) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Exam not found", 404));
        }
        return ResponseEntity.ok(ApiResponse.ok(Map.of("exam", exam)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<Map<String, Object>>> start(@PathVariable String id) {
        User user = SecurityUtils.requireUser();
        Map<String, Object> session = Map.of(
                "id", "session_" + System.currentTimeMillis(),
                "examId", id,
                "userId", user.getId(),
                "startTime", Instant.now().toString(),
                "status", "in_progress",
                "currentQuestion", 1,
                "answers", Map.of(),
                "timeRemaining", 3600
        );
        return ResponseEntity.ok(ApiResponse.ok("Exam started successfully", Map.of("session", session)));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submit(@PathVariable String id, @RequestBody Map<String, Object> body) {
        User user = SecurityUtils.requireUser();
        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) body.get("answers");
        int total = answers != null ? answers.size() : 0;
        int correct = total > 0 ? (int) (Math.random() * total * 0.4 + total * 0.6) : 0;
        int score = total > 0 ? Math.round((correct * 100f) / total) : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", "result_" + System.currentTimeMillis());
        result.put("examId", id);
        result.put("userId", user.getId());
        result.put("sessionId", body.get("sessionId"));
        result.put("score", score);
        result.put("totalQuestions", total);
        result.put("correctAnswers", correct);
        result.put("incorrectAnswers", total - correct);
        result.put("timeTaken", (int) (Math.random() * 60 + 30));
        result.put("submittedAt", Instant.now().toString());
        result.put("answers", answers != null ? answers : Map.of());
        result.put("feedback", score >= 70 ? "Excellent performance!" : score >= 50 ? "Good effort, keep practicing!" : "More practice needed");
        return ResponseEntity.ok(ApiResponse.ok("Exam submitted successfully", Map.of("result", result)));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<ApiResponse<Map<String, Object>>> results(@PathVariable String id) {
        User user = SecurityUtils.requireUser();
        List<Map<String, Object>> mockResults = List.of(
                Map.of("id", "result_1", "examId", id, "userId", user.getId(), "score", 85,
                        "totalQuestions", 30, "correctAnswers", 25, "incorrectAnswers", 5,
                        "timeTaken", 45, "submittedAt", Instant.now().minusSeconds(86400).toString(),
                        "feedback", "Excellent performance!"),
                Map.of("id", "result_2", "examId", id, "userId", user.getId(), "score", 72,
                        "totalQuestions", 30, "correctAnswers", 22, "incorrectAnswers", 8,
                        "timeTaken", 52, "submittedAt", Instant.now().minusSeconds(172800).toString(),
                        "feedback", "Good effort, keep practicing!")
        );
        int avg = mockResults.stream().mapToInt(r -> (Integer) r.get("score")).sum() / mockResults.size();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("results", mockResults, "total", mockResults.size(), "averageScore", avg)));
    }
}
