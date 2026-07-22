package com.exampal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    @Indexed(unique = true, sparse = true)
    private String email;
    @JsonIgnore
    private String password;
    private boolean isGuest = false;
    private Instant guestExpiresAt;
    private String collegePreference;
    private ProfileSetup profileSetup = new ProfileSetup();
    private Accessibility accessibility = new Accessibility();
    private AiHistory aiHistory = new AiHistory();
    private GeminiContext geminiContext = new GeminiContext();
    private String role = "student";
    private int totalExamsTaken = 0;
    private double averageScore = 0;
    private int studyStreak = 0;
    private Instant lastStudyDate;
    private boolean isActive = true;
    private boolean isVerified = false;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;

    public static class ProfileSetup {
        private int completionPercent = 0;
        private List<String> stepsCompleted = new ArrayList<>();
        public int getCompletionPercent() { return completionPercent; }
        public void setCompletionPercent(int completionPercent) { this.completionPercent = completionPercent; }
        public List<String> getStepsCompleted() { return stepsCompleted; }
        public void setStepsCompleted(List<String> stepsCompleted) { this.stepsCompleted = stepsCompleted; }
    }

    public static class Accessibility {
        private String textSize = "medium";
        private String contrastMode = "default";
        private boolean screenReader = false;
        public String getTextSize() { return textSize; }
        public void setTextSize(String textSize) { this.textSize = textSize; }
        public String getContrastMode() { return contrastMode; }
        public void setContrastMode(String contrastMode) { this.contrastMode = contrastMode; }
        public boolean isScreenReader() { return screenReader; }
        public void setScreenReader(boolean screenReader) { this.screenReader = screenReader; }
    }

    public static class AiHistory {
        private int totalInteractions = 0;
        private Instant lastInteractionAt;
        private List<String> topSubjects = new ArrayList<>();
        public int getTotalInteractions() { return totalInteractions; }
        public void setTotalInteractions(int totalInteractions) { this.totalInteractions = totalInteractions; }
        public Instant getLastInteractionAt() { return lastInteractionAt; }
        public void setLastInteractionAt(Instant lastInteractionAt) { this.lastInteractionAt = lastInteractionAt; }
        public List<String> getTopSubjects() { return topSubjects; }
        public void setTopSubjects(List<String> topSubjects) { this.topSubjects = topSubjects; }
    }

    public static class GeminiContext {
        private String lastConversationId;
        private List<ConversationSummary> conversationSummaries = new ArrayList<>();
        public String getLastConversationId() { return lastConversationId; }
        public void setLastConversationId(String lastConversationId) { this.lastConversationId = lastConversationId; }
        public List<ConversationSummary> getConversationSummaries() { return conversationSummaries; }
        public void setConversationSummaries(List<ConversationSummary> conversationSummaries) { this.conversationSummaries = conversationSummaries; }
    }

    public static class ConversationSummary {
        private String conversationId;
        private String summary;
        private Instant updatedAt = Instant.now();
        public String getConversationId() { return conversationId; }
        public void setConversationId(String conversationId) { this.conversationId = conversationId; }
        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
        public Instant getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public boolean isGuest() { return isGuest; }
    public void setGuest(boolean guest) { isGuest = guest; }
    public Instant getGuestExpiresAt() { return guestExpiresAt; }
    public void setGuestExpiresAt(Instant guestExpiresAt) { this.guestExpiresAt = guestExpiresAt; }
    public String getCollegePreference() { return collegePreference; }
    public void setCollegePreference(String collegePreference) { this.collegePreference = collegePreference; }
    public ProfileSetup getProfileSetup() { return profileSetup; }
    public void setProfileSetup(ProfileSetup profileSetup) { this.profileSetup = profileSetup; }
    public Accessibility getAccessibility() { return accessibility; }
    public void setAccessibility(Accessibility accessibility) { this.accessibility = accessibility; }
    public AiHistory getAiHistory() { return aiHistory; }
    public void setAiHistory(AiHistory aiHistory) { this.aiHistory = aiHistory; }
    public GeminiContext getGeminiContext() { return geminiContext; }
    public void setGeminiContext(GeminiContext geminiContext) { this.geminiContext = geminiContext; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public int getTotalExamsTaken() { return totalExamsTaken; }
    public void setTotalExamsTaken(int totalExamsTaken) { this.totalExamsTaken = totalExamsTaken; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public int getStudyStreak() { return studyStreak; }
    public void setStudyStreak(int studyStreak) { this.studyStreak = studyStreak; }
    public Instant getLastStudyDate() { return lastStudyDate; }
    public void setLastStudyDate(Instant lastStudyDate) { this.lastStudyDate = lastStudyDate; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public int getProfileCompletion() {
        return profileSetup != null ? profileSetup.getCompletionPercent() : 0;
    }
}
