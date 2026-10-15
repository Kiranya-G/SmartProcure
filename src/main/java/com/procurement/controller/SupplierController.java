package com.procurement.controller;

import com.procurement.dto.SupplierRequestDTO;
import com.procurement.entity.Supplier;
import com.procurement.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.procurement.entity.Product;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(
            @Valid @RequestBody SupplierRequestDTO request) {

        Supplier supplier = supplierService.createSupplier(request);

        return new ResponseEntity<>(supplier, HttpStatus.CREATED);

    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {

        return ResponseEntity.ok(
                supplierService.getAllSuppliers()
        );
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Supplier>> getActiveSuppliersByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                supplierService.getActiveSuppliersByCategory(categoryId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                supplierService.getSupplierById(id)
        );
    }

    @PutMapping("/{supplierId}/assign/{productId}")
    public ResponseEntity<Product> assignSupplier(
            @PathVariable Long supplierId,
            @PathVariable Long productId) {

        Product product =
                supplierService.assignSupplier(
                        productId,
                        supplierId
                );

        return ResponseEntity.ok(product);
    }

}