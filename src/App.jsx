import React, { useState } from "react";
import { WorkoutProvider } from "./context/WorkoutContext";
import Dashboard from "./components/Dashboard";
import WorkoutTab from "./components/WorkoutTab";
import Navbar from "./components/Navbar";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <WorkoutProvider>
      <div className="app-container">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="main-content">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "workout" && <WorkoutTab />}
        </main>
      </div>
    </WorkoutProvider>
  );
}

export default App;
