package com.kaamconnect.backend.controller;

import com.kaamconnect.backend.dto.LoginRequest;
import com.kaamconnect.backend.entity.Role;
import com.kaamconnect.backend.entity.User;
import com.kaamconnect.backend.security.JwtUtil;
import com.kaamconnect.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getLogin() == null || loginRequest.getLogin().isBlank()
                || loginRequest.getPassword() == null || loginRequest.getPassword().isBlank()) {
            Map<String, Object> errorBody = new LinkedHashMap<>();
            errorBody.put("success", false);
            errorBody.put("message", "Login and password are required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }

        Optional<User> authenticatedUser = authService.authenticate(loginRequest.getLogin(), loginRequest.getPassword());

        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();
            String subject = user.getMobile() != null && !user.getMobile().isBlank() ? user.getMobile() : user.getFullname();
            Role role = user.getRole() != null ? user.getRole() : Role.USER;
            String token = jwtUtil.generateToken(subject, role);

            Map<String, Object> successBody = new LinkedHashMap<>();
            successBody.put("success", true);
            successBody.put("message", "Login successful.");
            successBody.put("token", token);
            successBody.put("userId", user.getId());
            successBody.put("fullname", user.getFullname());
            successBody.put("mobile", user.getMobile());
            return ResponseEntity.ok(successBody);
        }

        Map<String, Object> errorBody = new LinkedHashMap<>();
        errorBody.put("success", false);
        errorBody.put("message", "Invalid credentials.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
    }
}
