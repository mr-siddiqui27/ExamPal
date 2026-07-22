package com.exampal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "subjects")
public class Subject {

    @Id
    private String id;
    private String name;
    private String code;
    private List<String> difficultyLevels = new ArrayList<>();
    private List<String> aiContextKeywords = new ArrayList<>();
    private String college;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public List<String> getDifficultyLevels() { return difficultyLevels; }
    public void setDifficultyLevels(List<String> difficultyLevels) { this.difficultyLevels = difficultyLevels; }
    public List<String> getAiContextKeywords() { return aiContextKeywords; }
    public void setAiContextKeywords(List<String> aiContextKeywords) { this.aiContextKeywords = aiContextKeywords; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
}
