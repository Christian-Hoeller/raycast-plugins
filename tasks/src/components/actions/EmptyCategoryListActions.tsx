import { ActionPanel, Action, Icon } from "@raycast/api";
import { CategoryForm } from "../forms/CategoryForm";
import { SharedCommonActions } from "./SharedCommonActions";

type EmptyCategoryListActionsProps = {
  onRefresh: () => void;
  onCheckConfiguration: () => void;
};

export function EmptyCategoryListActions({ onRefresh, onCheckConfiguration }: EmptyCategoryListActionsProps) {
  return (
    <ActionPanel>
      <Action.Push
        title="Create Category"
        icon={Icon.Plus}
        target={<CategoryForm onSuccess={onRefresh} />}
        shortcut={{ modifiers: ["cmd"], key: "n" }}
      />
      <SharedCommonActions
        onRefresh={onRefresh}
        onCheckConfiguration={onCheckConfiguration}
        showCreateCategory={false}
      />
    </ActionPanel>
  );
}
