import { formatRelativeDate, isOverdue } from "./formatters";
import type { Task } from "../types";

/**
 * Generate markdown for task detail view
 */
export function generateTaskMarkdown(task: Task, categoryName: string, description?: string): string {
  const overdue = !task.done && isOverdue(task.due);
  return `
# ${task.task}

${description || "_No description provided_"}

---

**Category:** ${categoryName}  
**Status:** ${task.done ? "✅ Done" : "⏳ Pending"}  
**Archived:** ${task.archived ? "📦 Yes" : "No"}  
**Due Date:** ${formatRelativeDate(task.due)}${overdue ? " ⚠️ **Overdue**" : ""}
  `.trim();
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
