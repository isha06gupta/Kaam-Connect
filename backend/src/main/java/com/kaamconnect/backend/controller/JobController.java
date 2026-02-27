package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs() {
        List<JobResponse> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(new ApiResponse<>(true, "Jobs fetched successfully", jobs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request) {
        Long userId = getAuthenticatedUserId();
        JobResponse job = jobService.createJob(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job created successfully", job));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<String>> applyToJob(@PathVariable("id") Long jobId) {
        Long userId = getAuthenticatedUserId();
        jobService.applyToJob(jobId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Applied to job successfully", "Application submitted"));
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

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
