import { List, Icon } from "@raycast/api";
import { generateTaskMarkdown } from "../utils/taskHelpers";
import { formatRelativeDate, isOverdue } from "../utils/formatters";
import { getPriorityName, getPriorityColor } from "../utils/priorityHelpers";
import type { Task, TaskCategory, Priority, CodingProject } from "../types";

type TaskDetailProps = {
  task: Task;
  categoryName: string;
  categories: TaskCategory[];
  priorities: Priority[];
  codingProjects: CodingProject[];
  description?: string;
};

export function TaskDetail({
  task,
  categoryName,
  categories,
  priorities,
  codingProjects,
  description,
}: TaskDetailProps) {
  const overdue = !task.done && isOverdue(task.due);

  // Find the category to check for codingProjectId
  const category = categories.find((cat) => cat.id === task.categoryId);
  const codingProject = category?.codingProjectId
    ? codingProjects.find((project) => project.id === category.codingProjectId)
    : undefined;

  return (
    <List.Item.Detail
      markdown={generateTaskMarkdown(task, categoryName, description)}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Id" text={`${task.id}`} />
          <List.Item.Detail.Metadata.Label title="Category" text={categoryName} />
          {codingProject && (
            <List.Item.Detail.Metadata.Label title="GitHub Project" text={codingProject.name} icon={Icon.Code} />
          )}
          <List.Item.Detail.Metadata.TagList title="Priority">
            <List.Item.Detail.Metadata.TagList.Item
              text={getPriorityName(priorities, task.priorityId)}
              color={getPriorityColor(priorities, task.priorityId)}
            />
          </List.Item.Detail.Metadata.TagList>
          <List.Item.Detail.Metadata.Label title="Archived" icon={task.archived ? Icon.Box : Icon.Circle} />
          <List.Item.Detail.Metadata.Label
            title="Due Date"
            text={`${formatRelativeDate(task.due)}${overdue ? " (Overdue)" : ""}`}
            icon={overdue ? { source: Icon.ExclamationMark, tintColor: "#FF0000" } : undefined}
          />
        </List.Item.Detail.Metadata>
      }
    />
  );
}
