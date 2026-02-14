import { ActionPanel, Action, Form, useNavigation, Icon, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { addDays, startOfDay } from "date-fns";
import { createTask, updateTask } from "../../api/tasks";
import { formatDateForAPI } from "../../utils/formatters";
import { getLowestPriority, sortPrioritiesByLevel } from "../../utils/priorityHelpers";
import type { Task, TaskCategory, Priority, CreateTaskPayload, UpdateTaskPayload } from "../../types";

type TaskFormProps = {
  categories: TaskCategory[];
  priorities: Priority[];
  task?: Task;
  initialTaskName?: string;
  onSuccess: () => void;
};

interface TaskFormValues {
  taskName: string;
  description: string;
  categoryId: string;
  priorityId: string;
  dueDateOption: string;
}

export function TaskForm({ categories, priorities, task, initialTaskName, onSuccess }: TaskFormProps) {
  const { pop } = useNavigation();
  const isEditing = !!task;
  const defaultPriority = getLowestPriority(priorities);

  // Helper function to determine initial due date option
  function getInitialDueDateOption(): string {
    if (!task?.due) return "tomorrow"; // Default to tomorrow for new tasks

    const taskDueDate = startOfDay(new Date(task.due));
    const today = startOfDay(new Date());
    const tomorrow = startOfDay(addDays(new Date(), 1));
    const twoDaysFromNow = startOfDay(addDays(new Date(), 2));

    if (taskDueDate.getTime() === today.getTime()) return "today";
    if (taskDueDate.getTime() === tomorrow.getTime()) return "tomorrow";
    if (taskDueDate.getTime() === twoDaysFromNow.getTime()) return "2days";
    return "tomorrow"; // Default if date doesn't match options
  }

  // Helper function to convert dropdown option to Date
  function getDueDate(dueDateOption: string): Date {
    const today = startOfDay(new Date());
    switch (dueDateOption) {
      case "today":
        return today;
      case "tomorrow":
        return addDays(today, 1);
      case "2days":
        return addDays(today, 2);
      default:
        return addDays(today, 1); // Default to tomorrow
    }
  }

  const { handleSubmit, itemProps } = useForm<TaskFormValues>({
    async onSubmit(values) {
      const dueDate = getDueDate(values.dueDateOption);

      if (isEditing && task) {
        // Update existing task
        const payload: UpdateTaskPayload = {
          task: values.taskName.trim(),
          categoryId: parseInt(values.categoryId, 10),
          priorityId: parseInt(values.priorityId, 10),
          due: formatDateForAPI(dueDate),
          ...(values.description.trim() && { description: values.description.trim() }),
        };

        const result = await updateTask(task.id, payload);

        if (result) {
          await showToast({
            style: Toast.Style.Success,
            title: "Task updated",
          });
          onSuccess();
          pop();
        }
      } else {
        // Create new task
        const payload: CreateTaskPayload = {
          task: values.taskName.trim(),
          categoryId: parseInt(values.categoryId, 10),
          priorityId: parseInt(values.priorityId, 10),
          due: formatDateForAPI(dueDate),
          ...(values.description.trim() && { description: values.description.trim() }),
        };

        const result = await createTask(payload);

        if (result) {
          await showToast({
            style: Toast.Style.Success,
            title: "Task created",
          });
          onSuccess();
          pop();
        }
      }
    },
    initialValues: {
      taskName: task?.task || initialTaskName || "",
      description: task?.description || "",
      categoryId: task?.categoryId !== undefined ? task.categoryId.toString() : "",
      priorityId: task?.priorityId !== undefined ? task.priorityId.toString() : defaultPriority.id.toString(),
      dueDateOption: getInitialDueDateOption(),
    },
    validation: {
      taskName: FormValidation.Required,
      categoryId: (value) => {
        if (!value || value === "") {
          return "Please select a category";
        }
      },
      priorityId: FormValidation.Required,
      dueDateOption: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={isEditing ? "Update Task" : "Create Task"} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Task" placeholder="Enter task name" {...itemProps.taskName} />
      <Form.TextArea title="Description" placeholder="Optional task description" {...itemProps.description} />
      <Form.Dropdown title="Category" {...itemProps.categoryId}>
        <Form.Dropdown.Item value="" title="Select a category" />
        {categories.map((cat) => (
          <Form.Dropdown.Item key={cat.id} value={cat.id.toString()} title={cat.category} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown title="Priority" {...itemProps.priorityId}>
        {sortPrioritiesByLevel(priorities).map((priority) => (
          <Form.Dropdown.Item
            key={priority.id}
            value={priority.id.toString()}
            title={priority.name}
            icon={{ source: Icon.Circle, tintColor: priority.color }}
          />
        ))}
      </Form.Dropdown>
      <Form.Dropdown title="Due Date" {...itemProps.dueDateOption}>
        <Form.Dropdown.Item value="today" title="Today" />
        <Form.Dropdown.Item value="tomorrow" title="Tomorrow" />
        <Form.Dropdown.Item value="2days" title="2 days from now" />
      </Form.Dropdown>
    </Form>
  );
}
