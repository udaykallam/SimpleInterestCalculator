import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [interest, setInterest] = useState(null);
  const [error, setError] = useState("");

  const calculateInterest = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      setError("Please enter valid positive numbers in all fields.");
      setInterest(null);
      return;
    }

    const simpleInterest = (p * r * t) / 100;
    setInterest(simpleInterest.toFixed(2));
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setInterest(null);
    setError("");
  };

  return (
    <div className="container">
      <h1>Simple Interest Calculator</h1>

      <div className="input-group">
        <label>Principal Amount:</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="Enter principal"
        />
      </div>

      <div className="input-group">
        <label>Rate of Interest (% per annum):</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="Enter rate"
        />
      </div>

      <div className="input-group">
        <label>Time (years):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter time"
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button onClick={calculateInterest}>Calculate</button>
        <button onClick={reset} className="reset">
          Reset
        </button>
      </div>

      {interest !== null && (
        <div className="result">
          <h2>Simple Interest: ₹{interest}</h2>
        </div>
      )}
    </div>
  );
}
