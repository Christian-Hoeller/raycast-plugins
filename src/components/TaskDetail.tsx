import { List, Icon } from "@raycast/api";
import { generateTaskMarkdown } from "../utils/taskHelpers";
import { formatRelativeDate, isOverdue } from "../utils/formatters";
import type { Task } from "../types";

interface TaskDetailProps {
  task: Task;
  categoryName: string;
  description?: string;
}

export function TaskDetail({ task, categoryName, description }: TaskDetailProps) {
  const overdue = !task.done && isOverdue(task.due);

  return (
    <List.Item.Detail
      markdown={generateTaskMarkdown(task, categoryName, description)}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Task" text={task.task} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label
            title="Status"
            text={task.done ? "Done" : "Pending"}
            icon={task.done ? Icon.CheckCircle : Icon.Circle}
          />
          <List.Item.Detail.Metadata.Label title="Category" text={categoryName} />
          <List.Item.Detail.Metadata.Label
            title="Archived"
            text={task.archived ? "Yes" : "No"}
            icon={task.archived ? Icon.Box : Icon.Circle}
          />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label
            title="Due Date"
            text={`${formatRelativeDate(task.due)}${overdue ? " (Overdue)" : ""}`}
            icon={overdue ? { source: Icon.ExclamationMark, tintColor: "#FF0000" } : undefined}
          />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="Description" text={description || "No description"} />
        </List.Item.Detail.Metadata>
      }
    />
  );
}
