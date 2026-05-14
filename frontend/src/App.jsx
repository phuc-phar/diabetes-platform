import { useState } from "react";
import axios from "axios";

export default function App() {

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

    try {

      const res = await axios.post(
        "https://diabetes-platform-2.onrender.com",
        form
      );

      setResult(res.data);

    } catch (err) {
      console.error(err);
      alert("API Error");
    }
  };

  return (
    <div style={{
      padding: 30,
      fontFamily: "Arial"
    }}>

      <h1>Diabetes Risk Predictor</h1>

      {Object.keys(form).map((key) => (
        <div key={key} style={{ marginBottom: 10 }}>

          <label>{key}</label>

          <input
            type="number"
            name={key}
            value={form[key]}
            onChange={handleChange}
            style={{
              marginLeft: 10,
              padding: 5
            }}
          />

        </div>
      ))}

      <button
        onClick={predict}
        style={{
          padding: 10,
          marginTop: 20
        }}
      >
        Predict
      </button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>Result</h2>

          <p>
            Risk Probability:
            {" "}
            {result.risk_probability}
          </p>

          <p>
            Risk Level:
            {" "}
            {result.risk_level}
          </p>

        </div>
      )}

    </div>
  );
}
