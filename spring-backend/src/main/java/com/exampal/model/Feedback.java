package com.exampal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedbacks")
public class Feedback {

    @Id
    private String id;
    private String user;
    private String aiInteraction;
    private String sessionType;
    private int rating;
    private String comments;
    private Integer geminiResponseQuality;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getAiInteraction() { return aiInteraction; }
    public void setAiInteraction(String aiInteraction) { this.aiInteraction = aiInteraction; }
    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public Integer getGeminiResponseQuality() { return geminiResponseQuality; }
    public void setGeminiResponseQuality(Integer geminiResponseQuality) { this.geminiResponseQuality = geminiResponseQuality; }
}
