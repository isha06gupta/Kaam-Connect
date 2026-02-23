package com.kaamconnect.backend.service;

import com.kaamconnect.backend.dto.UserResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserService userService;

    public AdminService(UserService userService) {
        this.userService = userService;
    }

    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}
