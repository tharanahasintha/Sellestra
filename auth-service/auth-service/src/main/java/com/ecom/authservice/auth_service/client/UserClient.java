package com.ecom.authservice.auth_service.client;

import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service", url = "http://localhost:8082")
public interface UserClient {

    @PostMapping("/users")
    void createUser(@RequestBody UserRequest request);
}