import os
from typing import Optional, Literal, Dict, Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


# -----------------------------
# Config
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH_ENV = os.getenv("MODEL_PATH", "heart_logreg_pipeline.joblib")


def _resolve_default_data_path() -> str:
    for rel in ("heart.csv", os.path.join("..", "heart.csv")):
        p = os.path.normpath(os.path.join(BASE_DIR, rel))
        if os.path.isfile(p):
            return p
    return os.path.normpath(os.path.join(BASE_DIR, "heart.csv"))


_data_env = os.getenv("DATA_PATH", "").strip()
if _data_env:
    DATA_PATH = _data_env if os.path.isabs(_data_env) else os.path.normpath(os.path.join(BASE_DIR, _data_env))
else:
    DATA_PATH = _resolve_default_data_path()

MODEL_PATH = MODEL_PATH_ENV if os.path.isabs(MODEL_PATH_ENV) else os.path.normpath(os.path.join(BASE_DIR, MODEL_PATH_ENV))
RANDOM_STATE = 42

# UCI heart disease datasets often use: target 1 = disease, 0 = no disease
HIGH_RISK_LABEL = 1

FEATURES = [
    "age",
    "sex",
    "chest_pain_type",
    "blood_pressure",
    "cholesterol",
    "blood_sugar",
    "heart_rate",
    "exercise_angina",
    "oldpeak",
    "slope",
]

CATEGORICAL_FEATURES = ["sex", "chest_pain_type", "blood_sugar", "exercise_angina", "slope"]
NUMERIC_FEATURES = ["age", "blood_pressure", "cholesterol", "heart_rate", "oldpeak"]

pipeline: Optional[Pipeline] = None


# -----------------------------
# Request/Response Models
# -----------------------------
class PredictRequest(BaseModel):
    # Mandatory features
    age: int = Field(..., ge=0, le=120)
    sex: int = Field(..., ge=0, le=1)  # 0/1 convention (dataset-dependent)
    chest_pain_type: int = Field(..., ge=0, le=3)
    blood_pressure: float = Field(..., gt=0, le=300)
    cholesterol: float = Field(..., gt=0, le=1000)
    blood_sugar: int = Field(..., ge=0, le=1)
    heart_rate: float = Field(..., gt=0, le=250)
    exercise_angina: int = Field(..., ge=0, le=1)
    oldpeak: float = Field(..., ge=0, le=10)
    slope: int = Field(..., ge=0, le=2)

    # Optional (accepted but the bundled UCI model may not use them)
    smoking: Optional[Literal[0, 1, 2]] = None
    physical_activity: Optional[Literal[0, 1, 2]] = None
    family_history: Optional[Literal[0, 1]] = None
    bmi: Optional[float] = None


class PredictResponse(BaseModel):
    prediction: str
    probability: float


