
package com.procurement.service;

import com.procurement.dto.QuotationResponseDTO;
import com.procurement.entity.Product;
import com.procurement.entity.Quotation;
import com.procurement.entity.Supplier;
import com.procurement.repository.ProductRepository;
import com.procurement.repository.QuotationRepository;
import com.procurement.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public QuotationService(
            QuotationRepository quotationRepository,
            ProductRepository productRepository,
            SupplierRepository supplierRepository) {
        this.quotationRepository = quotationRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional
    public Quotation submitQuotation(
            Long productId,
            Long supplierId,
            Double quotedAmount,
            Integer availableQuantity,
            java.time.LocalDate expectedDeliveryDate,
            String supplierMessage) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Request not found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));

        if (!"APPROVED".equalsIgnoreCase(product.getStatus())) {
            throw new RuntimeException(
                    "Quotation can only be submitted for approved requests");
        }

        if (!"ACTIVE".equalsIgnoreCase(supplier.getStatus())) {
            throw new RuntimeException("Supplier is not active");
        }

        if (supplier.getCategory() == null
                || product.getCategory() == null
                || !supplier.getCategory().getCatId()
                .equals(product.getCategory().getCatId())) {
            throw new RuntimeException(
                    "Supplier does not belong to this request category");
        }

        if (quotedAmount == null || quotedAmount <= 0) {
            throw new RuntimeException(
                    "Quoted amount must be greater than zero");
        }

        if (availableQuantity == null || availableQuantity <= 0) {
            throw new RuntimeException(
                    "Available quantity must be greater than zero");
        }

        if (availableQuantity < product.getNumberOfQuantities()) {
            throw new RuntimeException(
                    "Supplier does not have enough quantity available");
        }

        if (expectedDeliveryDate == null
                || expectedDeliveryDate.isBefore(
                java.time.LocalDate.now())) {
            throw new RuntimeException(
                    "Expected delivery date cannot be in the past");
        }


        boolean alreadySubmitted =
                quotationRepository
                        .existsByProduct_ProductIdAndSupplier_SupId(
                                productId, supplierId);

        if (alreadySubmitted) {
            throw new RuntimeException(
                    "You have already submitted a quotation for this request."
            );
        }


        Quotation quotation = new Quotation();
        quotation.setProduct(product);
        quotation.setSupplier(supplier);
        quotation.setQuotedAmount(quotedAmount);
        quotation.setAvailableQuantity(availableQuantity);
        quotation.setExpectedDeliveryDate(expectedDeliveryDate);
        quotation.setSupplierMessage(supplierMessage);
        quotation.setQuotationStatus("PENDING");
        quotation.setSubmittedAt(LocalDateTime.now());

        return quotationRepository.save(quotation);
    }

    public List<Quotation> getQuotationsByProduct(Long productId) {
        return quotationRepository.findByProduct_ProductId(productId);
    }

    public List<Quotation> getQuotationsBySupplier(Long supplierId) {
        return quotationRepository.findBySupplier_SupId(supplierId);
    }


    public List<QuotationResponseDTO> getQuotationResponsesBySupplier(Long supplierId) {
        return quotationRepository.findBySupplier_SupId(supplierId)
                .stream()
                .map(quotation -> new QuotationResponseDTO(
                        quotation.getQuotationId(),
                        quotation.getProduct().getProductId(),
                        quotation.getProduct().getName(),
                        quotation.getSupplier().getSupId(),
                        quotation.getSupplier().getName(),
                        quotation.getQuotedAmount(),
                        quotation.getAvailableQuantity(),
                        quotation.getExpectedDeliveryDate(),
                        quotation.getSupplierMessage(),
                        quotation.getQuotationStatus(),
                        quotation.getSubmittedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuotationResponseDTO> getQuotationResponsesByProduct(
            Long productId) {

        return quotationRepository.findByProduct_ProductId(productId)
                .stream()
                .map(q -> new QuotationResponseDTO(
                        q.getQuotationId(),
                        q.getProduct().getProductId(),
                        q.getProduct().getName(),
                        q.getSupplier().getSupId(),
                        q.getSupplier().getName(),
                        q.getQuotedAmount(),
                        q.getAvailableQuantity(),
                        q.getExpectedDeliveryDate(),
                        q.getSupplierMessage(),
                        q.getQuotationStatus(),
                        q.getSubmittedAt()
                ))
                .toList();
    }


    @Transactional
    public Quotation selectQuotation(Long quotationId) {

        // Find the quotation selected by admin
        Quotation selectedQuotation = quotationRepository.findById(quotationId)
                .orElseThrow(() ->
                        new RuntimeException("Quotation not found"));

        Long productId =
                selectedQuotation.getProduct().getProductId();

        // Prevent changing the selection after a supplier is selected
        List<Quotation> allQuotations =
                quotationRepository.findByProduct_ProductId(productId);

        boolean alreadySelected = allQuotations.stream()
                .anyMatch(q ->
                        "SELECTED".equalsIgnoreCase(
                                q.getQuotationStatus()));

        if (alreadySelected) {
            throw new RuntimeException(
                    "A supplier has already been selected for this request");
        }

        // Select one quotation and reject the remaining quotations
        for (Quotation quotation : allQuotations) {

            if (quotation.getQuotationId().equals(quotationId)) {
                quotation.setQuotationStatus("SELECTED");
            } else {
                quotation.setQuotationStatus("REJECTED");
            }
        }

        quotationRepository.saveAll(allQuotations);

        return selectedQuotation;
    }

}