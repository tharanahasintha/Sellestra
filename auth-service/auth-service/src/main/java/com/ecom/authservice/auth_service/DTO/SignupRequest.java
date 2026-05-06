package com.ecom.authservice.auth_service.DTO;

import lombok.Data;

@Data
public class SignupRequest {
	public String username;
	public String password;
	
	public String name;
    public int age;
    public String address;
    public String email;
    public String phone;
    public String country;
    public String postalCode;
}
