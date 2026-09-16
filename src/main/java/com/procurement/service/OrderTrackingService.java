package com.procurement.service;

import com.procurement.entity.Admin;
import com.procurement.entity.Order;
import com.procurement.entity.OrderTracking;
import com.procurement.repository.AdminRepository;
import com.procurement.repository.OrderRepository;
import com.procurement.repository.OrderTrackingRepository;
import org.springframework.stereotype.Service;


import com.procurement.notification.EmailTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderTrackingService {

    private final OrderRepository orderRepository;
    private final OrderTrackingRepository orderTrackingRepository;
    private final AdminRepository adminRepository;
    private final NotificationService notificationService;


    public OrderTrackingService(
            OrderRepository orderRepository,
            OrderTrackingRepository orderTrackingRepository,
            AdminRepository adminRepository,
            NotificationService notificationService) {

        this.orderRepository = orderRepository;
        this.orderTrackingRepository = orderTrackingRepository;
        this.adminRepository = adminRepository;
        this.notificationService = notificationService;
    }


    // Mark order as PACKED
    public OrderTracking markAsPacked(Long orderId) {

        Order order = getOrder(orderId);

        validateStatus(order, "PAID");

        return updateTracking(order, "PACKED");
    }


    // Mark order as SHIPPED
    public OrderTracking markAsShipped(Long orderId) {

        Order order = getOrder(orderId);

        validateStatus(order, "PACKED");

        return updateTracking(order, "SHIPPED");
    }


    // Mark order as DELIVERED
    public OrderTracking markAsDelivered(Long orderId) {

        Order order = getOrder(orderId);

        validateStatus(order, "SHIPPED");

        return updateTracking(order, "DELIVERED");
    }


    // Get tracking history
    public List<OrderTracking> getTrackingHistory(Long orderId) {

        getOrder(orderId);

        return orderTrackingRepository
                .findByOrderOrderIdOrderByUpdatedAtAsc(orderId);
    }


    // Find order
    private Order getOrder(Long orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }


    // Validate status transition
    private void validateStatus(
            Order order,
            String expectedStatus) {

        if (!expectedStatus.equalsIgnoreCase(order.getStatus())) {

            throw new RuntimeException(
                    "Invalid order status transition. Current status: "
                            + order.getStatus()
                            + ", expected: "
                            + expectedStatus);
        }
    }


    // Update order + create tracking + send notifications
    private OrderTracking updateTracking(
            Order order,
            String newStatus) {

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);


        OrderTracking tracking = new OrderTracking();

        tracking.setOrder(order);
        tracking.setStatus(newStatus);
        tracking.setUpdatedAt(LocalDateTime.now());

        OrderTracking savedTracking =
                orderTrackingRepository.save(tracking);


        // Send notifications
        sendTrackingNotifications(order, newStatus);


        return savedTracking;
    }


    // Send notification to User, Supplier and Admin
    // Send attractive notification to User, Supplier and Admin
    private void sendTrackingNotifications(
            Order order,
            String status) {

        String subject =
                "Order Status Updated - " + status;

        String htmlContent =
                EmailTemplate.orderTrackingNotification(
                        order.getUser().getName(),
                        order.getOrderId(),
                        order.getProduct().getName(),
                        order.getTotalAmount(),
                        status,
                        LocalDateTime.now().toString()
                );

        try {

            // 1. Send email to User
            notificationService.sendNotification(
                    order.getUser().getEmail(),
                    subject,
                    htmlContent
            );

            // 2. Send email to Supplier
            notificationService.sendNotification(
                    order.getSupplier().getEmail(),
                    subject,
                    htmlContent
            );

            // 3. Send email to Admin
            Admin admin =
                    adminRepository.findByDepartment(
                            order.getProduct().getDepartment()
                    );

            if (admin != null) {

                notificationService.sendNotification(
                        admin.getEmail(),
                        subject,
                        htmlContent
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Tracking notification failed: "
                            + e.getMessage()
            );
        }
    }
}