package com.ecom.authservice.auth_service.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecom.authservice.auth_service.Entity.AuthUser;

public interface AuthRepository extends JpaRepository<AuthUser, Long>{
	Optional<AuthUser> findByUsername(String username);

}
