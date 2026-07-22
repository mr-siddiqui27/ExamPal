package com.exampal.repository;

import com.exampal.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByIsActiveTrueOrderByAverageScoreDescStudyStreakDesc(org.springframework.data.domain.Pageable pageable);
    List<User> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);
}
