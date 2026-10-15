package com.procurement.service;

import com.procurement.dto.CategoryDTO;
import com.procurement.entity.Category;
import com.procurement.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {


    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category addCategory(CategoryDTO dto) {
        Category category = new Category();
        category.setCatName(dto.getCatName().trim());

        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long catId) {
        return categoryRepository.findById(catId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with ID: " + catId
                        ));
    }

    public Category updateCategory(Long catId, CategoryDTO dto) {
        Category category = getCategoryById(catId);
        category.setCatName(dto.getCatName().trim());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long catId) {
        Category category = getCategoryById(catId);
        categoryRepository.delete(category);
    }


}
