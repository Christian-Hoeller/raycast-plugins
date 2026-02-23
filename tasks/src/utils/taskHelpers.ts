import { isToday, parseISO } from "date-fns";
import type { Task, Priority } from "../types";

export type SortMode = "priority" | "createdAt";

/**
 * Generate markdown for task detail view
 */
export function generateTaskMarkdown(task: Task, categoryName: string, description?: string): string {
  return `
# ${task.task}

${description || "_No description provided_"}`.trim();
}

/**
 * Filter tasks based on category, archived status, search text, and due date
 */
export function filterTasks(
  tasks: Task[],
  selectedCategory: string,
  showArchived: boolean,
  searchText: string,
  showDueToday: boolean = false,
): Task[] {
  return tasks.filter((task) => {
    // Filter by archived status
    if (!showArchived && task.archived) {
      return false;
    }

    // Filter by due today
    if (showDueToday && task.due) {
      const taskDueDate = parseISO(task.due);
      if (!isToday(taskDueDate)) {
        return false;
      }
    }

    // Filter by category
    const matchesCategory = selectedCategory === "All" || task.categoryId.toString() === selectedCategory;

    // Filter by search text
    const matchesSearch = task.task.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}

/**
 * Sort tasks: done tasks at bottom, then by priority or createdAt based on sortMode
 */
export function sortTasks(tasks: Task[], priorities: Priority[], sortMode: SortMode = "createdAt"): Task[] {
  return [...tasks].sort((a, b) => {
    // Done tasks go to the bottom
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }

    if (sortMode === "priority") {
      // Priority mode: Higher level = higher priority (sort descending by level)
      const aPriority = priorities.find((p) => p.id === a.priorityId);
      const bPriority = priorities.find((p) => p.id === b.priorityId);
      const aLevel = aPriority?.level || 0;
      const bLevel = bPriority?.level || 0;

      if (aLevel !== bLevel) {
        return bLevel - aLevel; // Higher level first
      }

      // If same priority, fall back to createdAt
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Creation date mode (current behavior)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}

/**
 * Get count of non-done, non-archived tasks for a specific category
 */
export function getTaskCountByCategory(tasks: Task[], categoryId: number | string): number {
  return tasks.filter((task) => {
    const isActive = !task.done && !task.archived;
    const matchesCategory = categoryId === "All" || task.categoryId.toString() === categoryId.toString();
    return isActive && matchesCategory;
  }).length;
}
