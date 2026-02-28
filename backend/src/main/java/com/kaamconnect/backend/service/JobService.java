package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.JobApplicationResponse;
import com.kaamconnect.backend.dto.JobRequest;
import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.entity.Job;
import com.kaamconnect.backend.entity.JobApplication;
import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.exception.BadRequestException;
import com.kaamconnect.backend.exception.ResourceNotFoundException;
import com.kaamconnect.backend.repository.JobApplicationRepository;
import com.kaamconnect.backend.repository.JobRepository;
import com.kaamconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository
    ) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    /* ---------------- ALL JOBS ---------------- */

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toJobResponse)
                .toList();
    }

    /* ---------------- CREATE JOB ---------------- */

    public JobResponse createJob(Long userId, JobRequest dto) {

        Job job = new Job();

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setCategory(dto.getCategory());
        job.setPaymentAmount(dto.getPaymentAmount());
        job.setWorkersNeeded(dto.getWorkersNeeded());
        job.setUrgent(dto.getUrgent() != null && dto.getUrgent());
        job.setPostedByUserId(userId);

        Job saved = jobRepository.save(job);

        return toJobResponse(saved);
    }

    /* ---------------- APPLY JOB ---------------- */

    public void applyToJob(Long jobId, Long userId) {

        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found");
        }

        if (jobApplicationRepository.existsByJobIdAndUserId(jobId, userId)) {
            throw new BadRequestException("You have already applied to this job");
        }

        JobApplication application = new JobApplication();
        application.setJobId(jobId);
        application.setUserId(userId);

        jobApplicationRepository.save(application);
    }

    /* ---------------- APPLIED JOBS ---------------- */

    public List<JobResponse> getAppliedJobs(Long userId) {

        List<Long> jobIds =
                jobApplicationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                        .stream()
                        .map(JobApplication::getJobId)
                        .distinct()
                        .toList();

        if (jobIds.isEmpty()) {
            return Collections.emptyList();
        }

        return jobRepository.findByIdInOrderByCreatedAtDesc(jobIds)
                .stream()
                .map(this::toJobResponse)
                .toList();
    }

    /* ---------------- EMPLOYER JOBS ---------------- */

    public List<JobResponse> getJobsPostedByEmployer(Long userId) {

        return jobRepository
                .findByPostedByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toJobResponse)
                .toList();
    }

    /* ---------------- APPLICATIONS ---------------- */

    public List<JobApplicationResponse> getApplicationsForJob(Long jobId) {

        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found");
        }

        List<JobApplication> applications =
                jobApplicationRepository.findByJobIdOrderByCreatedAtDesc(jobId);

        List<Long> userIds =
                applications.stream()
                        .map(JobApplication::getUserId)
                        .distinct()
                        .toList();

        Map<Long, User> usersById =
                userRepository.findAllById(userIds)
                        .stream()
                        .collect(Collectors.toMap(User::getId, Function.identity()));

        return applications.stream().map(app -> {

            User u = usersById.get(app.getUserId());

            return new JobApplicationResponse(
                    app.getId(),
                    app.getJobId(),
                    app.getUserId(),
                    u != null ? u.getFullname() : "Unknown",
                    u != null ? u.getMobile() : "",
                    u != null ? u.getLocation() : "",
                    u != null ? u.getSkill() : "",
                    app.getCreatedAt()
            );

        }).toList();
    }

    /* ---------------- MAPPER ---------------- */

    private JobResponse toJobResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getCategory(),
                job.getPaymentAmount(),
                job.getWorkersNeeded(),
                job.getUrgent(),
                job.getPostedByUserId(),
                job.getCreatedAt()
        );
    }
}