import { showToast, Toast } from "@raycast/api";
import { getConfig } from "../utils/config";
import type { Priority, CreatePriorityPayload } from "../types";

/**
 * Fetch all priorities from the API
 */
export async function fetchPriorities(): Promise<Priority[]> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.GET_ALL_PRIORITIES_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data.filter((priority) => priority && priority.name && priority.level) : [];
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to fetch priorities",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

/**
 * Create a new priority
 */
export async function createPriority(payload: CreatePriorityPayload): Promise<Priority | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.CREATE_PRIORITY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Priority;

    await showToast({
      style: Toast.Style.Success,
      title: "Priority created",
      message: `"${payload.name}" has been created`,
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to create priority",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Delete a priority
 */
export async function deletePriority(id: number): Promise<boolean> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(`${config.DELETE_PRIORITY_ENDPOINT}/${id}`, {
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
      title: "Priority deleted",
    });

    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to delete priority",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}
