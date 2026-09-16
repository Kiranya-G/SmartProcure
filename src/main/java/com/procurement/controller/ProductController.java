package com.procurement.controller;

import com.procurement.dto.RaiseRequestDTO;
import com.procurement.dto.UpdateStatusDTO;
import com.procurement.entity.Product;
import com.procurement.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/raise-request")
    public ResponseEntity<Product> raiseRequest(
            @RequestBody RaiseRequestDTO request) {

        Product product = productService.raiseRequest(request);

        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllRequests() {

        List<Product> products =
                productService.getAllRequests();

        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // CSV DOWNLOAD
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadRequestsCsv() {

        byte[] csvBytes =
                productService.downloadRequestsCsv();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=procurement_requests.csv"
                )
                .contentType(
                        MediaType.parseMediaType("text/csv")
                )
                .body(csvBytes);
    }

    // EXCEL DOWNLOAD
    @GetMapping("/download-excel")
    public ResponseEntity<byte[]> downloadRequestsExcel() {

        byte[] excelBytes = productService.downloadRequestsExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=procurement_requests.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelBytes);
    }

    @PostMapping("/{productId}/status")
    public ResponseEntity<Product> updateStatus(
            @PathVariable Long productId,
            @RequestBody UpdateStatusDTO request) {

        Product product =
                productService.updateStatus(
                        productId,
                        request.getStatus(),
                        request.getAdminId()
                );

        return new ResponseEntity<>(
                product,
                HttpStatus.OK
        );
    }

    // =========================================================
// ASSIGN SUPPLIER TO PROCUREMENT REQUEST
// =========================================================

    @PutMapping("/{productId}/assign-supplier/{supplierId}")
    public ResponseEntity<Product> assignSupplier(
            @PathVariable Long productId,
            @PathVariable Long supplierId) {

        Product product =
                productService.assignSupplier(
                        productId,
                        supplierId
                );

        return ResponseEntity.ok(product);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Product>> getRequestsBySupplier(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                productService.getRequestsBySupplier(supplierId)
        );
    }
}