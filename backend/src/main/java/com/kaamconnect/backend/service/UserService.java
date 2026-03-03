package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.RegisterRequest;
import com.kaamconnect.backend.dto.ResetPasswordRequest;
import com.kaamconnect.backend.dto.UpdateProfileRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.entity.Role;
import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.exception.BadRequestException;
import com.kaamconnect.backend.exception.ResourceNotFoundException;
import com.kaamconnect.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER =================

    public UserResponse registerUser(RegisterRequest request) {

        if (userRepository.findByMobile(request.getMobile()).isPresent()) {
            throw new BadRequestException("Mobile number already registered");
        }

        User user = new User();
        user.setFullname(request.getFullname());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setSkill(request.getSkill());
        user.setCompany(request.getCompany());
        user.setLocation(request.getLocation());

        Role role;

        if ("employer".equalsIgnoreCase(request.getRole())) {
            role = Role.EMPLOYER;
        } 
        else if ("ngo".equalsIgnoreCase(request.getRole())) {
            role = Role.NGO;
        } 
        else {
            role = Role.USER;
        }

        user.setRole(role);
        user.setNgoVerified(Boolean.FALSE);

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    // ================= FIND USER =================

    public Optional<User> findByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }

    // ================= GET PROFILE =================

    public UserResponse getCurrentUserProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return toUserResponse(user);
    }

    // ================= UPDATE PROFILE =================

    public UserResponse updateProfile(Long userId,
                                      UpdateProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (request.getFullname() != null) {
            user.setFullname(request.getFullname());
        }

        if (request.getMobile() != null &&
                !request.getMobile().equals(user.getMobile())) {

            if (userRepository.findByMobile(request.getMobile()).isPresent()) {
                throw new BadRequestException("Mobile number already registered");
            }

            user.setMobile(request.getMobile());
        }

        if (request.getSkill() != null) {
            user.setSkill(request.getSkill());
        }

        if (request.getCompany() != null) {
            user.setCompany(request.getCompany());
        }

        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }

        User updatedUser = userRepository.save(user);

        return toUserResponse(updatedUser);
    }

    // ================= GET ALL USERS =================

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    // ================= RESET PASSWORD =================

    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository
                .findByMobile(request.getMobile())
                .orElseThrow(() ->
                        new BadRequestException("User not found"));

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);
    }

    // ================= MAPPER =================

    public UserResponse toUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getFullname(),
                user.getMobile(),
                user.getSkill(),
                user.getCompany(),
                user.getLocation(),
                user.getRole(),
                user.getNgoVerified()
        );
    }
}