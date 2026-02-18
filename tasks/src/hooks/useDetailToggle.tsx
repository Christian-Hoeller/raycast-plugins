import { useState } from "react";

/**
 * Custom hook for managing detail toggle state
 * Used across different list views (tasks, categories, etc.)
 */
export function useDetailToggle(initialState = false) {
  const [showingDetail, setShowingDetail] = useState<boolean>(initialState);

  const toggleDetail = () => setShowingDetail(!showingDetail);

  return {
    showingDetail,
    setShowingDetail,
    toggleDetail,
  };
}
