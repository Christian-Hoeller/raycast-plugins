import { ActionPanel, List, Action, Icon, confirmAlert, Alert } from "@raycast/api";
import { formatRelativeDate, isOverdue } from "../utils/formatters";
import { getCategoryColor } from "../utils/categoryHelpers";
import { TaskForm } from "./forms/TaskForm";
import { CategoryForm } from "./forms/CategoryForm";
import { ConfigurationForm } from "./forms/ConfigurationForm";
import { TaskDescriptionForm } from "./forms/TaskDescriptionForm";
import { TaskDetail } from "./TaskDetail";
import type { Task, TaskCategory } from "../types";

type TaskListItemProps = {
  task: Task;
  categoryName: string;
  categories: TaskCategory[];
  showingDetail: boolean;
  showArchived: boolean;
  searchText: string;
  description?: string;
  onToggleDetail: () => void;
  onToggleDone: (task: Task) => void;
  onToggleArchived: (task: Task) => void;
  onDelete: (task: Task) => void;
  onUpdateDescription: (taskId: number, description: string) => void;
  onShowArchivedToggle: () => void;
  onRefresh: () => void;
  onCheckConfiguration: () => void;
};

export function TaskListItem({
  task,
  categoryName,
  categories,
  showingDetail,
  showArchived,
  searchText,
  description,
  onToggleDetail,
  onToggleDone,
  onToggleArchived,
  onDelete,
  onUpdateDescription,
  onShowArchivedToggle,
  onRefresh,
  onCheckConfiguration,
}: TaskListItemProps) {
  const overdue = !task.done && isOverdue(task.due);

  return (
    <List.Item
      icon={task.done ? Icon.CheckCircle : Icon.Circle}
      title={task.task}
      subtitle={!showingDetail ? categoryName : undefined}
      accessories={
        !showingDetail
          ? [
              {
                text: formatRelativeDate(task.due),
                ...(overdue ? { icon: { source: Icon.ExclamationMark, tintColor: "#FF0000" } } : {}),
              },
              { tag: { value: categoryName, color: getCategoryColor(categoryName) } },
              ...(task.archived ? [{ icon: Icon.Box }] : []),
            ]
          : undefined
      }
      detail={<TaskDetail task={task} categoryName={categoryName} description={description} />}
      actions={
        <ActionPanel>
          <Action
            title={showingDetail ? "Hide Details" : "Show Details"}
            icon={showingDetail ? Icon.EyeDisabled : Icon.Eye}
            onAction={onToggleDetail}
            shortcut={{ modifiers: ["cmd"], key: "d" }}
          />
          <Action
            title="Toggle Done"
            icon={Icon.Check}
            onAction={() => onToggleDone(task)}
            shortcut={{ modifiers: ["cmd"], key: "enter" }}
          />
          <Action
            title={task.archived ? "Unarchive Task" : "Archive Task"}
            icon={Icon.Box}
            onAction={async () => {
              if (
                await confirmAlert({
                  title: task.archived ? "Unarchive Task" : "Archive Task",
                  message: `Are you sure you want to ${task.archived ? "unarchive" : "archive"} "${task.task}"?`,
                  primaryAction: { title: task.archived ? "Unarchive" : "Archive" },
                })
              ) {
                onToggleArchived(task);
              }
            }}
            shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
          />
          <Action.Push
            title="Edit Task"
            icon={Icon.Pencil}
            target={<TaskForm categories={categories} task={task} onSuccess={onRefresh} />}
            shortcut={{ modifiers: ["cmd"], key: "e" }}
          />
          <Action.Push
            title="Edit Description"
            icon={Icon.Text}
            target={
              <TaskDescriptionForm
                task={task}
                description={description}
                onSave={(desc) => onUpdateDescription(task.id, desc)}
              />
            }
            shortcut={{ modifiers: ["cmd", "shift"], key: "e" }}
          />
          <Action
            title="Delete Task"
            icon={Icon.Trash}
            style={Action.Style.Destructive}
            onAction={async () => {
              if (
                await confirmAlert({
                  title: "Delete Task",
                  message: `Are you sure you want to delete "${task.task}"?`,
                  primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
                })
              ) {
                onDelete(task);
              }
            }}
            shortcut={{ modifiers: ["cmd"], key: "backspace" }}
          />
          <ActionPanel.Section>
            <Action.Push
              title="Create New Task"
              icon={Icon.Plus}
              target={<TaskForm categories={categories} initialTaskName={searchText} onSuccess={onRefresh} />}
              shortcut={{ modifiers: ["cmd"], key: "n" }}
            />
            <Action.Push
              title="Create New Category"
              icon={Icon.Tag}
              target={<CategoryForm onSuccess={onRefresh} />}
              shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
            />
            <Action
              title={showArchived ? "Hide Archived" : "Show Archived"}
              icon={showArchived ? Icon.EyeDisabled : Icon.Eye}
              onAction={onShowArchivedToggle}
            />
            <Action
              title="Refresh"
              icon={Icon.ArrowClockwise}
              onAction={onRefresh}
              shortcut={{ modifiers: ["cmd"], key: "r" }}
            />
            <Action.Push
              title="Settings"
              icon={Icon.Gear}
              target={<ConfigurationForm onSuccess={onCheckConfiguration} />}
              shortcut={{ modifiers: ["cmd"], key: "," }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
