import type { CodingProject } from "../types";

/**
 * Sort coding projects by creation date (newest first)
 */
export function sortProjectsByDate(projects: CodingProject[]): CodingProject[] {
  return [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Filter coding projects by branch name (case-insensitive)
 */
export function filterProjectsByBranch(projects: CodingProject[], branchName: string): CodingProject[] {
  const lowerBranch = branchName.toLowerCase();
  return projects.filter((project) => project.branchName.toLowerCase().includes(lowerBranch));
}

/**
 * Validate that a project name is unique (case-insensitive)
 * @param name - The name to validate
 * @param projects - Array of existing projects
 * @param excludeId - Optional ID to exclude from validation (for updates)
 * @returns true if name is unique, false otherwise
 */
export function validateUniqueName(name: string, projects: CodingProject[], excludeId?: number): boolean {
  const lowerName = name.toLowerCase().trim();
  return !projects.some((project) => project.name.toLowerCase().trim() === lowerName && project.id !== excludeId);
}

/**
 * Get display text for a coding project (combines name and branch)
 */
export function getProjectDisplayText(project: CodingProject): string {
  return `${project.name} (${project.branchName})`;
}
