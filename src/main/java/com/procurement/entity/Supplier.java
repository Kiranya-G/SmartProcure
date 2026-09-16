package com.procurement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sup_id")
    private Long supId;





    @NotBlank(message = "Supplier name is required")
    @Size(min = 3, max = 50)
    @Column(name = "name")
    private String name;


    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid Indian phone number"
    )
    @Column(name = "phone")
    private String phone;


    @NotBlank(message = "Address is required")
    @Column(name = "address")
    private String address;


    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(name = "email")
    private String email;


    @NotBlank(message = "GST number is required")
    @Pattern(
            regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Invalid GST number"
    )
    @Column(name = "gst_number")
    private String gstNumber;


    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "ACTIVE|INACTIVE",
            message = "Status should be ACTIVE or INACTIVE"
    )
    @Column(name = "status")
    private String status;


    @Min(value = 1, message = "Rating should be between 1 and 5")
    @Max(value = 5, message = "Rating should be between 1 and 5")
    @Column(name = "rating")
    private Integer rating;

    @NotBlank(message = "Password is required")
    @Column(name = "password")
    private String password;


    // Getter and Setter

    public Long getSupId() {
        return supId;
    }

    public void setSupId(Long supId) {
        this.supId = supId;
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}