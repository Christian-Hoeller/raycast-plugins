import { useState, useMemo } from "react";
import { filterTasks, sortTasks, type SortMode } from "../utils/taskHelpers";
import type { Task, Priority } from "../types";

/**
 * Custom hook for managing task filters and providing filtered tasks
 */
export function useTaskFilters(tasks: Task[], priorities: Priority[], sortMode: SortMode = "createdAt") {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [showDueToday, setShowDueToday] = useState<boolean>(false);

  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(tasks, selectedCategory, showArchived, searchText, showDueToday);
    return sortTasks(filtered, priorities, sortMode);
  }, [tasks, priorities, sortMode, selectedCategory, showArchived, searchText, showDueToday]);

  return {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    showArchived,
    setShowArchived,
    showDueToday,
    setShowDueToday,
    filteredTasks,
  };
}
