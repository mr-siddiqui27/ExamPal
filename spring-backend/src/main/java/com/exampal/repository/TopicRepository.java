package com.exampal.repository;

import com.exampal.model.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.regex.Pattern;

public interface TopicRepository extends MongoRepository<Topic, String> {
    List<Topic> findByModule(String moduleId);
    List<Topic> findByNameRegex(Pattern pattern, org.springframework.data.domain.Pageable pageable);
}
