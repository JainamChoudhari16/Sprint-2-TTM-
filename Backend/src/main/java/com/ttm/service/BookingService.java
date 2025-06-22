package com.ttm.service;

import com.ttm.dto.BookingDto;
import com.ttm.dto.BookingRequestDto;
import com.ttm.dto.PassengerDto;
import com.ttm.dto.TrainDto;
import com.ttm.model.*;
import com.ttm.repository.BookingRepository;
import com.ttm.repository.TrainRepository;
import com.ttm.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainRepository trainRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, TrainRepository trainRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.trainRepository = trainRepository;
    }

    @Transactional
    public BookingDto createBooking(String username, BookingRequestDto bookingRequestDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Train train = trainRepository.findById(bookingRequestDto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        int numSeats = bookingRequestDto.getPassengers().size();
        if (train.getAvailableSeats() < numSeats) {
            throw new RuntimeException("Not enough seats available");
        }

        train.setAvailableSeats(train.getAvailableSeats() - numSeats);
        trainRepository.save(train);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrain(train);
        booking.setJourneyDate(bookingRequestDto.getJourneyDate());
        booking.setSeatsBooked(numSeats);
        booking.setTotalFare(train.getFare() * numSeats);

        List<Passenger> passengers = bookingRequestDto.getPassengers().stream()
                .map(dto -> {
                    Passenger passenger = new Passenger();
                    passenger.setName(dto.getName());
                    passenger.setAge(dto.getAge());
                    passenger.setGender(dto.getGender());
                    passenger.setBooking(booking);
                    return passenger;
                }).collect(Collectors.toList());
        booking.setPassengers(passengers);
        
        Booking savedBooking = bookingRepository.save(booking);
        return convertBookingToDto(savedBooking);
    }

    public List<BookingDto> getBookingHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return bookingRepository.findByUser(user).stream()
                .map(this::convertBookingToDto)
                .collect(Collectors.toList());
    }

    public BookingDto getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this::convertBookingToDto)
                .orElse(null);
    }
    
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        Train train = booking.getTrain();
        train.setAvailableSeats(train.getAvailableSeats() + booking.getSeatsBooked());
        trainRepository.save(train);
        
        bookingRepository.delete(booking);
    }

    private BookingDto convertBookingToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUsername(booking.getUser().getUsername());
        dto.setJourneyDate(booking.getJourneyDate());
        dto.setSeatsBooked(booking.getSeatsBooked());
        dto.setTotalFare(booking.getTotalFare());
        dto.setTrain(convertTrainToDto(booking.getTrain()));
        dto.setPassengers(booking.getPassengers().stream()
                .map(this::convertPassengerToDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private PassengerDto convertPassengerToDto(Passenger passenger) {
        PassengerDto dto = new PassengerDto();
        dto.setName(passenger.getName());
        dto.setAge(passenger.getAge());
        dto.setGender(passenger.getGender());
        return dto;
    }

    private TrainDto convertTrainToDto(Train train) {
        TrainDto trainDto = new TrainDto();
        trainDto.setId(train.getId());
        trainDto.setTrainNumber(train.getTrainNumber());
        trainDto.setTrainName(train.getTrainName());
        trainDto.setSource(train.getSource());
        trainDto.setDestination(train.getDestination());
        trainDto.setDepartureTime(train.getDepartureTime());
        trainDto.setArrivalTime(train.getArrivalTime());
        trainDto.setTotalSeats(train.getTotalSeats());
        trainDto.setAvailableSeats(train.getAvailableSeats());
        trainDto.setFare(train.getFare());
        return trainDto;
    }
} 