package com.ttm.controller;

import com.ttm.dto.FoodOrderDto;
import com.ttm.dto.FoodOrderRequestDto;
import com.ttm.service.FoodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/food")
@PreAuthorize("hasRole('USER')")
@CrossOrigin(origins = "http://localhost:4200")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping("/order")
    public ResponseEntity<?> createFoodOrder(Principal principal, @RequestBody FoodOrderRequestDto requestDto) {
        try {
            FoodOrderDto foodOrderDto = foodService.createFoodOrder(principal.getName(), requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(foodOrderDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<FoodOrderDto>> getMyFoodOrders(Principal principal) {
        return ResponseEntity.ok(foodService.getFoodOrderHistory(principal.getName()));
    }
} 