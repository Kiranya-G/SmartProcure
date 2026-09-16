package com.procurement.repository;

import com.procurement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByDepartmentDepId(Long departmentId);
}