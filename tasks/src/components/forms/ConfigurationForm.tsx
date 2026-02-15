import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { saveConfig, getConfig } from "../../utils/config";
import type { Config } from "../../utils/config";

type ConfigurationFormProps = {
  onSuccess: () => void;
};

export function ConfigurationForm({ onSuccess }: ConfigurationFormProps) {
  const { pop } = useNavigation();

  const [getAllTasksEndpoint, setGetAllTasksEndpoint] = useState<string>("");
  const [createTaskEndpoint, setCreateTaskEndpoint] = useState<string>("");
  const [updateTaskEndpoint, setUpdateTaskEndpoint] = useState<string>("");
  const [deleteTaskEndpoint, setDeleteTaskEndpoint] = useState<string>("");
  const [getTaskCategoriesEndpoint, setGetTaskCategoriesEndpoint] = useState<string>("");
  const [createTaskCategoryEndpoint, setCreateTaskCategoryEndpoint] = useState<string>("");
  const [deleteTaskCategoriesEndpoint, setDeleteTaskCategoriesEndpoint] = useState<string>("");
  const [getAllPrioritiesEndpoint, setGetAllPrioritiesEndpoint] = useState<string>("");
  const [createPriorityEndpoint, setCreatePriorityEndpoint] = useState<string>("");
  const [deletePriorityEndpoint, setDeletePriorityEndpoint] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      const config = await getConfig();
      if (config) {
        setGetAllTasksEndpoint(config.GET_ALL_TASKS_ENDPOINT);
        setCreateTaskEndpoint(config.CREATE_TASK_ENDPOINT);
        setUpdateTaskEndpoint(config.UPDATE_TASK_ENDPOINT);
        setDeleteTaskEndpoint(config.DELETE_TASK_ENDPOINT);
        setGetTaskCategoriesEndpoint(config.GET_TASK_CATEGORIES_ENDPOINT);
        setCreateTaskCategoryEndpoint(config.CREATE_TASK_CATEGORY_ENDPOINT);
        setDeleteTaskCategoriesEndpoint(config.DELETE_TASK_CATEGORIES_ENDPOINT);
        setGetAllPrioritiesEndpoint(config.GET_ALL_PRIORITIES_ENDPOINT);
        setCreatePriorityEndpoint(config.CREATE_PRIORITY_ENDPOINT);
        setDeletePriorityEndpoint(config.DELETE_PRIORITY_ENDPOINT);
      }
      setIsLoading(false);
    }
    loadConfig();
  }, []);

  async function handleSubmit() {
    setIsLoading(true);

    // Only save fields that have values
    const config: Config = {
      GET_ALL_TASKS_ENDPOINT: getAllTasksEndpoint.trim(),
      CREATE_TASK_ENDPOINT: createTaskEndpoint.trim(),
      UPDATE_TASK_ENDPOINT: updateTaskEndpoint.trim(),
      DELETE_TASK_ENDPOINT: deleteTaskEndpoint.trim(),
      GET_TASK_CATEGORIES_ENDPOINT: getTaskCategoriesEndpoint.trim(),
      CREATE_TASK_CATEGORY_ENDPOINT: createTaskCategoryEndpoint.trim(),
      DELETE_TASK_CATEGORIES_ENDPOINT: deleteTaskCategoriesEndpoint.trim(),
      GET_ALL_PRIORITIES_ENDPOINT: getAllPrioritiesEndpoint.trim(),
      CREATE_PRIORITY_ENDPOINT: createPriorityEndpoint.trim(),
      DELETE_PRIORITY_ENDPOINT: deletePriorityEndpoint.trim(),
    };

    await saveConfig(config);
    setIsLoading(false);
    onSuccess();
    pop();
  }

  return (
    <Form
      isLoading={isLoading}
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
        value={getAllTasksEndpoint}
        onChange={setGetAllTasksEndpoint}
      />
      <Form.TextField
        id="createTaskEndpoint"
        title="Create Task"
        placeholder="https://n8n.some-instance.com/webhook"
        value={createTaskEndpoint}
        onChange={setCreateTaskEndpoint}
      />
      <Form.TextField
        id="updateTaskEndpoint"
        title="Update Task"
        placeholder="https://n8n.some-instance.com/webhook"
        value={updateTaskEndpoint}
        onChange={setUpdateTaskEndpoint}
      />
      <Form.TextField
        id="deleteTaskEndpoint"
        title="Delete Task"
        placeholder="https://n8n.some-instance.com/webhook"
        value={deleteTaskEndpoint}
        onChange={setDeleteTaskEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        id="getTaskCategoriesEndpoint"
        title="Get Categories"
        placeholder="https://n8n.some-instance.com/webhook"
        value={getTaskCategoriesEndpoint}
        onChange={setGetTaskCategoriesEndpoint}
      />
      <Form.TextField
        id="createTaskCategoryEndpoint"
        title="Create Category"
        placeholder="https://n8n.some-instance.com/webhook"
        value={createTaskCategoryEndpoint}
        onChange={setCreateTaskCategoryEndpoint}
      />
      <Form.TextField
        id="deleteTaskCategoriesEndpoint"
        title="Delete Category"
        placeholder="https://n8n.some-instance.com/webhook"
        value={deleteTaskCategoriesEndpoint}
        onChange={setDeleteTaskCategoriesEndpoint}
      />

      <Form.Separator />

      <Form.TextField
        id="getAllPrioritiesEndpoint"
        title="Get All Priorities"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        value={getAllPrioritiesEndpoint}
        onChange={setGetAllPrioritiesEndpoint}
      />
      <Form.TextField
        id="createPriorityEndpoint"
        title="Create Priority"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        value={createPriorityEndpoint}
        onChange={setCreatePriorityEndpoint}
      />
      <Form.TextField
        id="deletePriorityEndpoint"
        title="Delete Priority"
        placeholder="https://n8n.some-instance.com/webhook/priorities"
        value={deletePriorityEndpoint}
        onChange={setDeletePriorityEndpoint}
      />
    </Form>
  );
}
