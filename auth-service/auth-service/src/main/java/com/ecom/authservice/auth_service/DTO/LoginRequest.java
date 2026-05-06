package com.ecom.authservice.auth_service.DTO;

import lombok.Data;

@Data
public class LoginRequest {
	public String username;
    public String password;
}
