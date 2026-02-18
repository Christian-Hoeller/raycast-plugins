import type { Task, TaskCategory } from "../types";

export type CategoryStats = {
  total: number;
  active: number;
  done: number;
  archived: number;
};

/**
 * Generate a consistent color based on category name hash
 */
export function getCategoryColor(category: string | null | undefined): string {
  // Generate a consistent color based on category name hash
  const safeCategoryName = category || "Unknown";
  let hash = 0;
  for (let i = 0; i < safeCategoryName.length; i++) {
    hash = safeCategoryName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = ["#FF6B6B", "#4ECDC4", "#95E1D3", "#F38181", "#AA96DA", "#FCBAD3", "#FFFFD2", "#A8D8EA"];
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get category name by ID from categories array
 */
export function getCategoryName(task: Task, categories: TaskCategory[]): string {
  const category = categories.find((cat) => cat.id === task.categoryId);
  return category?.category || "Unknown";
}

/**
 * Check if a category has valid repository information
 */
export function hasValidRepository(category: TaskCategory | undefined): boolean {
  return Boolean(
    category &&
    category.repositoryUrl &&
    category.repositoryUrl.trim() !== "" &&
    category.branchName &&
    category.branchName.trim() !== "",
  );
}

/**
 * Get task statistics for a specific category
 */
export function getCategoryStats(categoryId: number, tasks: Task[]): CategoryStats {
  const categoryTasks = tasks.filter((task) => task.categoryId === categoryId);

  return {
    total: categoryTasks.length,
    active: categoryTasks.filter((task) => !task.done && !task.archived).length,
    done: categoryTasks.filter((task) => task.done).length,
    archived: categoryTasks.filter((task) => task.archived).length,
  };
}

/**
 * Filter categories by search text
 */
export function filterCategories(categories: TaskCategory[], searchText: string): TaskCategory[] {
  if (!searchText.trim()) {
    return categories;
  }

  const searchLower = searchText.toLowerCase();
  return categories.filter(
    (category) =>
      category.category.toLowerCase().includes(searchLower) ||
      category.description?.toLowerCase().includes(searchLower),
  );
}

/**
 * Sort categories alphabetically by name
 */
export function sortCategoriesAlphabetically(categories: TaskCategory[]): TaskCategory[] {
  return [...categories].sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Generate markdown for category detail view
 */
export function generateCategoryMarkdown(category: TaskCategory, stats: CategoryStats): string {
  const description = category.description || "_No description provided_";

  return `
# ${category.category}

${description}

## Task Statistics
- **Total Tasks:** ${stats.total}
- **Active Tasks:** ${stats.active}
- **Completed Tasks:** ${stats.done}
- **Archived Tasks:** ${stats.archived}
${
  category.repositoryUrl
    ? `
## Repository Information
- **URL:** [${category.repositoryUrl}](${category.repositoryUrl})
- **Branch:** ${category.branchName || "Not specified"}`
    : ""
}`.trim();
}
