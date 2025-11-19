import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import WorkoutAssistant from "./WorkoutAssistant";
import CreateWorkoutForm from "./CreateWorkoutForm";

function WorkoutTab() {
  const { getWorkoutByDate } = useWorkout();
  const [isWorkoutActive, setIsWorkoutActive] =
    useState(false);
  const [showCreateForm, setShowCreateForm] =
    useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekStart(new Date())
  );
  const [createWorkoutDate, setCreateWorkoutDate] =
    useState(null);
  const [editingWorkout, setEditingWorkout] =
    useState(null);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to start on Monday
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function formatDayName(date) {
    return date.toLocaleDateString("it-IT", {
      weekday: "short",
    });
  }

  function formatDayNumber(date) {
    return date.getDate();
  }

  function isToday(date) {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  }

  function isSameDay(date1, date2) {
    return formatDate(date1) === formatDate(date2);
  }

  const weekDays = getWeekDays(currentWeekStart);
  const selectedWorkout = getWorkoutByDate(
    formatDate(selectedDate)
  );
  const isSelectedToday = isToday(selectedDate);

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
    setSelectedDate(today);
  };

  const startWorkout = () => {
    if (selectedWorkout && !selectedWorkout.completed) {
      setActiveWorkout(selectedWorkout);
      setIsWorkoutActive(true);
    }
  };

  const createNewWorkout = (date = null) => {
    setCreateWorkoutDate(date || selectedDate);
    setEditingWorkout(null);
    setShowCreateForm(true);
  };

  const editWorkout = (workout) => {
    setEditingWorkout(workout);
    setShowCreateForm(true);
  };

  const handleWorkoutComplete = () => {
    setIsWorkoutActive(false);
    setActiveWorkout(null);
  };

  if (showCreateForm) {
    return (
      <CreateWorkoutForm
        targetDate={createWorkoutDate}
        editWorkout={editingWorkout}
        onClose={() => {
          setShowCreateForm(false);
          setCreateWorkoutDate(null);
          setEditingWorkout(null);
        }}
      />
    );
  }

  return (
    <div className="workout-tab">
      <h1>Workout</h1>

      {!isWorkoutActive ? (
        <div className="workout-overview">
          {/* Week Navigation */}
          <div className="week-navigation">
            <button
              className="week-nav-btn"
              onClick={goToPreviousWeek}
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              className="today-btn"
              onClick={goToToday}
            >
              Oggi
            </button>
            <button
              className="week-nav-btn"
              onClick={goToNextWeek}
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="week-days">
            {weekDays.map((day) => {
              const dayWorkout = getWorkoutByDate(
                formatDate(day)
              );
              const isDayToday = isToday(day);
              const isSelected = isSameDay(
                day,
                selectedDate
              );

              return (
                <div
                  key={formatDate(day)}
                  className={`day-card ${
                    isSelected ? "selected" : ""
                  } ${isDayToday ? "today" : ""} ${
                    dayWorkout ? "has-workout" : ""
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="day-name">
                    {formatDayName(day)}
                  </div>
                  <div className="day-number">
                    {formatDayNumber(day)}
                  </div>
                  {dayWorkout && (
                    <div className="workout-indicator">
                      ●
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Day Workout */}
          <div className="selected-day-workout">
            {selectedWorkout ? (
              <div className="card today-workout">
                <h2>
                  {isSelectedToday
                    ? "Oggi"
                    : formatDate(selectedDate)}
                  : {selectedWorkout.name}
                </h2>
                {selectedWorkout.notes && (
                  <p className="workout-notes">
                    📝 {selectedWorkout.notes}
                  </p>
                )}
                {selectedWorkout.sections ? (
                  selectedWorkout.sections.map(
                    (section) => (
                      <div
                        key={section.id}
                        className="workout-section"
                      >
                        <h3 className="section-title">
                          {section.name}
                        </h3>
                        <div className="exercises-list">
                          {section.exercises.map(
                            (exercise) => (
                              <div
                                key={exercise.id}
                                className="exercise-display"
                              >
                                <h4 className="exercise-display-name">
                                  {exercise.name}
                                </h4>
                                {exercise.notes && (
                                  <p className="exercise-note">
                                    📝 {exercise.notes}
                                  </p>
                                )}
                                <div className="sets-display-table">
                                  <div className="sets-display-header">
                                    <span>Serie</span>
                                    {exercise.type ===
                                    "reps" ? (
                                      <>
                                        <span>Rip.</span>
                                        <span>Kg</span>
                                      </>
                                    ) : (
                                      <span>Sec.</span>
                                    )}
                                    <span>Rec.</span>
                                  </div>
                                  {Array.isArray(
                                    exercise.sets
                                  )
                                    ? exercise.sets.map(
                                        (set, idx) => (
                                          <div
                                            key={set.id}
                                            className="sets-display-row"
                                          >
                                            <span>
                                              {idx + 1}
                                            </span>
                                            {exercise.type ===
                                            "reps" ? (
                                              <>
                                                <span>
                                                  {set.reps}
                                                </span>
                                                <span>
                                                  {
                                                    set.weight
                                                  }
                                                  kg
                                                </span>
                                              </>
                                            ) : (
                                              <span>
                                                {set.time}s
                                              </span>
                                            )}
                                            <span>
                                              {set.rest ||
                                                90}
                                              s
                                            </span>
                                          </div>
                                        )
                                      )
                                    : // Fallback for old format
                                      Array.from({
                                        length:
                                          exercise.sets ||
                                          0,
                                      }).map((_, idx) => (
                                        <div
                                          key={idx}
                                          className="sets-display-row"
                                        >
                                          <span>
                                            {idx + 1}
                                          </span>
                                          {exercise.type ===
                                          "reps" ? (
                                            <>
                                              <span>
                                                {
                                                  exercise.reps
                                                }
                                              </span>
                                              <span>
                                                {
                                                  exercise.weight
                                                }
                                                kg
                                              </span>
                                            </>
                                          ) : (
                                            <span>
                                              {
                                                exercise.time
                                              }
                                              s
                                            </span>
                                          )}
                                          <span>90s</span>
                                        </div>
                                      ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )
                ) : selectedWorkout.exercises ? (
                  <ul>
                    {selectedWorkout.exercises.map(
                      (exercise) => (
                        <li key={exercise.id}>
                          {exercise.name}: {exercise.sets}x
                          {exercise.reps}
                        </li>
                      )
                    )}
                  </ul>
                ) : null}
                {!selectedWorkout.completed && (
                  <div className="actions">
                    <button
                      className="primary-btn"
                      onClick={startWorkout}
                    >
                      Inizia Workout
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() =>
                        editWorkout(selectedWorkout)
                      }
                    >
                      ✏️ Modifica
                    </button>
                  </div>
                )}
                {selectedWorkout.completed && (
                  <div className="completed-badge">
                    ✓ Completato
                  </div>
                )}
              </div>
            ) : (
              <div className="card no-workout">
                <h2>Nessun allenamento</h2>
                <p>
                  {isSelectedToday
                    ? "Non hai programmato un allenamento per oggi."
                    : `Nessun allenamento programmato per il ${formatDate(
                        selectedDate
                      )}.`}
                </p>
                {isSelectedToday && (
                  <button
                    className="primary-btn"
                    onClick={() =>
                      createNewWorkout(selectedDate)
                    }
                  >
                    + Crea Workout per Oggi
                  </button>
                )}
              </div>
            )}
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
