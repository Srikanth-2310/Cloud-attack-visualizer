import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function History() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history",  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("HISTORY DATA:", res.data);
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history");
      }
    };

    fetchHistory();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setHistory(history.filter(scan => scan.id !== id));
    } catch (error) {
      alert("Failed to delete scan");
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete("http://localhost:5000/history/clear", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setHistory([]);
    } catch (error) {
      alert("Failed to clear history");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Scan History</h2>

      {/* Summary */}
      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <p>Total Scans</p>
          <h2>{history.length}</h2>
        </div>

        {history.length > 0 && (
          <button className="button-danger button-modern" onClick={handleClearAll}>
            Clear All History
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="card fade-card" style={styles.emptyCard}>
          <h3>No Scan History Found</h3>
          <p>Your analyzed results will appear here.</p>
        </div>
      )}

      {/* Scan Cards */}
      {history.map((scan) => (
        <div key={scan.id} className="card fade-card" style={styles.scanCard}>

          {/* Header */}
          <div style={styles.scanHeader}>
            <p><strong>Date:</strong> {scan.created_at}</p>

            <button
              className="button-danger button-modern"
              style={{ padding: "6px 12px" }}
              onClick={() => handleDelete(scan.id)}
            >
              Delete
            </button>
          </div>

          {/* Result */}
          <div style={styles.resultBox}>
            <p><strong>Critical Path:</strong></p>

            {(() => {
              try {
                const result =
                  typeof scan.result === "string"
                    ? JSON.parse(scan.result)
                    : scan.result;

                return result?.critical_path ? (
                  <>
                    <p>
                      {result.critical_path.path.join(" → ")}
                    </p>
                    <p>
                      <strong>Risk:</strong> {result.critical_path.risk}
                    </p>
                  </>
                ) : (
                  <p>No critical path available</p>
                );
              } catch (e) {
                return <p>Invalid data</p>;
              }
            })()}
          </div>
        </div>
      ))}
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

  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },

  summaryCard: {
    backgroundColor: "white",
    padding: "15px 25px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  emptyCard: {
    textAlign: "center",
    padding: "40px"
  },

  scanCard: {
    marginBottom: "20px"
  },

  scanHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },

  resultBox: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "8px"
  }
};

export default History;