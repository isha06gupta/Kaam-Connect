package com.kaamconnect.backend.dto;

import java.time.LocalDateTime;

public class JobApplicationResponse {
    private Long applicationId;
    private Long jobId;
    private Long userId;
    private String applicantName;
    private String applicantMobile;
    private String applicantLocation;
    private String applicantSkill;
    private LocalDateTime appliedAt;

    public JobApplicationResponse() {
    }

    public JobApplicationResponse(Long applicationId, Long jobId, Long userId, String applicantName, String applicantMobile, String applicantLocation, String applicantSkill, LocalDateTime appliedAt) {
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.userId = userId;
        this.applicantName = applicantName;
        this.applicantMobile = applicantMobile;
        this.applicantLocation = applicantLocation;
        this.applicantSkill = applicantSkill;
        this.appliedAt = appliedAt;
    }

    public Long getApplicationId() { return applicationId; }
    public Long getJobId() { return jobId; }
    public Long getUserId() { return userId; }
    public String getApplicantName() { return applicantName; }
    public String getApplicantMobile() { return applicantMobile; }
    public String getApplicantLocation() { return applicantLocation; }
    public String getApplicantSkill() { return applicantSkill; }
    public LocalDateTime getAppliedAt() { return appliedAt; }

    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public void setApplicantMobile(String applicantMobile) { this.applicantMobile = applicantMobile; }
    public void setApplicantLocation(String applicantLocation) { this.applicantLocation = applicantLocation; }
    public void setApplicantSkill(String applicantSkill) { this.applicantSkill = applicantSkill; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}