package com.ecom.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecom.orderservice.entity.Product;

@FeignClient(name = "product-service", url = "http://localhost:8083")
public interface ProductClient {

    @GetMapping("/products/{id}")
    Product getProduct(@PathVariable Long id);

    @GetMapping("/products")
    java.util.List<Product> getAllProducts();

    @PutMapping("/products/reduce/{id}")
    void reduceQuantity(@PathVariable Long id,
                        @RequestParam int qty);
}