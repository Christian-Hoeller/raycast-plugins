// API Response Types
export type TaskCategory = {
  id: number;
  category: string;
  description?: string;
};

export type Priority = {
  id: number;
  color: string; // Hex color from backend (e.g., "#00FF00")
  level: number; // 1 = lowest priority, higher = more urgent
  name: string; // Display name (e.g., "Low", "Medium", "High")
};

export type Task = {
  id: number;
  task: string;
  done: boolean;
  archived: boolean;
  due: string; // ISO 8601 date string
  categoryId: number;
  priorityId: number; // Required priority field
  description?: string; // Local only (not synced to API)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
};

// Form Payload Types
export type CreateTaskPayload = {
  task: string;
  due: string;
  categoryId: number;
  priorityId: number; // Required when creating
  description?: string;
};

export type UpdateTaskPayload = {
  task?: string;
  done?: boolean;
  archived?: boolean;
  due?: string;
  categoryId?: number;
  priorityId?: number; // Optional when updating
  description?: string;
};

export type CreateCategoryPayload = {
  category: string;
  description?: string;
};

export type CreatePriorityPayload = {
  name: string;
  color: string;
  level: number;
};

// Coding Projects
export type CodingProject = {
  id: number;
  name: string;
  repositoryUrl: string;
  branchName: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
};

export type CreateCodingProjectPayload = {
  name: string;
  repositoryUrl: string;
  branchName: string;
};

export type UpdateCodingProjectPayload = {
  name?: string;
  repositoryUrl?: string;
  branchName?: string;
};
