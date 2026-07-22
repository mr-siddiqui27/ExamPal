package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.AIInteraction;
import com.exampal.model.User;
import com.exampal.repository.AIInteractionRepository;
import com.exampal.repository.UserRepository;
import com.exampal.security.SecurityUtils;
import com.exampal.security.UnauthorizedException;
import com.exampal.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AIInteractionRepository aiInteractionRepository;

    public AuthController(AuthService authService, UserRepository userRepository,
                          AIInteractionRepository aiInteractionRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.aiInteractionRepository = aiInteractionRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody Map<String, Object> body) {
        Map<String, Object> data = authService.register(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> body) {
        try {
            Map<String, Object> data = authService.login(body.get("email"), body.get("password"));
            return ResponseEntity.ok(ApiResponse.ok("Login successful", data));
        } catch (AuthService.UnauthorizedCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail(e.getMessage(), 401));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        SecurityUtils.requireUser();
        return ResponseEntity.ok(ApiResponse.ok("Logout successful. Please remove the token from client storage.", null));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        User current = SecurityUtils.requireUser();
        User user = userRepository.findById(current.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.fail("User not found"));
        }
        if (user.isGuest() && user.getGuestExpiresAt() != null && user.getGuestExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.fail("Guest session expired"));
        }

        List<AIInteraction> recent = aiInteractionRepository.findTop10ByUserOrderByCreatedAtDesc(user.getId());
        long total = aiInteractionRepository.countByUser(user.getId());
        Instant lastAt = recent.isEmpty() ? null : recent.get(0).getCreatedAt();

        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "user", user,
                "ai", Map.of(
                        "totalInteractions", total,
                        "lastInteractionAt", lastAt,
                        "recent", recent.stream().map(i -> Map.of(
                                "queryType", i.getQueryType(),
                                "context", i.getContext(),
                                "createdAt", i.getCreatedAt()
                        )).toList()
                )
        )));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(@RequestBody Map<String, Object> body) {
        User updated = authService.updateProfile(SecurityUtils.requireUser(), body);
        updated.setPassword(null);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", Map.of("user", updated)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody Map<String, String> body) {
        authService.changePassword(SecurityUtils.requireUser(), body.get("currentPassword"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }

    @PostMapping("/guest")
    public ResponseEntity<?> guest(@RequestBody(required = false) Map<String, Object> body) {
        String college = body != null ? (String) body.get("collegePreference") : null;
        @SuppressWarnings("unchecked")
        Map<String, Object> accessibility = body != null ? (Map<String, Object>) body.get("accessibility") : null;
        Map<String, Object> data = authService.createGuest(college, accessibility);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Guest session created", data));
    }
}
