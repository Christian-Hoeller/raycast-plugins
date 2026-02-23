import { List, Icon } from "@raycast/api";
import { formatRelativeDate, isOverdue } from "../utils/formatters";
import { getCategoryColor } from "../utils/categoryHelpers";
import { getPriorityName, getPriorityColor } from "../utils/priorityHelpers";
import { TaskDetail } from "./TaskDetail";
import { TaskListItemActions } from "./actions/TaskListItemActions";
import type { Task, TaskCategory, Priority } from "../types";

type TaskListItemProps = {
  task: Task;
  categoryName: string;
  categories: TaskCategory[];
  priorities: Priority[];
  showingDetail: boolean;
  showArchived: boolean;
  showDueToday: boolean;
  searchText: string;
  description?: string;
  onToggleDetail: () => void;
  onToggleDone: (task: Task) => void;
  onToggleArchived: (task: Task) => void;
  onDelete: (task: Task) => void;
  onUpdateDescription: (taskId: number, description: string) => void;
  onShowArchivedToggle: () => void;
  onShowDueTodayToggle: () => void;
  onRefresh: () => void;
  onCheckConfiguration: () => void;
  onSendToCodingAgent: (task: Task) => void;
};

export function TaskListItem({
  task,
  categoryName,
  categories,
  priorities,
  showingDetail,
  showArchived,
  showDueToday,
  searchText,
  description,
  onToggleDetail,
  onToggleDone,
  onToggleArchived,
  onDelete,
  onUpdateDescription,
  onShowArchivedToggle,
  onShowDueTodayToggle,
  onRefresh,
  onCheckConfiguration,
  onSendToCodingAgent,
}: TaskListItemProps) {
  const overdue = !task.done && isOverdue(task.due);
  const category = categories.find((cat) => cat.id === task.categoryId);

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
              {
                tag: {
                  value: getPriorityName(priorities, task.priorityId),
                  color: getPriorityColor(priorities, task.priorityId),
                },
              },
              { tag: { value: categoryName, color: getCategoryColor(categoryName) } },
              ...(task.archived ? [{ icon: Icon.Box }] : []),
            ]
          : undefined
      }
      detail={
        <TaskDetail
          task={task}
          categoryName={categoryName}
          categories={categories}
          priorities={priorities}
          description={description}
        />
      }
      actions={
        <TaskListItemActions
          task={task}
          categories={categories}
          priorities={priorities}
          category={category}
          showingDetail={showingDetail}
          showArchived={showArchived}
          showDueToday={showDueToday}
          searchText={searchText}
          description={description}
          onToggleDetail={onToggleDetail}
          onToggleDone={onToggleDone}
          onToggleArchived={onToggleArchived}
          onDelete={onDelete}
          onUpdateDescription={onUpdateDescription}
          onShowArchivedToggle={onShowArchivedToggle}
          onShowDueTodayToggle={onShowDueTodayToggle}
          onRefresh={onRefresh}
          onCheckConfiguration={onCheckConfiguration}
          onSendToCodingAgent={onSendToCodingAgent}
        />
      }
    />
  );
}
