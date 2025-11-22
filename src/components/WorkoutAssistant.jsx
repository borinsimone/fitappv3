import React, { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";

function WorkoutAssistant({
  workout: initialWorkout,
  onComplete,
}) {
  const {
    workouts,
    toggleExerciseComplete,
    completeWorkout,
    updateSet,
  } = useWorkout();

  // Get the latest version of the workout from context to ensure updates are reflected
  const workout =
    workouts.find((w) => w.id === initialWorkout.id) ||
    initialWorkout;

  const [currentExerciseIndex, setCurrentExerciseIndex] =
    useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] =
    useState(0);
  const [initialRestTime, setInitialRestTime] = useState(0);
  const [isExercising, setIsExercising] = useState(false);
  const [exerciseTimeRemaining, setExerciseTimeRemaining] =
    useState(0);
  const [initialExerciseTime, setInitialExerciseTime] =
    useState(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const [
    preparationTimeRemaining,
    setPreparationTimeRemaining,
  ] = useState(0);

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

  useEffect(() => {
    let interval;
    if (isResting && restTimeRemaining > 0) {
      interval = setInterval(() => {
        setRestTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restTimeRemaining === 0) {
      playAlarmSound();
      // Optional: Auto-advance or wait for user?
      // For now, we'll let the user click "Start Next Set"
    } else if (
      isPreparing &&
      preparationTimeRemaining > 0
    ) {
      interval = setInterval(() => {
        setPreparationTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (
      isPreparing &&
      preparationTimeRemaining === 0
    ) {
      playShortBeep();
      setIsPreparing(false);
      setIsExercising(true);
    } else if (isExercising && exerciseTimeRemaining > 0) {
      interval = setInterval(() => {
        setExerciseTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (
      isExercising &&
      exerciseTimeRemaining === 0
    ) {
      playAlarmSound();
      setIsExercising(false);
    }
    return () => clearInterval(interval);
  }, [
    isResting,
    restTimeRemaining,
    isPreparing,
    preparationTimeRemaining,
    isExercising,
    exerciseTimeRemaining,
  ]);

  const playAlarmSound = () => {
    const audioCtx = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      880,
      audioCtx.currentTime
    ); // A5
    oscillator.frequency.exponentialRampToValueAtTime(
      440,
      audioCtx.currentTime + 0.5
    );

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.5
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  const playShortBeep = () => {
    const audioCtx = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      600,
      audioCtx.currentTime
    );
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.2
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
    advanceToNextSet();
  };

  const addRestTime = (seconds) => {
    setRestTimeRemaining((prev) => prev + seconds);
    setInitialRestTime((prev) => prev + seconds);
  };

  const startExerciseTimer = (duration) => {
    setExerciseTimeRemaining(duration);
    setInitialExerciseTime(duration);
    setPreparationTimeRemaining(5);
    setIsPreparing(true);
  };

  const stopExerciseTimer = () => {
    setIsExercising(false);
    setIsPreparing(false);
    setExerciseTimeRemaining(0);
    setPreparationTimeRemaining(0);
  };

  const addExerciseTime = (seconds) => {
    setExerciseTimeRemaining((prev) => prev + seconds);
    setInitialExerciseTime((prev) => prev + seconds);
  };

  const handleSetUpdate = (field, value) => {
    // Pass the value as is to allow for decimal points and empty states during typing
    // We can convert to number when saving or processing if needed
    updateSet(
      workout.id,
      currentExercise.sectionId,
      currentExercise.id,
      currentSet.id,
      { [field]: value }
    );
  };

  const advanceToNextSet = () => {
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
    // Check if we should rest
    // Don't rest if it's the very last set of the workout
    const isLastSetOfWorkout =
      currentExerciseIndex === allExercises.length - 1 &&
      currentSetIndex === exerciseSets.length - 1;

    if (!isLastSetOfWorkout && !isResting) {
      const restTime = currentSet.rest || 90;
      if (restTime > 0) {
        setRestTimeRemaining(restTime);
        setInitialRestTime(restTime);
        setIsResting(true);
        return;
      }
    }

    advanceToNextSet();
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

  const handleJumpToExercise = (index) => {
    setCurrentExerciseIndex(index);
    setCurrentSetIndex(0);
    setIsResting(false);
    setRestTimeRemaining(0);
    setIsExercising(false);
    setExerciseTimeRemaining(0);
  };

  // Timer Circle Calculations
  const isTimerActive =
    isResting || isExercising || isPreparing;
  const activeTimerTime = isResting
    ? restTimeRemaining
    : isPreparing
    ? preparationTimeRemaining
    : exerciseTimeRemaining;
  const activeTimerInitial = isResting
    ? initialRestTime
    : isPreparing
    ? 5
    : initialExerciseTime;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference -
    (activeTimerTime / activeTimerInitial) * circumference;

  return (
    <div className="workout-assistant">
      {isTimerActive && (
        <div className="timer-overlay">
          <div className="timer-content">
            <h3>
              {isResting
                ? "Recupero"
                : isPreparing
                ? "Pronti..."
                : "Lavoro"}
            </h3>
            <div className="timer-circle-container">
              <svg
                className="timer-svg"
                width="300"
                height="300"
                viewBox="0 0 300 300"
              >
                <circle
                  className="timer-circle-bg"
                  cx="150"
                  cy="150"
                  r={radius}
                />
                <circle
                  className={`timer-circle-progress ${
                    isExercising || isPreparing
                      ? "exercise-mode"
                      : ""
                  }`}
                  cx="150"
                  cy="150"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="timer-display">
                {Math.floor(activeTimerTime / 60)}:
                {(activeTimerTime % 60)
                  .toString()
                  .padStart(2, "0")}
              </div>
            </div>

            <div className="timer-controls">
              <button
                className="secondary-btn"
                onClick={() =>
                  isResting
                    ? addRestTime(30)
                    : addExerciseTime(30)
                }
              >
                +30s
              </button>
              <button
                className="primary-btn"
                onClick={
                  isResting ? skipRest : stopExerciseTimer
                }
              >
                {activeTimerTime === 0
                  ? isResting
                    ? "Inizia Serie"
                    : "Fatto"
                  : isResting
                  ? "Salta Recupero"
                  : "Termina"}
              </button>
            </div>
          </div>
        </div>
      )}

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

          <div className="active-exercise-table-container">
            <div className="active-exercise-header-row">
              <div className="col-set">Set</div>
              <div className="col-data">
                {currentExercise.type === "reps"
                  ? "Reps"
                  : "Time"}
              </div>
              {currentExercise.type === "reps" && (
                <div className="col-data">Kg</div>
              )}
              <div className="col-data">Rest</div>
              <div className="col-action">Stato</div>
            </div>

            {exerciseSets.map((set, idx) => {
              const isCurrent = idx === currentSetIndex;
              const isCompleted = idx < currentSetIndex;
              const isLastSet =
                currentExerciseIndex ===
                  allExercises.length - 1 &&
                idx === exerciseSets.length - 1;

              return (
                <div
                  key={set.id}
                  className={`active-exercise-row ${
                    isCurrent ? "current" : ""
                  } ${isCompleted ? "completed" : ""}`}
                >
                  <div className="col-set">#{idx + 1}</div>

                  {/* Reps or Time Column */}
                  <div className="col-data">
                    {isCurrent ? (
                      <input
                        type="number"
                        className="table-input"
                        value={
                          currentExercise.type === "reps"
                            ? set.reps
                            : set.time
                        }
                        onChange={(e) =>
                          handleSetUpdate(
                            currentExercise.type === "reps"
                              ? "reps"
                              : "time",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <span>
                        {currentExercise.type === "reps"
                          ? set.reps
                          : set.time + "s"}
                      </span>
                    )}
                  </div>

                  {/* Weight Column (only for reps) */}
                  {currentExercise.type === "reps" && (
                    <div className="col-data">
                      {isCurrent ? (
                        <input
                          type="number"
                          className="table-input"
                          value={set.weight}
                          onChange={(e) =>
                            handleSetUpdate(
                              "weight",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <span>{set.weight}</span>
                      )}
                    </div>
                  )}

                  {/* Rest Column */}
                  <div className="col-data">
                    {isCurrent ? (
                      <input
                        type="number"
                        className="table-input"
                        value={
                          set.rest !== undefined
                            ? set.rest
                            : 90
                        }
                        onChange={(e) =>
                          handleSetUpdate(
                            "rest",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <span>{set.rest || 90}s</span>
                    )}
                  </div>

                  {/* Action Column */}
                  <div className="col-action">
                    {isCurrent ? (
                      <div className="action-buttons-container">
                        {currentExercise.type ===
                          "time" && (
                          <button
                            className="secondary-btn table-action-btn small-gap"
                            onClick={() =>
                              startExerciseTimer(set.time)
                            }
                          >
                            Vai
                          </button>
                        )}
                        <button
                          className="primary-btn table-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextSet();
                          }}
                        >
                          {isLastSet ? "Fine" : "Fatto"}
                        </button>
                      </div>
                    ) : isCompleted ? (
                      <span className="check-mark">✓</span>
                    ) : (
                      <span className="pending-dot">•</span>
                    )}
                  </div>
                </div>
              );
            })}
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
                  onClick={() => handleJumpToExercise(idx)}
                  className={`exercise-list-item ${
                    idx === currentExerciseIndex
                      ? "current"
                      : ex.completed
                      ? "completed"
                      : ""
                  }`}
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
