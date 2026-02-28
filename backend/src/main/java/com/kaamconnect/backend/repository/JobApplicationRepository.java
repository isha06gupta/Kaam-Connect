package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByJobIdAndUserId(Long jobId, Long userId);
    List<JobApplication> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<JobApplication> findByJobIdOrderByCreatedAtDesc(Long jobId);
}