package com.kaamconnect.backend.repository;

import com.kaamconnect.backend.entity.Role;
import com.kaamconnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobile(String mobile);
    Optional<User> findByFullname(String fullname);
    List<User> findByRoleOrderByIdDesc(Role role);
    long countByRole(Role role);
    long countByRoleAndNgoVerified(Role role, Boolean ngoVerified);
}