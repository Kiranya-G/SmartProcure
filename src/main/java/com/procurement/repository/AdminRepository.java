package com.procurement.repository;

import com.procurement.entity.Admin;
import com.procurement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByEmail(String email);

    Admin findByEmail(String email);

    Admin findByDepartment(Department department);
    boolean existsByDepartment(Department department);
}