import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <NavLink to="/" style={{ marginRight: "12px" }}>
        Home
      </NavLink>

      {!user && (
        <>
          <NavLink to="/login" style={{ marginRight: "12px" }}>
            Login
          </NavLink>
          <NavLink to="/register" style={{ marginRight: "12px" }}>
            Register
          </NavLink>
        </>
      )}

      {user && (
        <>
          <NavLink to="/dashboard" style={{ marginRight: "12px" }}>
            Dashboard
          </NavLink>
          <NavLink to="/upload" style={{ marginRight: "12px" }}>
            Upload Resume
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default Navigation;
