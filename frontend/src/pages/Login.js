import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="login-card-animate">
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <div style={{ position: "relative", width: "100%" }}>
            
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...styles.input,
                paddingRight: "40px",
              }}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {errorMessage && (
            <p style={styles.error}>{errorMessage}</p>
          )}

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e3a8a, #111827)",
    overflowX: "hidden",
    overflowY: "hidden"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
  },

  title: {
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box"
  },

  button: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
  },

  error: {
    color: "red",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
