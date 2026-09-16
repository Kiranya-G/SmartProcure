package com.procurement.service;

import com.procurement.entity.Admin;
import com.procurement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminLoginService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin loginAdmin(String email, String password) {

        Admin admin = adminRepository.findByEmail(email);

        // Wrong email
        if (admin == null) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        // Wrong password
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        return admin;
    }
}