package com.procurement.service;

import com.procurement.dto.AdminRegisterRequestDTO;
import com.procurement.entity.Admin;
import com.procurement.entity.Department;
import com.procurement.repository.AdminRepository;
import com.procurement.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class AdminRegistrationService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DepartmentRepository departmentRepository;

    public Admin registerAdmin(AdminRegisterRequestDTO request) {


        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email already registered.  Please use another email or login."
            );
        }


        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Department not found"
                        ));


        if (adminRepository.existsByDepartment(department)) {
            throw new IllegalArgumentException("This department already has an admin");
        }


        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPhoneNumber(request.getPhoneNumber());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setDepartment(department);

        return adminRepository.save(admin);
    }
}