# -----------------------------
# Training helpers
# -----------------------------
def _resolve_uci_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Resolve common UCI Heart Disease dataset column names to the canonical ones used by FEATURES.
    Canonical mapping:
      - chest_pain_type <- cp
      - blood_pressure  <- trestbps
      - cholesterol      <- chol
      - blood_sugar     <- fbs
      - heart_rate      <- thalach / thalachh
      - exercise_angina <- exang
      - oldpeak          <- oldpeak
      - slope            <- slope
      - sex              <- sex
      - age              <- age
      - target           <- target
    """
    cols = set(df.columns)

    aliases: Dict[str, list[str]] = {
        "age": ["age"],
        "sex": ["sex"],
        "chest_pain_type": ["cp", "chest_pain_type"],
        "blood_pressure": ["trestbps", "blood_pressure", "resting_bp"],
        "cholesterol": ["chol", "cholesterol"],
        "blood_sugar": ["fbs", "blood_sugar", "fasting_bs"],
        "heart_rate": ["thalach", "thalachh", "heart_rate", "max_heart_rate"],
        "exercise_angina": ["exang", "exercise_angina"],
        "oldpeak": ["oldpeak", "st_depression"],
        "slope": ["slope"],
    }

    resolved: Dict[str, str] = {}
    missing = []

    for canonical, candidates in aliases.items():
        picked = None
        for c in candidates:
            if c in cols:
                picked = c
                break
        if picked is None:
            missing.append(canonical)
        else:
            resolved[canonical] = picked

    if "target" not in cols:
        # Some datasets may call it 'diagnosis' or 'heart_disease'
        for alt in ["diagnosis", "heart_disease", "disease", "heart_attack"]:
            if alt in cols:
                df = df.rename(columns={alt: "target"})
                break
        else:
            raise ValueError("Dataset must contain a 'target' column (or known alternatives).")

    out = df.rename(columns={v: k for k, v in resolved.items()})

    # Some real-world files use string labels. Normalize them to numeric codes.
    if "sex" in out.columns:
        out["sex"] = out["sex"].replace(
            {"Male": 1, "Female": 0, "M": 1, "F": 0, "male": 1, "female": 0}
        )
    if "exercise_angina" in out.columns:
        out["exercise_angina"] = out["exercise_angina"].replace(
            {"Y": 1, "N": 0, "Yes": 1, "No": 0, "y": 1, "n": 0}
        )
    if "slope" in out.columns:
        out["slope"] = out["slope"].replace(
            {"Down": 0, "Flat": 1, "Up": 2, "down": 0, "flat": 1, "up": 2}
        )

    # If a required feature is absent in the CSV, add a sensible default.
    # This keeps startup robust for slightly different heart datasets.
    for f in FEATURES:
        if f not in out.columns:
            out[f] = 0

    if missing:
        # Keep a visible warning path in logs while still allowing startup.
        print(f"[ml-service] Warning: missing columns mapped with defaults: {missing}")

    return out


def _build_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, NUMERIC_FEATURES),
            ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
        verbose_feature_names_out=False,
    )


def train_pipeline() -> Pipeline:
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"DATA_PATH CSV not found: {DATA_PATH}")

    raw = pd.read_csv(DATA_PATH)
    df = _resolve_uci_columns(raw)

    # Keep only the canonical ML features + target
    X = df[FEATURES]
    y = pd.to_numeric(df["target"], errors="coerce").fillna(0).astype(int)

    # 80/20 split as required
    X_train, X_test, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    preprocessor = _build_preprocessor()

    model = LogisticRegression(max_iter=1000, random_state=RANDOM_STATE)

    clf = Pipeline(
        steps=[
            ("preprocess", preprocessor),
            ("logreg", model),
        ]
    )

    clf.fit(X_train, y_train)
    return clf


def get_or_train_pipeline() -> Pipeline:
    global pipeline
    if pipeline is not None:
        return pipeline

    if os.path.exists(MODEL_PATH):
        try:
            pipeline = joblib.load(MODEL_PATH)
            return pipeline
        except Exception as e:
            # Pickled models break across scikit-learn upgrades; retrain from CSV.
            print(f"[ml-service] Could not load saved model, will retrain: {e}")

    pipeline = train_pipeline()
    joblib.dump(pipeline, MODEL_PATH)
    return pipeline


# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Cardio Risk ML API", version="1.0.0")


@app.on_event("startup")
def _startup():
    # Fail fast if training data is missing/malformed
    try:
        get_or_train_pipeline()
    except Exception as e:
        raise RuntimeError(f"Failed to load/train ML pipeline: {e}") from e


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    try:
        model = get_or_train_pipeline()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Use only the canonical FEATURES for prediction (optional fields ignored)
    row = pd.DataFrame(
        [
            {
                "age": req.age,
                "sex": req.sex,
                "chest_pain_type": req.chest_pain_type,
                "blood_pressure": req.blood_pressure,
                "cholesterol": req.cholesterol,
                "blood_sugar": req.blood_sugar,
                "heart_rate": req.heart_rate,
                "exercise_angina": req.exercise_angina,
                "oldpeak": req.oldpeak,
                "slope": req.slope,
            }
        ],
        columns=FEATURES,
    )

    proba = float(model.predict_proba(row)[0][HIGH_RISK_LABEL])
    prediction = "High Risk" if proba >= 0.5 else "Low Risk"

    return PredictResponse(prediction=prediction, probability=round(proba, 4))

