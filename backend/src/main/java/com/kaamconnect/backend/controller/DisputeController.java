package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.dto.DisputeCreateRequest;
import com.kaamconnect.backend.entity.Dispute;
import com.kaamconnect.backend.service.DisputeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disputes")
@CrossOrigin(origins = "*")
public class DisputeController {

    private final DisputeService disputeService;

    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Dispute>> create(@RequestBody DisputeCreateRequest request) {
        Dispute dispute = disputeService.create(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Dispute created", dispute));
    }
}