package com.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CategoryDTO {


    @NotBlank(message = "Category name is required")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Category name should contain only letters"
    )
    private String catName;

    public CategoryDTO() {
    }

    public String getCatName() {
        return catName;
    }

    public void setCatName(String catName) {
        this.catName = catName;
    }


}
