import React, { useState } from "react";
import axios from "axios";
import GraphView from "./GraphView";
import "../App.css";

function Dashboard() {
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleClear = () => {
    setResult(null);
    setSelectedFile(null);
  };

  if (!token) {
    return <h3 style={{ textAlign: "center" }}>Unauthorized. Please login.</h3>;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const text = await file.text();
    const jsonData = JSON.parse(text);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(response.data);
    } catch (error) {
      alert("Analysis failed. Check authentication.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cloud Attack Path Analyzer</h2>

      {/* Upload Section */}
      <div className="upload-box">
        <label>
          📂 Click to Upload JSON File
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>

        {selectedFile && (
          <p className="file-name">Selected: {selectedFile.name}</p>
        )}
      </div>

      {result && (
        <>
          {/* Summary Cards */}
          <div style={styles.summaryContainer}>
            <div style={styles.summaryCard}>
              <p>Total Paths</p>
              <h2>{result.attack_paths.length}</h2>
            </div>

            <div style={{ ...styles.summaryCard, backgroundColor: "#fee2e2" }}>
              <p>Critical Risk</p>
              <h2 style={{ color: "#dc2626" }}>
                {result.critical_path?.risk}
              </h2>
            </div>

            <div style={styles.summaryCard}>
              <p>Total Nodes</p>
              <h2>
                {new Set(result.attack_paths.flatMap(p => p.path)).size}
              </h2>
            </div>
          </div>

          {/* Critical Path */}
          {result.critical_path && (
            <div className="card fade-card" style={styles.criticalCard}>
              <h3>🔥 Critical Attack Path</h3>
              <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                {result.critical_path.path.join(" → ")}
              </p>
              <p style={{ color: "#dc2626", fontWeight: "bold" }}>
                Risk Score: {result.critical_path.risk}
              </p>
            </div>
          )}

          {/* All Attack Paths */}
          <div style={styles.pathsContainer}>
            <h3>All Attack Paths</h3>

            {result.attack_paths.map((p, index) => {
              let riskLevel = "Low";
              let color = "#16a34a";

              if (p.risk > 70) {
                riskLevel = "High";
                color = "#dc2626";
              } else if (p.risk > 40) {
                riskLevel = "Medium";
                color = "#f59e0b";
              }

              return (
                <div key={index} style={styles.pathCard}>
                  <p>{p.path.join(" → ")}</p>
                  <p style={{ color }}>
                    Risk: {p.risk} ({riskLevel})
                  </p>
                </div>
              );
            })}
          </div>

          {/* Graph Section */}
          <div className="card fade-card" style={styles.graphCard}>
            <h3>Network Visualization</h3>
            <GraphView data={result} />
          </div>

          {/* Clear Button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="button-danger button-modern" onClick={handleClear}>
              Clear Results
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: "#f3f4f6"
  },

  title: {
    marginBottom: "25px",
    fontWeight: "bold"
  },

  summaryContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px"
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  criticalCard: {
    borderLeft: "5px solid #dc2626",
    marginBottom: "25px"
  },

  pathsContainer: {
    marginBottom: "30px"
  },

  pathCard: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  graphCard: {
    marginTop: "20px"
  }
};

export default Dashboard;