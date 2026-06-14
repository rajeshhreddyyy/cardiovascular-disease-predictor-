package com.example.cardiorisk.service;

import com.example.cardiorisk.dto.*;
import com.example.cardiorisk.entity.PredictionRecord;
import com.example.cardiorisk.exception.ApiException;
import com.example.cardiorisk.repository.PredictionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Service
public class PredictionService {

  private final PredictionRepository repo;
  private final RestTemplate restTemplate;

  @Value("${ml.api.url:http://localhost:8000/predict}")
  private String mlApiUrl;

  public PredictionService(PredictionRepository repo) {
    this.repo = repo;
    this.restTemplate = new RestTemplate();
  }

  public PredictResponseDto predictAndStore(PredictRequestDto request) {
    Map<String, Object> mlPayload = new LinkedHashMap<>();
    mlPayload.put("age", request.age);
    mlPayload.put("sex", request.gender); // UCI uses 'sex' convention (0/1)
    mlPayload.put("chest_pain_type", request.chestPainType);
    mlPayload.put("blood_pressure", request.bloodPressure);
    mlPayload.put("cholesterol", request.cholesterol);
    mlPayload.put("blood_sugar", request.bloodSugar);
    mlPayload.put("heart_rate", request.heartRate);
    mlPayload.put("exercise_angina", request.exerciseAngina);
    mlPayload.put("oldpeak", request.oldpeak);
    mlPayload.put("slope", request.slope);

    // Optional fields (accepted by ML service; dataset-dependent)
    mlPayload.put("smoking", request.smoking);
    mlPayload.put("physical_activity", request.physicalActivity);
    mlPayload.put("family_history", request.familyHistory);
    mlPayload.put("bmi", request.bmi);

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);

      HttpEntity<Map<String, Object>> entity = new HttpEntity<>(mlPayload, headers);
      ResponseEntity<Map> resp = restTemplate.exchange(mlApiUrl, HttpMethod.POST, entity, Map.class);

      if (resp.getStatusCode() == null || !resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
        throw new ApiException(502, "ML API call failed");
      }

      Map body = resp.getBody();
      Object predictionObj = body.get("prediction");
      Object probabilityObj = body.get("probability");

      if (!(predictionObj instanceof String) || probabilityObj == null) {
        throw new ApiException(502, "ML API response missing fields");
      }

      String prediction = (String) predictionObj;
      Double probability;
      if (probabilityObj instanceof Number) {
        probability = ((Number) probabilityObj).doubleValue();
      } else {
        throw new ApiException(502, "ML API 'probability' is not numeric");
      }

      PredictionRecord record = new PredictionRecord();
      record.age = request.age;
      record.gender = request.gender;
      record.chestPainType = request.chestPainType;
      record.bloodPressure = request.bloodPressure;
      record.cholesterol = request.cholesterol;
      record.bloodSugar = request.bloodSugar;
      record.heartRate = request.heartRate;
      record.exerciseAngina = request.exerciseAngina;
      record.oldpeak = request.oldpeak;
      record.slope = request.slope;
      record.predictionResult = prediction;
      record.probability = probability;
      record.timestamp = Instant.now();

      repo.save(record);

      PredictResponseDto out = new PredictResponseDto();
      out.prediction = prediction;
      out.probability = probability;
      return out;
    } catch (RestClientException e) {
      throw new ApiException(502, "Failed to reach ML API");
    } catch (ApiException e) {
      throw e;
    } catch (Exception e) {
      throw new ApiException(400, "Invalid input or ML API response");
    }
  }

  public List<HistoryItemDto> history() {
    List<PredictionRecord> records = repo.findTop50ByOrderByTimestampDesc();
    List<HistoryItemDto> out = new ArrayList<>();

    for (PredictionRecord r : records) {
      HistoryItemDto h = new HistoryItemDto();
      h.id = r.id;
      h.age = r.age;
      h.gender = r.gender;
      h.chestPainType = r.chestPainType;
      h.bloodPressure = r.bloodPressure;
      h.cholesterol = r.cholesterol;
      h.bloodSugar = r.bloodSugar;
      h.heartRate = r.heartRate;
      h.exerciseAngina = r.exerciseAngina;
      h.oldpeak = r.oldpeak;
      h.slope = r.slope;
      h.predictionResult = r.predictionResult;
      h.probability = r.probability;
      h.timestamp = r.timestamp;
      out.add(h);
    }
    return out;
  }
}

