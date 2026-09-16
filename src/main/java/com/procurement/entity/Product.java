package com.procurement.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;


    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 50, message = "Product name must be between 3 and 50 characters")
    @Column(name = "name")
    private String name;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    @Column(name = "price_per_product")
    private Double pricePerProduct;

    @Column(name = "total_price")
    private Double totalPrice;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "number_of_quantities")
    private Integer numberOfQuantities;


    @ManyToOne
    @JoinColumn(name = "dep_id", nullable = false)
    private Department department;


    @ManyToOne
    @JoinColumn(name = "cat_id", nullable = false)
    private Category category;


    @NotBlank(message = "Description is required")
    @Column(name = "description")
    private String description;


    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "PENDING_FOR_APPROVAL|APPROVED|REJECTED|ACTIVE|CLOSED",
            message = "Invalid status"
    )
    @Column(name = "status")
    private String status;


    @Column(name = "created_date")
    private LocalDateTime createdDate;


    @Column(name = "update_date")
    private LocalDateTime updateDate;


    @ManyToOne
    @JoinColumn(name = "sup_id", nullable = true)
    private Supplier supplier;

    // Getter and Setter


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public Double getPricePerProduct() {
        return pricePerProduct;
    }

    public void setPricePerProduct(Double pricePerProduct) {
        this.pricePerProduct = pricePerProduct;
    }


    public Integer getNumberOfQuantities() {
        return numberOfQuantities;
    }

    public void setNumberOfQuantities(Integer numberOfQuantities) {
        this.numberOfQuantities = numberOfQuantities;
    }


    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }


    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }


    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }


    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
}