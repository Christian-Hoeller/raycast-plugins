import { useState, useEffect } from "react";
import { fetchTasks } from "../api/tasks";
import { fetchCategories } from "../api/categories";
import { fetchPriorities } from "../api/priorities";
import { hasConfig } from "../utils/config";
import type { Task, TaskCategory, Priority } from "../types";

/**
 * Custom hook for managing tasks and categories data
 */
export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
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
    const [fetchedCategories, fetchedPriorities, fetchedTasks] = await Promise.all([
      fetchCategories(),
      fetchPriorities(),
      fetchTasks(),
    ]);
    setCategories(fetchedCategories);
    setPriorities(fetchedPriorities);
    setTasks(fetchedTasks);
    setIsLoading(false);
  }

  return {
    tasks,
    setTasks,
    categories,
    priorities,
    isLoading,
    isConfigured,
    loadData,
    checkConfiguration,
  };
}
