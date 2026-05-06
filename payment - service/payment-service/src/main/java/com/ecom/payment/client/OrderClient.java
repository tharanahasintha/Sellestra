package com.ecom.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecom.payment.entity.OrderDTO;

@FeignClient(name = "order-service", url = "http://localhost:8084")
public interface OrderClient {

    @GetMapping("/orders/{id}")
    OrderDTO getOrder(@PathVariable Long id);

    @PutMapping("/orders/status/{id}")
    void updateStatus(@PathVariable Long id,
                      @RequestParam String status);
}
