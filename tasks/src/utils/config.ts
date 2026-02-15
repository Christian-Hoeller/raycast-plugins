import { LocalStorage } from "@raycast/api";

export type Config = {
  GET_ALL_TASKS_ENDPOINT: string;
  CREATE_TASK_ENDPOINT: string;
  UPDATE_TASK_ENDPOINT: string;
  DELETE_TASK_ENDPOINT: string;
  GET_TASK_CATEGORIES_ENDPOINT: string;
  CREATE_TASK_CATEGORY_ENDPOINT: string;
  DELETE_TASK_CATEGORIES_ENDPOINT: string;
  GET_ALL_PRIORITIES_ENDPOINT: string;
  CREATE_PRIORITY_ENDPOINT: string;
  DELETE_PRIORITY_ENDPOINT: string;
};

const CONFIG_KEY = "endpoint_config";

/**
 * Check if configuration exists in LocalStorage
 */
export async function hasConfig(): Promise<boolean> {
  const config = await LocalStorage.getItem<string>(CONFIG_KEY);
  return !!config;
}

/**
 * Get configuration from LocalStorage
 */
export async function getConfig(): Promise<Config | null> {
  const configStr = await LocalStorage.getItem<string>(CONFIG_KEY);
  if (!configStr) {
    return null;
  }

  try {
    return JSON.parse(configStr) as Config;
  } catch (error) {
    console.error("Failed to parse config:", error);
    return null;
  }
}

/**
 * Save configuration to LocalStorage
 */
export async function saveConfig(config: Config): Promise<void> {
  await LocalStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * Clear configuration from LocalStorage
 */
export async function clearConfig(): Promise<void> {
  await LocalStorage.removeItem(CONFIG_KEY);
}

/**
 * Get default configuration values
 */
export function getDefaultConfig(): Config {
  return {
    GET_ALL_TASKS_ENDPOINT: "https://n8n.some-instance.com/webhook/tasks",
    CREATE_TASK_ENDPOINT: "https://n8n.some-instance.com/webhook/tasks",
    UPDATE_TASK_ENDPOINT: "https://n8n.some-instance.com/webhook/tasks",
    DELETE_TASK_ENDPOINT: "https://n8n.some-instance.com/webhook/tasks",
    GET_TASK_CATEGORIES_ENDPOINT: "https://n8n.some-instance.com/webhook/taskCategories",
    CREATE_TASK_CATEGORY_ENDPOINT: "https://n8n.some-instance.com/webhook/taskCategories",
    DELETE_TASK_CATEGORIES_ENDPOINT: "https://n8n.some-instance.com/webhook/taskCategories",
    GET_ALL_PRIORITIES_ENDPOINT: "https://n8n.some-instance.com/webhook/priorities",
    CREATE_PRIORITY_ENDPOINT: "https://n8n.some-instance.com/webhook/priorities",
    DELETE_PRIORITY_ENDPOINT: "https://n8n.some-instance.com/webhook/priorities",
  };
}
