import { ActionPanel, Action, Icon } from "@raycast/api";
import { type SortMode } from "../../utils/taskHelpers";
import { TaskForm } from "../forms/TaskForm";
import { SharedCommonActions } from "./SharedCommonActions";
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
      <ActionPanel.Section>
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
      </ActionPanel.Section>
      <SharedCommonActions onRefresh={onRefresh} onCheckConfiguration={onCheckConfiguration} />
    </ActionPanel>
  );
}
