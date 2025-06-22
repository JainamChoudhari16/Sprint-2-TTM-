package com.ttm.service;

import com.ttm.dto.TrainDto;
import com.ttm.dto.UserDto;
import com.ttm.model.Train;
import com.ttm.model.User;
import com.ttm.repository.TrainRepository;
import com.ttm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final TrainRepository trainRepository;
    private final UserRepository userRepository;

    public AdminService(TrainRepository trainRepository, UserRepository userRepository) {
        this.trainRepository = trainRepository;
        this.userRepository = userRepository;
    }

    // Train Management
    public Train createTrain(TrainDto trainDto) {
        Train train = new Train();
        // map dto to entity
        train.setTrainNumber(trainDto.getTrainNumber());
        train.setTrainName(trainDto.getTrainName());
        train.setSource(trainDto.getSource());
        train.setDestination(trainDto.getDestination());
        train.setDepartureTime(trainDto.getDepartureTime());
        train.setArrivalTime(trainDto.getArrivalTime());
        train.setTotalSeats(trainDto.getTotalSeats());
        train.setAvailableSeats(trainDto.getTotalSeats()); // Initially all seats are available
        train.setFare(trainDto.getFare());
        return trainRepository.save(train);
    }

    public List<TrainDto> getAllTrains() {
        return trainRepository.findAll().stream().map(this::convertTrainToDto).collect(Collectors.toList());
    }

    public TrainDto getTrainById(Long id) {
        return trainRepository.findById(id).map(this::convertTrainToDto).orElse(null);
    }

    public Train updateTrain(Long id, TrainDto trainDto) {
        Train train = trainRepository.findById(id).orElseThrow(() -> new RuntimeException("Train not found"));
        // map dto to entity
        train.setTrainName(trainDto.getTrainName());
        train.setSource(trainDto.getSource());
        train.setDestination(trainDto.getDestination());
        train.setDepartureTime(trainDto.getDepartureTime());
        train.setArrivalTime(trainDto.getArrivalTime());
        train.setTotalSeats(trainDto.getTotalSeats());
        train.setAvailableSeats(trainDto.getAvailableSeats());
        train.setFare(trainDto.getFare());
        return trainRepository.save(train);
    }

    public void deleteTrain(Long id) {
        trainRepository.deleteById(id);
    }

    // User Management
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::convertUserToDto).collect(Collectors.toList());
    }
    
    // --- Private conversion methods ---

    private UserDto convertUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setMobile(user.getMobile());
        userDto.setAadhaar(user.getAadhaar());
        userDto.setRole(user.getRole().name());
        return userDto;
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