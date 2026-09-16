package com.procurement.repository;

import com.procurement.entity.Order;
import com.procurement.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Long> {

    List<OrderTracking> findByOrderOrderIdOrderByUpdatedAtAsc(Long orderId);
}