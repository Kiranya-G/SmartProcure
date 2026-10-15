
package com.procurement.controller;

import com.procurement.dto.QuotationResponseDTO;
import com.procurement.entity.Quotation;
import com.procurement.service.QuotationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "http://localhost:5177")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    public static class QuotationRequest {
        private Long productId;
        private Long supplierId;
        private Double quotedAmount;
        private Integer availableQuantity;
        private LocalDate expectedDeliveryDate;
        private String supplierMessage;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Long getSupplierId() {
            return supplierId;
        }

        public void setSupplierId(Long supplierId) {
            this.supplierId = supplierId;
        }

        public Double getQuotedAmount() {
            return quotedAmount;
        }

        public void setQuotedAmount(Double quotedAmount) {
            this.quotedAmount = quotedAmount;
        }

        public Integer getAvailableQuantity() {
            return availableQuantity;
        }

        public void setAvailableQuantity(Integer availableQuantity) {
            this.availableQuantity = availableQuantity;
        }

        public LocalDate getExpectedDeliveryDate() {
            return expectedDeliveryDate;
        }

        public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) {
            this.expectedDeliveryDate = expectedDeliveryDate;
        }

        public String getSupplierMessage() {
            return supplierMessage;
        }

        public void setSupplierMessage(String supplierMessage) {
            this.supplierMessage = supplierMessage;
        }
    }


    @PostMapping("/submit")
    public ResponseEntity<?> submitQuotation(
            @RequestBody QuotationRequest request) {
        try {
            Quotation quotation = quotationService.submitQuotation(
                    request.getProductId(),
                    request.getSupplierId(),
                    request.getQuotedAmount(),
                    request.getAvailableQuantity(),
                    request.getExpectedDeliveryDate(),
                    request.getSupplierMessage()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(quotation);

        } catch (RuntimeException e) {
            if (e.getMessage() != null
                    && e.getMessage().contains("already submitted")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(e.getMessage());
            }

            throw e;
        }
    }



    @GetMapping("/request/{productId}")
    public List<QuotationResponseDTO> getQuotationsByProduct(
            @PathVariable Long productId) {
        return quotationService.getQuotationResponsesByProduct(productId);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<QuotationResponseDTO>> getQuotationsBySupplier(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                quotationService.getQuotationResponsesBySupplier(supplierId)
        );
    }




    @PutMapping("/{quotationId}/select")
    public ResponseEntity<?> selectQuotation(
            @PathVariable Long quotationId) {
        try {
            Quotation selectedQuotation =
                    quotationService.selectQuotation(quotationId);

            return ResponseEntity.ok(
                    "Supplier selected successfully. Quotation ID: "
                            + selectedQuotation.getQuotationId()
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }




}