package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.ApiResponse;
import com.kaamconnect.backend.dto.RegisterRequest;
import com.kaamconnect.backend.dto.UpdateProfileRequest;
import com.kaamconnect.backend.dto.UserResponse;
import com.kaamconnect.backend.exception.UnauthorizedException;
import com.kaamconnect.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        Long userId = getAuthenticatedUserId();
        UserResponse userResponse = userService.getCurrentUserProfile(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", userResponse));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(@RequestBody UpdateProfileRequest updateProfileRequest) {
        Long userId = getAuthenticatedUserId();
        UserResponse userResponse = userService.updateProfile(userId, updateProfileRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", userResponse));
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new UnauthorizedException("Unauthorized");
        }

        Object principal = authentication.getPrincipal();

        try {
            if (principal instanceof Long) {
                return (Long) principal;
            }
            return Long.parseLong(principal.toString());
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Unauthorized");
        }
    }
}
