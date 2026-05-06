package com.ecom.orderservice.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecom.orderservice.client.ProductClient;
import com.ecom.orderservice.dto.OrderResponse;
import com.ecom.orderservice.entity.Order;
import com.ecom.orderservice.entity.Product;
import com.ecom.orderservice.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
	@Autowired
    private  OrderRepository repo;
	@Autowired
    private  ProductClient productClient;

    public Order placeOrder(Long productId, int qty) {

        // ✅ 1. Validate product exists
        Product product = productClient.getProduct(productId);

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // ✅ 2. Check stock
        if (product.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock");
        }

        // ✅ 3. Calculate total
        double total = product.getPrice() * qty;

        // ✅ 4. Reduce stock (IMPORTANT)
        productClient.reduceQuantity(productId, qty);

        // ✅ 5. Save order
        Order order = new Order();
        order.setProductId(productId);
        
        order.setQuantity(qty);
        order.setTotalPrice(total);
        order.setStatus("CREATED");
       

        return repo.save(order);
    }
    
    public Order updateOrderStatus(Long id, String status) {
        Order order = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return repo.save(order);
    }

    public Order cancelOrder(Long id) {

        Order order = repo.findById(id).orElseThrow();

        order.setStatus("CANCELLED");

        // restore stock
        productClient.reduceQuantity(order.getProductId(), -order.getQuantity());

        return repo.save(order);
    }

    public void deleteOrder(Long id) {
        repo.deleteById(id);
    }

    public Order updateOrder(Long id, int qty) {

        Order order = repo.findById(id).orElseThrow();

        Product product = productClient.getProduct(order.getProductId());

        if (product.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock");
        }

        order.setQuantity(qty);
        order.setTotalPrice(product.getPrice() * qty);

        return repo.save(order);
    }
    
    public List<OrderResponse> getAllOrders() {

        List<Order> orders = repo.findAll();
        List<OrderResponse> responseList = new ArrayList<>();

        for (Order order : orders) {

            OrderResponse response = new OrderResponse();

            response.setId(order.getId());
            response.setProductId(order.getProductId());
            response.setQuantity(order.getQuantity());
            response.setTotalPrice(order.getTotalPrice());
            response.setStatus(order.getStatus());

            try {
                Product product = productClient.getProduct(order.getProductId());
                response.setProductName(product != null ? product.getName() : "Unknown");
            } catch (Exception e) {
                response.setProductName("Unknown");
            }

            responseList.add(response);
        }

        return responseList;
    }
    
    public OrderResponse getOrder(Long id) {

        Order order = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        Product product = productClient.getProduct(order.getProductId());

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setProductId(order.getProductId());
        response.setQuantity(order.getQuantity());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());

        if (product != null) {
            response.setProductName(product.getName());
        } else {
            response.setProductName("Unknown");
        }

        return response;
    }
}