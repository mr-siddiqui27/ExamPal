package com.exampal.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class MockDataService {

    public List<Map<String, Object>> getExams() {
        return List.of(
                exam("1", "Computer Science Fundamentals", "Computer Science", "beginner", 60, 30, "BBD University",
                        "Basic concepts of computer science and programming",
                        List.of("Programming Basics", "Data Structures", "Algorithms")),
                exam("2", "Advanced Mathematics", "Mathematics", "advanced", 90, 25, "AKTU",
                        "Advanced mathematical concepts and problem solving",
                        List.of("Calculus", "Linear Algebra", "Statistics")),
                exam("3", "Physics Principles", "Physics", "intermediate", 75, 35, "BBD University",
                        "Core physics principles and applications",
                        List.of("Mechanics", "Thermodynamics", "Electromagnetism"))
        );
    }

    private Map<String, Object> exam(String id, String title, String subject, String difficulty,
                                     int duration, int questionCount, String college, String description, List<String> topics) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("title", title);
        m.put("subject", subject);
        m.put("difficulty", difficulty);
        m.put("duration", duration);
        m.put("questionCount", questionCount);
        m.put("college", college);
        m.put("description", description);
        m.put("topics", topics);
        return m;
    }

    public Map<String, Object> getExamDetail(String id) {
        if (!"1".equals(id)) return null;
        Map<String, Object> exam = new LinkedHashMap<>(getExams().get(0));
        exam.put("instructions", List.of(
                "Read each question carefully",
                "You have 60 minutes to complete the exam",
                "All questions are mandatory",
                "Use the back button to review your answers"
        ));
        exam.put("rules", List.of(
                "No external resources allowed",
                "Calculator is permitted",
                "Submit only when you are confident with all answers"
        ));
        return exam;
    }

    public List<Map<String, Object>> getResources() {
        return List.of(
                resource("1", "Programming Fundamentals Guide", "study_guide", "Computer Science", "BBD University", "beginner", 4.5, 1250),
                resource("2", "Calculus Practice Problems", "practice_set", "Mathematics", "AKTU", "intermediate", 4.2, 890),
                resource("3", "Physics Lab Manual", "lab_manual", "Physics", "BBD University", "intermediate", 4.7, 2100),
                resource("4", "Data Structures Cheat Sheet", "cheat_sheet", "Computer Science", "BBD University", "intermediate", 4.8, 3100)
        );
    }

    private Map<String, Object> resource(String id, String title, String type, String subject, String college,
                                         String difficulty, double rating, int downloads) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("title", title);
        m.put("type", type);
        m.put("subject", subject);
        m.put("college", college);
        m.put("description", title + " description");
        m.put("content", "Content for " + title);
        m.put("difficulty", difficulty);
        m.put("tags", List.of(subject.toLowerCase()));
        m.put("author", "ExamPal Team");
        m.put("createdAt", Instant.now().minusSeconds(86400).toString());
        m.put("rating", rating);
        m.put("downloads", downloads);
        return m;
    }

    public Map<String, Object> getProgressDashboard() {
        Map<String, Object> progress = new LinkedHashMap<>();
        progress.put("overview", Map.of(
                "totalExamsTaken", 15, "averageScore", 78, "studyStreak", 7,
                "totalStudyTime", 45, "profileCompletion", 85
        ));
        progress.put("recentActivity", List.of(
                Map.of("id", "1", "type", "exam_completed", "title", "Computer Science Fundamentals",
                        "score", 85, "date", Instant.now().minusSeconds(86400).toString(), "subject", "Computer Science")
        ));
        progress.put("subjects", List.of(
                Map.of("name", "Computer Science", "progress", 75, "examsTaken", 8, "averageScore", 82,
                        "lastStudied", Instant.now().minusSeconds(43200).toString()),
                Map.of("name", "Mathematics", "progress", 60, "examsTaken", 5, "averageScore", 70,
                        "lastStudied", Instant.now().minusSeconds(86400).toString())
        ));
        progress.put("achievements", List.of(
                Map.of("id", "1", "title", "First Exam", "description", "Completed your first exam",
                        "icon", "🎯", "unlockedAt", Instant.now().minusSeconds(259200).toString())
        ));
        progress.put("goals", List.of(
                Map.of("id", "1", "title", "Complete 20 exams", "current", 15, "target", 20,
                        "progress", 75, "deadline", Instant.now().plusSeconds(2592000).toString())
        ));
        return progress;
    }
}
