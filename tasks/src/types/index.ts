// API Response Types
export type TaskCategory = {
  id: number;
  category: string;
  description?: string;
};

export type Task = {
  id: number;
  task: string;
  done: boolean;
  archived: boolean;
  due: string; // ISO 8601 date string
  categoryId: number;
  description?: string; // Local only (not synced to API)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
};

// Form Payload Types
export type CreateTaskPayload = {
  task: string;
  due: string;
  categoryId: number;
  description?: string;
};

export type UpdateTaskPayload = {
  task?: string;
  done?: boolean;
  archived?: boolean;
  due?: string;
  categoryId?: number;
  description?: string;
};

export type CreateCategoryPayload = {
  category: string;
  description?: string;
};
