package com.procurement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Long catId;

    @Column(name = "cat_name", nullable = false)
    @NotBlank(message = "Category name is required")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Category name should contain only letters"
    )
    private String catName;

    @ManyToOne
    @JoinColumn(name = "dep_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "sup_id", nullable = true)
    private Supplier supplier;


    public Category() {
    }

    public Long getCatId() {
        return catId;
    }

    public void setCatId(Long catId) {
        this.catId = catId;
    }

    public String getCatName() {
        return catName;
    }

    public void setCatName(String catName) {
        this.catName = catName;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
}