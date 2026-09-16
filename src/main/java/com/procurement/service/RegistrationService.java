package com.procurement.service;

import com.procurement.dto.RegisterRequestDTO;
import com.procurement.entity.Department;
import com.procurement.entity.User;
import com.procurement.repository.DepartmentRepository;
import com.procurement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(UserRepository userRepository,
                               DepartmentRepository departmentRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterRequestDTO dto) {


        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException(
                    "Email already registered.Please use another email or login."
            );
        }


        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() ->

                                new IllegalArgumentException(
                                        "Department not found with ID: "
                                                + dto.getDepartmentId()
                                ));


        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());


        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDesignation(dto.getDesignation());
        user.setDepartment(department);


        return userRepository.save(user);
    }
}