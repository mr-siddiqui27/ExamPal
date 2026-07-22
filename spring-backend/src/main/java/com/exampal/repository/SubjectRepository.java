package com.exampal.repository;

import com.exampal.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.regex.Pattern;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByCollege(String collegeId);
    List<Subject> findByNameRegex(Pattern pattern, org.springframework.data.domain.Pageable pageable);
}
