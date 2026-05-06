package com.ecom.payment.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.payment.client.OrderClient;
import com.ecom.payment.entity.OrderDTO;
import com.ecom.payment.entity.Payment;
import com.ecom.payment.repository.PaymentRepository;
import com.ecom.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "http://localhost:5173") // allow your frontend origin
@RequiredArgsConstructor
public class PaymentController {
	
	@Autowired
    private  PaymentService paymentService;
	@Autowired
    private  PaymentRepository paymentRepository;
    

   
    @PostMapping("/process")
    public ResponseEntity<Payment> processPayment(
            @RequestParam Long orderId,
            @RequestParam String method) {

        return ResponseEntity.ok(paymentService.processPayment(orderId, method));
    }
 // 
 // PayHere Payment INIT
    @PostMapping("/payhere/{orderId}")
    public ResponseEntity<Map<String, Object>> payHere(@PathVariable Long orderId) {

        return ResponseEntity.ok(paymentService.createPayHerePayment(orderId));
    }

    // PayHere Webhook
    @PostMapping("/notify")
    public ResponseEntity<String> handleNotify(@RequestParam Map<String, String> params) {

        paymentService.handlePaymentNotification(params);

        return ResponseEntity.ok("Payment processed");
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return ResponseEntity.ok(payment);
    }

    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getByOrderId(@PathVariable Long orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return ResponseEntity.ok(payment);
    }

    
    @GetMapping("/receipt/{id}")
    public ResponseEntity<String> generateReceipt(@PathVariable Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        String receipt = "== RECEIPT ===\n" +
                "Payment ID: " + payment.getId() + "\n" +
                "Order ID: " + payment.getOrderId() + "\n" +
                "Amount: Rs. " + payment.getAmount() + "\n" +
                "Method: " + payment.getMethod() + "\n" +
                "Status: " + payment.getStatus() + "\n" +
                "Transaction ID: " + payment.getTransactionId() + "\n" +
                "=============================";

        return ResponseEntity.ok(receipt);
    }

    @GetMapping
    public ResponseEntity<java.util.List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }
}