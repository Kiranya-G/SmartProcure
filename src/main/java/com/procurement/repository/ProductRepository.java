package com.procurement.repository;

import com.procurement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySupplier_SupId(Long supplierId);
}