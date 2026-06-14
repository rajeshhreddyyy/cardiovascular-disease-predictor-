package com.example.cardiorisk.repository;

import com.example.cardiorisk.entity.PredictionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<PredictionRecord, Long> {
  List<PredictionRecord> findTop50ByOrderByTimestampDesc();
}

