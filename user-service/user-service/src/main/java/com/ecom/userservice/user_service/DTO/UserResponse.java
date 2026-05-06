package com.ecom.userservice.user_service.DTO;

import lombok.Data;

@Data
public class UserResponse {
	public Long id;
    public String name;
    public String email;
}
