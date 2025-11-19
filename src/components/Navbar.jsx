import React from "react";

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <button
        className={
          activeTab === "dashboard" ? "active" : ""
        }
        onClick={() => setActiveTab("dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          />
        </svg>
        <span>Dashboard</span>
      </button>
      <button
        className={activeTab === "workout" ? "active" : ""}
        onClick={() => setActiveTab("workout")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
        <span>Workout</span>
      </button>
    </nav>
  );
}

export default Navbar;
