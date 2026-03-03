package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.DisputeCreateRequest;
import com.kaamconnect.backend.entity.Dispute;
import com.kaamconnect.backend.entity.DisputeStatus;
import com.kaamconnect.backend.exception.BadRequestException;
import com.kaamconnect.backend.repository.DisputeRepository;
import com.kaamconnect.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final JobRepository jobRepository;

    public DisputeService(DisputeRepository disputeRepository, JobRepository jobRepository) {
        this.disputeRepository = disputeRepository;
        this.jobRepository = jobRepository;
    }

    public Dispute create(DisputeCreateRequest request) {
        if (request.getJobId() == null || !jobRepository.existsById(request.getJobId())) {
            throw new BadRequestException("Invalid job id");
        }

        Dispute dispute = new Dispute();
        dispute.setJobId(request.getJobId());
        dispute.setRaisedBy(request.getRaisedBy());
        dispute.setDescription(request.getDescription());
        dispute.setStatus(DisputeStatus.OPEN);

        return disputeRepository.save(dispute);
    }
}