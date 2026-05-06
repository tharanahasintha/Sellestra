package com.ecom.authservice.auth_service.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecom.authservice.auth_service.DTO.AuthResponse;
import com.ecom.authservice.auth_service.DTO.LoginRequest;
import com.ecom.authservice.auth_service.DTO.SignupRequest;
import com.ecom.authservice.auth_service.Entity.AuthUser;
import com.ecom.authservice.auth_service.Repository.AuthRepository;
import com.ecom.authservice.auth_service.Utill.JwtUtil;
import com.ecom.authservice.auth_service.client.UserClient;
import com.ecom.authservice.auth_service.client.UserRequest;

@Service
public class AuthService {

    private final AuthRepository repo;
    private final JwtUtil jwtUtil;
    private final UserClient userClient;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(AuthRepository repo, JwtUtil jwtUtil, UserClient userClient) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.userClient = userClient;
    }

    @jakarta.annotation.PostConstruct
    public void seedAdmin() {
        if (!repo.findByUsername("admin@gmail.com").isPresent()) {
            AuthUser admin = new AuthUser();
            admin.setUsername("admin@gmail.com");
            admin.setPassword(encoder.encode("admin"));
            admin.setRole("ADMIN");
            repo.save(admin);
            
            // Note: we don't necessarily call UserClient here during startup context
            // to avoid missing bean exceptions, as the auth requirement only strictly needs AuthUser to login.
        }
    }

    public AuthResponse signup(SignupRequest request) {
        AuthUser user = new AuthUser();
        user.setUsername(request.username);
        user.setPassword(encoder.encode(request.password));
        if ("admin".equalsIgnoreCase(request.username) || "admin@gmail.com".equalsIgnoreCase(request.email)) {
             user.setRole("ADMIN");
        } else {
             user.setRole("USER");
        }

        repo.save(user);

        // CALL USER SERVICE
        UserRequest userReq = new UserRequest();
        userReq.name = request.name;
        userReq.age = request.age;
        userReq.address = request.address;
        userReq.email = request.email;
        userReq.phone = request.phone;
        userReq.country = request.country;
        userReq.postalCode = request.postalCode;
        userReq.authUserId = user.getId();

        userClient.createUser(userReq);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        AuthResponse response = new AuthResponse();
        response.token = token;
        return response;
    }
    
    public AuthResponse login(LoginRequest request) {

        // 1. Find user by username
        AuthUser user = repo.findByUsername(request.username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check password (hashed)
        if (!encoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 3. Generate JWT
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // 4. Return response
        AuthResponse response = new AuthResponse();
        response.token = token;

        return response;
    }

    public void updateRole(Long authUserId, String newRole) {
        AuthUser user = repo.findById(authUserId)
                .orElseThrow(() -> new RuntimeException("Auth user not found"));
        user.setRole(newRole);
        repo.save(user);
    }
}
