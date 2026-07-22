package com.exampal.repository;

import com.exampal.model.AIInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AIInteractionRepository extends MongoRepository<AIInteraction, String> {
    List<AIInteraction> findTop10ByUserOrderByCreatedAtDesc(String userId);
    long countByUser(String userId);
}
