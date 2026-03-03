package com.kaamconnect.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private String category;

    private Integer paymentAmount;

    private String paymentType;

    private Integer workersNeeded;

    private Boolean urgent = Boolean.FALSE;

    private Long postedByUserId;

    private Boolean employerMarkedComplete = Boolean.FALSE;

    private Boolean workerConfirmedPayment = Boolean.FALSE;

    private LocalDateTime createdAt;

    public Job() {}

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (urgent == null) urgent = Boolean.FALSE;
        if (employerMarkedComplete == null) employerMarkedComplete = Boolean.FALSE;
        if (workerConfirmedPayment == null) workerConfirmedPayment = Boolean.FALSE;
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public Integer getPaymentAmount() { return paymentAmount; }

    public void setPaymentAmount(Integer paymentAmount) { this.paymentAmount = paymentAmount; }

    public String getPaymentType() { return paymentType; }

    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Integer getWorkersNeeded() { return workersNeeded; }

    public void setWorkersNeeded(Integer workersNeeded) { this.workersNeeded = workersNeeded; }

    public Boolean getUrgent() { return urgent; }

    public void setUrgent(Boolean urgent) { this.urgent = urgent; }

    public Long getPostedByUserId() { return postedByUserId; }

    public void setPostedByUserId(Long postedByUserId) { this.postedByUserId = postedByUserId; }

    public Boolean getEmployerMarkedComplete() { return employerMarkedComplete; }

    public void setEmployerMarkedComplete(Boolean employerMarkedComplete) {
        this.employerMarkedComplete = employerMarkedComplete;
    }

    public Boolean getWorkerConfirmedPayment() { return workerConfirmedPayment; }

    public void setWorkerConfirmedPayment(Boolean workerConfirmedPayment) {
        this.workerConfirmedPayment = workerConfirmedPayment;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}