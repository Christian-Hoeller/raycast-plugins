import { useState, useCallback } from "react";
import { updateTask, deleteTask } from "../api/tasks";
import type { Task } from "../types";

/**
 * Custom hook for managing task actions (toggle done, archive, delete, descriptions)
 */
export function useTaskActions(setTasks: React.Dispatch<React.SetStateAction<Task[]>>) {
  const [taskDescriptions, setTaskDescriptions] = useState<Record<number, string>>({});

  const handleToggleDone = useCallback(
    async (task: Task) => {
      const updated = await updateTask(task.id, { done: !task.done });
      if (updated) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
      }
    },
    [setTasks],
  );

  const handleToggleArchived = useCallback(
    async (task: Task) => {
      const updated = await updateTask(task.id, { archived: !task.archived });
      if (updated) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, archived: !t.archived } : t)));
      }
    },
    [setTasks],
  );

  const handleDeleteTask = useCallback(
    async (task: Task) => {
      const success = await deleteTask(task.id);
      if (success) {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
      }
    },
    [setTasks],
  );

  const updateTaskDescription = useCallback((taskId: number, description: string) => {
    setTaskDescriptions((prev) => ({ ...prev, [taskId]: description }));
  }, []);

  return {
    taskDescriptions,
    handleToggleDone,
    handleToggleArchived,
    handleDeleteTask,
    updateTaskDescription,
  };
}
