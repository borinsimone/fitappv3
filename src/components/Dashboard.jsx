import React from "react";
import { useWorkout } from "../context/WorkoutContext";

function Dashboard() {
  const {
    workoutHistory,
    supplements,
    toggleSupplementTaken,
  } = useWorkout();

  const getWeekWorkouts = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return workoutHistory.filter(
      (w) => new Date(w.date) >= oneWeekAgo
    ).length;
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="card">
        <h2>Recap Allenamenti</h2>
        {workoutHistory.length > 0 ? (
          <>
            <p>
              Ultimo allenamento: {workoutHistory[0].date} (
              {workoutHistory[0].name})
            </p>
            <p>
              Totale allenamenti questa settimana:{" "}
              {getWeekWorkouts()}
            </p>
            <div style={{ marginTop: "1rem" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.5rem",
                }}
              >
                Storico Recente:
              </h3>
              <ul>
                {workoutHistory
                  .slice(0, 5)
                  .map((workout) => (
                    <li key={workout.id}>
                      {workout.date} - {workout.name}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Nessun allenamento completato ancora.</p>
        )}
      </div>

      <div className="card">
        <h2>Reminder Integratori</h2>
        <ul>
          {supplements.map((supplement) => (
            <li
              key={supplement.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: supplement.taken
                  ? "line-through"
                  : "none",
                opacity: supplement.taken ? 0.6 : 1,
              }}
              onClick={() =>
                toggleSupplementTaken(supplement.id)
              }
            >
              <span>
                {supplement.name}: {supplement.amount}
              </span>
              <span
                style={{
                  color: supplement.taken
                    ? "#10b981"
                    : "#ef4444",
                }}
              >
                {supplement.taken
                  ? "✓ Preso"
                  : "○ Da prendere"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
