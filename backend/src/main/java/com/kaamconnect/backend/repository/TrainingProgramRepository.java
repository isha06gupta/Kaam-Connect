package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
}