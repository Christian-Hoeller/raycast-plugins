import { Action, Icon } from "@raycast/api";

type DetailToggleActionProps = {
  showingDetail: boolean;
  onToggle: () => void;
};

/**
 * Shared action for toggling detail view
 * Used consistently across all list-based commands
 */
export function DetailToggleAction({ showingDetail, onToggle }: DetailToggleActionProps) {
  return (
    <Action
      title={showingDetail ? "Hide Details" : "Show Details"}
      icon={showingDetail ? Icon.EyeDisabled : Icon.Eye}
      onAction={onToggle}
      shortcut={{ modifiers: ["cmd"], key: "d" }}
    />
  );
}
