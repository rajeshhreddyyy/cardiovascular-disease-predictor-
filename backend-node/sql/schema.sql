CREATE DATABASE IF NOT EXISTS heart_prediction_db;
USE heart_prediction_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patient_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,

  -- Basic fields
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  chest_pain_type VARCHAR(60) NOT NULL,
  blood_pressure INT NOT NULL,
  exercise_angina VARCHAR(20) NOT NULL,
  smoking VARCHAR(30) NOT NULL,
  family_history VARCHAR(20) NOT NULL,

  -- Optional fields
  physical_activity VARCHAR(30) NULL,
  bmi FLOAT NULL,
  max_heart_rate INT NULL,

  -- Advanced fields
  cholesterol INT NULL,
  resting_ecg VARCHAR(80) NULL,
  oldpeak FLOAT NULL,
  slope VARCHAR(30) NULL,
  vessels INT NULL,
  thalassemia VARCHAR(60) NULL,

  -- Prediction output
  prediction_result VARCHAR(20) NOT NULL,
  prediction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_patient_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
