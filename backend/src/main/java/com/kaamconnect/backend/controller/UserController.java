package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.dto.RegisterRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse registeredUser = userService.registerUser(registerRequest);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "User registered successfully",
                registeredUser
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new RuntimeException("Unauthorized");
        }

        String mobile = authentication.getName();
        Optional<User> userOptional = userService.findByMobile(mobile);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        UserResponse userResponse = userService.toUserResponse(userOptional.get());
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", userResponse));
    }
}
