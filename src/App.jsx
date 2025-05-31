import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [interest, setInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [history, setHistory] = useState([]);
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      setError("Please enter valid positive numbers.");
      setInterest(null);
      setTotalAmount(null);
      return;
    }

    const si = (p * r * t) / 100;
    setInterest(si.toFixed(2));
    setTotalAmount((p + si).toFixed(2));
    setHistory([
      ...history,
      { principal: p, rate: r, time: t, interest: si.toFixed(2) },
    ]);
  };

  useEffect(() => {
    if (autoCalculate) calculate();
  }, [principal, rate, time]);

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setInterest(null);
    setTotalAmount(null);
    setError("");
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="container">
      <h1>Simple Interest Calculator</h1>

      <div className="input-group">
        <label>Principal:</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="e.g., 5000"
        />
      </div>

      <div className="input-group">
        <label>Rate (% per annum):</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="e.g., 7.5"
        />
      </div>

      <div className="input-group">
        <label>Time (in years):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 2"
        />
      </div>

      <div className="toggle">
        <input
          type="checkbox"
          checked={autoCalculate}
          onChange={() => setAutoCalculate(!autoCalculate)}
        />
        <label>Auto-calculate</label>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button onClick={calculate}>Calculate</button>
        <button className="reset" onClick={reset}>Reset</button>
      </div>

      {interest && (
        <div className="result">
          <p><strong>Interest:</strong> ₹{interest}</p>
          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h3>History</h3>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>
                ₹{item.principal} at {item.rate}% for {item.time} year(s) → ₹{item.interest}
              </li>
            ))}
          </ul>
          <button className="clear-history" onClick={clearHistory}>Clear History</button>
        </div>
      )}
    </div>
  );
}
