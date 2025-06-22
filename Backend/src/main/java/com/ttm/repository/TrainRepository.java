package com.ttm.repository;

import com.ttm.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
    Optional<Train> findByTrainNumber(String trainNumber);

    List<Train> findBySourceAndDestinationAndDepartureTimeAfter(
            String source, String destination, LocalDateTime departureTime);
} 