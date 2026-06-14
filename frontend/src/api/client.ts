import axios from "axios";

export type PredictResponse = {
  prediction: "High Risk" | "Low Risk" | string;
  probability: number;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/ml";
const NODE_API_BASE = import.meta.env.VITE_NODE_API_BASE ?? "/api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export type PatientRecordPayload = {
  age: number;
  gender: string;
  chest_pain_type: string;
  blood_pressure: number;
  exercise_angina: string;
  smoking: string;
  family_history: string;
  physical_activity?: string | null;
  bmi?: number | null;
  max_heart_rate?: number | null;
  cholesterol?: number | null;
  resting_ecg?: string | null;
  oldpeak?: number | null;
  slope?: string | null;
  vessels?: number | null;
  thalassemia?: string | null;
  prediction_result: string;
  prediction_type: "Basic" | "Advanced";
};

export type PatientHistoryItem = PatientRecordPayload & {
  id: number;
  user_id: number;
  created_at: string;
};

export type PredictRequestPayload = {
  age: number;
  gender: number;
  chest_pain_type: number;
  blood_pressure: number;
  cholesterol: number;
  blood_sugar: number;
  heart_rate: number;
  exercise_angina: number;
  oldpeak: number;
  slope: number;
  // optional
  smoking?: number | null;
  physical_activity?: number | null;
  family_history?: number | null;
  bmi?: number | null;
};

export async function postPredict(payload: PredictRequestPayload): Promise<PredictResponse> {
  // Frontend stores the field as `gender`; ML API expects `sex`.
  const mlPayload = {
    ...payload,
    sex: payload.gender
  };
  const res = await axios.post(`${API_BASE}/predict`, mlPayload, {
    headers: { "Content-Type": "application/json" }
  });
  return res.data as PredictResponse;
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  const res = await axios.post(`${NODE_API_BASE}/auth/register`, { name, email, password });
  return res.data as RegisterResponse;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post(`${NODE_API_BASE}/auth/login`, { email, password });
  return res.data as AuthResponse;
}

export async function savePatientRecord(payload: PatientRecordPayload, token: string): Promise<void> {
  await axios.post(`${NODE_API_BASE}/patient`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getPatientHistory(token: string): Promise<PatientHistoryItem[]> {
  const res = await axios.get(`${NODE_API_BASE}/patient/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data as PatientHistoryItem[];
}

