import React, {
  createContext,
  useState,
  useContext,
} from "react";

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "useWorkout must be used within a WorkoutProvider"
    );
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: "Gambe e Spalle",
      date: new Date().toISOString().split("T")[0],
      notes: "Allenamento completo lower body e spalle",
      sections: [
        {
          id: 1,
          name: "Gambe",
          exercises: [
            {
              id: 1,
              name: "Squat",
              type: "reps",
              notes: "Mantenere la schiena dritta",
              sets: [
                {
                  id: 1,
                  reps: 8,
                  weight: 80,
                  rest: 120,
                  completed: false,
                },
                {
                  id: 2,
                  reps: 8,
                  weight: 82.5,
                  rest: 120,
                  completed: false,
                },
                {
                  id: 3,
                  reps: 8,
                  weight: 85,
                  rest: 120,
                  completed: false,
                },
                {
                  id: 4,
                  reps: 6,
                  weight: 90,
                  rest: 180,
                  completed: false,
                },
              ],
              completed: false,
            },
            {
              id: 2,
              name: "Leg Press",
              type: "reps",
              notes: "",
              sets: [
                {
                  id: 1,
                  reps: 12,
                  weight: 120,
                  rest: 90,
                  completed: false,
                },
                {
                  id: 2,
                  reps: 12,
                  weight: 120,
                  rest: 90,
                  completed: false,
                },
                {
                  id: 3,
                  reps: 10,
                  weight: 130,
                  rest: 120,
                  completed: false,
                },
              ],
              completed: false,
            },
          ],
        },
        {
          id: 2,
          name: "Spalle",
          exercises: [
            {
              id: 3,
              name: "Military Press",
              type: "reps",
              notes: "",
              sets: [
                {
                  id: 1,
                  reps: 10,
                  weight: 40,
                  rest: 90,
                  completed: false,
                },
                {
                  id: 2,
                  reps: 10,
                  weight: 40,
                  rest: 90,
                  completed: false,
                },
                {
                  id: 3,
                  reps: 8,
                  weight: 45,
                  rest: 90,
                  completed: false,
                },
                {
                  id: 4,
                  reps: 8,
                  weight: 45,
                  rest: 120,
                  completed: false,
                },
              ],
              completed: false,
            },
            {
              id: 4,
              name: "Plank",
              type: "time",
              notes: "Tenuta isometrica",
              sets: [
                {
                  id: 1,
                  time: 60,
                  rest: 60,
                  completed: false,
                },
                {
                  id: 2,
                  time: 60,
                  rest: 60,
                  completed: false,
                },
                {
                  id: 3,
                  time: 45,
                  rest: 60,
                  completed: false,
                },
              ],
              completed: false,
            },
          ],
        },
      ],
      completed: false,
    },
  ]);

  const [supplements, setSupplements] = useState([
    { id: 1, name: "Creatina", amount: "5g", taken: false },
    { id: 2, name: "Proteine", amount: "30g", taken: true },
    {
      id: 3,
      name: "Multivitaminico",
      amount: "1 compressa",
      taken: false,
    },
  ]);

  const [workoutHistory, setWorkoutHistory] = useState([
    {
      id: 1,
      name: "Petto e Tricipiti",
      date: new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0],
      completed: true,
    },
    {
      id: 2,
      name: "Dorso e Bicipiti",
      date: new Date(Date.now() - 172800000)
        .toISOString()
        .split("T")[0],
      completed: true,
    },
    {
      id: 3,
      name: "Gambe",
      date: new Date(Date.now() - 259200000)
        .toISOString()
        .split("T")[0],
      completed: true,
    },
  ]);

  const addWorkout = (workout, targetDate = null) => {
    const newWorkout = {
      ...workout,
      id: workouts.length + 1,
      date:
        targetDate ||
        new Date().toISOString().split("T")[0],
      completed: false,
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const getWorkoutByDate = (date) => {
    return (
      workouts.find(
        (w) => w.date === date && !w.completed
      ) || workoutHistory.find((w) => w.date === date)
    );
  };

  const completeWorkout = (workoutId) => {
    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId ? { ...w, completed: true } : w
      )
    );
    const completedWorkout = workouts.find(
      (w) => w.id === workoutId
    );
    if (completedWorkout) {
      setWorkoutHistory([
        completedWorkout,
        ...workoutHistory,
      ]);
    }
  };

  const toggleExerciseComplete = (
    workoutId,
    sectionId,
    exerciseId
  ) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            sections: workout.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    exercises: section.exercises.map(
                      (exercise) =>
                        exercise.id === exerciseId
                          ? {
                              ...exercise,
                              completed:
                                !exercise.completed,
                            }
                          : exercise
                    ),
                  }
                : section
            ),
          };
        }
        return workout;
      })
    );
  };

  const toggleSupplementTaken = (supplementId) => {
    setSupplements(
      supplements.map((s) =>
        s.id === supplementId
          ? { ...s, taken: !s.taken }
          : s
      )
    );
  };

  const updateWorkout = (workoutId, updatedWorkout) => {
    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId
          ? { ...w, ...updatedWorkout, id: workoutId }
          : w
      )
    );
  };

  const updateSet = (
    workoutId,
    sectionId,
    exerciseId,
    setId,
    updates
  ) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id !== workoutId) return workout;

        if (workout.sections) {
          return {
            ...workout,
            sections: workout.sections.map((section) => {
              if (sectionId && section.id !== sectionId)
                return section;

              return {
                ...section,
                exercises: section.exercises.map(
                  (exercise) => {
                    if (exercise.id !== exerciseId)
                      return exercise;

                    return {
                      ...exercise,
                      sets: exercise.sets.map((set) =>
                        set.id === setId
                          ? { ...set, ...updates }
                          : set
                      ),
                    };
                  }
                ),
              };
            }),
          };
        } else {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) => {
              if (exercise.id !== exerciseId)
                return exercise;

              return {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id === setId
                    ? { ...set, ...updates }
                    : set
                ),
              };
            }),
          };
        }
      })
    );
  };

  const value = {
    workouts,
    supplements,
    workoutHistory,
    addWorkout,
    completeWorkout,
    toggleExerciseComplete,
    toggleSupplementTaken,
    getWorkoutByDate,
    updateWorkout,
    updateSet,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
