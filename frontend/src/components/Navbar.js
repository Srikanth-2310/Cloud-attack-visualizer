import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    // Listen for storage changes
    window.addEventListener("storage", checkToken);

    // Also check when route changes
    checkToken();

    return () => window.removeEventListener("storage", checkToken);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div style={{
      backgroundColor: "#111827",
      color: "white",
      padding: "15px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Cloud Attack Path Visualizer
      </h2>

      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>

        {token && (
          <>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link to="/history" style={{ color: "white", textDecoration: "none" }}>
              History
            </Link>
          </>
        )}

        {!token && (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}

        {token && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;