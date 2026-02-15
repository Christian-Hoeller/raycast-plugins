import { LocalStorage } from "@raycast/api";

export type Config = {
  TASKS_ENDPOINT: string;
  CATEGORIES_ENDPOINT: string;
  PRIORITIES_ENDPOINT: string;
  CODING_AGENT_ENDPOINT: string;
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
    TASKS_ENDPOINT: "https://n8n.some-instance.com/webhook/tasks",
    CATEGORIES_ENDPOINT: "https://n8n.some-instance.com/webhook/taskCategories",
    PRIORITIES_ENDPOINT: "https://n8n.some-instance.com/webhook/priorities",
    CODING_AGENT_ENDPOINT: "https://n8n.some-instance.com/webhook/agents/codingAgent",
  };
}
