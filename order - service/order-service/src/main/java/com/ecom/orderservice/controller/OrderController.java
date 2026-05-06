package com.ecom.orderservice.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.orderservice.dto.OrderResponse;
import com.ecom.orderservice.entity.Order;
import com.ecom.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {
    @Autowired
    private OrderService service;

    @PostMapping
    public Order place(@RequestParam Long productId,
                       @RequestParam int qty) {
        return service.placeOrder(productId, qty);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id) { 
        return service.getOrder(id);
    }

    
    @PutMapping("/status/{id}")
    public Order updateStatus(@PathVariable Long id,
                              @RequestParam String status) {
        return service.updateOrderStatus(id, status);
    }

    
    @PutMapping("/cancel/{id}")
    public Order cancel(@PathVariable Long id) {
        return service.cancelOrder(id);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id,
                        @RequestParam int qty) {
        return service.updateOrder(id, qty);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteOrder(id);
    }

    @GetMapping
    public List<OrderResponse> getAll() { // ✅ FIXED
        return service.getAllOrders();
    }
}