package com.ecom.userservice.user_service.Controller;

import org.springframework.web.bind.annotation.*;

import com.ecom.userservice.user_service.DTO.UserRequest;
import com.ecom.userservice.user_service.DTO.UserResponse;
import com.ecom.userservice.user_service.Entity.UserProfile;
import com.ecom.userservice.user_service.Service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173") // allow your frontend origin
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public UserResponse create(@RequestBody UserRequest request) {
        return service.createUser(request);
    }

    @GetMapping("/{id}")
    public UserProfile get(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PutMapping("/{id}")
    public UserProfile update(@PathVariable Long id, @RequestBody UserRequest request) {
        return service.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteUser(id);
    }

    @GetMapping
    public java.util.List<UserProfile> getAll() {
        return service.getAllUsers();
    }
}
