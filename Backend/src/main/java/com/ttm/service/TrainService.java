package com.ttm.service;

import com.ttm.dto.TrainDto;
import com.ttm.model.Train;
import com.ttm.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainService {

    private final TrainRepository trainRepository;

    public TrainService(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    public List<TrainDto> searchTrains(String source, String destination, LocalDate date) {
        // We search for trains departing any time on the given date
        return trainRepository.findBySourceAndDestinationAndDepartureTimeAfter(
                source, destination, date.atStartOfDay())
                .stream()
                .filter(train -> train.getDepartureTime().toLocalDate().equals(date))
                .map(this::convertTrainToDto)
                .collect(Collectors.toList());
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