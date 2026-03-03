package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.dto.TrainingProgramRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.entity.Dispute;
import com.kaamconnect.backend.entity.TrainingProgram;
import com.kaamconnect.backend.exception.UnauthorizedException;
import com.kaamconnect.backend.service.NgoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = "*")
public class NgoController {

    private final NgoService ngoService;

    public NgoController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @GetMapping("/workers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> workers() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Workers fetched", ngoService.getAllWorkers()));
    }

    @PutMapping("/verify/{workerId}")
    public ResponseEntity<ApiResponse<UserResponse>> verify(@PathVariable Long workerId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Worker verified", ngoService.verifyWorker(workerId)));
    }

    @PutMapping("/reject/{workerId}")
    public ResponseEntity<ApiResponse<UserResponse>> reject(@PathVariable Long workerId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Worker rejected", ngoService.rejectWorker(workerId)));
    }

    @GetMapping("/pending-payments")
    public ResponseEntity<ApiResponse<List<JobResponse>>> pendingPayments() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending payments fetched", ngoService.getPendingPayments()));
    }

    @GetMapping("/disputes")
    public ResponseEntity<ApiResponse<List<Dispute>>> disputes() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Disputes fetched", ngoService.getAllDisputes()));
    }

    @PutMapping("/disputes/resolve/{disputeId}")
    public ResponseEntity<ApiResponse<Dispute>> resolve(@PathVariable Long disputeId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Dispute resolved", ngoService.resolveDispute(disputeId)));
    }

    @PostMapping("/trainings")
    public ResponseEntity<ApiResponse<TrainingProgram>> createTraining(@RequestBody TrainingProgramRequest request) {
        Long ngoId = getAuthenticatedUserId();
        return ResponseEntity.ok(new ApiResponse<>(true, "Training created", ngoService.createTraining(request, ngoId)));
    }

    @GetMapping("/trainings")
    public ResponseEntity<ApiResponse<List<TrainingProgram>>> trainings() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Trainings fetched", ngoService.getAllTrainings()));
    }

    @GetMapping("/dashboard-overview")
    public ResponseEntity<ApiResponse<Map<String, Long>>> dashboardOverview() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Overview fetched", ngoService.getDashboardOverview()));
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Long>>> overview() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Overview fetched", ngoService.getDashboardOverview()));
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UnauthorizedException("Unauthorized");
        }

        Object principal = authentication.getPrincipal();

        try {
            if (principal instanceof Long userId) {
                return userId;
            }
            return Long.parseLong(principal.toString());
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Unauthorized");
        }
    }
}