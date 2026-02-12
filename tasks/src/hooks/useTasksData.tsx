import { useState, useEffect } from "react";
import { fetchTasks } from "../api/tasks";
import { fetchCategories } from "../api/categories";
import { hasConfig } from "../utils/config";
import type { Task, TaskCategory } from "../types";

/**
 * Custom hook for managing tasks and categories data
 */
export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Check configuration on mount
  useEffect(() => {
    checkConfiguration();
  }, []);

  async function checkConfiguration() {
    const configured = await hasConfig();
    setIsConfigured(configured);
    if (configured) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }

  async function loadData() {
    setIsLoading(true);
    const [fetchedCategories, fetchedTasks] = await Promise.all([fetchCategories(), fetchTasks()]);
    setCategories(fetchedCategories);
    setTasks(fetchedTasks);
    setIsLoading(false);
  }

  return {
    tasks,
    setTasks,
    categories,
    isLoading,
    isConfigured,
    loadData,
    checkConfiguration,
  };
}
