package com.procurement.controller;

import com.procurement.dto.RatingRequestDTO;
import com.procurement.entity.Rating;
import com.procurement.service.RatingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(
            @RequestBody RatingRequestDTO request) {

        Rating savedRating =
                ratingService.addRating(request);

        return ResponseEntity.ok(savedRating);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Rating>> getSupplierRatings(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                ratingService.getRatingsBySupplier(supplierId)
        );
    }
}