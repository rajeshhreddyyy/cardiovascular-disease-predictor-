import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { postPredict, savePatientRecord, type PredictRequestPayload } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageBackButton from "../components/PageBackButton";

type SexOption = "Male" | "Female";
type YesNo = "Yes" | "No";
type SmokingOption = "No" | "Occasionally" | "Yes";
type ActivityOption = "Low" | "Moderate" | "High";
type ChestPainOption = "Typical Angina" | "Atypical Angina" | "Non-anginal Pain" | "No Chest Pain";
type EcgOption = "Normal" | "ST-T Abnormality" | "Left Ventricular Hypertrophy";
type SlopeOption = "Upsloping" | "Flat" | "Downsloping";
type ThalOption = "Normal" | "Fixed Defect" | "Reversible Defect";
type InfoKey =
  | "age"
  | "gender"
  | "chestPainType"
  | "bloodPressure"
  | "exerciseAngina"
  | "smoking"
  | "familyHistory"
  | "physicalActivity"
  | "bmi"
  | "maxHeartRate"
  | "cholesterol"
  | "restingEcg"
  | "oldpeak"
  | "slope"
  | "vessels"
  | "thalassemia";

const FIELD_INFO: Record<InfoKey, { simple: string; why: string; example: string }> = {
  age: {
    simple: "Your age in years.",
    why: "Heart risk often rises as age increases.",
    example: "Example: 45"
  },
  gender: {
    simple: "Biological gender (male or female).",
    why: "Risk patterns can differ between men and women.",
    example: "Example: Female"
  },
  chestPainType: {
    simple: "The kind of chest discomfort you feel.",
    why: "Some pain patterns are more linked to heart problems.",
    example: "Example: Typical Angina"
  },
  bloodPressure: {
    simple: "Your resting blood pressure value.",
    why: "High blood pressure can strain your heart and blood vessels.",
    example: "Example: 130"
  },
  exerciseAngina: {
    simple: "Chest discomfort during physical activity.",
    why: "It can suggest reduced blood flow when your heart works harder.",
    example: "Example: Yes"
  },
  smoking: {
    simple: "How often you smoke.",
    why: "Smoking damages blood vessels and raises heart risk.",
    example: "Example: Occasionally"
  },
  familyHistory: {
    simple: "Whether close family had heart disease.",
    why: "Family history may increase your risk.",
    example: "Example: Yes"
  },
  physicalActivity: {
    simple: "Your usual activity level.",
    why: "Regular activity helps lower heart risk.",
    example: "Example: Moderate"
  },
  bmi: {
    simple: "A height-weight health score.",
    why: "Higher BMI may be linked to higher heart risk.",
    example: "Example: 27.4"
  },
  maxHeartRate: {
    simple: "Highest heart rate reached during exercise.",
    why: "Very low values can sometimes signal reduced heart performance.",
    example: "Example: 150"
  },
  cholesterol: {
    simple: "Fat level in your blood.",
    why: "High cholesterol can lead to artery blockage.",
    example: "Example: 220"
  },
  restingEcg: {
    simple: "A resting heart electrical test result.",
    why: "Abnormal patterns can indicate heart stress or damage.",
    example: "Example: Normal"
  },
  oldpeak: {
    simple: "Change in heart signal during exercise.",
    why: "Higher values can suggest lower blood flow to the heart.",
    example: "Example: 1.2"
  },
  slope: {
    simple: "How your heart signal trend looks under stress.",
    why: "Some trends are more associated with heart issues.",
    example: "Example: Flat"
  },
  vessels: {
    simple: "How many major blood vessels look affected.",
    why: "More affected vessels usually means higher risk.",
    example: "Example: 2"
  },
  thalassemia: {
    simple: "A blood-related test category used in heart assessments.",
    why: "Some categories are linked with higher observed risk.",
    example: "Example: Reversible Defect"
  }
};

const FIELD_LABELS: Record<InfoKey, string> = {
  age: "Age",
  gender: "Gender",
  chestPainType: "Chest Pain Type",
  bloodPressure: "Blood Pressure",
  exerciseAngina: "Exercise Induced Angina",
  smoking: "Smoking",
  familyHistory: "Family History",
  physicalActivity: "Physical Activity",
  bmi: "BMI",
  maxHeartRate: "Maximum Heart Rate",
  cholesterol: "Cholesterol",
  restingEcg: "Resting ECG",
  oldpeak: "Oldpeak",
  slope: "Slope",
  vessels: "Number of Major Vessels",
  thalassemia: "Thalassemia"
};

const CHEST_PAIN_HELP: Record<ChestPainOption, string> = {
  "Typical Angina": "Usual heart-related chest pain, often during activity.",
  "Atypical Angina": "Unusual chest discomfort that may still relate to the heart.",
  "Non-anginal Pain": "Chest pain usually not caused by heart disease.",
  "No Chest Pain": "No chest pain symptoms are present."
};

