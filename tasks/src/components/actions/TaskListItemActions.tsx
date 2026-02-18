import { ActionPanel, Action, Icon, confirmAlert, Alert } from "@raycast/api";
import { TaskForm } from "../forms/TaskForm";
import { TaskDescriptionForm } from "../forms/TaskDescriptionForm";
import { DetailToggleAction } from "./DetailToggleAction";
import { SharedCommonActions } from "./SharedCommonActions";
import { hasValidRepository } from "../../utils/categoryHelpers";
import type { Task, TaskCategory, Priority } from "../../types";

type TaskListItemActionsProps = {
  task: Task;
  categories: TaskCategory[];
  priorities: Priority[];
  category: TaskCategory | undefined;
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
  onSendToCodingAgent: (task: Task) => void;
};

export function TaskListItemActions({
  task,
  categories,
  priorities,
  category,
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
  onSendToCodingAgent,
}: TaskListItemActionsProps) {
  return (
    <ActionPanel>
      <DetailToggleAction showingDetail={showingDetail} onToggle={onToggleDetail} />
      <Action
        title="Toggle Done"
        icon={Icon.Check}
        onAction={() => onToggleDone(task)}
        shortcut={{ modifiers: ["cmd"], key: "enter" }}
      />
      {hasValidRepository(category) && (
        <Action
          title="Send to Coding Agent"
          icon={Icon.Rocket}
          onAction={() => onSendToCodingAgent(task)}
          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
        />
      )}
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
        target={<TaskForm categories={categories} priorities={priorities} task={task} onSuccess={onRefresh} />}
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
          target={
            <TaskForm
              categories={categories}
              priorities={priorities}
              initialTaskName={searchText}
              onSuccess={onRefresh}
            />
          }
          shortcut={{ modifiers: ["cmd"], key: "n" }}
        />
        <Action
          title={showArchived ? "Hide Archived" : "Show Archived"}
          icon={showArchived ? Icon.EyeDisabled : Icon.Eye}
          onAction={onShowArchivedToggle}
        />
      </ActionPanel.Section>
      <SharedCommonActions onRefresh={onRefresh} onCheckConfiguration={onCheckConfiguration} />
    </ActionPanel>
  );
}
