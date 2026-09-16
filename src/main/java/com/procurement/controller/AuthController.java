package com.procurement.controller;

import com.procurement.dto.LoginRequestDTO;
import com.procurement.dto.RegisterRequestDTO;
import com.procurement.entity.User;
import com.procurement.service.LoginService;
import com.procurement.service.RegistrationService;

import com.procurement.dto.SupplierLoginRequestDTO;
import com.procurement.entity.Supplier;
import com.procurement.service.SupplierLoginService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegistrationService registrationService;
    private final LoginService loginService;

    private final SupplierLoginService supplierLoginService;
    public AuthController(
            RegistrationService registrationService,
            LoginService loginService,
            SupplierLoginService supplierLoginService) {

        this.registrationService = registrationService;
        this.loginService = loginService;
        this.supplierLoginService = supplierLoginService;
    }


    // =====================================================
    // REGISTRATION API
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequestDTO request) {

        try {

            User user =
                    registrationService.registerUser(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(user);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // USER LOGIN API
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO dto) {

        System.out.println(
                "===== LOGIN API CALLED ====="
        );

        try {

            User user =
                    loginService.login(dto);


            System.out.println(
                    "Login successful for: "
                            + user.getEmail()
            );

            System.out.println(
                    "User ID: "
                            + user.getUserId()
            );


            return ResponseEntity.ok(

                    Map.of(

                            "message",
                            "Login successful",

                            "role",
                            "USER",

                            "userId",
                            user.getUserId(),

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail()
                    )
            );


        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }
    }
    @PostMapping("/supplier-login")
    public ResponseEntity<?> supplierLogin(
            @RequestBody SupplierLoginRequestDTO request) {

        try {

            Supplier supplier =
                    supplierLoginService.login(request);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Supplier login successful",
                            "role", "SUPPLIER",
                            "supplierId", supplier.getSupId(),
                            "name", supplier.getName(),
                            "email", supplier.getEmail()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}