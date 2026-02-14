import type { Priority } from "../types";

/**
 * Get the lowest level priority from the list
 * Finds priority with level = 1, or the minimum level available
 */
export function getLowestPriority(priorities: Priority[]): Priority {
  if (priorities.length === 0) {
    return { id: 1, name: "Low", color: "#999999", level: 1 };
  }

  // Try to find priority with level = 1
  const levelOnePriority = priorities.find((p) => p.level === 1);
  if (levelOnePriority) {
    return levelOnePriority;
  }

  // Otherwise, find the priority with the minimum level
  return priorities.reduce((lowest, current) => (current.level < lowest.level ? current : lowest));
}

/**
 * Get priority by ID, fallback to lowest level priority
 */
export function getPriorityById(priorities: Priority[], id: number): Priority {
  const priority = priorities.find((p) => p.id === id);
  return priority || getLowestPriority(priorities);
}

/**
 * Get priority name by ID, fallback to lowest level priority name
 */
export function getPriorityName(priorities: Priority[], id: number): string {
  const priority = getPriorityById(priorities, id);
  return priority.name;
}

/**
 * Get priority color by ID, fallback to lowest level priority color
 */
export function getPriorityColor(priorities: Priority[], id: number): string {
  const priority = getPriorityById(priorities, id);
  return priority.color;
}

/**
 * Sort priorities by level (ascending: 1, 2, 3...)
 */
export function sortPrioritiesByLevel(priorities: Priority[]): Priority[] {
  return [...priorities].sort((a, b) => a.level - b.level);
}
