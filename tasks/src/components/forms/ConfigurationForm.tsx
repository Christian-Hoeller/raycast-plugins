import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { saveConfig } from "../../utils/config";
import type { Config } from "../../utils/config";

type ConfigurationFormProps = {
  config?: Config | null;
  onSuccess: () => void;
};

interface ConfigFormValues {
  tasksEndpoint: string;
  categoriesEndpoint: string;
  prioritiesEndpoint: string;
  codingAgentEndpoint: string;
}

// URL validation function
function validateUrl(value: string | undefined): string | undefined {
  if (!value || value.trim() === "") {
    return "URL is required";
  }

  const trimmedValue = value.trim();

  // Check if it's a valid URL format
  try {
    const url = new URL(trimmedValue);
    // Ensure it's HTTPS
    if (url.protocol !== "https:") {
      return "URL must use HTTPS protocol";
    }
  } catch {
    return "Please enter a valid URL (e.g., https://n8n.example.com/webhook)";
  }

  return undefined;
}

export function ConfigurationForm({ config, onSuccess }: ConfigurationFormProps) {
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<ConfigFormValues>({
    async onSubmit(values) {
      // Save config with trimmed values
      const configToSave: Config = {
        TASKS_ENDPOINT: values.tasksEndpoint.trim(),
        CATEGORIES_ENDPOINT: values.categoriesEndpoint.trim(),
        PRIORITIES_ENDPOINT: values.prioritiesEndpoint.trim(),
        CODING_AGENT_ENDPOINT: values.codingAgentEndpoint.trim(),
      };

      await saveConfig(configToSave);

      onSuccess();
      pop();
    },
    initialValues: {
      tasksEndpoint: config?.TASKS_ENDPOINT || "",
      categoriesEndpoint: config?.CATEGORIES_ENDPOINT || "",
      prioritiesEndpoint: config?.PRIORITIES_ENDPOINT || "",
      codingAgentEndpoint: config?.CODING_AGENT_ENDPOINT || "",
    },
    validation: {
      tasksEndpoint: validateUrl,
      categoriesEndpoint: validateUrl,
      prioritiesEndpoint: validateUrl,
      codingAgentEndpoint: validateUrl,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Configuration" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description
        title="API Configuration"
        text="Configure your n8n webhook endpoints. The service layer will automatically handle HTTP methods (GET, POST, PUT, DELETE) and ID parameters for each resource."
      />

      <Form.Separator />

      <Form.TextField
        id="tasksEndpoint"
        title="Tasks API Endpoint"
        placeholder="https://n8n.some-instance.com/webhook/tasks"
        info="Base endpoint for all task operations (GET, POST, PUT, DELETE)"
        {...itemProps.tasksEndpoint}
      />

      <Form.TextField
        id="categoriesEndpoint"
        title="Categories API Endpoint"
        placeholder="https://n8n.some-instance.com/webhook/taskCategories"
        info="Base endpoint for all category operations (GET, POST, PUT, DELETE)"
        {...itemProps.categoriesEndpoint}
      />

      <Form.TextField
        id="prioritiesEndpoint"
        title="Priorities API Endpoint"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        info="Base endpoint for all priority operations (GET, POST, DELETE)"
        {...itemProps.prioritiesEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        id="codingAgentEndpoint"
        title="Coding Agent Endpoint"
        placeholder="https://n8n.some-instance.com/webhook/agents/codingAgent"
        info="Endpoint for sending tasks to the coding agent"
        {...itemProps.codingAgentEndpoint}
      />
    </Form>
  );
}
