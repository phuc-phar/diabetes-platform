import pandas as pd
import numpy as np
from xgboost import XGBClassifier
import joblib
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, accuracy_score
from sklearn.model_selection import train_test_split

df = pd.read_csv("data/diabetes.csv")

cols_with_zero = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]

for col in cols_with_zero:
    df[col] = df[col].replace(0, np.nan)
    df[col] = df[col].fillna(df[col].median())

df["BMI_Age"] = df["BMI"] * df["Age"]
df["Glucose_BMI"] = df["Glucose"] / (df["BMI"] + 1)
df["Risk_Index"] = df["Glucose"] * df["Age"] / 100
df["Insulin_Glucose"] = df["Insulin"] / (df["Glucose"] + 1)


X = df.drop("Outcome", axis=1)
y = df["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
xgb = XGBClassifier(
    n_estimators=600,
    max_depth=3,
    learning_rate=0.03,
    subsample=0.8,
    colsample_bytree=0.8,
    min_child_weight=5,
    gamma=0.1,
    reg_alpha=0.1,
    reg_lambda=1.0,
    eval_metric="logloss"
)

xgb.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=True
)


model = CalibratedClassifierCV(
    xgb,
    method="isotonic",
    cv=3
)

model.fit(X_train, y_train)


y_prob = model.predict_proba(X_test)[:, 1]
y_pred = model.predict(X_test)

print("AUC:", roc_auc_score(y_test, y_prob))
print("Accuracy:", accuracy_score(y_test, y_pred))
joblib.dump(model, "models/diabetes_xgb.pkl")

print("Model saved")