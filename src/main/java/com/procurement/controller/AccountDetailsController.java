package com.procurement.controller;

import com.procurement.entity.AccountDetails;
import com.procurement.service.AccountDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account-details")
@CrossOrigin(origins = "http://localhost:5185")
public class AccountDetailsController {

    private final AccountDetailsService accountDetailsService;

    public AccountDetailsController(
            AccountDetailsService accountDetailsService) {
        this.accountDetailsService = accountDetailsService;
    }

    @PostMapping
    public ResponseEntity<AccountDetails> createAccountDetails(
            @RequestParam Long adminId,
            @RequestParam String accountHolderName,
            @RequestParam String accountNumber,
            @RequestParam String ifscCode,
            @RequestParam String pin) {

        AccountDetails accountDetails =
                accountDetailsService.createAccountDetails(
                        adminId,
                        accountHolderName,
                        accountNumber,
                        ifscCode,
                        pin
                );

        return new ResponseEntity<>(
                accountDetails,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<AccountDetails> getAccountDetails(
            @PathVariable Long adminId) {

        AccountDetails accountDetails =
                accountDetailsService.getAccountDetails(adminId);

        return ResponseEntity.ok(accountDetails);
    }
}