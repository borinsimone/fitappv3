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
      exercises: [
        {
          id: 1,
          name: "Squat",
          sets: 4,
          reps: 8,
          completed: false,
        },
        {
          id: 2,
          name: "Leg Press",
          sets: 3,
          reps: 12,
          completed: false,
        },
        {
          id: 3,
          name: "Military Press",
          sets: 4,
          reps: 10,
          completed: false,
        },
        {
          id: 4,
          name: "Alzate Laterali",
          sets: 3,
          reps: 15,
          completed: false,
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

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: workouts.length + 1,
      date: new Date().toISOString().split("T")[0],
      completed: false,
    };
    setWorkouts([...workouts, newWorkout]);
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
    exerciseId
  ) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) =>
              exercise.id === exerciseId
                ? {
                    ...exercise,
                    completed: !exercise.completed,
                  }
                : exercise
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

  const value = {
    workouts,
    supplements,
    workoutHistory,
    addWorkout,
    completeWorkout,
    toggleExerciseComplete,
    toggleSupplementTaken,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
