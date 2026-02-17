import { ActionPanel, Action, Icon } from "@raycast/api";
import { type SortMode } from "../../utils/taskHelpers";
import { TaskForm } from "../forms/TaskForm";
import { CategoryForm } from "../forms/CategoryForm";
import { ConfigurationFormWrapper } from "../ConfigurationFormWrapper";
import type { TaskCategory, Priority } from "../../types";

type EmptyTaskListActionsProps = {
  categories: TaskCategory[];
  priorities: Priority[];
  searchText: string;
  showArchived: boolean;
  sortMode: SortMode;
  onRefresh: () => void;
  onShowArchivedToggle: () => void;
  onSortModeToggle: () => void;
  onCheckConfiguration: () => void;
};

export function EmptyTaskListActions({
  categories,
  priorities,
  searchText,
  showArchived,
  sortMode,
  onRefresh,
  onShowArchivedToggle,
  onSortModeToggle,
  onCheckConfiguration,
}: EmptyTaskListActionsProps) {
  return (
    <ActionPanel>
      <Action.Push
        title="Create Task"
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
        shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
      />
      <Action
        title={`Sort by ${sortMode === "priority" ? "Date" : "Priority"}`}
        icon={sortMode === "priority" ? Icon.Calendar : Icon.LevelMeter}
        onAction={onSortModeToggle}
        shortcut={{ modifiers: ["cmd"], key: "t" }}
      />
      <Action.Push
        title="Settings"
        icon={Icon.Gear}
        target={<ConfigurationFormWrapper onSuccess={onCheckConfiguration} />}
        shortcut={{ modifiers: ["cmd"], key: "," }}
      />
    </ActionPanel>
  );
}
