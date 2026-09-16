package com.procurement.dto;

public class RaiseRequestDTO {

    private String name;

    private Long userId;

    private Double pricePerProduct;

    private Integer numberOfQuantities;

    private Long categoryId;

    private String description;


    public RaiseRequestDTO() {
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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


    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}