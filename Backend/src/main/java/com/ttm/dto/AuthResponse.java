package com.ttm.dto;

import com.ttm.model.UserRole;

public class AuthResponse {
    private String token;
    private UserRole role;
    private String username;

    public AuthResponse(String token, UserRole role, String username) {
        this.token = token;
        this.role = role;
        this.username = username;
    }

    // Getters and Setters
    
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
} 