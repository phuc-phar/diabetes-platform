import { useState } from "react";
import axios from "axios";

export default function App() {

  const fields = [
    { name: "Pregnancies", unit: "times" },
    { name: "Glucose", unit: "mg/dL" },
    { name: "BloodPressure", unit: "mmHg" },
    { name: "SkinThickness", unit: "mm" },
    { name: "Insulin", unit: "µU/mL" },
    { name: "BMI", unit: "kg/m²" },
    { name: "DiabetesPedigreeFunction", unit: "score" },
    { name: "Age", unit: "years" }
  ];

  const [form, setForm] = useState({
    Pregnancies: 2,
    Glucose: 120,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 80,
    BMI: 25,
    DiabetesPedigreeFunction: 0.5,
    Age: 30
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value)
    });
  };

  const predict = async () => {
    const res = await axios.post(
      "https://diabetes-platform-2.onrender.com/predict",
      form
    );
    setResult(res.data);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>

      <h1>🧬 Diabetes Risk Predictor</h1>

      {/* INPUT FORM */}
      <div style={{ marginTop: 20 }}>

        {fields.map((f) => (
          <div key={f.name} style={{ marginBottom: 12 }}>

            <label style={{ width: 260, display: "inline-block" }}>
              {f.name}
            </label>

            <input
              type="number"
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              style={{
                padding: 6,
                width: 120
              }}
            />

            <span style={{ marginLeft: 10, color: "gray" }}>
              {f.unit}
            </span>

          </div>
        ))}

      </div>

      <button
        onClick={predict}
        style={{
          marginTop: 20,
          padding: 10,
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 6
        }}
      >
        Predict Risk
      </button>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: 30 }}>

          <h2>Result</h2>

          <p>Risk Probability: {result.risk_probability}</p>
          <p>Risk Level: {result.risk_level}</p>

        </div>
      )}

    </div>
  );
}