package com.procurement.controller;

import com.procurement.entity.Shipment;
import com.procurement.service.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @PostMapping("/create/{paymentId}")
    public ResponseEntity<Shipment> createShipment(
            @PathVariable Long paymentId) {

        Shipment shipment =
                shipmentService.createShipment(paymentId);

        return new ResponseEntity<>(
                shipment,
                HttpStatus.CREATED
        );
    }
    @PutMapping("/{shipmentId}/status")
    public ResponseEntity<Shipment> updateShipmentStatus(
            @PathVariable Long shipmentId,
            @RequestParam String status) {

        Shipment shipment =
                shipmentService.updateShipmentStatus(
                        shipmentId,
                        status
                );

        return ResponseEntity.ok(shipment);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Shipment>> getSupplierShipments(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                shipmentService.getShipmentsBySupplier(supplierId)
        );
    }

    @GetMapping("/supplier/email/{email}")
    public ResponseEntity<List<Shipment>> getSupplierShipmentsByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                shipmentService.getShipmentsBySupplierEmail(email)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Shipment>> getUserShipments(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                shipmentService.getShipmentsByUser(userId)
        );
    }

}