package com.ttm.dto;

import java.util.List;

public class FoodOrderRequestDto {
    private Long bookingId;
    private List<OrderItemRequestDto> orderItems;

    // Getters and Setters
    
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public List<OrderItemRequestDto> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemRequestDto> orderItems) {
        this.orderItems = orderItems;
    }
} 