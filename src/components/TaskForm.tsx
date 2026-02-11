import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import { addDays, startOfDay } from "date-fns";
import { createTask, updateTask } from "../api/tasks";
import { formatDateForAPI } from "../utils/formatters";
import type { Task, TaskCategory, CreateTaskPayload, UpdateTaskPayload } from "../types";

interface TaskFormProps {
  categories: TaskCategory[];
  task?: Task;
  initialTaskName?: string;
  onSuccess: () => void;
}

export function TaskForm({ categories, task, initialTaskName, onSuccess }: TaskFormProps) {
  const { pop } = useNavigation();
  const isEditing = !!task;

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

  const [taskName, setTaskName] = useState<string>(task?.task || initialTaskName || "");
  const [categoryId, setCategoryId] = useState<string>(
    task?.categoryId !== undefined ? task.categoryId.toString() : "",
  );
  const [dueDateOption, setDueDateOption] = useState<string>(getInitialDueDateOption());
  const [done, setDone] = useState<boolean>(task?.done || false);
  const [archived, setArchived] = useState<boolean>(task?.archived || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper function to convert dropdown option to Date
  function getDueDate(): Date {
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

  async function handleSubmit() {
    if (!taskName.trim() || !categoryId || !dueDateOption) {
      return;
    }

    setIsLoading(true);
    const dueDate = getDueDate();

    if (isEditing && task) {
      // Update existing task
      const payload: UpdateTaskPayload = {
        task: taskName.trim(),
        categoryId: parseInt(categoryId, 10),
        due: formatDateForAPI(dueDate),
        done,
        archived,
      };

      const result = await updateTask(task.id, payload);
      setIsLoading(false);

      if (result) {
        onSuccess();
        pop();
      }
    } else {
      // Create new task
      const payload: CreateTaskPayload = {
        task: taskName.trim(),
        categoryId: parseInt(categoryId, 10),
        due: formatDateForAPI(dueDate),
        done,
        archived,
      };

      const result = await createTask(payload);
      setIsLoading(false);

      if (result) {
        onSuccess();
        pop();
      }
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title={isEditing ? "Update Task" : "Create Task"} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="task" title="Task" placeholder="Enter task name" value={taskName} onChange={setTaskName} />
      <Form.Dropdown id="category" title="Category" value={categoryId} onChange={setCategoryId}>
        <Form.Dropdown.Item value="" title="Select a category" />
        {categories.map((cat) => (
          <Form.Dropdown.Item key={cat.id} value={cat.id.toString()} title={cat.category} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown id="due" title="Due Date" value={dueDateOption} onChange={setDueDateOption}>
        <Form.Dropdown.Item value="today" title="Today" />
        <Form.Dropdown.Item value="tomorrow" title="Tomorrow" />
        <Form.Dropdown.Item value="2days" title="2 days from now" />
      </Form.Dropdown>
      <Form.Checkbox id="done" label="Done" value={done} onChange={setDone} />
      <Form.Checkbox id="archived" label="Archived" value={archived} onChange={setArchived} />
    </Form>
  );
}
