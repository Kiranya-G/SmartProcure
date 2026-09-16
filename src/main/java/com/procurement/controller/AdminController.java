package com.procurement.controller;

import com.procurement.dto.AdminLoginRequestDTO;
import com.procurement.dto.AdminRegisterRequestDTO;
import com.procurement.entity.Admin;
import com.procurement.service.AdminLoginService;
import com.procurement.service.AdminRegistrationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRegistrationService adminRegistrationService;

    @Autowired
    private AdminLoginService adminLoginService;


    // ============================
    // ADMIN REGISTRATION
    // ============================

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(
            @RequestBody AdminRegisterRequestDTO request) {

        try {

            Admin admin =
                    adminRegistrationService.registerAdmin(request);

            return new ResponseEntity<>(
                    admin,
                    HttpStatus.CREATED
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // ============================
    // ADMIN LOGIN
    // ============================

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
            @RequestBody AdminLoginRequestDTO request) {

        try {

            Admin admin =
                    adminLoginService.loginAdmin(
                            request.getEmail(),
                            request.getPassword()
                    );

            return ResponseEntity.ok(admin);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
}