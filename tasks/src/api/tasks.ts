import { showToast, Toast } from "@raycast/api";
import { getConfig } from "../utils/config";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types";

/**
 * Fetch all tasks from the API
 */
export async function fetchTasks(): Promise<Task[]> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.GET_ALL_TASKS_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data.filter((task) => task && task.task) : [];
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to fetch tasks",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

/**
 * Create a new task
 */
export async function createTask(payload: CreateTaskPayload): Promise<Task | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.CREATE_TASK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Task;

    await showToast({
      style: Toast.Style.Success,
      title: "Task created",
      message: `"${payload.task}" has been created`,
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to create task",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Update an existing task
 */
export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    console.log("updateTask called with:", { id, payload });

    const response = await fetch(`${config.UPDATE_TASK_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Task;

    await showToast({
      style: Toast.Style.Success,
      title: "Task updated",
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to update task",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<boolean> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(`${config.DELETE_TASK_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await showToast({
      style: Toast.Style.Success,
      title: "Task deleted",
    });

    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to delete task",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}
