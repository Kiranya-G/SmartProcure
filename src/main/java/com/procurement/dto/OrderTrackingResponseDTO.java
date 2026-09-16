package com.procurement.dto;

import java.time.LocalDateTime;

public class OrderTrackingResponseDTO {

    private Long trackingId;
    private Long orderId;
    private String status;
    private LocalDateTime updatedAt;

    public OrderTrackingResponseDTO() {
    }

    public OrderTrackingResponseDTO(
            Long trackingId,
            Long orderId,
            String status,
            LocalDateTime updatedAt) {

        this.trackingId = trackingId;
        this.orderId = orderId;
        this.status = status;
        this.updatedAt = updatedAt;
    }

    public Long getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(Long trackingId) {
        this.trackingId = trackingId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}