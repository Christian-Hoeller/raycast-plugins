import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { useForm } from "@raycast/utils";
import { saveConfig, getConfig } from "../../utils/config";
import type { Config } from "../../utils/config";

type ConfigurationFormProps = {
  onSuccess: () => void;
};

interface ConfigFormValues {
  getAllTasksEndpoint: string;
  createTaskEndpoint: string;
  updateTaskEndpoint: string;
  deleteTaskEndpoint: string;
  getTaskCategoriesEndpoint: string;
  createTaskCategoryEndpoint: string;
  deleteTaskCategoriesEndpoint: string;
  getAllPrioritiesEndpoint: string;
  createPriorityEndpoint: string;
  deletePriorityEndpoint: string;
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

export function ConfigurationForm({ onSuccess }: ConfigurationFormProps) {
  const { pop } = useNavigation();
  const [initialValues, setInitialValues] = useState<ConfigFormValues | undefined>(undefined);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);

  // Load config on mount
  useEffect(() => {
    async function loadConfig() {
      const config = await getConfig();
      if (config) {
        setInitialValues({
          getAllTasksEndpoint: config.GET_ALL_TASKS_ENDPOINT,
          createTaskEndpoint: config.CREATE_TASK_ENDPOINT,
          updateTaskEndpoint: config.UPDATE_TASK_ENDPOINT,
          deleteTaskEndpoint: config.DELETE_TASK_ENDPOINT,
          getTaskCategoriesEndpoint: config.GET_TASK_CATEGORIES_ENDPOINT,
          createTaskCategoryEndpoint: config.CREATE_TASK_CATEGORY_ENDPOINT,
          deleteTaskCategoriesEndpoint: config.DELETE_TASK_CATEGORIES_ENDPOINT,
          getAllPrioritiesEndpoint: config.GET_ALL_PRIORITIES_ENDPOINT,
          createPriorityEndpoint: config.CREATE_PRIORITY_ENDPOINT,
          deletePriorityEndpoint: config.DELETE_PRIORITY_ENDPOINT,
          codingAgentEndpoint: config.CODING_AGENT_ENDPOINT,
        });
      } else {
        // Set empty values if no config exists
        setInitialValues({
          getAllTasksEndpoint: "",
          createTaskEndpoint: "",
          updateTaskEndpoint: "",
          deleteTaskEndpoint: "",
          getTaskCategoriesEndpoint: "",
          createTaskCategoryEndpoint: "",
          deleteTaskCategoriesEndpoint: "",
          getAllPrioritiesEndpoint: "",
          createPriorityEndpoint: "",
          deletePriorityEndpoint: "",
          codingAgentEndpoint: "",
        });
      }
      setIsLoadingConfig(false);
    }
    loadConfig();
  }, []);

  const { handleSubmit, itemProps } = useForm<ConfigFormValues>({
    async onSubmit(values) {
      // Save config with trimmed values
      const config: Config = {
        GET_ALL_TASKS_ENDPOINT: values.getAllTasksEndpoint.trim(),
        CREATE_TASK_ENDPOINT: values.createTaskEndpoint.trim(),
        UPDATE_TASK_ENDPOINT: values.updateTaskEndpoint.trim(),
        DELETE_TASK_ENDPOINT: values.deleteTaskEndpoint.trim(),
        GET_TASK_CATEGORIES_ENDPOINT: values.getTaskCategoriesEndpoint.trim(),
        CREATE_TASK_CATEGORY_ENDPOINT: values.createTaskCategoryEndpoint.trim(),
        DELETE_TASK_CATEGORIES_ENDPOINT: values.deleteTaskCategoriesEndpoint.trim(),
        GET_ALL_PRIORITIES_ENDPOINT: values.getAllPrioritiesEndpoint.trim(),
        CREATE_PRIORITY_ENDPOINT: values.createPriorityEndpoint.trim(),
        DELETE_PRIORITY_ENDPOINT: values.deletePriorityEndpoint.trim(),
        CODING_AGENT_ENDPOINT: values.codingAgentEndpoint.trim(),
      };

      await saveConfig(config);
      onSuccess();
      pop();
    },
    initialValues,
    validation: {
      getAllTasksEndpoint: validateUrl,
      createTaskEndpoint: validateUrl,
      updateTaskEndpoint: validateUrl,
      deleteTaskEndpoint: validateUrl,
      getTaskCategoriesEndpoint: validateUrl,
      createTaskCategoryEndpoint: validateUrl,
      deleteTaskCategoriesEndpoint: validateUrl,
      getAllPrioritiesEndpoint: validateUrl,
      createPriorityEndpoint: validateUrl,
      deletePriorityEndpoint: validateUrl,
      codingAgentEndpoint: validateUrl,
    },
  });

  // Show loading state while config is being loaded
  if (isLoadingConfig || !initialValues) {
    return <Form isLoading={true} />;
  }

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
        text="Configure your n8n webhook endpoints for tasks, categories, and priorities."
      />

      <Form.Separator />

      <Form.TextField
        id="getAllTasksEndpoint"
        title="Get All Tasks"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.getAllTasksEndpoint}
      />
      <Form.TextField
        id="createTaskEndpoint"
        title="Create Task"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.createTaskEndpoint}
      />
      <Form.TextField
        id="updateTaskEndpoint"
        title="Update Task"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.updateTaskEndpoint}
      />
      <Form.TextField
        id="deleteTaskEndpoint"
        title="Delete Task"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.deleteTaskEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        id="getTaskCategoriesEndpoint"
        title="Get Categories"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.getTaskCategoriesEndpoint}
      />
      <Form.TextField
        id="createTaskCategoryEndpoint"
        title="Create Category"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.createTaskCategoryEndpoint}
      />
      <Form.TextField
        id="deleteTaskCategoriesEndpoint"
        title="Delete Category"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.deleteTaskCategoriesEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        id="getAllPrioritiesEndpoint"
        title="Get All Priorities"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        {...itemProps.getAllPrioritiesEndpoint}
      />
      <Form.TextField
        id="createPriorityEndpoint"
        title="Create Priority"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        {...itemProps.createPriorityEndpoint}
      />
      <Form.TextField
        id="deletePriorityEndpoint"
        title="Delete Priority"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        {...itemProps.deletePriorityEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        id="codingAgentEndpoint"
        title="Coding Agent Endpoint"
        placeholder="https://n8n.some-instance.com/webhook/agents/codingAgent"
        {...itemProps.codingAgentEndpoint}
      />
    </Form>
  );
}
