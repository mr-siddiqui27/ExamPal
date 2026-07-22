package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.User;
import com.exampal.repository.UserRepository;
import com.exampal.security.SecurityUtils;
import com.exampal.service.MockDataService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> leaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<User> leaderboard = userRepository.findByIsActiveTrueOrderByAverageScoreDescStudyStreakDesc(PageRequest.of(0, limit));
        leaderboard.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.ok(Map.of("leaderboard", leaderboard, "total", leaderboard.size())));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> stats() {
        User current = SecurityUtils.requireUser();
        User user = userRepository.findById(current.getId()).orElseThrow();
        Map<String, Object> stats = Map.of(
                "totalExamsTaken", user.getTotalExamsTaken(),
                "averageScore", user.getAverageScore(),
                "studyStreak", user.getStudyStreak(),
                "profileCompletion", user.getProfileCompletion(),
                "lastStudyDate", user.getLastStudyDate()
        );
        return ResponseEntity.ok(ApiResponse.ok(Map.of("stats", stats)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "20") int limit) {
        User current = SecurityUtils.requireUser();
        SecurityUtils.requireRole(current, "admin");
        List<User> users = name != null
                ? userRepository.findByNameContainingIgnoreCase(name, PageRequest.of(0, limit))
                : userRepository.findAll(PageRequest.of(0, limit)).getContent();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.ok(Map.of("users", users, "total", users.size())));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        User current = SecurityUtils.requireUser();
        SecurityUtils.requireRole(current, "admin");
        Boolean isActive = body.get("isActive");
        if (isActive == null) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("isActive must be a boolean value", 400));
        }
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(isActive);
                    user.setPassword(null);
                    userRepository.save(user);
                    String msg = isActive ? "activated" : "deactivated";
                    return ResponseEntity.ok(ApiResponse.ok("User account " + msg + " successfully", Map.of("user", user)));
                })
                .orElse(ResponseEntity.status(404).body(ApiResponse.fail("User not found", 404)));
    }
}

@RestController
@RequestMapping("/api/resources")
class ResourceController {

    private final MockDataService mockDataService;

    ResourceController(MockDataService mockDataService) {
        this.mockDataService = mockDataService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String college,
            @RequestParam(defaultValue = "20") int limit) {
        List<Map<String, Object>> resources = mockDataService.getResources().stream()
                .filter(r -> subject == null || r.get("subject").toString().toLowerCase().contains(subject.toLowerCase()))
                .filter(r -> type == null || type.equals(r.get("type")))
                .filter(r -> college == null || college.equals(r.get("college")))
                .limit(limit)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(Map.of("resources", resources, "total", resources.size())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detail(@PathVariable String id) {
        return mockDataService.getResources().stream()
                .filter(r -> id.equals(r.get("id")))
                .findFirst()
                .map(r -> ResponseEntity.ok(ApiResponse.ok(Map.of("resource", r))))
                .orElse(ResponseEntity.status(404).body(ApiResponse.fail("Resource not found", 404)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@RequestBody Map<String, Object> body) {
        SecurityUtils.requireUser();
        body.put("id", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.status(201).body(ApiResponse.ok("Resource created successfully", Map.of("resource", body)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        SecurityUtils.requireUser();
        return ResponseEntity.ok(ApiResponse.ok("Resource updated successfully", Map.of("resourceId", id, "updates", body)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        SecurityUtils.requireUser();
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted successfully", null));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rate(@PathVariable String id, @RequestBody Map<String, Object> body) {
        SecurityUtils.requireUser();
        return ResponseEntity.ok(ApiResponse.ok("Rating submitted successfully", Map.of("resourceId", id, "rating", body.get("rating"))));
    }
}
