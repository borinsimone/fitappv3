import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";

function CreateWorkoutForm({ onClose }) {
  const { addWorkout } = useWorkout();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { id: 1, name: "", sets: 3, reps: 10 },
  ]);

  const addExercise = () => {
    const newExercise = {
      id: exercises.length + 1,
      name: "",
      sets: 3,
      reps: 10,
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const updateExercise = (id, field, value) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workoutName && exercises.every((ex) => ex.name)) {
      addWorkout({
        name: workoutName,
        exercises: exercises.map((ex) => ({
          ...ex,
          completed: false,
        })),
      });
      onClose();
    } else {
      alert("Compila tutti i campi!");
    }
  };

  return (
    <div className="create-workout-form">
      <div className="card">
        <h2>Crea Nuovo Workout</h2>
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

          <div className="exercises-section">
            <h3>Esercizi</h3>
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="exercise-input-group"
              >
                <div className="exercise-number">
                  {index + 1}
                </div>
                <input
                  type="text"
                  placeholder="Nome esercizio"
                  value={exercise.name}
                  onChange={(e) =>
                    updateExercise(
                      exercise.id,
                      "name",
                      e.target.value
                    )
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Serie"
                  value={exercise.sets}
                  onChange={(e) =>
                    updateExercise(
                      exercise.id,
                      "sets",
                      parseInt(e.target.value)
                    )
                  }
                  min="1"
                  required
                />
                <input
                  type="number"
                  placeholder="Rip."
                  value={exercise.reps}
                  onChange={(e) =>
                    updateExercise(
                      exercise.id,
                      "reps",
                      parseInt(e.target.value)
                    )
                  }
                  min="1"
                  required
                />
                {exercises.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeExercise(exercise.id)
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="secondary-btn"
              onClick={addExercise}
              style={{ marginTop: "1rem" }}
            >
              + Aggiungi Esercizio
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Salva Workout
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
    </div>
  );
}

export default CreateWorkoutForm;
