package com.ecom.payment.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecom.payment.client.OrderClient;
import com.ecom.payment.entity.OrderDTO;
import com.ecom.payment.entity.Payment;
import com.ecom.payment.repository.PaymentRepository;
import com.ecom.payment.utill.PayHereUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
	
	@Autowired
    private  PaymentRepository repo;
	@Autowired
    private  OrderClient orderClient;

    

    	private final String merchantId = "1234954";
        private final String merchantSecret = "MTU1NTM1NzQwNTUzNjMzNTE2MzU3NjM3MDA4NjQyNjE5MzE3MQ==";

        // ✅ COMMON CALCULATION METHOD
        private double calculateTotal(double baseTotal) {
            double serviceCharge = baseTotal * 0.10;
            double transport = 300;
            return baseTotal + serviceCharge + transport;
        }

        // ✅ COD / NORMAL PAYMENT
        public Payment processPayment(Long orderId, String method) {

            OrderDTO order = orderClient.getOrder(orderId);

            double finalTotal = calculateTotal(order.getTotalPrice());

            Payment payment = new Payment();
            payment.setOrderId(orderId);
            payment.setAmount(finalTotal);
            payment.setMethod(method);
            payment.setStatus("PENDING");

            if (method.equalsIgnoreCase("COD")) {
                payment.setStatus("PAID");
                orderClient.updateStatus(orderId, "CONFIRMED");
            }

            return repo.save(payment);
        }

        // ✅ PAYHERE INIT
        public Map<String, Object> createPayHerePayment(Long orderId) {

            OrderDTO order = orderClient.getOrder(orderId);

            double finalTotal = calculateTotal(order.getTotalPrice());
            String amount = String.format("%.2f", finalTotal);

            // ✅ SAVE PAYMENT FIRST
            Payment payment = new Payment();
            payment.setOrderId(orderId);
            payment.setAmount(finalTotal);
            payment.setMethod("PAYHERE");
            payment.setStatus("PENDING");

            repo.save(payment);

            // ✅ GENERATE HASH
            String hash = PayHereUtil.generateHash(
                    merchantId,
                    orderId.toString(),
                    amount,
                    "LKR",
                    merchantSecret
            );

            Map<String, Object> data = new HashMap<>();

            data.put("merchant_id", merchantId);
            data.put("return_url", "http://localhost:5173/payment-success");
            data.put("cancel_url", "http://localhost:5173/payment-cancel");
            data.put("notify_url", "http://localhost:8085/payments/notify");

            data.put("order_id", orderId);
            data.put("items", "E-Commerce Order");
            data.put("currency", "LKR");
            data.put("amount", amount);
            data.put("hash", hash); // ✅ IMPORTANT

            data.put("first_name", "Test");
            data.put("last_name", "User");
            data.put("email", "test@mail.com");
            data.put("phone", "0771234567");
            data.put("address", "Colombo");
            data.put("city", "Colombo");
            data.put("country", "Sri Lanka");

            return data;
        }

        // 🔔 HANDLE NOTIFICATION
        public void handlePaymentNotification(Map<String, String> params) {

            String orderId = params.get("order_id");
            String statusCode = params.get("status_code");

            if ("2".equals(statusCode)) {

                Payment payment = repo.findByOrderId(Long.parseLong(orderId))
                        .orElseThrow(() -> new RuntimeException("Payment not found"));

                payment.setStatus("PAID");
                payment.setTransactionId(params.get("payment_id"));

                repo.save(payment);

                // ✅ Update order
                orderClient.updateStatus(Long.parseLong(orderId), "CONFIRMED");
            }
        }
}