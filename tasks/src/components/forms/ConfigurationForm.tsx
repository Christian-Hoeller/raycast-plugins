import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import { saveConfig, getDefaultConfig } from "../../utils/config";
import type { Config } from "../../utils/config";

interface ConfigurationFormProps {
  onSuccess: () => void;
}

export function ConfigurationForm({ onSuccess }: ConfigurationFormProps) {
  const { pop } = useNavigation();
  const defaults = getDefaultConfig();

  const [getAllTasksEndpoint, setGetAllTasksEndpoint] = useState<string>(defaults.GET_ALL_TASKS_ENDPOINT);
  const [createTaskEndpoint, setCreateTaskEndpoint] = useState<string>(defaults.CREATE_TASK_ENDPOINT);
  const [updateTaskEndpoint, setUpdateTaskEndpoint] = useState<string>(defaults.UPDATE_TASK_ENDPOINT);
  const [deleteTaskEndpoint, setDeleteTaskEndpoint] = useState<string>(defaults.DELETE_TASK_ENDPOINT);
  const [getTaskCategoriesEndpoint, setGetTaskCategoriesEndpoint] = useState<string>(
    defaults.GET_TASK_CATEGORIES_ENDPOINT,
  );
  const [createTaskCategoryEndpoint, setCreateTaskCategoryEndpoint] = useState<string>(
    defaults.CREATE_TASK_CATEGORY_ENDPOINT,
  );
  const [deleteTaskCategoriesEndpoint, setDeleteTaskCategoriesEndpoint] = useState<string>(
    defaults.DELETE_TASK_CATEGORIES_ENDPOINT,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit() {
    setIsLoading(true);

    const config: Config = {
      GET_ALL_TASKS_ENDPOINT: getAllTasksEndpoint.trim(),
      CREATE_TASK_ENDPOINT: createTaskEndpoint.trim(),
      UPDATE_TASK_ENDPOINT: updateTaskEndpoint.trim(),
      DELETE_TASK_ENDPOINT: deleteTaskEndpoint.trim(),
      GET_TASK_CATEGORIES_ENDPOINT: getTaskCategoriesEndpoint.trim(),
      CREATE_TASK_CATEGORY_ENDPOINT: createTaskCategoryEndpoint.trim(),
      DELETE_TASK_CATEGORIES_ENDPOINT: deleteTaskCategoriesEndpoint.trim(),
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
        text="Configure your n8n webhook endpoints. Default values are pre-filled."
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
    </Form>
  );
}
