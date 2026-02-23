package com.kaamconnect.backend.service;

import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> authenticate(String login, String rawPassword) {
        Optional<User> userOptional = userRepository.findByMobile(login);

        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByFullname(login);
        }

        if (userOptional.isPresent()
                && passwordEncoder.matches(rawPassword, userOptional.get().getPassword())) {
            return userOptional;
        }

        return Optional.empty();
    }
}
