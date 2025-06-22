package com.ttm.service;

import com.ttm.dto.FoodOrderDto;
import com.ttm.dto.FoodOrderRequestDto;
import com.ttm.dto.OrderItemDto;
import com.ttm.dto.OrderItemRequestDto;
import com.ttm.model.*;
import com.ttm.repository.BookingRepository;
import com.ttm.repository.FoodItemRepository;
import com.ttm.repository.FoodOrderRepository;
import com.ttm.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private final FoodOrderRepository foodOrderRepository;
    private final FoodItemRepository foodItemRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public FoodService(FoodOrderRepository foodOrderRepository, FoodItemRepository foodItemRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.foodOrderRepository = foodOrderRepository;
        this.foodItemRepository = foodItemRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FoodOrderDto createFoodOrder(String username, FoodOrderRequestDto requestDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(requestDto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().equals(user)) {
            throw new SecurityException("User not authorized to order for this booking");
        }
        
        FoodOrder foodOrder = new FoodOrder();
        foodOrder.setUser(user);
        foodOrder.setBooking(booking);
        foodOrder.setOrderTime(LocalDateTime.now());
        foodOrder.setStatus("PENDING");

        List<OrderItem> orderItems = requestDto.getOrderItems().stream()
                .map(itemDto -> createOrderItem(itemDto, foodOrder))
                .collect(Collectors.toList());

        foodOrder.setOrderItems(orderItems);

        double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        foodOrder.setTotalAmount(totalAmount);

        FoodOrder savedOrder = foodOrderRepository.save(foodOrder);
        return convertFoodOrderToDto(savedOrder);
    }

    private OrderItem createOrderItem(OrderItemRequestDto itemDto, FoodOrder foodOrder) {
        FoodItem foodItem = foodItemRepository.findById(itemDto.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        if (!foodItem.isAvailable()) {
            throw new RuntimeException("Food item " + foodItem.getName() + " is not available.");
        }
        OrderItem orderItem = new OrderItem();
        orderItem.setFoodOrder(foodOrder);
        orderItem.setFoodItem(foodItem);
        orderItem.setQuantity(itemDto.getQuantity());
        orderItem.setPrice(foodItem.getPrice()); // Price at the time of order
        return orderItem;
    }

    public List<FoodOrderDto> getFoodOrderHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return foodOrderRepository.findByUser(user).stream()
                .map(this::convertFoodOrderToDto)
                .collect(Collectors.toList());
    }
    
    // Conversion methods
    
    private FoodOrderDto convertFoodOrderToDto(FoodOrder order) {
        FoodOrderDto dto = new FoodOrderDto();
        dto.setId(order.getId());
        dto.setBookingId(order.getBooking().getId());
        dto.setUsername(order.getUser().getUsername());
        dto.setOrderTime(order.getOrderTime());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderItems(order.getOrderItems().stream()
            .map(this::convertOrderItemToDto)
            .collect(Collectors.toList()));
        return dto;
    }
    
    private OrderItemDto convertOrderItemToDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setFoodItemId(item.getFoodItem().getId());
        dto.setFoodItemName(item.getFoodItem().getName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }

}
