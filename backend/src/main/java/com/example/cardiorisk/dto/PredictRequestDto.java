package com.example.cardiorisk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class PredictRequestDto {

  @NotNull
  @Min(0)
  @Max(120)
  public Integer age;

  @NotNull
  @Min(0)
  @Max(1)
  public Integer gender;

  @NotNull
  @Min(0)
  @Max(3)
  @JsonProperty("chest_pain_type")
  public Integer chestPainType;

  @NotNull
  @DecimalMin("1")
  @DecimalMax("300")
  @JsonProperty("blood_pressure")
  public Double bloodPressure;

  @NotNull
  @DecimalMin("1")
  @DecimalMax("1000")
  public Double cholesterol;

  @NotNull
  @Min(0)
  @Max(1)
  @JsonProperty("blood_sugar")
  public Integer bloodSugar;

  @NotNull
  @DecimalMin("1")
  @DecimalMax("250")
  @JsonProperty("heart_rate")
  public Double heartRate;

  @NotNull
  @Min(0)
  @Max(1)
  @JsonProperty("exercise_angina")
  public Integer exerciseAngina;

  @NotNull
  @DecimalMin("0")
  @DecimalMax("10")
  public Double oldpeak;

  @NotNull
  @Min(0)
  @Max(2)
  public Integer slope;

  // Optional (may not be used by the bundled UCI model)
  @JsonProperty("smoking")
  @Min(0)
  @Max(2)
  public Integer smoking;

  @JsonProperty("physical_activity")
  @Min(0)
  @Max(2)
  public Integer physicalActivity;

  @JsonProperty("family_history")
  @Min(0)
  @Max(1)
  public Integer familyHistory;

  @JsonProperty("bmi")
  @DecimalMin("10")
  @DecimalMax("80")
  public Double bmi;
}

