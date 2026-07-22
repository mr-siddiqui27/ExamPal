package com.exampal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "exampal")
public class AppProperties {

    private boolean authDisabled = false;
    private String jwtSecret;
    private String jwtExpiresIn = "30d";
    private String geminiApiKey;
    private String geminiModel = "gemini-2.5-flash";
    private int geminiMaxTokens = 8000;
    private double geminiTemperature = 0.7;
    private String allowedOrigins = "http://localhost:3000,http://localhost:5000";
    private String uploadPath = "uploads/";
    private long rateLimitWindowMs = 900000;
    private int rateLimitMaxRequests = 100;

    public boolean isAuthDisabled() { return authDisabled; }
    public void setAuthDisabled(boolean authDisabled) { this.authDisabled = authDisabled; }
    public String getJwtSecret() { return jwtSecret; }
    public void setJwtSecret(String jwtSecret) { this.jwtSecret = jwtSecret; }
    public String getJwtExpiresIn() { return jwtExpiresIn; }
    public void setJwtExpiresIn(String jwtExpiresIn) { this.jwtExpiresIn = jwtExpiresIn; }
    public String getGeminiApiKey() { return geminiApiKey; }
    public void setGeminiApiKey(String geminiApiKey) { this.geminiApiKey = geminiApiKey; }
    public String getGeminiModel() { return geminiModel; }
    public void setGeminiModel(String geminiModel) { this.geminiModel = geminiModel; }
    public int getGeminiMaxTokens() { return geminiMaxTokens; }
    public void setGeminiMaxTokens(int geminiMaxTokens) { this.geminiMaxTokens = geminiMaxTokens; }
    public double getGeminiTemperature() { return geminiTemperature; }
    public void setGeminiTemperature(double geminiTemperature) { this.geminiTemperature = geminiTemperature; }
    public String getAllowedOrigins() { return allowedOrigins; }
    public void setAllowedOrigins(String allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    public String getUploadPath() { return uploadPath; }
    public void setUploadPath(String uploadPath) { this.uploadPath = uploadPath; }
    public long getRateLimitWindowMs() { return rateLimitWindowMs; }
    public void setRateLimitWindowMs(long rateLimitWindowMs) { this.rateLimitWindowMs = rateLimitWindowMs; }
    public int getRateLimitMaxRequests() { return rateLimitMaxRequests; }
    public void setRateLimitMaxRequests(int rateLimitMaxRequests) { this.rateLimitMaxRequests = rateLimitMaxRequests; }
}
