package com.kaamconnect.backend.dto;

import java.time.LocalDateTime;

public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String category;
    private String paymentAmount;
    private Integer workersNeeded;
    private Boolean urgent;
    private Long postedByUserId;
    private LocalDateTime createdAt;

    public JobResponse() {
    }

    public JobResponse(Long id,
                       String title,
                       String description,
                       String location,
                       String category,
                       String paymentAmount,
                       Integer workersNeeded,
                       Boolean urgent,
                       Long postedByUserId,
                       LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.category = category;
        this.paymentAmount = paymentAmount;
        this.workersNeeded = workersNeeded;
        this.urgent = urgent;
        this.postedByUserId = postedByUserId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(String paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public Integer getWorkersNeeded() {
        return workersNeeded;
    }

    public void setWorkersNeeded(Integer workersNeeded) {
        this.workersNeeded = workersNeeded;
    }

    public Boolean getUrgent() {
        return urgent;
    }

    public void setUrgent(Boolean urgent) {
        this.urgent = urgent;
    }

    public Long getPostedByUserId() {
        return postedByUserId;
    }

    public void setPostedByUserId(Long postedByUserId) {
        this.postedByUserId = postedByUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
