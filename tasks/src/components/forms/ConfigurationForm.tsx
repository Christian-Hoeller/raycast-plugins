import { ActionPanel, Action, Form, useNavigation, showToast, Toast } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { useEffect, useState } from "react";
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
  getAllCodingProjectsEndpoint: string;
  createCodingProjectEndpoint: string;
  updateCodingProjectEndpoint: string;
  deleteCodingProjectEndpoint: string;
}

export function ConfigurationForm({ onSuccess }: ConfigurationFormProps) {
  const { pop } = useNavigation();
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [initialConfig, setInitialConfig] = useState<ConfigFormValues>({
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
    getAllCodingProjectsEndpoint: "",
    createCodingProjectEndpoint: "",
    updateCodingProjectEndpoint: "",
    deleteCodingProjectEndpoint: "",
  });

  useEffect(() => {
    async function loadConfig() {
      const config = await getConfig();
      if (config) {
        setInitialConfig({
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
          getAllCodingProjectsEndpoint: config.GET_ALL_CODING_PROJECTS_ENDPOINT,
          createCodingProjectEndpoint: config.CREATE_CODING_PROJECT_ENDPOINT,
          updateCodingProjectEndpoint: config.UPDATE_CODING_PROJECT_ENDPOINT,
          deleteCodingProjectEndpoint: config.DELETE_CODING_PROJECT_ENDPOINT,
        });
      }
      setIsLoadingConfig(false);
    }
    loadConfig();
  }, []);

  const { handleSubmit, itemProps } = useForm<ConfigFormValues>({
    async onSubmit(values) {
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
        GET_ALL_CODING_PROJECTS_ENDPOINT: values.getAllCodingProjectsEndpoint.trim(),
        CREATE_CODING_PROJECT_ENDPOINT: values.createCodingProjectEndpoint.trim(),
        UPDATE_CODING_PROJECT_ENDPOINT: values.updateCodingProjectEndpoint.trim(),
        DELETE_CODING_PROJECT_ENDPOINT: values.deleteCodingProjectEndpoint.trim(),
      };

      await saveConfig(config);
      await showToast({
        style: Toast.Style.Success,
        title: "Configuration saved",
      });
      onSuccess();
      pop();
    },
    initialValues: initialConfig,
  });

  if (isLoadingConfig) {
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
        text="Configure your n8n webhook endpoints for tasks, categories, priorities, and coding projects."
      />

      <Form.Separator />

      <Form.TextField
        title="Get All Tasks"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.getAllTasksEndpoint}
      />
      <Form.TextField
        title="Create Task"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.createTaskEndpoint}
      />
      <Form.TextField
        title="Update Task"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.updateTaskEndpoint}
      />
      <Form.TextField
        title="Delete Task"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.deleteTaskEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        title="Get Categories"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.getTaskCategoriesEndpoint}
      />
      <Form.TextField
        title="Create Category"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.createTaskCategoryEndpoint}
      />
      <Form.TextField
        title="Delete Category"
        placeholder="https://n8n.some-instance.com/webhook"
        {...itemProps.deleteTaskCategoriesEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        title="Get All Priorities"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        {...itemProps.getAllPrioritiesEndpoint}
      />
      <Form.TextField
        title="Create Priority"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        {...itemProps.createPriorityEndpoint}
      />
      <Form.TextField
        title="Delete Priority"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        {...itemProps.deletePriorityEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        title="Get All Coding Projects"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        {...itemProps.getAllCodingProjectsEndpoint}
      />
      <Form.TextField
        title="Create Coding Project"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        {...itemProps.createCodingProjectEndpoint}
      />
      <Form.TextField
        title="Update Coding Project"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        {...itemProps.updateCodingProjectEndpoint}
      />
      <Form.TextField
        title="Delete Coding Project"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        {...itemProps.deleteCodingProjectEndpoint}
      />
    </Form>
  );
}
