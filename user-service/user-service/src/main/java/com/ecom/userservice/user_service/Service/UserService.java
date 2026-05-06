package com.ecom.userservice.user_service.Service;

import org.springframework.stereotype.Service;

import com.ecom.userservice.user_service.DTO.UserRequest;
import com.ecom.userservice.user_service.DTO.UserResponse;
import com.ecom.userservice.user_service.Entity.UserProfile;
import com.ecom.userservice.user_service.Repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public UserResponse createUser(UserRequest request) {
        UserProfile user = new UserProfile();
        user.setAuthUserId(request.authUserId);
        user.setName(request.name);
        user.setAge(request.age);
        user.setAddress(request.address);
        user.setEmail(request.email);
        user.setPhone(request.phone);
        user.setCountry(request.country);
        user.setPostalCode(request.postalCode);

        repo.save(user);

        UserResponse res = new UserResponse();
        res.id = user.getId();
        res.name = user.getName();
        res.email = user.getEmail();
        return res;
    }

    public UserProfile getUserById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfile updateUser(Long id, UserRequest request) {
        UserProfile user = getUserById(id);

        user.setName(request.name);
        user.setAge(request.age);
        user.setAddress(request.address);
        user.setEmail(request.email);
        user.setPhone(request.phone);
        user.setCountry(request.country);
        user.setPostalCode(request.postalCode);

        return repo.save(user);
    }

    public void deleteUser(Long id) {
        repo.deleteById(id);
    }
    
    public java.util.List<UserProfile> getAllUsers() {
        return repo.findAll();
    }
}