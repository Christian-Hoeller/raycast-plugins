import { useState, useMemo } from "react";
import { filterTasks } from "../utils/taskHelpers";
import type { Task } from "../types";

/**
 * Custom hook for managing task filters and providing filtered tasks
 */
export function useTaskFilters(tasks: Task[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [showingDetail, setShowingDetail] = useState<boolean>(false);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, selectedCategory, showArchived, searchText),
    [tasks, selectedCategory, showArchived, searchText],
  );

  return {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    showArchived,
    setShowArchived,
    showingDetail,
    setShowingDetail,
    filteredTasks,
  };
}
