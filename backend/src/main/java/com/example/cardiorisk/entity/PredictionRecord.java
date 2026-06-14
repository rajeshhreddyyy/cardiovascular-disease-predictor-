package com.example.cardiorisk.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "user_predictions")
public class PredictionRecord {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public Integer age;

  public Integer gender;

  @Column(name = "chest_pain_type")
  public Integer chestPainType;

  @Column(name = "blood_pressure")
  public Double bloodPressure;

  public Double cholesterol;

  @Column(name = "blood_sugar")
  public Integer bloodSugar;

  @Column(name = "heart_rate")
  public Double heartRate;

  @Column(name = "exercise_angina")
  public Integer exerciseAngina;

  public Double oldpeak;

  public Integer slope;

  @Column(name = "prediction_result")
  public String predictionResult;

  public Double probability;

  public Instant timestamp;
}

