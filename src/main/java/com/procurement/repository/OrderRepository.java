package com.procurement.repository;

import com.procurement.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Order findByProduct_ProductId(Long productId);

    List<Order> findAllByProduct_ProductId(Long productId);

}