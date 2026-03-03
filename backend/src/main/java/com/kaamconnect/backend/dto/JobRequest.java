package com.kaamconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Payment amount is required")
    private Integer paymentAmount;

    @NotBlank(message = "Payment type is required")
    private String paymentType;

    @NotNull(message = "Workers needed is required")
    private Integer workersNeeded;

    private Boolean urgent;

    public JobRequest() {}

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
}