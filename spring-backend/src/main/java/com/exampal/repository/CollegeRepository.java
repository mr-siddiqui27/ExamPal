package com.exampal.repository;

import com.exampal.model.College;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CollegeRepository extends MongoRepository<College, String> {
    List<College> findByNameIn(List<String> names);
}
