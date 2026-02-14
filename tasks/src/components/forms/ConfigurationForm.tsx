import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import { saveConfig, getDefaultConfig } from "../../utils/config";
import type { Config } from "../../utils/config";

type ConfigurationFormProps = {
  onSuccess: () => void;
};

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
  const [getAllPrioritiesEndpoint, setGetAllPrioritiesEndpoint] = useState<string>(
    defaults.GET_ALL_PRIORITIES_ENDPOINT,
  );
  const [createPriorityEndpoint, setCreatePriorityEndpoint] = useState<string>(defaults.CREATE_PRIORITY_ENDPOINT);
  const [deletePriorityEndpoint, setDeletePriorityEndpoint] = useState<string>(defaults.DELETE_PRIORITY_ENDPOINT);
  const [getAllCodingProjectsEndpoint, setGetAllCodingProjectsEndpoint] = useState<string>(
    defaults.GET_ALL_CODING_PROJECTS_ENDPOINT,
  );
  const [createCodingProjectEndpoint, setCreateCodingProjectEndpoint] = useState<string>(
    defaults.CREATE_CODING_PROJECT_ENDPOINT,
  );
  const [updateCodingProjectEndpoint, setUpdateCodingProjectEndpoint] = useState<string>(
    defaults.UPDATE_CODING_PROJECT_ENDPOINT,
  );
  const [deleteCodingProjectEndpoint, setDeleteCodingProjectEndpoint] = useState<string>(
    defaults.DELETE_CODING_PROJECT_ENDPOINT,
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
      GET_ALL_PRIORITIES_ENDPOINT: getAllPrioritiesEndpoint.trim(),
      CREATE_PRIORITY_ENDPOINT: createPriorityEndpoint.trim(),
      DELETE_PRIORITY_ENDPOINT: deletePriorityEndpoint.trim(),
      GET_ALL_CODING_PROJECTS_ENDPOINT: getAllCodingProjectsEndpoint.trim(),
      CREATE_CODING_PROJECT_ENDPOINT: createCodingProjectEndpoint.trim(),
      UPDATE_CODING_PROJECT_ENDPOINT: updateCodingProjectEndpoint.trim(),
      DELETE_CODING_PROJECT_ENDPOINT: deleteCodingProjectEndpoint.trim(),
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

      <Form.Separator />

      <Form.TextField
        id="getAllCodingProjectsEndpoint"
        title="Get All Coding Projects"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        value={getAllCodingProjectsEndpoint}
        onChange={setGetAllCodingProjectsEndpoint}
      />
      <Form.TextField
        id="createCodingProjectEndpoint"
        title="Create Coding Project"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        value={createCodingProjectEndpoint}
        onChange={setCreateCodingProjectEndpoint}
      />
      <Form.TextField
        id="updateCodingProjectEndpoint"
        title="Update Coding Project"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        value={updateCodingProjectEndpoint}
        onChange={setUpdateCodingProjectEndpoint}
      />
      <Form.TextField
        id="deleteCodingProjectEndpoint"
        title="Delete Coding Project"
        placeholder="https://n8n.some-instance.com/webhook/codingProjects"
        value={deleteCodingProjectEndpoint}
        onChange={setDeleteCodingProjectEndpoint}
      />
    </Form>
  );
}
