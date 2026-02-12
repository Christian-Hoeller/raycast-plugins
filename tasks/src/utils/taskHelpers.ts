import { formatRelativeDate, isOverdue } from "./formatters";
import type { Task } from "../types";

/**
 * Generate markdown for task detail view
 */
export function generateTaskMarkdown(task: Task, categoryName: string, description?: string): string {
  const overdue = !task.done && isOverdue(task.due);
  return `
# ${task.task}

${description || "_No description provided_"}`.trim();
}

/**
 * Filter tasks based on category, archived status, and search text
 */
export function filterTasks(
  tasks: Task[],
  selectedCategory: string,
  showArchived: boolean,
  searchText: string,
): Task[] {
  return tasks.filter((task) => {
    // Filter by archived status
    if (!showArchived && task.archived) {
      return false;
    }

    // Filter by category
    const matchesCategory = selectedCategory === "All" || task.categoryId.toString() === selectedCategory;

    // Filter by search text
    const matchesSearch = task.task.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}

/**
 * Sort tasks: done tasks at bottom, then by createdAt date (newest first)
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Done tasks go to the bottom
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }

    // Sort by createdAt (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
