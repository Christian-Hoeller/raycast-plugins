import { useState, useEffect } from "react";
import { fetchTasks } from "../api/tasks";
import { fetchCategories } from "../api/categories";
import { fetchPriorities } from "../api/priorities";
import { fetchCodingProjects } from "../api/codingProjects";
import { hasConfig } from "../utils/config";
import type { Task, TaskCategory, Priority, CodingProject } from "../types";

/**
 * Custom hook for managing tasks and categories data
 */
export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [codingProjects, setCodingProjects] = useState<CodingProject[]>([]);
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
    const [fetchedCategories, fetchedPriorities, fetchedTasks, fetchedCodingProjects] = await Promise.all([
      fetchCategories(),
      fetchPriorities(),
      fetchTasks(),
      fetchCodingProjects(),
    ]);
    setCategories(fetchedCategories);
    setPriorities(fetchedPriorities);
    setTasks(fetchedTasks);
    setCodingProjects(fetchedCodingProjects);
    setIsLoading(false);
  }

  return {
    tasks,
    setTasks,
    categories,
    priorities,
    codingProjects,
    isLoading,
    isConfigured,
    loadData,
    checkConfiguration,
  };
}
