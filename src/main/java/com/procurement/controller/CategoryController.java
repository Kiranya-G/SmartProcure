package com.procurement.controller;

import com.procurement.dto.CategoryDTO;
import com.procurement.entity.Category;
import com.procurement.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Add Category
    @PostMapping
    public ResponseEntity<Category> addCategory(
            @Valid @RequestBody CategoryDTO dto) {

        Category category = categoryService.addCategory(dto);

        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    // Get All Categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    // Get Category by ID
    @GetMapping("/{catId}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long catId) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(catId)
        );
    }

    // Get Categories by Department ID
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Category>> getCategoriesByDepartmentId(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                categoryService.getCategoriesByDepartmentId(departmentId)
        );
    }

    // Update Category
    @PutMapping("/{catId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long catId,
            @Valid @RequestBody CategoryDTO dto) {

        return ResponseEntity.ok(
                categoryService.updateCategory(catId, dto)
        );
    }

    // Delete Category
    @DeleteMapping("/{catId}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long catId) {

        categoryService.deleteCategory(catId);

        return ResponseEntity.ok("Category deleted successfully");
    }
}