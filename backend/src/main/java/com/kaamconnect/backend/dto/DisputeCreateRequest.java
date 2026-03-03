package com.kaamconnect.backend.dto;

import com.kaamconnect.backend.entity.DisputeRaisedBy;

public class DisputeCreateRequest {
    private Long jobId;
    private DisputeRaisedBy raisedBy;
    private String description;

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public DisputeRaisedBy getRaisedBy() {
        return raisedBy;
    }

    public void setRaisedBy(DisputeRaisedBy raisedBy) {
        this.raisedBy = raisedBy;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}