package com.exampal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;
    private String user;
    private String subject;
    private String module;
    private String topic;
    private List<Map<String, Object>> questions = new ArrayList<>();
    private List<Map<String, Object>> userResponses = new ArrayList<>();
    private double score;
    private int timeTakenSeconds;
    private String geminiConversationId;
    private Instant completedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public List<Map<String, Object>> getQuestions() { return questions; }
    public void setQuestions(List<Map<String, Object>> questions) { this.questions = questions; }
    public List<Map<String, Object>> getUserResponses() { return userResponses; }
    public void setUserResponses(List<Map<String, Object>> userResponses) { this.userResponses = userResponses; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
    public int getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(int timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
    public String getGeminiConversationId() { return geminiConversationId; }
    public void setGeminiConversationId(String geminiConversationId) { this.geminiConversationId = geminiConversationId; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
