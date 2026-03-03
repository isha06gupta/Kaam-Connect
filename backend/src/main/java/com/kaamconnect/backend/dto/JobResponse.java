package com.kaamconnect.backend.dto;

import java.time.LocalDateTime;

public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String category;
    private Integer paymentAmount;
    private String paymentType;
    private Integer workersNeeded;
    private Boolean urgent;
    private Long postedByUserId;
    private LocalDateTime createdAt;
    private Boolean employerMarkedComplete;
    private Boolean workerConfirmedPayment;
    private Boolean ngoVerified;

    public JobResponse() {}

    public JobResponse(Long id,
                       String title,
                       String description,
                       String location,
                       String category,
                       Integer paymentAmount,
                       String paymentType,
                       Integer workersNeeded,
                       Boolean urgent,
                       Long postedByUserId,
                       LocalDateTime createdAt,
                       Boolean employerMarkedComplete,
                       Boolean workerConfirmedPayment,
                       Boolean ngoVerified) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.category = category;
        this.paymentAmount = paymentAmount;
        this.paymentType = paymentType;
        this.workersNeeded = workersNeeded;
        this.urgent = urgent;
        this.postedByUserId = postedByUserId;
        this.createdAt = createdAt;
        this.employerMarkedComplete = employerMarkedComplete;
        this.workerConfirmedPayment = workerConfirmedPayment;
        this.ngoVerified = ngoVerified;
    }

    // getters and setters (standard)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getEmployerMarkedComplete() { return employerMarkedComplete; }
    public void setEmployerMarkedComplete(Boolean employerMarkedComplete) { this.employerMarkedComplete = employerMarkedComplete; }

    public Boolean getWorkerConfirmedPayment() { return workerConfirmedPayment; }
    public void setWorkerConfirmedPayment(Boolean workerConfirmedPayment) { this.workerConfirmedPayment = workerConfirmedPayment; }

    public Boolean getNgoVerified() { return ngoVerified; }
    public void setNgoVerified(Boolean ngoVerified) { this.ngoVerified = ngoVerified; }
}