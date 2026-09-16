package com.procurement.service;

import com.procurement.dto.RatingRequestDTO;
import com.procurement.entity.Product;
import com.procurement.entity.Rating;
import com.procurement.entity.Shipment;
import com.procurement.entity.Supplier;
import com.procurement.entity.User;
import com.procurement.repository.RatingRepository;
import com.procurement.repository.ShipmentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ShipmentRepository shipmentRepository;

    public RatingService(
            RatingRepository ratingRepository,
            ShipmentRepository shipmentRepository) {

        this.ratingRepository = ratingRepository;
        this.shipmentRepository = shipmentRepository;
    }

    public Rating addRating(RatingRequestDTO request) {

        // Validate rating
        if (request.getRating() == null ||
                request.getRating() < 1 ||
                request.getRating() > 5) {

            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }

        // Find shipment
        Shipment shipment = shipmentRepository
                .findById(request.getShipmentId())
                .orElseThrow(() ->
                        new RuntimeException("Shipment not found")
                );

        // Rating only after delivery
        if (!"DELIVERED".equalsIgnoreCase(
                shipment.getShipmentStatus())) {

            throw new RuntimeException(
                    "Rating can be submitted only after delivery"
            );
        }

        // Get product
        Product product = shipment.getProduct();

        // Get user
        User user = product.getUser();

        // Get supplier from payment
        Supplier supplier =
                shipment.getPayment().getSupplier();

        if (supplier == null) {
            throw new RuntimeException(
                    "Supplier not assigned to this shipment"
            );
        }

        // Create rating
        Rating rating = new Rating();

        rating.setUserId(user.getUserId());
        rating.setProductId(product.getProductId());
        rating.setSupplierId(supplier.getSupId());
        rating.setRating(request.getRating());
        rating.setDescription(request.getDescription());

        return ratingRepository.save(rating);
    }

    // Get all ratings for a supplier
    public List<Rating> getRatingsBySupplier(Long supplierId) {

        return ratingRepository.findBySupplierId(supplierId);
    }
}