import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.heroContainer}>
      {/* Overlay */}
      <div style={styles.overlay}></div>

      {/* Content */}
      <div style={styles.content}>
        <h1 className="fade-card" style={styles.title}>
          Cloud Attack Path Visualizer
        </h1>

        <p style={styles.subtitle}>
          Detect Cloud Attack Paths. Predict Risk. Secure Your Infrastructure.
        </p>

        <div style={styles.buttonContainer}>
          
          <button
            className="button-modern"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>

          <button
            className="button-modern"
            style={{ backgroundColor: "#16a34a" }}
            onClick={() => navigate("/auth")}
          >
            Create Account
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  heroContainer: {
    minHeight: "100vh",
    width: "100%",
    backgroundImage: "url('/images/home.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white"
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(30,58,138,0.8))"
  },

  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "700px",
    padding: "20px"
  },

  title: {
    fontSize: "48px",
    marginBottom: "20px",
    lineHeight: "1.2"
  },

  subtitle: {
    fontSize: "18px",
    marginBottom: "30px"
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap"
  }
};

export default Home;