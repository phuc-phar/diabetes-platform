import joblib

MODEL_PATH = "models/diabetes_xgb.pkl"

def load_model():
    return joblib.load(MODEL_PATH)