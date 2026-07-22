package com.exampal.controller;

import com.exampal.dto.ApiResponse;
import com.exampal.model.College;
import com.exampal.model.CourseModule;
import com.exampal.model.Subject;
import com.exampal.model.Topic;
import com.exampal.service.AcademicsService;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AcademicsController {

    private final AcademicsService academicsService;

    public AcademicsController(AcademicsService academicsService) {
        this.academicsService = academicsService;
    }

    @GetMapping("/colleges")
    public ResponseEntity<ApiResponse<List<College>>> colleges() {
        return ResponseEntity.ok(ApiResponse.ok(academicsService.getColleges()));
    }

    @GetMapping("/subjects/{collegeId}")
    public ResponseEntity<?> subjects(@PathVariable String collegeId) {
        if (!ObjectId.isValid(collegeId)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "errors",
                    List.of(Map.of("msg", "Invalid collegeId", "param", "collegeId"))));
        }
        return ResponseEntity.ok(ApiResponse.ok(academicsService.getSubjects(collegeId)));
    }

    @GetMapping("/modules/{subjectId}")
    public ResponseEntity<?> modules(@PathVariable String subjectId) {
        if (!ObjectId.isValid(subjectId)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "errors",
                    List.of(Map.of("msg", "Invalid subjectId", "param", "subjectId"))));
        }
        return ResponseEntity.ok(ApiResponse.ok(academicsService.getModules(subjectId)));
    }

    @GetMapping("/topics/{moduleId}")
    public ResponseEntity<?> topics(@PathVariable String moduleId) {
        if (!ObjectId.isValid(moduleId)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "errors",
                    List.of(Map.of("msg", "Invalid moduleId", "param", "moduleId"))));
        }
        return ResponseEntity.ok(ApiResponse.ok(academicsService.getTopics(moduleId)));
    }

    @GetMapping("/search/suggestions")
    public ResponseEntity<?> suggestions(@RequestParam(required = false) String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "errors",
                    List.of(Map.of("msg", "Query is required", "param", "q"))));
        }
        return ResponseEntity.ok(ApiResponse.ok(academicsService.getSearchSuggestions(q.trim())));
    }
}