const ECG_HELP: Record<EcgOption, string> = {
  Normal: "Heart electrical activity looks normal at rest.",
  "ST-T Abnormality": "Mild signal changes that may indicate heart stress.",
  "Left Ventricular Hypertrophy": "Can suggest thickening of heart muscle."
};

const SLOPE_HELP: Record<SlopeOption, string> = {
  Upsloping: "Usually lower concern compared with other patterns.",
  Flat: "Can be linked to moderate heart stress risk.",
  Downsloping: "Often linked to higher heart risk patterns."
};

const THAL_HELP: Record<ThalOption, string> = {
  Normal: "No major issue indicated by this category.",
  "Fixed Defect": "A persistent issue pattern in blood flow imaging.",
  "Reversible Defect": "A stress-related issue pattern that may improve at rest."
};

function coerceNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function coerceRequiredNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function InfoLabel({ label, infoKey }: { label: string; infoKey: InfoKey }) {
  const info = FIELD_INFO[infoKey];
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="group relative">
        <button
          type="button"
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500"
          aria-label={`More info about ${label}`}
        >
          i
        </button>
        <div className="pointer-events-none absolute left-1/2 top-6 z-10 w-64 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 opacity-0 shadow-soft transition group-hover:opacity-100 group-focus-within:opacity-100">
          <div><span className="font-semibold text-slate-800">What:</span> {info.simple}</div>
          <div className="mt-1"><span className="font-semibold text-slate-800">Why:</span> {info.why}</div>
          <div className="mt-1"><span className="font-semibold text-slate-800">Example:</span> {info.example}</div>
        </div>
      </div>
    </div>
  );
}

