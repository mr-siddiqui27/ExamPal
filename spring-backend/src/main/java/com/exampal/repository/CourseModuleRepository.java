package com.exampal.repository;

import com.exampal.model.CourseModule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseModuleRepository extends MongoRepository<CourseModule, String> {
    List<CourseModule> findBySubject(String subjectId);
}
