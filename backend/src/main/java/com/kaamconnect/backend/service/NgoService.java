package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.dto.TrainingProgramRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.entity.*;
import com.kaamconnect.backend.exception.ResourceNotFoundException;
import com.kaamconnect.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class NgoService {

    private final UserRepository userRepository;
    private final JobService jobService;
    private final JobRepository jobRepository;
    private final DisputeRepository disputeRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final UserService userService;

    public NgoService(UserRepository userRepository,
                      JobService jobService,
                      JobRepository jobRepository,
                      DisputeRepository disputeRepository,
                      TrainingProgramRepository trainingProgramRepository,
                      UserService userService) {
        this.userRepository = userRepository;
        this.jobService = jobService;
        this.jobRepository = jobRepository;
        this.disputeRepository = disputeRepository;
        this.trainingProgramRepository = trainingProgramRepository;
        this.userService = userService;
    }

    public List<UserResponse> getAllWorkers() {
        return userRepository.findByRoleOrderByIdDesc(Role.USER)
                .stream()
                .map(userService::toUserResponse)
                .toList();
    }

    public UserResponse verifyWorker(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        worker.setNgoVerified(Boolean.TRUE);
        return userService.toUserResponse(userRepository.save(worker));
    }

    public UserResponse rejectWorker(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        worker.setNgoVerified(Boolean.FALSE);
        return userService.toUserResponse(userRepository.save(worker));
    }

    public List<JobResponse> getPendingPayments() {
        return jobService.getPendingPayments();
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAllByOrderByIdDesc();
    }

    public Dispute resolveDispute(Long disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));
        dispute.setStatus(DisputeStatus.RESOLVED);
        return disputeRepository.save(dispute);
    }

    public TrainingProgram createTraining(TrainingProgramRequest request, Long ngoId) {
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setTitle(request.getTitle());
        trainingProgram.setDescription(request.getDescription());
        trainingProgram.setCreatedByNgo(ngoId);
        return trainingProgramRepository.save(trainingProgram);
    }

    public List<TrainingProgram> getAllTrainings() {
        return trainingProgramRepository.findAll();
    }

    public Map<String, Long> getDashboardOverview() {
        Map<String, Long> overview = new LinkedHashMap<>();
        overview.put("totalWorkers", userRepository.countByRole(Role.USER));
        overview.put("verifiedWorkers", userRepository.countByRoleAndNgoVerified(Role.USER, true));
        overview.put("openDisputes", disputeRepository.countByStatus(DisputeStatus.OPEN));
        overview.put("pendingPayments", jobRepository.countByEmployerMarkedCompleteTrueAndWorkerConfirmedPaymentFalse());
        return overview;
    }
}