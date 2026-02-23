package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.RegisterRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.entity.Role;
import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.findByMobile(request.getMobile()).isPresent()) {
            throw new RuntimeException("Mobile number already registered");
        }

        User user = new User();
        user.setFullname(request.getFullname());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setSkill(request.getSkill());
        user.setCompany(request.getCompany());
        user.setLocation(request.getLocation());
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }

    public Optional<User> findByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullname(),
                user.getMobile(),
                user.getSkill(),
                user.getCompany(),
                user.getLocation()
        );
    }
}
