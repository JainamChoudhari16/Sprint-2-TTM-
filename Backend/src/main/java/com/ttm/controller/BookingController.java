package com.ttm.controller;

import com.ttm.dto.BookingDto;
import com.ttm.dto.BookingRequestDto;
import com.ttm.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@PreAuthorize("hasRole('USER')")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(Principal principal, @RequestBody BookingRequestDto bookingRequestDto) {
        try {
            BookingDto bookingDto = bookingService.createBooking(principal.getName(), bookingRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(bookingDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingDto>> getMyBookings(Principal principal) {
        return ResponseEntity.ok(bookingService.getBookingHistory(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        // Add security check to ensure user can only see their own booking
        BookingDto bookingDto = bookingService.getBookingById(id);
        return bookingDto != null ? ResponseEntity.ok(bookingDto) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        // Add security check to ensure user can only cancel their own booking
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
} 