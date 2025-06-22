package com.ttm.dto;

import java.time.LocalDate;
import java.util.List;

public class BookingRequestDto {
    private Long trainId;
    private LocalDate journeyDate;
    private List<PassengerDto> passengers;

    // Getters and Setters

    public Long getTrainId() {
        return trainId;
    }

    public void setTrainId(Long trainId) {
        this.trainId = trainId;
    }

    public LocalDate getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(LocalDate journeyDate) {
        this.journeyDate = journeyDate;
    }

    public List<PassengerDto> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDto> passengers) {
        this.passengers = passengers;
    }
} 