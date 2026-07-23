package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Welcome to ExamPal Backend API",
                "version", "1.0.0",
                "documentation", "/api/docs",
                "health", "/health",
                "endpoints", Map.of(
                        "auth", "/api/auth",
                        "users", "/api/users",
                        "exams", "/api/exams",
                        "ai", "/api/ai",
                        "resources", "/api/resources",
                        "progress", "/api/progress"
                )
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "ExamPal Backend is running",
                "timestamp", Instant.now().toString(),
                "environment", System.getProperty("spring.profiles.active", "development"),
                "version", "1.0.0",
                "backend", "spring-boot"
        ));
    }
}
