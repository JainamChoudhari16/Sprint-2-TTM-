package com.ttm.service;

import com.ttm.model.User;
import com.ttm.model.UserRole;
import com.ttm.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initData() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setName("Admin User");
            admin.setEmail("admin@ttm.com");
            admin.setMobile("1234567890");
            admin.setAadhaar("123412341234");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole(UserRole.ROLE_ADMIN);
            userRepository.save(admin);
        }
    }
} 