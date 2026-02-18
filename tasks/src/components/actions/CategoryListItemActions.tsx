import { ActionPanel, Action, Icon, confirmAlert, Alert, Clipboard, showToast, Toast } from "@raycast/api";
import { deleteCategory } from "../../api/categories";
import { CategoryForm } from "../forms/CategoryForm";
import { DetailToggleAction } from "./DetailToggleAction";
import { SharedCommonActions } from "./SharedCommonActions";
import type { CategoryWithStats } from "../../hooks/useCategoryFilters";

type CategoryListItemActionsProps = {
  category: CategoryWithStats;
  showingDetail: boolean;
  onToggleDetail: () => void;
  onRefresh: () => void;
  onCheckConfiguration: () => void;
  onViewTasks: (categoryId: number) => void;
};

export function CategoryListItemActions({
  category,
  showingDetail,
  onToggleDetail,
  onRefresh,
  onCheckConfiguration,
  onViewTasks,
}: CategoryListItemActionsProps) {
  const handleDelete = async () => {
    if (
      await confirmAlert({
        title: "Delete Category",
        message: `Are you sure you want to delete "${category.category}"? This will not delete tasks in this category.`,
        primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
      })
    ) {
      const success = await deleteCategory(category.id);
      if (success) {
        onRefresh();
      }
    }
  };

  const handleCopyRepoUrl = async () => {
    if (category.repositoryUrl) {
      await Clipboard.copy(category.repositoryUrl);
      await showToast({
        style: Toast.Style.Success,
        title: "Copied to Clipboard",
        message: category.repositoryUrl,
      });
    }
  };

  return (
    <ActionPanel>
      <DetailToggleAction showingDetail={showingDetail} onToggle={onToggleDetail} />
      <Action
        title="View Tasks in Category"
        icon={Icon.List}
        onAction={() => onViewTasks(category.id)}
        shortcut={{ modifiers: ["cmd"], key: "o" }}
      />
      <Action.Push
        title="Edit Category"
        icon={Icon.Pencil}
        target={<CategoryForm category={category} onSuccess={onRefresh} />}
        shortcut={{ modifiers: ["cmd"], key: "e" }}
      />
      {category.repositoryUrl && (
        <Action
          title="Copy Repository URL"
          icon={Icon.Link}
          onAction={handleCopyRepoUrl}
          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
        />
      )}
      <Action
        title="Delete Category"
        icon={Icon.Trash}
        style={Action.Style.Destructive}
        onAction={handleDelete}
        shortcut={{ modifiers: ["cmd"], key: "backspace" }}
      />
      <ActionPanel.Section>
        <Action.Push
          title="Create New Category"
          icon={Icon.Plus}
          target={<CategoryForm onSuccess={onRefresh} />}
          shortcut={{ modifiers: ["cmd"], key: "n" }}
        />
      </ActionPanel.Section>
      <SharedCommonActions onRefresh={onRefresh} onCheckConfiguration={onCheckConfiguration} />
    </ActionPanel>
  );
}
