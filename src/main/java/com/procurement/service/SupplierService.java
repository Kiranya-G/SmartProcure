package com.procurement.service;

import com.procurement.dto.SupplierRequestDTO;

import com.procurement.entity.Category;
import com.procurement.entity.Supplier;

import com.procurement.repository.CategoryRepository;
import com.procurement.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

import com.procurement.entity.Product;
import com.procurement.repository.ProductRepository;
@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public SupplierService(
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            PasswordEncoder passwordEncoder) {


        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;


    }

    public Supplier createSupplier(SupplierRequestDTO request) {


        Category category = categoryRepository.findById(
                request.getCategoryId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Category not found with ID: "
                                + request.getCategoryId()
                ));

        Supplier supplier = new Supplier();

        supplier.setName(request.getName());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());
        supplier.setEmail(request.getEmail());
        supplier.setGstNumber(request.getGstNumber());

        supplier.setStatus(
                request.getStatus() == null
                        ? "ACTIVE"
                        : request.getStatus()
        );

// New suppliers should not receive a fabricated rating.
        supplier.setRating(null);

        supplier.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        supplier.setCategory(category);

        return supplierRepository.save(supplier);


    }


    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }



    public List<Supplier> getActiveSuppliersByCategory(Long categoryId) {

        return supplierRepository.findByCategory_CatId(categoryId)
                .stream()
                .filter(supplier -> "ACTIVE".equalsIgnoreCase(supplier.getStatus()))
                .toList();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));
    }

    public Product assignSupplier(Long productId, Long supplierId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));

        product.setSupplier(supplier);

        return productRepository.save(product);
    }
}