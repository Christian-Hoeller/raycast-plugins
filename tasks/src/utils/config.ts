import { LocalStorage } from "@raycast/api";

export type Config = {
  TASKS_ENDPOINT: string;
  CATEGORIES_ENDPOINT: string;
  PRIORITIES_ENDPOINT: string;
  CODING_AGENT_ENDPOINT: string;
};

// Legacy config type for migration
type LegacyConfig = {
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
 * Migrate legacy config to new format
 */
function migrateLegacyConfig(legacy: LegacyConfig): Config {
  console.log("Migrating legacy configuration to new format...");
  return {
    TASKS_ENDPOINT: legacy.GET_ALL_TASKS_ENDPOINT || legacy.CREATE_TASK_ENDPOINT || "",
    CATEGORIES_ENDPOINT: legacy.GET_TASK_CATEGORIES_ENDPOINT || legacy.CREATE_TASK_CATEGORY_ENDPOINT || "",
    PRIORITIES_ENDPOINT: legacy.GET_ALL_PRIORITIES_ENDPOINT || legacy.CREATE_PRIORITY_ENDPOINT || "",
    CODING_AGENT_ENDPOINT: legacy.CODING_AGENT_ENDPOINT || "",
  };
}

/**
 * Check if config is in legacy format
 */
function isLegacyConfig(config: unknown): config is LegacyConfig {
  return (
    typeof config === "object" &&
    config !== null &&
    "GET_ALL_TASKS_ENDPOINT" in config &&
    "CREATE_TASK_ENDPOINT" in config
  );
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
    const parsed = JSON.parse(configStr);

    // Check if this is a legacy config and migrate if needed
    if (isLegacyConfig(parsed)) {
      const migratedConfig = migrateLegacyConfig(parsed);
      // Save the migrated config
      await saveConfig(migratedConfig);
      console.log("Legacy configuration migrated successfully");
      return migratedConfig;
    }

    return parsed as Config;
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
