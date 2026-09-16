package com.procurement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "approval_hierarchy")
public class ApprovalHierarchy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_hierarchy_id")
    private Long approvalHierarchyId;


    @ManyToOne
    @JoinColumn(name = "dep_id", nullable = false)
    private Department department;


    @NotBlank(message = "Level is required")
    @Pattern(
            regexp = "Level [1-9]",
            message = "Level should be in format Level 1, Level 2 etc."
    )
    @Column(name = "level")
    private String level;


    // Getter and Setter

    public Long getApprovalHierarchyId() {
        return approvalHierarchyId;
    }

    public void setApprovalHierarchyId(Long approvalHierarchyId) {
        this.approvalHierarchyId = approvalHierarchyId;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}