package com.example.cardiorisk.controller;

import com.example.cardiorisk.dto.*;
import com.example.cardiorisk.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class PredictionController {

  private final PredictionService service;

  public PredictionController(PredictionService service) {
    this.service = service;
  }

  @PostMapping("/predict")
  public PredictResponseDto predict(@RequestBody @Valid PredictRequestDto request) {
    return service.predictAndStore(request);
  }

  @GetMapping("/history")
  public List<HistoryItemDto> history() {
    return service.history();
  }
}

