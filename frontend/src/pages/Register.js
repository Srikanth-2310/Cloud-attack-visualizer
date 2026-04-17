import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /* Disable scrolling when Register page loads */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/register", {
        username,
        password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <p style={styles.passwordHint}>
            Password must include:
            <br />
            • 8+ characters
            <br />
            • Uppercase & lowercase letters
            <br />
            • At least 1 number
            <br />
            • At least 1 special character (@$!%*?&)
          </p>

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundImage:
      "url('https://orca.security/wp-content/uploads/2026/02/orca-blog-shifting-left-orca-mcp.png?w=750')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  title: {
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },

  passwordHint: {
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "left",
  },

  button: {
    backgroundColor: "#16a34a",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  text: {
    marginTop: "15px",
    fontSize: "14px",
  },

  link: {
    color: "#16a34a",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Register;