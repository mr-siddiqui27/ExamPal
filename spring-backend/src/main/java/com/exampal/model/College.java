package com.exampal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "colleges")
public class College {

    @Id
    private String id;
    private String name;
    @Indexed
    private String code;
    private String location;
    private List<String> availableSubjects = new ArrayList<>();
    private Map<String, String> geminiPromptTemplates;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public List<String> getAvailableSubjects() { return availableSubjects; }
    public void setAvailableSubjects(List<String> availableSubjects) { this.availableSubjects = availableSubjects; }
    public Map<String, String> getGeminiPromptTemplates() { return geminiPromptTemplates; }
    public void setGeminiPromptTemplates(Map<String, String> geminiPromptTemplates) { this.geminiPromptTemplates = geminiPromptTemplates; }
}
