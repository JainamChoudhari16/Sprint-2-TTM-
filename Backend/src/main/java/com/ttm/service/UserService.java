package com.ttm.service;

import com.ttm.dto.UserDto;
import com.ttm.model.User;
import com.ttm.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return convertUserToDto(user);
    }
    
    public UserDto updateUserProfile(String username, UserDto userDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        user.setName(userDto.getName());
        user.setMobile(userDto.getMobile());
        // Potentially update other fields as needed, ensure sensitive data like aadhaar/email is handled carefully
        
        User updatedUser = userRepository.save(user);
        return convertUserToDto(updatedUser);
    }

    private UserDto convertUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setMobile(user.getMobile());
        userDto.setAadhaar(user.getAadhaar()); // Be careful about exposing this
        userDto.setRole(user.getRole().name());
        return userDto;
    }
} 