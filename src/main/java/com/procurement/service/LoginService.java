package com.procurement.service;

import com.procurement.dto.LoginRequestDTO;
import com.procurement.entity.User;
import com.procurement.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public LoginService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    public User login(LoginRequestDTO loginRequest) {

        try {

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    );

            Authentication authentication =
                    authenticationManager.authenticate(authenticationToken);

            // Get logged-in user from database
            User user = userRepository
                    .findByEmail(loginRequest.getEmail())
                    .orElseThrow(() ->
                            new RuntimeException("User not found")
                    );

            return user;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }
    }
}