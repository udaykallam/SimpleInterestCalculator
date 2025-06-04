import React, { useState } from "react";
import "./App.css";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [method, setMethod] = useState("simple");
  const [flatRate, setFlatRate] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const calculate = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    if (isNaN(P) || P <= 0 || T <= 0 || (method !== "flat" && (isNaN(R) || R <= 0))) {
      setError("Please enter valid positive values.");
      return;
    }

    setError("");

    if (method === "simple") {
      const interest = (P * R * T) / 100;
      const total = P + interest;
      setTotalInterest(interest.toFixed(2));
      setTotalAmount(total.toFixed(2));
      setEmi(null);
    } else if (method === "emi") {
      const monthlyRate = R / 12 / 100;
      const n = T * 12;
      const emiCalc = (P * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                      (Math.pow(1 + monthlyRate, n) - 1);
      const total = emiCalc * n;
      const interest = total - P;

      setEmi(emiCalc.toFixed(2));
      setTotalAmount(total.toFixed(2));
      setTotalInterest(interest.toFixed(2));
    } else if (method === "flat") {
      const flat = parseFloat(flatRate);
      if (isNaN(flat) || flat <= 0) {
        setError("Please enter a valid flat rate.");
        return;
      }

      const months = T * 12;
      const interest = (P / 100) * flat * months;
      const total = P + interest;

      setTotalInterest(interest.toFixed(2));
      setTotalAmount(total.toFixed(2));
      setEmi((total / months).toFixed(2));
    }
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setFlatRate("");
    setMethod("simple");
    setEmi(null);
    setTotalAmount(null);
    setTotalInterest(null);
    setError("");
  };

  const exportPDF = () => {
    const input = document.getElementById("results");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("loan-summary.pdf");
    });
  };

  const pieData = [
    { name: "Principal", value: parseFloat(principal || 0) },
    { name: "Interest", value: parseFloat(totalInterest || 0) },
  ];
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <h1>Loan & Interest Calculator</h1>

      <div>
        <label>Dark Mode:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      <div className="input-group">
        <label>Loan Amount (₹):</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
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
          <option value="flat">Flat Rate (₹ per ₹100/month)</option>
        </select>
      </div>

      {method === "flat" && (
        <div className="input-group">
          <label>Flat Rate:</label>
          <input
            type="number"
            value={flatRate}
            onChange={(e) => setFlatRate(e.target.value)}
            placeholder="₹ per ₹100/month"
          />
        </div>
      )}

      {method !== "flat" && (
        <div className="input-group">
          <label>Annual Interest Rate (%):</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button onClick={calculate}>Calculate</button>
        <button onClick={reset}>Reset</button>
      </div>

      {(totalAmount || emi) && (
        <div id="results" className="results">
          <h2>Results</h2>
          {emi && <p><strong>Monthly EMI:</strong> ₹{emi}</p>}
          <p><strong>Total Interest:</strong> ₹{totalInterest}</p>
          <p><strong>Total Repayment:</strong> ₹{totalAmount}</p>

          <div className="chart">
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="export">
            <button onClick={exportPDF}>Export as PDF</button>
            <CSVLink
              data={[
                ["Principal", principal],
                ["Time (years)", time],
                ["Interest Type", method],
                ["Rate", method === "flat" ? flatRate : rate],
                ["Monthly EMI", emi || "N/A"],
                ["Total Interest", totalInterest],
                ["Total Amount", totalAmount],
              ]}
              filename="loan-summary.csv"
              className="btn"
            >
              Export as CSV
            </CSVLink>
          </div>
        </div>
      )}
    </div>
  );
}
