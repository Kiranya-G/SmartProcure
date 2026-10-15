
package com.procurement.repository;

import com.procurement.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    List<Quotation> findByProduct_ProductId(Long productId);

    List<Quotation> findBySupplier_SupId(Long supplierId);

    boolean existsByProduct_ProductIdAndSupplier_SupId(
            Long productId,
            Long supplierId
    );


    List<Quotation> findByProduct_ProductIdAndQuotationStatus(
            Long productId,
            String quotationStatus
    );

}