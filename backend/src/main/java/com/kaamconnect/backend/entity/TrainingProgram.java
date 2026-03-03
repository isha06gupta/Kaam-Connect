package com.kaamconnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "training_programs")
public class TrainingProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long createdByNgo;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCreatedByNgo() {
        return createdByNgo;
    }

    public void setCreatedByNgo(Long createdByNgo) {
        this.createdByNgo = createdByNgo;
    }
}