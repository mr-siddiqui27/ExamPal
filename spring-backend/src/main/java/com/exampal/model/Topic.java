package com.exampal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "topics")
public class Topic {

    @Id
    private String id;
    private String name;
    private String description;
    private List<String> keywords = new ArrayList<>();
    private String difficulty;
    private Map<String, String> geminiPromptTemplates;
    private String module;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Map<String, String> getGeminiPromptTemplates() { return geminiPromptTemplates; }
    public void setGeminiPromptTemplates(Map<String, String> geminiPromptTemplates) { this.geminiPromptTemplates = geminiPromptTemplates; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
}
