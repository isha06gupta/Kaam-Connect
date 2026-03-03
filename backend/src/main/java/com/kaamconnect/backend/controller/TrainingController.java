package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.entity.TrainingProgram;
import com.kaamconnect.backend.service.NgoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "*")
public class TrainingController {

    private final NgoService ngoService;

    public TrainingController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TrainingProgram>>> list() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Trainings fetched", ngoService.getAllTrainings()));
    }
}