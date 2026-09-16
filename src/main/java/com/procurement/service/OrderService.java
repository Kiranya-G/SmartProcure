
package com.procurement.service;

import com.procurement.entity.Order;
import com.procurement.entity.Payment;
import com.procurement.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;


    public Order createOrderFromPayment(Payment payment) {

        if (payment == null) {
            throw new RuntimeException("Payment not found");
        }

        if (!"SUCCESS".equalsIgnoreCase(payment.getPaymentStatus())) {
            throw new RuntimeException("Order can be created only after successful payment");
        }

        Order order = new Order();

        order.setProduct(payment.getProduct());
        order.setSupplier(payment.getSupplier());

        order.setUser(payment.getProduct().getUser());

        order.setPayment(payment);

        order.setTotalAmount(payment.getAmount());

        order.setStatus("PAID");

        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }
}