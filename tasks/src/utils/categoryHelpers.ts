import type { Task, TaskCategory } from "../types";

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
