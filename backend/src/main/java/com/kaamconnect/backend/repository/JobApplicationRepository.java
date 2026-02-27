package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByJobIdAndUserId(Long jobId, Long userId);
}
