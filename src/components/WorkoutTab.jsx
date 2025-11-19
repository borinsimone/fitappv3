import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import WorkoutAssistant from "./WorkoutAssistant";
import CreateWorkoutForm from "./CreateWorkoutForm";

function WorkoutTab() {
  const { workouts } = useWorkout();
  const [isWorkoutActive, setIsWorkoutActive] =
    useState(false);
  const [showCreateForm, setShowCreateForm] =
    useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);

  const todayWorkout = workouts.find(
    (w) =>
      w.date === new Date().toISOString().split("T")[0] &&
      !w.completed
  );

  const startWorkout = () => {
    if (todayWorkout) {
      setActiveWorkout(todayWorkout);
      setIsWorkoutActive(true);
    }
  };

  const createNewWorkout = () => {
    setShowCreateForm(true);
  };

  const handleWorkoutComplete = () => {
    setIsWorkoutActive(false);
    setActiveWorkout(null);
  };

  if (showCreateForm) {
    return (
      <CreateWorkoutForm
        onClose={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="workout-tab">
      <h1>Workout</h1>

      {!isWorkoutActive ? (
        <div className="workout-overview">
          {todayWorkout ? (
            <div className="card today-workout">
              <h2>Workout di Oggi: {todayWorkout.name}</h2>
              <ul>
                {todayWorkout.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    {exercise.name}: {exercise.sets}x
                    {exercise.reps}
                  </li>
                ))}
              </ul>
              <div className="actions">
                <button
                  className="primary-btn"
                  onClick={startWorkout}
                >
                  Inizia Workout
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <h2>Nessun workout programmato per oggi</h2>
              <p>Crea un nuovo workout per iniziare!</p>
            </div>
          )}

          <div className="create-workout-section">
            <button
              className="secondary-btn"
              onClick={createNewWorkout}
            >
              + Crea Nuovo Workout
            </button>
          </div>
        </div>
      ) : (
        <WorkoutAssistant
          workout={activeWorkout}
          onComplete={handleWorkoutComplete}
        />
      )}
    </div>
  );
}

export default WorkoutTab;
