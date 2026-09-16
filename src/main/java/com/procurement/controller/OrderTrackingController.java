package com.procurement.controller;

import com.procurement.dto.OrderTrackingResponseDTO;
import com.procurement.entity.OrderTracking;
import com.procurement.service.OrderTrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderTrackingController {

    private final OrderTrackingService orderTrackingService;

    public OrderTrackingController(
            OrderTrackingService orderTrackingService) {

        this.orderTrackingService = orderTrackingService;
    }


    // Mark order as PACKED
    @PutMapping("/{orderId}/packed")
    public ResponseEntity<OrderTrackingResponseDTO> markAsPacked(
            @PathVariable Long orderId) {

        OrderTracking tracking =
                orderTrackingService.markAsPacked(orderId);

        return ResponseEntity.ok(convertToDTO(tracking));
    }


    // Mark order as SHIPPED
    @PutMapping("/{orderId}/shipped")
    public ResponseEntity<OrderTrackingResponseDTO> markAsShipped(
            @PathVariable Long orderId) {

        OrderTracking tracking =
                orderTrackingService.markAsShipped(orderId);

        return ResponseEntity.ok(convertToDTO(tracking));
    }


    // Mark order as DELIVERED
    @PutMapping("/{orderId}/delivered")
    public ResponseEntity<OrderTrackingResponseDTO> markAsDelivered(
            @PathVariable Long orderId) {

        OrderTracking tracking =
                orderTrackingService.markAsDelivered(orderId);

        return ResponseEntity.ok(convertToDTO(tracking));
    }


    // Get tracking history
    @GetMapping("/{orderId}/tracking")
    public ResponseEntity<List<OrderTrackingResponseDTO>> getTrackingHistory(
            @PathVariable Long orderId) {

        List<OrderTracking> trackingList =
                orderTrackingService.getTrackingHistory(orderId);

        List<OrderTrackingResponseDTO> response =
                trackingList.stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    // Convert Entity → DTO
    private OrderTrackingResponseDTO convertToDTO(
            OrderTracking tracking) {

        return new OrderTrackingResponseDTO(
                tracking.getTrackingId(),
                tracking.getOrder().getOrderId(),
                tracking.getStatus(),
                tracking.getUpdatedAt()
        );
    }
}