package com.procurement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dep_id")
    private Long depId;

    @Column(name = "dep_name", nullable = false)
    @NotBlank(message = "Department name is required")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Department name should contain only letters"
    )
    private String depName;

    @Column(name = "manager_of_department", nullable = false)
    @NotBlank(message = "Manager name is required")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Manager name should contain only letters"
    )
    private String managerOfDepartment;

    public Department() {
    }

    public Long getDepId() {
        return depId;
    }

    public void setDepId(Long depId) {
        this.depId = depId;
    }

    public String getDepName() {
        return depName;
    }

    public void setDepName(String depName) {
        this.depName = depName;
    }

    public String getManagerOfDepartment() {
        return managerOfDepartment;
    }

    public void setManagerOfDepartment(String managerOfDepartment) {
        this.managerOfDepartment = managerOfDepartment;
    }
}