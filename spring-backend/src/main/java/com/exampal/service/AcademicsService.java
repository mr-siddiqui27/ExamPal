package com.exampal.service;

import com.exampal.model.*;
import com.exampal.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class AcademicsService {

    private final CollegeRepository collegeRepository;
    private final SubjectRepository subjectRepository;
    private final CourseModuleRepository moduleRepository;
    private final TopicRepository topicRepository;

    public AcademicsService(CollegeRepository collegeRepository, SubjectRepository subjectRepository,
                            CourseModuleRepository moduleRepository, TopicRepository topicRepository) {
        this.collegeRepository = collegeRepository;
        this.subjectRepository = subjectRepository;
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
    }

    public List<College> getColleges() {
        try {
            return collegeRepository.findByNameIn(List.of("BBD University", "AKTU"));
        } catch (Exception e) {
            return List.of();
        }
    }

    public List<Subject> getSubjects(String collegeId) {
        return subjectRepository.findByCollege(collegeId);
    }

    public List<CourseModule> getModules(String subjectId) {
        return moduleRepository.findBySubject(subjectId);
    }

    public List<Topic> getTopics(String moduleId) {
        return topicRepository.findByModule(moduleId);
    }

    public List<Map<String, Object>> getSearchSuggestions(String q) {
        Pattern pattern = Pattern.compile(Pattern.quote(q), Pattern.CASE_INSENSITIVE);
        var subjects = subjectRepository.findByNameRegex(pattern, PageRequest.of(0, 5));
        var topics = topicRepository.findByNameRegex(pattern, PageRequest.of(0, 5));

        List<Map<String, Object>> suggestions = new ArrayList<>();
        for (Subject s : subjects) {
            suggestions.add(Map.of("type", "subject", "id", s.getId(), "name", s.getName(), "code", s.getCode() != null ? s.getCode() : ""));
        }
        for (Topic t : topics) {
            suggestions.add(Map.of("type", "topic", "id", t.getId(), "name", t.getName()));
        }
        return suggestions;
    }
}
