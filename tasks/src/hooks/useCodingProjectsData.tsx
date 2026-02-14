import { useState, useEffect } from "react";
import { fetchCodingProjects } from "../api/codingProjects";
import type { CodingProject } from "../types";

/**
 * Custom hook for managing coding projects data
 */
export function useCodingProjectsData() {
  const [projects, setProjects] = useState<CodingProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function loadData() {
    setIsLoading(true);
    const fetchedProjects = await fetchCodingProjects();
    setProjects(fetchedProjects);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return { projects, isLoading, loadData };
}
