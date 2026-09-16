package com.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class CategoryDTO {

    @NotBlank(message = "Category name is required")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Category name should contain only letters"
    )
    private String catName;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    public CategoryDTO() {
    }

    public String getCatName() {
        return catName;
    }

    public void setCatName(String catName) {
        this.catName = catName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}