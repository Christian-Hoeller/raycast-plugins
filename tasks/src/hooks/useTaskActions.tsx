import { useState, useCallback, useEffect } from "react";
import { confirmAlert, Alert } from "@raycast/api";
import { updateTask, deleteTask } from "../api/tasks";
import { sendToCodingAgent } from "../api/codingAgent";
import type { Task } from "../types";

/**
 * Custom hook for managing task actions (toggle done, archive, delete, descriptions)
 */
export function useTaskActions(tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) {
  const [taskDescriptions, setTaskDescriptions] = useState<Record<number, string>>({});

  // Initialize descriptions from tasks
  useEffect(() => {
    const descriptions: Record<number, string> = {};
    tasks.forEach((task) => {
      if (task.description) {
        descriptions[task.id] = task.description;
      }
    });
    setTaskDescriptions(descriptions);
  }, [tasks]);

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

  const updateTaskDescription = useCallback(
    async (taskId: number, description: string) => {
      console.log("updateTaskDescription called with:", { taskId, description });
      const updated = await updateTask(taskId, { description });
      console.log("updateTask returned:", updated);
      if (updated) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, description } : t)));
        setTaskDescriptions((prev) => ({ ...prev, [taskId]: description }));
      }
    },
    [setTasks],
  );

  const handleSendToCodingAgent = useCallback(async (task: Task) => {
    if (
      await confirmAlert({
        title: "Send to Coding Agent",
        message: `This will send task "${task.task}" to the coding agent. This operation may incur costs. Are you sure you want to continue?`,
        primaryAction: {
          title: "Send to Agent",
          style: Alert.ActionStyle.Default,
        },
        dismissAction: {
          title: "Cancel",
        },
      })
    ) {
      await sendToCodingAgent(task.id);
    }
  }, []);

  return {
    taskDescriptions,
    handleToggleDone,
    handleToggleArchived,
    handleDeleteTask,
    updateTaskDescription,
    handleSendToCodingAgent,
  };
}