export default function PredictionFormPage() {
  const nav = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);

  // Section 1: Basic Information
  const [ageRaw, setAgeRaw] = useState<string>("");
  const [sex, setSex] = useState<SexOption | "">("");
  const [chestPainType, setChestPainType] = useState<ChestPainOption | "">("");

  // Section 2: Symptoms
  const [bloodPressureRaw, setBloodPressureRaw] = useState<string>("");
  const [exerciseAngina, setExerciseAngina] = useState<YesNo | "">("");

  // Section 3: Lifestyle
  const [smoking, setSmoking] = useState<SmokingOption | "">("");
  const [familyHistory, setFamilyHistory] = useState<YesNo | "">("");
  const [physicalActivity, setPhysicalActivity] = useState<ActivityOption | "">("");
  const [bmiRaw, setBmiRaw] = useState<string>("");
  const [heartRateRaw, setHeartRateRaw] = useState<string>("");

  // Section 4: Advanced
  const [cholesterolRaw, setCholesterolRaw] = useState<string>("");
  const [restingEcg, setRestingEcg] = useState<EcgOption | "">("");
  const [oldpeakRaw, setOldpeakRaw] = useState<string>("");
  const [slope, setSlope] = useState<SlopeOption | "">("");
  const [majorVessels, setMajorVessels] = useState<"0" | "1" | "2" | "3" | "">("");
  const [thal, setThal] = useState<ThalOption | "">("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const age = coerceRequiredNumber(ageRaw);
    if (age === null || !sex || !chestPainType || !exerciseAngina || !smoking || !familyHistory) {
      setError("Please fill all required fields in Basic Prediction.");
      return;
    }
    if (!inRange(age, 0, 120)) return setError("Age must be between 0 and 120.");
    const bloodPressure = coerceNullableNumber(bloodPressureRaw) ?? 130;
    if (!inRange(bloodPressure, 1, 300)) return setError("Blood Pressure must be between 1 and 300.");
    const heartRate = coerceNullableNumber(heartRateRaw) ?? 150;
    if (!inRange(heartRate, 1, 250)) return setError("Maximum Heart Rate must be between 1 and 250.");
    const bmi = coerceNullableNumber(bmiRaw);
    if (bmi !== null && !inRange(bmi, 10, 70)) return setError("BMI should be between 10 and 70.");

    const cholesterol = advancedMode ? coerceRequiredNumber(cholesterolRaw) : 220;
    const oldpeak = advancedMode ? coerceRequiredNumber(oldpeakRaw) : 1.0;
    const slopeValue = advancedMode ? slope : "Flat";
    if (cholesterol === null || oldpeak === null || !slopeValue) {
      return setError("Please complete Advanced fields or switch back to Basic mode.");
    }
    if (!inRange(cholesterol, 1, 1000)) return setError("Cholesterol must be between 1 and 1000.");
    if (!inRange(oldpeak, 0, 10)) return setError("Oldpeak must be between 0 and 10.");
    if (advancedMode && !restingEcg) return setError("Please select Resting ECG.");
    if (advancedMode && !majorVessels) return setError("Please select Number of Major Vessels.");
    if (advancedMode && !thal) return setError("Please select Thalassemia.");

    const chestPainMap: Record<ChestPainOption, number> = {
      "Typical Angina": 0,
      "Atypical Angina": 1,
      "Non-anginal Pain": 2,
      "No Chest Pain": 3
    };
    const smokingMap: Record<SmokingOption, number> = { No: 0, Occasionally: 1, Yes: 2 };
    const activityMap: Record<ActivityOption, number> = { Low: 0, Moderate: 1, High: 2 };
    const slopeMap: Record<SlopeOption, number> = { Upsloping: 0, Flat: 1, Downsloping: 2 };

    const payload: PredictRequestPayload = {
      age,
      gender: sex === "Male" ? 1 : 0,
      chest_pain_type: chestPainMap[chestPainType],
      blood_pressure: bloodPressure,
      cholesterol,
      blood_sugar: 0,
      heart_rate: heartRate,
      exercise_angina: exerciseAngina === "Yes" ? 1 : 0,
      oldpeak,
      slope: slopeMap[slopeValue],
      smoking: smokingMap[smoking],
      physical_activity: physicalActivity ? activityMap[physicalActivity] : null,
      family_history: familyHistory === "Yes" ? 1 : 0,
      bmi
    };

    setLoading(true);
    try {
      const res = await postPredict(payload);
      if (token) {
        await savePatientRecord(
          {
            age,
            gender: sex,
            chest_pain_type: chestPainType,
            blood_pressure: Math.round(bloodPressure),
            exercise_angina: exerciseAngina,
            smoking,
            family_history: familyHistory,
            physical_activity: physicalActivity || null,
            bmi,
            max_heart_rate: Math.round(heartRate),
            cholesterol: advancedMode ? Math.round(cholesterol) : null,
            resting_ecg: advancedMode ? restingEcg : null,
            oldpeak: advancedMode ? oldpeak : null,
            slope: advancedMode ? slopeValue : null,
            vessels: advancedMode ? Number(majorVessels) : null,
            thalassemia: advancedMode ? thal : null,
            prediction_result: res.prediction,
            prediction_type: advancedMode ? "Advanced" : "Basic"
          },
          token
        );
      }
      nav("/result", {
        state: {
          prediction: res.prediction,
          probability: res.probability,
          mode: advancedMode ? "Advanced Prediction" : "Basic Prediction"
        }
      });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const detailMsg = Array.isArray(detail)
        ? detail.map((d: any) => d?.msg).filter(Boolean).join(", ")
        : typeof detail === "string"
          ? detail
          : null;
      const msg =
        detailMsg ||
        err?.response?.data?.error ||
        (!err?.response
          ? "Cannot reach the prediction service. From the frontend folder run npm run dev (starts ML on port 8010 and Vite together). Or run npm run ml in a second terminal."
          : "Failed to get prediction.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <PageBackButton fallbackPath="/" />
        <div className="text-sm text-slate-500">Home &gt; Patient Details</div>
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Patient Details</h1>
      <p className="mt-2 max-w-4xl text-slate-600">
        Start with Basic Prediction for a user-friendly flow. Turn on Advanced Prediction only if you know more medical
        values to improve model accuracy.
      </p>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Section 1: Basic Information</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <InfoLabel label="Age" infoKey="age" />
                <input className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" inputMode="numeric" value={ageRaw} onChange={(e) => setAgeRaw(e.target.value)} placeholder="Enter your age" />
              </div>
              <div>
                <InfoLabel label="Gender" infoKey="gender" />
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={sex} onChange={(e) => setSex(e.target.value as SexOption | "")}>
                  <option value="">Select</option><option>Male</option><option>Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Section 2: Symptoms</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <InfoLabel label="Chest Pain Type" infoKey="chestPainType" />
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={chestPainType} onChange={(e) => setChestPainType(e.target.value as ChestPainOption | "")}>
                  <option value="">Select</option><option>Typical Angina</option><option>Atypical Angina</option><option>Non-anginal Pain</option><option>No Chest Pain</option>
                </select>
                {chestPainType ? <p className="mt-1 text-xs text-slate-500">{CHEST_PAIN_HELP[chestPainType]}</p> : null}
              </div>
              <div>
                <InfoLabel label="Blood Pressure (if known)" infoKey="bloodPressure" />
                <input className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" inputMode="numeric" value={bloodPressureRaw} onChange={(e) => setBloodPressureRaw(e.target.value)} placeholder="Approximate value is okay" />
              </div>
              <div>
                <InfoLabel label="Exercise Induced Angina" infoKey="exerciseAngina" />
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={exerciseAngina} onChange={(e) => setExerciseAngina(e.target.value as YesNo | "")}>
                  <option value="">Select</option><option>Yes</option><option>No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Section 3: Lifestyle</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <InfoLabel label="Smoking" infoKey="smoking" />
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={smoking} onChange={(e) => setSmoking(e.target.value as SmokingOption | "")}>
                  <option value="">Select</option><option>No</option><option>Occasionally</option><option>Yes</option>
                </select>
              </div>
              <div>
                <InfoLabel label="Family History of Heart Disease" infoKey="familyHistory" />
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={familyHistory} onChange={(e) => setFamilyHistory(e.target.value as YesNo | "")}>
                  <option value="">Select</option><option>Yes</option><option>No</option>
                </select>
              </div>
              <div>
                <InfoLabel label="Physical Activity (optional)" infoKey="physicalActivity" />
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={physicalActivity} onChange={(e) => setPhysicalActivity(e.target.value as ActivityOption | "")}>
                  <option value="">Not sure</option><option>Low</option><option>Moderate</option><option>High</option>
                </select>
              </div>
              <div>
                <InfoLabel label="BMI (optional)" infoKey="bmi" />
                <input className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" inputMode="decimal" value={bmiRaw} onChange={(e) => setBmiRaw(e.target.value)} placeholder="If known" />
              </div>
              <div>
                <InfoLabel label="Maximum Heart Rate (optional)" infoKey="maxHeartRate" />
                <input className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" inputMode="numeric" value={heartRateRaw} onChange={(e) => setHeartRateRaw(e.target.value)} placeholder="If known" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
            <button
              type="button"
              onClick={() => setAdvancedMode((v) => !v)}
              className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2 text-left font-medium text-blue-800 transition hover:bg-blue-50"
            >
              Improve Accuracy (Add Medical Data) {advancedMode ? "▲" : "▼"}
            </button>
            <AnimatePresence initial={false}>
              {advancedMode ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <InfoLabel label="Cholesterol" infoKey="cholesterol" />
                      <input className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" inputMode="numeric" value={cholesterolRaw} onChange={(e) => setCholesterolRaw(e.target.value)} placeholder="Enter if known" />
                    </div>
                    <div>
                      <InfoLabel label="Resting ECG" infoKey="restingEcg" />
                      <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={restingEcg} onChange={(e) => setRestingEcg(e.target.value as EcgOption | "")}>
                        <option value="">Select</option><option>Normal</option><option>ST-T Abnormality</option><option>Left Ventricular Hypertrophy</option>
                      </select>
                      {restingEcg ? <p className="mt-1 text-xs text-slate-500">{ECG_HELP[restingEcg]}</p> : null}
                    </div>
                    <div>
                      <InfoLabel label="Oldpeak (ST Depression)" infoKey="oldpeak" />
                      <input className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" inputMode="decimal" value={oldpeakRaw} onChange={(e) => setOldpeakRaw(e.target.value)} placeholder="e.g. 1.0" />
                    </div>
                    <div>
                      <InfoLabel label="Slope" infoKey="slope" />
                      <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={slope} onChange={(e) => setSlope(e.target.value as SlopeOption | "")}>
                        <option value="">Select</option><option>Upsloping</option><option>Flat</option><option>Downsloping</option>
                      </select>
                      {slope ? <p className="mt-1 text-xs text-slate-500">{SLOPE_HELP[slope]}</p> : null}
                    </div>
                    <div>
                      <InfoLabel label="Number of Major Vessels" infoKey="vessels" />
                      <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={majorVessels} onChange={(e) => setMajorVessels(e.target.value as "0" | "1" | "2" | "3" | "")}>
                        <option value="">Select</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                      </select>
                    </div>
                    <div>
                      <InfoLabel label="Thalassemia" infoKey="thalassemia" />
                      <select className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={thal} onChange={(e) => setThal(e.target.value as ThalOption | "")}>
                        <option value="">Select</option><option>Normal</option><option>Fixed Defect</option><option>Reversible Defect</option>
                      </select>
                      {thal ? <p className="mt-1 text-xs text-slate-500">{THAL_HELP[thal]}</p> : null}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

          <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer font-medium text-slate-800">Need help understanding all terms?</summary>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              {(Object.keys(FIELD_INFO) as InfoKey[]).map((key) => (
                <div key={key} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="font-semibold text-slate-800">{FIELD_LABELS[key]}</div>
                  <div className="mt-1">{FIELD_INFO[key].simple}</div>
                  <div className="mt-1 text-xs"><span className="font-medium text-slate-700">Why:</span> {FIELD_INFO[key].why}</div>
                </div>
              ))}
            </div>
          </details>

          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:opacity-95 disabled:opacity-60">
            {loading ? "Predicting..." : "Predict Risk"}
          </button>
        </form>
      </section>
    </main>
  );
}

