package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.dto.JobApplicationResponse;
import com.kaamconnect.backend.dto.JobRequest;
import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.exception.UnauthorizedException;
import com.kaamconnect.backend.service.JobService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String paymentType,
            @RequestParam(required = false) Integer minSalary,
            @RequestParam(required = false) Integer maxSalary,
            @RequestParam(required = false) Boolean urgent,
            @RequestParam(required = false) Boolean ngoVerified
    ) {

        List<JobResponse> jobs = jobService.getFilteredJobs(
                keyword,
                location,
                category,
                paymentType,
                minSalary,
                maxSalary,
                urgent,
                ngoVerified
        );

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Jobs fetched successfully", jobs)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest request
    ) {
        Long userId = getAuthenticatedUserId();
        JobResponse job = jobService.createJob(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Job created successfully", job)
        );
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<String>> applyToJob(
            @PathVariable("id") Long jobId
    ) {
        Long userId = getAuthenticatedUserId();
        jobService.applyToJob(jobId, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Applied successfully", "Application submitted")
        );
    }

    @GetMapping("/applied")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAppliedJobs() {
        Long userId = getAuthenticatedUserId();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Applied jobs fetched",
                        jobService.getAppliedJobs(userId))
        );
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getJobApplications(
            @PathVariable("id") Long jobId
    ) {
        getAuthenticatedUserId();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Applications fetched",
                        jobService.getApplicationsForJob(jobId))
        );
    }

    @PutMapping("/mark-complete/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> markComplete(
            @PathVariable Long jobId
    ) {
        Long userId = getAuthenticatedUserId();
        JobResponse response = jobService.markJobComplete(jobId, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Job marked complete", response)
        );
    }

    @PutMapping("/confirm-payment/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> confirmPayment(
            @PathVariable Long jobId
    ) {
        getAuthenticatedUserId();
        JobResponse response = jobService.confirmPayment(jobId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Payment confirmed", response)
        );
    }

    private Long getAuthenticatedUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UnauthorizedException("Unauthorized");
        }

        Object principal = authentication.getPrincipal();

        try {
            if (principal instanceof Long) {
                return (Long) principal;
            }
            return Long.parseLong(principal.toString());
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Unauthorized");
        }
    }
}