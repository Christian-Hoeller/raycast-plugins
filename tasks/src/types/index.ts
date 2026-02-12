// API Response Types
export interface TaskCategory {
  id: number;
  category: string;
  description?: string;
}

export interface Task {
  id: number;
  task: string;
  done: boolean;
  archived: boolean;
  due: string; // ISO 8601 date string
  categoryId: number;
  description?: string; // Local only (not synced to API)
}

// Form Payload Types
export interface CreateTaskPayload {
  task: string;
  due: string;
  categoryId: number;
  description?: string;
}

export interface UpdateTaskPayload {
  task?: string;
  done?: boolean;
  archived?: boolean;
  due?: string;
  categoryId?: number;
  description?: string;
}

export interface CreateCategoryPayload {
  category: string;
  description?: string;
}
