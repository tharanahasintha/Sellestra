package com.ecom.userservice.user_service.DTO;

import lombok.Data;

@Data
public class UserRequest {
	
	public String name;
    public int age;
    public String address;
    public String email;
    public String phone;
    public String country;
    public String postalCode;
    public Long authUserId;

}
