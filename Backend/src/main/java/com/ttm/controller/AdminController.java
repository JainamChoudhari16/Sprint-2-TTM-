package com.ttm.controller;

import com.ttm.dto.TrainDto;
import com.ttm.dto.UserDto;
import com.ttm.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Train management endpoints
    @PostMapping("/trains")
    public ResponseEntity<?> createTrain(@RequestBody TrainDto trainDto) {
        return ResponseEntity.ok(adminService.createTrain(trainDto));
    }

    @GetMapping("/trains")
    public ResponseEntity<List<TrainDto>> getAllTrains() {
        return ResponseEntity.ok(adminService.getAllTrains());
    }

    @GetMapping("/trains/{id}")
    public ResponseEntity<TrainDto> getTrainById(@PathVariable Long id) {
        TrainDto trainDto = adminService.getTrainById(id);
        return trainDto != null ? ResponseEntity.ok(trainDto) : ResponseEntity.notFound().build();
    }

    @PutMapping("/trains/{id}")
    public ResponseEntity<?> updateTrain(@PathVariable Long id, @RequestBody TrainDto trainDto) {
        return ResponseEntity.ok(adminService.updateTrain(id, trainDto));
    }

    @DeleteMapping("/trains/{id}")
    public ResponseEntity<Void> deleteTrain(@PathVariable Long id) {
        adminService.deleteTrain(id);
        return ResponseEntity.noContent().build();
    }

    // User management endpoints
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
} 