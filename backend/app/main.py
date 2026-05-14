from fastapi import FastAPI
import numpy as np

from app.schema import PatientInput
from app.utils import load_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Diabetes Risk API")

model = load_model()
def preprocess(patient):
    return np.array([[
        patient.Pregnancies,
        patient.Glucose,
        patient.BloodPressure,
        patient.SkinThickness,
        patient.Insulin,
        patient.BMI,
        patient.DiabetesPedigreeFunction,
        patient.Age,

        # engineered features (QUAN TRỌNG)
        patient.BMI * patient.Age,
        patient.Glucose / (patient.BMI + 1),
        patient.Glucose * patient.Age / 100,
        patient.Insulin / (patient.Glucose + 1)
    ]], dtype=float)

@app.post("/predict")
def predict(patient: PatientInput):

    try:
        data = preprocess(patient)

        prob = model.predict_proba(data)[0][1]
        if prob < 0.3:
            level = "Low risk"
        elif prob < 0.7:
            level = "Medium risk"
        else:
            level = "High risk"

        return {
            "risk_probability": float(prob),
            "risk_level": level
        }

    except Exception as e:
        return {
            "error": str(e)
        }
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)