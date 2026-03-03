package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.dto.TrainingProgramRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.entity.Dispute;
import com.kaamconnect.backend.entity.DisputeStatus;
import com.kaamconnect.backend.entity.Job;
import com.kaamconnect.backend.entity.Role;
import com.kaamconnect.backend.entity.TrainingProgram;
import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.exception.ResourceNotFoundException;
import com.kaamconnect.backend.repository.DisputeRepository;
import com.kaamconnect.backend.repository.JobRepository;
import com.kaamconnect.backend.repository.TrainingProgramRepository;
import com.kaamconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class NgoService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final DisputeRepository disputeRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final UserService userService;

    public NgoService(UserRepository userRepository,
                      JobRepository jobRepository,
                      DisputeRepository disputeRepository,
                      TrainingProgramRepository trainingProgramRepository,
                      UserService userService) {
        this.userRepository = userRepository;
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

    @Transactional
    public UserResponse verifyWorker(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        worker.setNgoVerified(Boolean.TRUE);
        return userService.toUserResponse(userRepository.save(worker));
    }

    @Transactional
    public UserResponse rejectWorker(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        worker.setNgoVerified(Boolean.FALSE);
        return userService.toUserResponse(userRepository.save(worker));
    }

    public List<JobResponse> getPendingPayments() {
        return jobRepository
                .findByEmployerMarkedCompleteTrueAndWorkerConfirmedPaymentFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::toJobResponse)
                .toList();
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findByStatusOrderByIdDesc(DisputeStatus.OPEN);
    }

    @Transactional
    public Dispute resolveDispute(Long disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));
        dispute.setStatus(DisputeStatus.RESOLVED);
        return disputeRepository.save(dispute);
    }

    @Transactional
    public TrainingProgram createTraining(TrainingProgramRequest request, Long ngoId) {
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setTitle(request != null ? request.getTitle() : null);
        trainingProgram.setDescription(request != null ? request.getDescription() : null);
        trainingProgram.setCreatedByNgo(ngoId);
        return trainingProgramRepository.save(trainingProgram);
    }

    public List<TrainingProgram> getAllTrainings() {
        return trainingProgramRepository.findAllByOrderByIdDesc();
    }

    public Map<String, Long> getDashboardOverview() {
        Map<String, Long> overview = new LinkedHashMap<>();
        overview.put("totalWorkers", userRepository.countByRole(Role.USER));
        overview.put("verifiedWorkers", userRepository.countByRoleAndNgoVerified(Role.USER, Boolean.TRUE));
        overview.put("openDisputes", disputeRepository.countByStatus(DisputeStatus.OPEN));
        overview.put("pendingPayments", jobRepository.countByEmployerMarkedCompleteTrueAndWorkerConfirmedPaymentFalse());
        return overview;
    }

    private JobResponse toJobResponse(Job job) {
        Long postedByUserId = job.getPostedByUserId();

        Boolean ngoVerified = Boolean.FALSE;
        if (postedByUserId != null) {
            ngoVerified = userRepository.findById(postedByUserId)
                    .map(User::getNgoVerified)
                    .orElse(Boolean.FALSE);
        }

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getCategory(),
                job.getPaymentAmount(),
                job.getPaymentType(),
                job.getWorkersNeeded(),
                Boolean.TRUE.equals(job.getUrgent()),
                postedByUserId,
                job.getCreatedAt(),
                Boolean.TRUE.equals(job.getEmployerMarkedComplete()),
                Boolean.TRUE.equals(job.getWorkerConfirmedPayment()),
                Boolean.TRUE.equals(ngoVerified)
        );
    }
}