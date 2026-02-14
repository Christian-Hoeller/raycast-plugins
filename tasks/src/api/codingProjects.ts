import { showToast, Toast } from "@raycast/api";
import { getConfig } from "../utils/config";
import type { CodingProject, CreateCodingProjectPayload, UpdateCodingProjectPayload } from "../types";

/**
 * Fetch all coding projects from the API
 */
export async function fetchCodingProjects(): Promise<CodingProject[]> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.GET_ALL_CODING_PROJECTS_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data.filter((project) => project && project.name) : [];
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to fetch coding projects",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

/**
 * Create a new coding project
 */
export async function createCodingProject(payload: CreateCodingProjectPayload): Promise<CodingProject | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.CREATE_CODING_PROJECT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as CodingProject;

    await showToast({
      style: Toast.Style.Success,
      title: "Coding project created",
      message: `"${payload.name}" has been created`,
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to create coding project",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Update an existing coding project
 */
export async function updateCodingProject(
  id: number,
  payload: UpdateCodingProjectPayload,
): Promise<CodingProject | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    console.log("updateCodingProject called with:", { id, payload });

    const response = await fetch(`${config.UPDATE_CODING_PROJECT_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as CodingProject;

    await showToast({
      style: Toast.Style.Success,
      title: "Coding project updated",
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to update coding project",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Delete a coding project
 */
export async function deleteCodingProject(id: number): Promise<boolean> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(`${config.DELETE_CODING_PROJECT_ENDPOINT}/${id}`, {
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
      title: "Coding project deleted",
    });

    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to delete coding project",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}
