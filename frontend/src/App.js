import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
 
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResultView from "./pages/ResultView";
 
function App() {
  return (
<div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
>
<Navbar />
 
      <div
        style={{
          flex: 1,
          backgroundColor: "#f3f4f6",
          overflow: "auto",
        }}
>
<div style={{ padding: "40px", height: "100%" }}>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/history" element={<History />} />
<Route path="/result/:id" element={<ResultView />} />
</Routes>
</div>
</div>
</div>
  );
}
 
export default App;