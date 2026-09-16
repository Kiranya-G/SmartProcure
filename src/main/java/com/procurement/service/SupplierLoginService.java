package com.procurement.service;

import com.procurement.dto.SupplierLoginRequestDTO;
import com.procurement.entity.Supplier;
import com.procurement.repository.SupplierRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class SupplierLoginService {

    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;

    public SupplierLoginService(
            SupplierRepository supplierRepository,
            PasswordEncoder passwordEncoder) {

        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Supplier login(SupplierLoginRequestDTO request) {

        List<Supplier> suppliers =
                supplierRepository.findAllByEmail(request.getEmail());

        if (suppliers.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        Supplier validSupplier = null;

        for (Supplier supplier : suppliers) {

            if (passwordEncoder.matches(
                    request.getPassword(),
                    supplier.getPassword())) {

                validSupplier = supplier;
                break;
            }
        }

        if (validSupplier == null) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!"ACTIVE".equals(validSupplier.getStatus())) {
            throw new RuntimeException("Supplier account is inactive");
        }

        return validSupplier;
    }
}