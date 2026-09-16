package com.procurement.repository;

import com.procurement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByProduct_ProductId(Long productId);

    List<Payment> findBySupplier_SupId(Long supId);
}