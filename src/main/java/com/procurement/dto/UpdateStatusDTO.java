package com.procurement.dto;

public class UpdateStatusDTO {

    private String status;

    private Long adminId;


    // ============================
    // STATUS
    // ============================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    // ============================
    // ADMIN ID
    // ============================

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
}