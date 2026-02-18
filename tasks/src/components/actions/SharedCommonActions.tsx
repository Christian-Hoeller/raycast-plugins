import { ActionPanel, Action, Icon } from "@raycast/api";
import { CategoryForm } from "../forms/CategoryForm";
import { ConfigurationFormWrapper } from "../ConfigurationFormWrapper";

type SharedCommonActionsProps = {
  onRefresh: () => void;
  onCheckConfiguration: () => void;
  showCreateCategory?: boolean;
};

/**
 * Shared common actions used across multiple commands
 * Includes: Create Category, Refresh, Settings
 */
export function SharedCommonActions({
  onRefresh,
  onCheckConfiguration,
  showCreateCategory = true,
}: SharedCommonActionsProps) {
  return (
    <ActionPanel.Section>
      {showCreateCategory && (
        <Action.Push
          title="Create New Category"
          icon={Icon.Tag}
          target={<CategoryForm onSuccess={onRefresh} />}
          shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
        />
      )}
      <Action
        title="Refresh"
        icon={Icon.ArrowClockwise}
        onAction={onRefresh}
        shortcut={{ modifiers: ["cmd"], key: "r" }}
      />
      <Action.Push
        title="Settings"
        icon={Icon.Gear}
        target={<ConfigurationFormWrapper onSuccess={onCheckConfiguration} />}
      />
    </ActionPanel.Section>
  );
}
