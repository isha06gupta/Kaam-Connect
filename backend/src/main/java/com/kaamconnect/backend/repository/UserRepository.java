package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}