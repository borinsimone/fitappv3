import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";

function WorkoutAssistant({ workout, onComplete }) {
  const { toggleExerciseComplete, completeWorkout } =
    useWorkout();
  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(0);

  const currentExercise =
    workout.exercises[currentExerciseIndex];
  const progress =
    ((currentExerciseIndex + 1) /
      workout.exercises.length) *
    100;

  const handleNextExercise = () => {
    toggleExerciseComplete(workout.id, currentExercise.id);
    if (
      currentExerciseIndex <
      workout.exercises.length - 1
    ) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      completeWorkout(workout.id);
      onComplete();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleCompleteWorkout = () => {
    completeWorkout(workout.id);
    onComplete();
  };

  return (
    <div className="workout-assistant">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="card assistant-card">
        <h2>Assistente Workout</h2>
        <p className="workout-name">{workout.name}</p>

        <div className="exercise-info">
          <h3>
            Esercizio {currentExerciseIndex + 1} di{" "}
            {workout.exercises.length}
          </h3>
          <h1 className="exercise-name">
            {currentExercise.name}
          </h1>
          <div className="exercise-details">
            <div className="detail-item">
              <span className="detail-label">Serie:</span>
              <span className="detail-value">
                {currentExercise.sets}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                Ripetizioni:
              </span>
              <span className="detail-value">
                {currentExercise.reps}
              </span>
            </div>
          </div>
        </div>

        <div className="exercise-list">
          <h4>Tutti gli esercizi:</h4>
          <ul>
            {workout.exercises.map((ex, idx) => (
              <li
                key={ex.id}
                className={
                  idx === currentExerciseIndex
                    ? "current"
                    : ex.completed
                    ? "completed"
                    : ""
                }
              >
                {ex.name} - {ex.sets}x{ex.reps}
                {ex.completed && " ✓"}
              </li>
            ))}
          </ul>
        </div>

        <div className="assistant-actions">
          <button
            className="secondary-btn"
            onClick={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            ← Precedente
          </button>
          {currentExerciseIndex <
          workout.exercises.length - 1 ? (
            <button
              className="primary-btn"
              onClick={handleNextExercise}
            >
              Prossimo →
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={handleNextExercise}
            >
              Completa Workout
            </button>
          )}
        </div>

        <button
          className="danger-btn"
          onClick={handleCompleteWorkout}
        >
          Termina Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutAssistant;
