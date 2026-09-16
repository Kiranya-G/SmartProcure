package com.procurement.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.entity.User;
import com.procurement.repository.UserRepository;
import com.procurement.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // Create User
    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Get All Users
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User By Id
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Update User
    @Override
    public User updateUser(Long id, User user) {

        User existingUser = userRepository.findById(id).orElse(null);

        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setPassword(user.getPassword());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setEmail(user.getEmail());
            existingUser.setDesignation(user.getDesignation());
            existingUser.setDepartment(user.getDepartment());

            return userRepository.save(existingUser);
        }

        return null;
    }

    // Delete User
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}