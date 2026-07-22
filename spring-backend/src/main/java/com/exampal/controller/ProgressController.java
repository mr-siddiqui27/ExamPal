package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.AIInteraction;
import com.exampal.model.Quiz;
import com.exampal.model.User;
import com.exampal.repository.AIInteractionRepository;
import com.exampal.repository.QuizRepository;
import com.exampal.repository.UserRepository;
import com.exampal.security.SecurityUtils;
import com.exampal.service.MockDataService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
public class ProgressController {

    private final MockDataService mockDataService;
    private final QuizRepository quizRepository;
    private final AIInteractionRepository aiInteractionRepository;

    public ProgressController(MockDataService mockDataService, QuizRepository quizRepository,
                              AIInteractionRepository aiInteractionRepository) {
        this.mockDataService = mockDataService;
        this.quizRepository = quizRepository;
        this.aiInteractionRepository = aiInteractionRepository;
    }

    @GetMapping("/api/progress/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
        SecurityUtils.requireUser();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("progress", mockDataService.getProgressDashboard())));
    }

    @GetMapping("/api/progress/subjects")
    public ResponseEntity<?> subjects(@RequestParam(required = false) String subject) {
        SecurityUtils.requireUser();
        Map<String, Object> cs = Map.of(
                "name", "Computer Science", "overallProgress", 75,
                "totalExams", 8, "averageScore", 82, "studyTime", 25, "resourcesUsed", 12
        );
        if (subject != null && !"Computer Science".equals(subject)) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Subject not found", 404));
        }
        if (subject != null) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of("subject", cs)));
        }
        return ResponseEntity.ok(ApiResponse.ok(Map.of("subjects", List.of(cs))));
    }

    @GetMapping("/api/progress/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analytics(@RequestParam(defaultValue = "month") String period) {
        SecurityUtils.requireUser();
        Map<String, Object> analytics = Map.of(
                "period", period,
                "studyTrends", Map.of("daily", List.of(2, 3, 1, 4), "weekly", List.of(15, 18, 12)),
                "performanceMetrics", Map.of("improvementRate", 12.5, "weakestAreas", List.of("Algorithms")),
                "timeAnalysis", Map.of("averageStudySession", 45, "totalStudyTime", 45, "efficiency", 78),
                "recommendations", List.of(Map.of("type", "weakness", "subject", "Algorithms", "action", "Focus on algorithm complexity analysis", "priority", "high"))
        );
        return ResponseEntity.ok(ApiResponse.ok(Map.of("analytics", analytics)));
    }

    @PostMapping("/api/progress/study-session")
    public ResponseEntity<ApiResponse<Map<String, Object>>> studySession(@RequestBody Map<String, Object> body) {
        User user = SecurityUtils.requireUser();
        int duration = ((Number) body.get("duration")).intValue();
        Map<String, Object> session = Map.of(
                "id", "session_" + System.currentTimeMillis(),
                "userId", user.getId(),
                "subject", body.get("subject"),
                "duration", duration,
                "topics", body.getOrDefault("topics", List.of()),
                "notes", body.get("notes"),
                "startTime", Instant.now().toString(),
                "endTime", Instant.now().plusSeconds(duration * 60L).toString(),
                "efficiency", (int) (Math.random() * 30 + 70)
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Study session recorded successfully", Map.of("session", session)));
    }

    @PostMapping("/api/progress/goal")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createGoal(@RequestBody Map<String, Object> body) {
        User user = SecurityUtils.requireUser();
        Map<String, Object> goal = new LinkedHashMap<>();
        goal.put("id", "goal_" + System.currentTimeMillis());
        goal.put("userId", user.getId());
        goal.put("title", body.get("title"));
        goal.put("type", body.get("type"));
        goal.put("target", body.get("target"));
        goal.put("current", 0);
        goal.put("progress", 0);
        goal.put("deadline", body.getOrDefault("deadline", Instant.now().plusSeconds(2592000).toString()));
        goal.put("subject", body.get("subject"));
        goal.put("status", "active");
        goal.put("createdAt", Instant.now().toString());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Goal created successfully", Map.of("goal", goal)));
    }

    @PutMapping("/api/progress/goal/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateGoal(@PathVariable String id, @RequestBody Map<String, Object> body) {
        SecurityUtils.requireUser();
        return ResponseEntity.ok(ApiResponse.ok("Goal updated successfully", Map.of("goalId", id, "updatedFields", body.keySet())));
    }

    @PostMapping("/api/progress/quiz")
    public ResponseEntity<?> saveQuiz(@RequestBody Map<String, Object> body) {
        User user = SecurityUtils.requireUser();
        try {
            Quiz quiz = new Quiz();
            quiz.setUser(user.getId());
            quiz.setCompletedAt(Instant.now());

            // Accept both Node backend format and frontend format
            if (body.containsKey("userResponses")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> responses = (List<Map<String, Object>>) body.get("userResponses");
                quiz.setUserResponses(responses);
            } else if (body.containsKey("answers")) {
                quiz.setUserResponses(adaptFrontendAnswers(body));
            }

            if (body.containsKey("questions")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> questions = (List<Map<String, Object>>) body.get("questions");
                quiz.setQuestions(questions);
            }

            if (body.containsKey("score")) {
                quiz.setScore(((Number) body.get("score")).doubleValue());
            }

            if (body.containsKey("timeTakenSeconds")) {
                quiz.setTimeTakenSeconds(((Number) body.get("timeTakenSeconds")).intValue());
            } else if (body.containsKey("time")) {
                quiz.setTimeTakenSeconds(((Number) body.get("time")).intValue());
            }

            if (body.containsKey("context")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> ctx = (Map<String, Object>) body.get("context");
                quiz.setSubject(ctx.get("subject") != null ? ctx.get("subject").toString() : null);
                quiz.setTopic(ctx.get("topic") != null ? ctx.get("topic").toString() : null);
            } else {
                if (body.get("subject") != null) quiz.setSubject(body.get("subject").toString());
                if (body.get("topic") != null) quiz.setTopic(body.get("topic").toString());
            }

            if (body.get("geminiConversationId") != null) {
                quiz.setGeminiConversationId(body.get("geminiConversationId").toString());
            }

            Quiz saved = quizRepository.save(quiz);

            try {
                AIInteraction interaction = new AIInteraction();
                interaction.setUser(user.getId());
                interaction.setSessionId(String.valueOf(System.currentTimeMillis()));
                interaction.setQueryType("quiz");
                interaction.setResponse("Quiz saved with score " + quiz.getScore());
                aiInteractionRepository.save(interaction);
            } catch (Exception ignored) {
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(saved));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.fail("Failed to save quiz"));
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> adaptFrontendAnswers(Map<String, Object> body) {
        Object answersObj = body.get("answers");
        List<Map<String, Object>> result = new ArrayList<>();
        if (answersObj instanceof List<?> list) {
            for (int i = 0; i < list.size(); i++) {
                result.add(Map.of("questionIndex", i, "answer", list.get(i) != null ? list.get(i).toString() : ""));
            }
        } else if (answersObj instanceof Map<?, ?> map) {
            map.forEach((k, v) -> result.add(Map.of("questionIndex", k, "answer", v != null ? v.toString() : "")));
        }
        return result;
    }
}
