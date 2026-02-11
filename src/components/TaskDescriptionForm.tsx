import { ActionPanel, Action, Form } from "@raycast/api";
import { useState } from "react";
import type { Task } from "../types";

interface TaskDescriptionFormProps {
  task: Task;
  description?: string;
  onSave: (description: string) => void;
}

export function TaskDescriptionForm({ task, description, onSave }: TaskDescriptionFormProps) {
  const [localDescription, setLocalDescription] = useState<string>(description || "");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Save Description"
            onSubmit={() => {
              onSave(localDescription);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description title="Task" text={task.task} />
      <Form.Separator />
      <Form.TextArea
        id="description"
        title="Description"
        placeholder="Enter task description..."
        value={localDescription}
        onChange={setLocalDescription}
      />
    </Form>
  );
}
