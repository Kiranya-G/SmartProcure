package com.procurement.repository;

import com.procurement.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Rating findByProductId(Long productId);

    List<Rating> findAllByProductId(Long productId);

    List<Rating> findBySupplierId(Long supplierId);
}