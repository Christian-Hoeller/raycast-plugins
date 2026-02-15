import { showToast, Toast } from "@raycast/api";
import { getConfig } from "../utils/config";
import type { TaskCategory, CreateCategoryPayload } from "../types";

/**
 * Fetch all task categories from the API
 */
export async function fetchCategories(): Promise<TaskCategory[]> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.CATEGORIES_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data.filter((cat) => cat && cat.category) : [];
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to fetch categories",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

/**
 * Create a new task category
 */
export async function createCategory(payload: CreateCategoryPayload): Promise<TaskCategory | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(config.CATEGORIES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as TaskCategory;

    await showToast({
      style: Toast.Style.Success,
      title: "Category created",
      message: `"${payload.category}" has been created`,
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to create category",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Update an existing task category
 */
export async function updateCategory(
  id: number,
  payload: Partial<CreateCategoryPayload>,
): Promise<TaskCategory | null> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(`${config.CATEGORIES_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as TaskCategory;

    await showToast({
      style: Toast.Style.Success,
      title: "Category updated",
    });

    return data;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to update category",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Delete a task category
 */
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const config = await getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    const response = await fetch(`${config.CATEGORIES_ENDPOINT}/${id}`, {
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
      title: "Category deleted",
    });

    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to delete category",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}
