package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.Dispute;
import com.kaamconnect.backend.entity.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findAllByOrderByIdDesc();
    long countByStatus(DisputeStatus status);
}