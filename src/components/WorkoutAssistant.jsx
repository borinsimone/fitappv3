import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";

function WorkoutAssistant({ workout, onComplete }) {
  const { toggleExerciseComplete, completeWorkout } =
    useWorkout();
  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  // Flatten all exercises with section info
  const allExercises = workout.sections
    ? workout.sections.flatMap((section) =>
        section.exercises.map((ex) => ({
          ...ex,
          sectionId: section.id,
          sectionName: section.name,
        }))
      )
    : workout.exercises || [];

  const currentExercise =
    allExercises[currentExerciseIndex];
  const exerciseSets = Array.isArray(currentExercise.sets)
    ? currentExercise.sets
    : [];
  const currentSet = exerciseSets[currentSetIndex];

  // Calculate total sets across all exercises
  const totalSets = allExercises.reduce(
    (sum, ex) =>
      sum +
      (Array.isArray(ex.sets)
        ? ex.sets.length
        : ex.sets || 0),
    0
  );
  const completedSets =
    allExercises
      .slice(0, currentExerciseIndex)
      .reduce(
        (sum, ex) =>
          sum +
          (Array.isArray(ex.sets)
            ? ex.sets.length
            : ex.sets || 0),
        0
      ) + currentSetIndex;

  const progress =
    totalSets > 0
      ? ((completedSets + 1) / totalSets) * 100
      : 0;

  const handleNextSet = () => {
    // Move to next set or next exercise
    if (currentSetIndex < exerciseSets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (
      currentExerciseIndex <
      allExercises.length - 1
    ) {
      // Mark current exercise as complete and move to next exercise
      if (workout.sections) {
        toggleExerciseComplete(
          workout.id,
          currentExercise.sectionId,
          currentExercise.id
        );
      }
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // Workout complete
      completeWorkout(workout.id);
      onComplete();
    }
  };

  const handlePreviousSet = () => {
    // Move to previous set or previous exercise
    if (currentSetIndex > 0) {
      setCurrentSetIndex(currentSetIndex - 1);
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      const prevExercise =
        allExercises[currentExerciseIndex - 1];
      const prevSets = Array.isArray(prevExercise.sets)
        ? prevExercise.sets
        : [];
      setCurrentSetIndex(Math.max(0, prevSets.length - 1));
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
          {currentExercise.sectionName && (
            <p className="section-badge">
              {currentExercise.sectionName}
            </p>
          )}
          <h3>
            Esercizio {currentExerciseIndex + 1} di{" "}
            {allExercises.length}
          </h3>
          <h1 className="exercise-name">
            {currentExercise.name}
          </h1>
          {currentExercise.notes && (
            <p className="exercise-notes-assistant">
              📝 {currentExercise.notes}
            </p>
          )}

          <div className="set-info-large">
            <p className="set-number-label">
              Serie {currentSetIndex + 1} di{" "}
              {exerciseSets.length}
            </p>
          </div>

          {currentSet && (
            <div className="exercise-details">
              {currentExercise.type === "reps" ? (
                <>
                  <div className="detail-item">
                    <span className="detail-label">
                      Ripetizioni:
                    </span>
                    <span className="detail-value">
                      {currentSet.reps}
                    </span>
                  </div>
                  {currentSet.weight > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">
                        Peso:
                      </span>
                      <span className="detail-value">
                        {currentSet.weight} kg
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="detail-item">
                  <span className="detail-label">
                    Tempo:
                  </span>
                  <span className="detail-value">
                    {currentSet.time} sec
                  </span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">
                  Recupero:
                </span>
                <span className="detail-value">
                  {currentSet.rest || 90}s
                </span>
              </div>
            </div>
          )}

          {/* Show all sets for current exercise */}
          <div className="current-exercise-sets">
            <h4>Tutte le serie di questo esercizio:</h4>
            <div className="sets-preview">
              {exerciseSets.map((set, idx) => (
                <div
                  key={set.id}
                  className={`set-preview-item ${
                    idx === currentSetIndex ? "active" : ""
                  } ${
                    idx < currentSetIndex ? "completed" : ""
                  }`}
                >
                  <span className="set-preview-number">
                    #{idx + 1}
                  </span>
                  {currentExercise.type === "reps" ? (
                    <span className="set-preview-details">
                      {set.reps} rip × {set.weight}kg •{" "}
                      {set.rest || 90}s rec
                    </span>
                  ) : (
                    <span className="set-preview-details">
                      {set.time}s • {set.rest || 90}s rec
                    </span>
                  )}
                  {idx < currentSetIndex && (
                    <span className="check-mark">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="exercise-list">
          <h4>Tutti gli esercizi:</h4>
          <ul>
            {allExercises.map((ex, idx) => {
              const exSets = Array.isArray(ex.sets)
                ? ex.sets
                : [];
              return (
                <li
                  key={`${ex.sectionId}-${ex.id}`}
                  className={
                    idx === currentExerciseIndex
                      ? "current"
                      : ex.completed
                      ? "completed"
                      : ""
                  }
                >
                  {ex.sectionName && (
                    <span className="section-tag">
                      [{ex.sectionName}]{" "}
                    </span>
                  )}
                  {ex.name} - {exSets.length} serie
                  {ex.completed && " ✓"}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="assistant-actions">
          <button
            className="secondary-btn"
            onClick={handlePreviousSet}
            disabled={
              currentExerciseIndex === 0 &&
              currentSetIndex === 0
            }
          >
            ← Precedente
          </button>
          {currentExerciseIndex < allExercises.length - 1 ||
          currentSetIndex < exerciseSets.length - 1 ? (
            <button
              className="primary-btn"
              onClick={handleNextSet}
            >
              Prossima Serie →
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={handleNextSet}
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
