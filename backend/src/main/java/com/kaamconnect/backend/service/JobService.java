package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.JobRequest;
import com.kaamconnect.backend.dto.JobResponse;
import com.kaamconnect.backend.entity.Job;
import com.kaamconnect.backend.entity.JobApplication;
import com.kaamconnect.backend.exception.BadRequestException;
import com.kaamconnect.backend.exception.ResourceNotFoundException;
import com.kaamconnect.backend.repository.JobApplicationRepository;
import com.kaamconnect.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public JobService(JobRepository jobRepository,
                      JobApplicationRepository jobApplicationRepository) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toJobResponse)
                .toList();
    }

    public JobResponse createJob(Long userId, JobRequest dto) {
        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setCategory(dto.getCategory());
        job.setPaymentAmount(dto.getPaymentAmount());
        job.setWorkersNeeded(dto.getWorkersNeeded());
        job.setUrgent(dto.getUrgent() != null ? dto.getUrgent() : Boolean.FALSE);
        job.setPostedByUserId(userId);

        Job saved = jobRepository.save(job);
        return toJobResponse(saved);
    }

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
