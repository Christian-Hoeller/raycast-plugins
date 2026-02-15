import { Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { ConfigurationForm } from "./forms/ConfigurationForm";
import { getConfig } from "../utils/config";
import type { Config } from "../utils/config";

type ConfigurationFormWrapperProps = {
  onSuccess: () => void;
};

export function ConfigurationFormWrapper({ onSuccess }: ConfigurationFormWrapperProps) {
  const [config, setConfig] = useState<Config | null | undefined>(undefined);

  useEffect(() => {
    async function loadConfig() {
      const loadedConfig = await getConfig();
      setConfig(loadedConfig);
    }
    loadConfig();
  }, []);

  // Show loading state while config is being loaded
  if (config === undefined) {
    return <Form isLoading={true} />;
  }

  return <ConfigurationForm config={config} onSuccess={onSuccess} />;
}
