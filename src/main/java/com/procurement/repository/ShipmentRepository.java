package com.procurement.repository;

import com.procurement.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Shipment findByProduct_ProductId(Long productId);

    List<Shipment> findByPayment_Supplier_SupId(Long supId);

    List<Shipment> findByProduct_User_UserId(Long userId);

    List<Shipment> findByPayment_Supplier_Email(String email);

}