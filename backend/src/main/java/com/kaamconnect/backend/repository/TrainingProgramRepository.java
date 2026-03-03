package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findAllByOrderByIdDesc();
}