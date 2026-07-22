package com.exampal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "modules")
public class CourseModule {

    @Id
    private String id;
    private String name;
    private int number;
    private String description;
    private List<String> learningObjectives = new ArrayList<>();
    private String subject;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getLearningObjectives() { return learningObjectives; }
    public void setLearningObjectives(List<String> learningObjectives) { this.learningObjectives = learningObjectives; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}
