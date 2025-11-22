import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { exerciseDatabase } from "../data/exercises";

function CreateWorkoutForm({
  onClose,
  targetDate,
  editWorkout,
}) {
  const { addWorkout, updateWorkout } = useWorkout();
  const [workoutName, setWorkoutName] = useState(
    editWorkout?.name || ""
  );
  const [workoutNotes, setWorkoutNotes] = useState(
    editWorkout?.notes || ""
  );
  const [sections, setSections] = useState(
    editWorkout?.sections || [
      {
        id: 1,
        name: "",
        exercises: [
          {
            id: 1,
            name: "",
            type: "reps",
            sets: [
              {
                id: 1,
                reps: 10,
                weight: 0,
                rest: 90,
                completed: false,
              },
              {
                id: 2,
                reps: 10,
                weight: 0,
                rest: 90,
                completed: false,
              },
              {
                id: 3,
                reps: 10,
                weight: 0,
                rest: 90,
                completed: false,
              },
            ],
            notes: "",
          },
        ],
      },
    ]
  );

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      name: "",
      exercises: [
        {
          id: 1,
          name: "",
          type: "reps",
          sets: [
            {
              id: 1,
              reps: 10,
              weight: 0,
              rest: 90,
              completed: false,
            },
            {
              id: 2,
              reps: 10,
              weight: 0,
              rest: 90,
              completed: false,
            },
            {
              id: 3,
              reps: 10,
              weight: 0,
              rest: 90,
              completed: false,
            },
          ],
          notes: "",
        },
      ],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId) => {
    if (sections.length > 1) {
      setSections(
        sections.filter((s) => s.id !== sectionId)
      );
    }
  };

  const updateSection = (sectionId, field, value) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    );
  };

  const addExercise = (sectionId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const newExercise = {
            id: section.exercises.length + 1,
            name: "",
            type: "reps",
            sets: [
              {
                id: 1,
                reps: 10,
                weight: 0,
                rest: 90,
                completed: false,
              },
              {
                id: 2,
                reps: 10,
                weight: 0,
                rest: 90,
                completed: false,
              },
              {
                id: 3,
                reps: 10,
                weight: 0,
                rest: 90,
                completed: false,
              },
            ],
            notes: "",
          };
          return {
            ...section,
            exercises: [...section.exercises, newExercise],
          };
        }
        return section;
      })
    );
  };

  const removeExercise = (sectionId, exerciseId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            exercises: section.exercises.filter(
              (ex) => ex.id !== exerciseId
            ),
          };
        }
        return section;
      })
    );
  };

  const updateExercise = (
    sectionId,
    exerciseId,
    field,
    value
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            exercises: section.exercises.map((ex) => {
              if (ex.id === exerciseId) {
                const updatedEx = { ...ex, [field]: value };

                // Auto-detect type if name changes
                if (field === "name") {
                  const foundExercise =
                    exerciseDatabase.find(
                      (dbEx) => dbEx.name === value
                    );
                  if (foundExercise) {
                    updatedEx.type = foundExercise.type;
                  }
                }

                return updatedEx;
              }
              return ex;
            }),
          };
        }
        return section;
      })
    );
  };

  const addSet = (sectionId, exerciseId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            exercises: section.exercises.map((ex) => {
              if (ex.id === exerciseId) {
                const newSetId = ex.sets.length + 1;
                const newSet =
                  ex.type === "reps"
                    ? {
                        id: newSetId,
                        reps: 10,
                        weight: 0,
                        rest: 90,
                        completed: false,
                      }
                    : {
                        id: newSetId,
                        time: 60,
                        rest: 90,
                        completed: false,
                      };
                return {
                  ...ex,
                  sets: [...ex.sets, newSet],
                };
              }
              return ex;
            }),
          };
        }
        return section;
      })
    );
  };

  const removeSet = (sectionId, exerciseId, setId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            exercises: section.exercises.map((ex) => {
              if (
                ex.id === exerciseId &&
                ex.sets.length > 1
              ) {
                return {
                  ...ex,
                  sets: ex.sets.filter(
                    (s) => s.id !== setId
                  ),
                };
              }
              return ex;
            }),
          };
        }
        return section;
      })
    );
  };

  const updateSet = (
    sectionId,
    exerciseId,
    setId,
    field,
    value
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            exercises: section.exercises.map((ex) => {
              if (ex.id === exerciseId) {
                return {
                  ...ex,
                  sets: ex.sets.map((s) =>
                    s.id === setId
                      ? { ...s, [field]: value }
                      : s
                  ),
                };
              }
              return ex;
            }),
          };
        }
        return section;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allExercisesValid = sections.every(
      (section) =>
        section.name &&
        section.exercises.every((ex) => ex.name)
    );

    if (workoutName && allExercisesValid) {
      const workoutData = {
        name: workoutName,
        notes: workoutNotes,
        sections: sections.map((section) => ({
          ...section,
          exercises: section.exercises.map((ex) => ({
            ...ex,
            completed: ex.completed || false,
          })),
        })),
      };

      if (editWorkout) {
        // Update existing workout
        updateWorkout(editWorkout.id, workoutData);
      } else {
        // Create new workout
        const workoutDate = targetDate
          ? targetDate.toISOString().split("T")[0]
          : null;
        addWorkout(workoutData, workoutDate);
      }
      onClose();
    } else {
      alert(
        "Compila tutti i campi obbligatori (nome workout, nome sezioni e nome esercizi)!"
      );
    }
  };

  return (
    <div className="create-workout-form">
      <div className="card">
        <h2>
          {editWorkout
            ? "Modifica Workout"
            : "Crea Nuovo Workout"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Workout:</label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) =>
                setWorkoutName(e.target.value)
              }
              placeholder="Es: Petto e Tricipiti"
              required
            />
          </div>

          <div className="form-group">
            <label>Note Generali (opzionale):</label>
            <textarea
              value={workoutNotes}
              onChange={(e) =>
                setWorkoutNotes(e.target.value)
              }
              placeholder="Note generali sull'allenamento..."
              rows="3"
            />
          </div>

          <div className="sections-container">
            <h3>Sezioni</h3>
            {sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="section-block"
              >
                <div className="section-header">
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) =>
                      updateSection(
                        section.id,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Nome sezione (es: Petto, Gambe)"
                    className="section-name-input"
                    required
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeSection(section.id)
                      }
                    >
                      ✕ Rimuovi Sezione
                    </button>
                  )}
                </div>

                <div className="exercises-section">
                  <h4>Esercizi</h4>
                  {section.exercises.map(
                    (exercise, exIndex) => (
                      <div
                        key={exercise.id}
                        className="exercise-block"
                      >
                        <div className="exercise-header">
                          <div className="exercise-number">
                            {exIndex + 1}
                          </div>
                          <input
                            type="text"
                            placeholder="Nome esercizio"
                            value={exercise.name}
                            onChange={(e) =>
                              updateExercise(
                                section.id,
                                exercise.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="exercise-name-input"
                            list="exercise-suggestions"
                            required
                          />
                          <select
                            value={exercise.type}
                            onChange={(e) =>
                              updateExercise(
                                section.id,
                                exercise.id,
                                "type",
                                e.target.value
                              )
                            }
                            className="type-select"
                          >
                            <option value="reps">
                              Rip.
                            </option>
                            <option value="time">
                              Tempo
                            </option>
                          </select>
                          {section.exercises.length > 1 && (
                            <button
                              type="button"
                              className="remove-btn small"
                              onClick={() =>
                                removeExercise(
                                  section.id,
                                  exercise.id
                                )
                              }
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="sets-table">
                          <div className="sets-table-header">
                            <span>Serie</span>
                            {exercise.type === "reps" ? (
                              <>
                                <span>Rip.</span>
                                <span>Kg</span>
                              </>
                            ) : (
                              <span>Sec.</span>
                            )}
                            <span>Rec.</span>
                            <span></span>
                          </div>
                          {exercise.sets.map(
                            (set, setIndex) => (
                              <div
                                key={set.id}
                                className="sets-table-row"
                              >
                                <span className="set-number">
                                  {setIndex + 1}
                                </span>
                                {exercise.type ===
                                "reps" ? (
                                  <>
                                    <input
                                      type="number"
                                      value={set.reps}
                                      onChange={(e) =>
                                        updateSet(
                                          section.id,
                                          exercise.id,
                                          set.id,
                                          "reps",
                                          parseInt(
                                            e.target.value
                                          )
                                        )
                                      }
                                      min="1"
                                      className="set-input"
                                      required
                                    />
                                    <input
                                      type="number"
                                      value={set.weight}
                                      onChange={(e) =>
                                        updateSet(
                                          section.id,
                                          exercise.id,
                                          set.id,
                                          "weight",
                                          parseFloat(
                                            e.target.value
                                          )
                                        )
                                      }
                                      min="0"
                                      step="0.5"
                                      className="set-input"
                                    />
                                  </>
                                ) : (
                                  <input
                                    type="number"
                                    value={set.time}
                                    onChange={(e) =>
                                      updateSet(
                                        section.id,
                                        exercise.id,
                                        set.id,
                                        "time",
                                        parseInt(
                                          e.target.value
                                        )
                                      )
                                    }
                                    min="1"
                                    className="set-input"
                                    required
                                  />
                                )}
                                <input
                                  type="number"
                                  value={set.rest || 90}
                                  onChange={(e) =>
                                    updateSet(
                                      section.id,
                                      exercise.id,
                                      set.id,
                                      "rest",
                                      parseInt(
                                        e.target.value
                                      )
                                    )
                                  }
                                  min="0"
                                  className="set-input"
                                  placeholder="90"
                                />
                                {exercise.sets.length >
                                  1 && (
                                  <button
                                    type="button"
                                    className="remove-set-btn"
                                    onClick={() =>
                                      removeSet(
                                        section.id,
                                        exercise.id,
                                        set.id
                                      )
                                    }
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            className="add-set-btn"
                            onClick={() =>
                              addSet(
                                section.id,
                                exercise.id
                              )
                            }
                          >
                            + Aggiungi Serie
                          </button>
                        </div>

                        <div className="exercise-notes">
                          <input
                            type="text"
                            placeholder="Note per questo esercizio (opzionale)"
                            value={exercise.notes}
                            onChange={(e) =>
                              updateExercise(
                                section.id,
                                exercise.id,
                                "notes",
                                e.target.value
                              )
                            }
                            className="notes-input"
                          />
                        </div>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="secondary-btn small-btn"
                    onClick={() => addExercise(section.id)}
                  >
                    + Aggiungi Esercizio
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="primary-btn"
              onClick={addSection}
              style={{ marginTop: "1rem" }}
            >
              + Aggiungi Sezione
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editWorkout
                ? "Aggiorna Workout"
                : "Salva Workout"}
            </button>
            <button
              type="button"
              className="danger-btn"
              onClick={onClose}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>

      <datalist id="exercise-suggestions">
        {exerciseDatabase.map((ex, idx) => (
          <option key={idx} value={ex.name}>
            {ex.category}
          </option>
        ))}
      </datalist>
    </div>
  );
}

export default CreateWorkoutForm;
