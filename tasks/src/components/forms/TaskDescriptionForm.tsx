import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useForm } from "@raycast/utils";
import type { Task } from "../../types";

type TaskDescriptionFormProps = {
  task: Task;
  description?: string;
  onSave: (description: string) => void;
};

interface TaskDescriptionFormValues {
  description: string;
}

export function TaskDescriptionForm({ task, description, onSave }: TaskDescriptionFormProps) {
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<TaskDescriptionFormValues>({
    onSubmit(values) {
      onSave(values.description);
      pop();
    },
    initialValues: {
      description: description || "",
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Description" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Task" text={task.task} />
      <Form.Separator />
      <Form.TextArea title="Description" placeholder="Enter task description..." {...itemProps.description} />
    </Form>
  );
}
