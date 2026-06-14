import pool from "../config/db.js";

export async function savePatientRecord(req, res) {
  try {
    const userId = req.user.id;
    const {
      age,
      gender,
      chest_pain_type,
      blood_pressure,
      exercise_angina,
      smoking,
      family_history,
      physical_activity,
      bmi,
      max_heart_rate,
      cholesterol,
      resting_ecg,
      oldpeak,
      slope,
      vessels,
      thalassemia,
      prediction_result,
      prediction_type
    } = req.body;

    if (
      age == null ||
      !gender ||
      !chest_pain_type ||
      blood_pressure == null ||
      !exercise_angina ||
      !smoking ||
      !family_history ||
      !prediction_result ||
      !prediction_type
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: age, gender, chest_pain_type, blood_pressure, exercise_angina, smoking, family_history, prediction_result, prediction_type."
      });
    }

    const sql = `
      INSERT INTO patient_records (
        user_id, age, gender, chest_pain_type, blood_pressure, exercise_angina, smoking, family_history,
        physical_activity, bmi, max_heart_rate, cholesterol, resting_ecg, oldpeak, slope, vessels, thalassemia,
        prediction_result, prediction_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      age,
      gender,
      chest_pain_type,
      blood_pressure,
      exercise_angina,
      smoking,
      family_history,
      physical_activity ?? null,
      bmi ?? null,
      max_heart_rate ?? null,
      cholesterol ?? null,
      resting_ecg ?? null,
      oldpeak ?? null,
      slope ?? null,
      vessels ?? null,
      thalassemia ?? null,
      prediction_result,
      prediction_type
    ];

    const [result] = await pool.query(sql, values);

    return res.status(201).json({
      message: "Patient record saved successfully.",
      recordId: result.insertId
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save patient record.", error: error.message });
  }
}

export async function getUserHistory(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM patient_records WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch patient history.", error: error.message });
  }
}
