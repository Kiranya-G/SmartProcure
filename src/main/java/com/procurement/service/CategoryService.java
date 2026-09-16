package com.procurement.service;

import com.procurement.dto.CategoryDTO;
import com.procurement.entity.Category;
import com.procurement.entity.Department;
import com.procurement.repository.CategoryRepository;
import com.procurement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           DepartmentRepository departmentRepository) {
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
    }

    // Add Category
    public Category addCategory(CategoryDTO dto) {

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found with ID: " + dto.getDepartmentId()
                        ));

        Category category = new Category();

        category.setCatName(dto.getCatName());
        category.setDepartment(department);

        return categoryRepository.save(category);
    }

    // Get All Categories
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    // Get Category by ID
    public Category getCategoryById(Long catId) {

        return categoryRepository.findById(catId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with ID: " + catId
                        ));
    }

    // Get Categories by Department ID
    public List<Category> getCategoriesByDepartmentId(Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException(
                    "Department not found with ID: " + departmentId
            );
        }

        return categoryRepository.findByDepartmentDepId(departmentId);
    }

    // Update Category
    public Category updateCategory(Long catId, CategoryDTO dto) {

        Category category = categoryRepository.findById(catId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with ID: " + catId
                        ));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found with ID: " + dto.getDepartmentId()
                        ));

        category.setCatName(dto.getCatName());
        category.setDepartment(department);

        return categoryRepository.save(category);
    }

    // Delete Category
    public void deleteCategory(Long catId) {

        Category category = categoryRepository.findById(catId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with ID: " + catId
                        ));

        categoryRepository.delete(category);
    }
}