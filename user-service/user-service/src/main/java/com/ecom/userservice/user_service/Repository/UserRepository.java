package com.ecom.userservice.user_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecom.userservice.user_service.Entity.UserProfile;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByAuthUserId(Long authUserId);
}