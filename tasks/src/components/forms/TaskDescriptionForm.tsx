import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import type { Task } from "../../types";

interface TaskDescriptionFormProps {
  task: Task;
  description?: string;
  onSave: (description: string) => void;
}

export function TaskDescriptionForm({ task, description, onSave }: TaskDescriptionFormProps) {
  const [localDescription, setLocalDescription] = useState<string>(description || "");
  const { pop } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Save Description"
            onSubmit={(values: { description: string }) => {
              onSave(values.description);
              pop();
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
