package com.procurement.service;

import java.util.List;

import com.procurement.entity.User;

public interface UserService {

    // Create User
    User saveUser(User user);

    // Get all Users
    List<User> getAllUsers();

    // Get User by ID
    User getUserById(Long id);

    // Update User
    User updateUser(Long id, User user);

    // Delete User
    void deleteUser(Long id);
}