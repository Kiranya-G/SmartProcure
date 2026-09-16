package com.procurement.service;

import com.procurement.entity.AccountDetails;
import com.procurement.entity.Admin;
import com.procurement.repository.AccountDetailsRepository;
import com.procurement.repository.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailsService {

    private final AccountDetailsRepository accountDetailsRepository;
    private final AdminRepository adminRepository;

    public AccountDetailsService(
            AccountDetailsRepository accountDetailsRepository,
            AdminRepository adminRepository) {

        this.accountDetailsRepository = accountDetailsRepository;
        this.adminRepository = adminRepository;
    }

    public AccountDetails createAccountDetails(
            Long adminId,
            String accountHolderName,
            String accountNumber,
            String ifscCode,
            String pin) {

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        if (accountDetailsRepository.existsByAdmin(admin)) {
            throw new RuntimeException(
                    "Account details already exist for this admin");
        }

        AccountDetails accountDetails = new AccountDetails();

        accountDetails.setAdmin(admin);
        accountDetails.setAccountHolderName(accountHolderName);
        accountDetails.setAccountNumber(accountNumber);
        accountDetails.setIfscCode(ifscCode);
        accountDetails.setPin(pin);

        return accountDetailsRepository.save(accountDetails);
    }

    public AccountDetails getAccountDetails(Long adminId) {

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        return accountDetailsRepository.findByAdmin(admin)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Account details not found"));
    }
}