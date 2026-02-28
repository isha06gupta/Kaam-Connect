package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.exception.UnauthorizedException;
import com.kaamconnect.backend.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "*")
public class EmployerController {

    private final JobService jobService;

    public EmployerController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getEmployerJobs() {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity.ok(new ApiResponse<>(true, "Employer jobs fetched", jobService.getJobsPostedByEmployer(userId)));
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