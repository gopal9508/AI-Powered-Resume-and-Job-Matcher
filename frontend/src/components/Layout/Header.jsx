import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <h2 style={{ margin: 0 }}>
        Resume Matcher
      </h2>

      {user && (
        <p style={{ margin: 0, fontSize: "14px", color: "gray" }}>
          Logged in
        </p>
      )}
    </header>
  );
};

export default Header;
