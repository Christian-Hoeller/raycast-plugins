import { useState, useMemo } from "react";
import { filterCategories, sortCategoriesAlphabetically, getCategoryStats } from "../utils/categoryHelpers";
import { useDetailToggle } from "./useDetailToggle";
import type { Task, TaskCategory } from "../types";
import type { CategoryStats } from "../utils/categoryHelpers";

export type CategoryWithStats = TaskCategory & {
  stats: CategoryStats;
};

/**
 * Custom hook for managing category filters and providing filtered categories with stats
 */
export function useCategoryFilters(categories: TaskCategory[], tasks: Task[]) {
  const [searchText, setSearchText] = useState<string>("");
  const { showingDetail, setShowingDetail, toggleDetail } = useDetailToggle();

  const filteredCategories = useMemo(() => {
    const filtered = filterCategories(categories, searchText);
    const sorted = sortCategoriesAlphabetically(filtered);

    // Add task statistics to each category
    return sorted.map((category) => ({
      ...category,
      stats: getCategoryStats(category.id, tasks),
    }));
  }, [categories, tasks, searchText]);

  return {
    searchText,
    setSearchText,
    showingDetail,
    setShowingDetail,
    toggleDetail,
    filteredCategories,
  };
}
