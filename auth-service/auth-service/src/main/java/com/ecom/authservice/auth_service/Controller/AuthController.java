package com.ecom.authservice.auth_service.Controller;

import org.springframework.web.bind.annotation.*;

import com.ecom.authservice.auth_service.DTO.AuthResponse;
import com.ecom.authservice.auth_service.DTO.LoginRequest;
import com.ecom.authservice.auth_service.DTO.SignupRequest;
import com.ecom.authservice.auth_service.Service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") // allow your frontend origin
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {
        return service.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }

    @PutMapping("/roles/{authUserId}")
    public org.springframework.http.ResponseEntity<String> updateRole(@PathVariable Long authUserId, @RequestParam String role) {
        service.updateRole(authUserId, role);
        return org.springframework.http.ResponseEntity.ok("Role updated");
    }
}
