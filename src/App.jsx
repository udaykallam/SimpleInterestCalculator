import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [method, setMethod] = useState("simple");
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R <= 0 || T <= 0) {
      setError("Please enter positive values for all fields.");
      return;
    }

    setError("");

    if (method === "simple") {
      const interest = (P * R * T) / 100;
      const total = P + interest;
      setTotalInterest(interest.toFixed(2));
      setTotalAmount(total.toFixed(2));
      setEmi(null);
    } else {
      // EMI Calculation
      const monthlyRate = R / 12 / 100;
      const n = T * 12; // total months
      const emiCalc = (P * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                      (Math.pow(1 + monthlyRate, n) - 1);
      const total = emiCalc * n;
      const interest = total - P;

      setEmi(emiCalc.toFixed(2));
      setTotalAmount(total.toFixed(2));
      setTotalInterest(interest.toFixed(2));
    }
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setMethod("simple");
    setEmi(null);
    setTotalAmount(null);
    setTotalInterest(null);
    setError("");
  };

  return (
    <div className="container">
      <h1>Loan & Interest Calculator</h1>

      <div className="input-group">
        <label>Loan Amount (₹):</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Annual Interest Rate (%):</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Loan Period (years):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Interest Type:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="simple">Simple Interest</option>
          <option value="emi">EMI Based</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button onClick={calculate}>Calculate</button>
        <button className="reset" onClick={reset}>Reset</button>
      </div>

      {(emi || totalAmount) && (
        <div className="result">
          {emi && <p><strong>Monthly EMI:</strong> ₹{emi}</p>}
          <p><strong>Total Interest:</strong> ₹{totalInterest}</p>
          <p><strong>Total Repayment:</strong> ₹{totalAmount}</p>
        </div>
      )}
    </div>
  );
}
