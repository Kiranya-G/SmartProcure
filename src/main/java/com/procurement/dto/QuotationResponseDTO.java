
package com.procurement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class QuotationResponseDTO {

    private Long quotationId;
    private Long productId;
    private String productName;
    private Long supplierId;
    private String supplierName;
    private Double quotedAmount;
    private Integer availableQuantity;
    private LocalDate expectedDeliveryDate;
    private String supplierMessage;
    private String quotationStatus;
    private LocalDateTime submittedAt;

    public QuotationResponseDTO(
            Long quotationId,
            Long productId,
            String productName,
            Long supplierId,
            String supplierName,
            Double quotedAmount,
            Integer availableQuantity,
            LocalDate expectedDeliveryDate,
            String supplierMessage,
            String quotationStatus,
            LocalDateTime submittedAt) {
        this.quotationId = quotationId;
        this.productId = productId;
        this.productName = productName;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.quotedAmount = quotedAmount;
        this.availableQuantity = availableQuantity;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.supplierMessage = supplierMessage;
        this.quotationStatus = quotationStatus;
        this.submittedAt = submittedAt;
    }

    public Long getQuotationId() { return quotationId; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Long getSupplierId() { return supplierId; }
    public String getSupplierName() { return supplierName; }
    public Double getQuotedAmount() { return quotedAmount; }
    public Integer getAvailableQuantity() { return availableQuantity; }
    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public String getSupplierMessage() { return supplierMessage; }
    public String getQuotationStatus() { return quotationStatus; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
}