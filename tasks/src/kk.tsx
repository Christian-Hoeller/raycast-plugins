import { ActionPanel, List, Action, Icon } from "@raycast/api";
import { useState } from "react";
import { useTasksData } from "./hooks/useTasksData";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { useTaskActions } from "./hooks/useTaskActions";
import { getCategoryName } from "./utils/categoryHelpers";
import { getTaskCountByCategory, type SortMode } from "./utils/taskHelpers";
import { TaskForm } from "./components/forms/TaskForm";
import { ConfigurationFormWrapper } from "./components/ConfigurationFormWrapper";
import { TaskListItem } from "./components/TaskListItem";

export default function Command() {
  // Custom hooks for data management
  const { tasks, setTasks, categories, priorities, isLoading, isConfigured, loadData, checkConfiguration } =
    useTasksData();
  const [sortMode, setSortMode] = useState<SortMode>("createdAt");
  const {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    showArchived,
    setShowArchived,
    showingDetail,
    setShowingDetail,
    filteredTasks,
  } = useTaskFilters(tasks, priorities, sortMode);
  const {
    taskDescriptions,
    handleToggleDone,
    handleToggleArchived,
    handleDeleteTask,
    updateTaskDescription,
    handleSendToCodingAgent,
  } = useTaskActions(tasks, setTasks);

  // Show configuration form if not configured
  if (isConfigured === false) {
    return (
      <List isLoading={false}>
        <List.EmptyView
          icon={Icon.Gear}
          title="Configuration Required"
          description="Please configure your n8n webhook endpoints to get started"
          actions={
            <ActionPanel>
              <Action.Push
                title="Configure Endpoints"
                icon={Icon.Gear}
                target={<ConfigurationFormWrapper onSuccess={checkConfiguration} />}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  // Show loading while checking configuration
  if (isConfigured === null) {
    return <List isLoading={true} />;
  }

  return (
    <List
      searchBarPlaceholder="Add new task or search..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isShowingDetail={showingDetail}
      isLoading={isLoading}
      searchBarAccessory={
        <List.Dropdown tooltip="Select Category" value={selectedCategory} onChange={setSelectedCategory}>
          <List.Dropdown.Item title={`All • ${getTaskCountByCategory(tasks, "All")}`} value="All" />
          {categories.map((category) => (
            <List.Dropdown.Item
              key={category.id}
              title={`${category.category || "Unnamed"} • ${getTaskCountByCategory(tasks, category.id)}`}
              value={category.id.toString()}
            />
          ))}
        </List.Dropdown>
      }
    >
      {filteredTasks.length === 0 ? (
        <List.EmptyView
          icon={Icon.Checkmark}
          title={showArchived ? "No tasks found" : "No active tasks"}
          description={
            showArchived
              ? "Create a new task with Cmd+N"
              : "All tasks completed! Create a new task with Cmd+N or show archived with Cmd+Shift+A"
          }
          actions={
            <ActionPanel>
              <Action.Push
                title="Create Task"
                icon={Icon.Plus}
                target={
                  <TaskForm
                    categories={categories}
                    priorities={priorities}
                    initialTaskName={searchText}
                    onSuccess={loadData}
                  />
                }
                shortcut={{ modifiers: ["cmd"], key: "n" }}
              />
              <Action
                title={showArchived ? "Hide Archived" : "Show Archived"}
                icon={showArchived ? Icon.EyeDisabled : Icon.Eye}
                onAction={() => setShowArchived(!showArchived)}
                shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
              />
              <Action
                title={`Sort by ${sortMode === "priority" ? "Date" : "Priority"}`}
                icon={sortMode === "priority" ? Icon.Calendar : Icon.LevelMeter}
                onAction={() => setSortMode(sortMode === "priority" ? "createdAt" : "priority")}
                shortcut={{ modifiers: ["cmd"], key: "t" }}
              />
              <Action.Push
                title="Settings"
                icon={Icon.Gear}
                target={<ConfigurationFormWrapper onSuccess={checkConfiguration} />}
                shortcut={{ modifiers: ["cmd"], key: "," }}
              />
            </ActionPanel>
          }
        />
      ) : (
        <List.Section
          title="Tasks"
          subtitle={`${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""} • Sorted by ${sortMode === "priority" ? "Priority" : "Date"}`}
        >
          {filteredTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              categoryName={getCategoryName(task, categories)}
              categories={categories}
              priorities={priorities}
              showingDetail={showingDetail}
              showArchived={showArchived}
              searchText={searchText}
              description={taskDescriptions[task.id]}
              onToggleDetail={() => setShowingDetail(!showingDetail)}
              onToggleDone={handleToggleDone}
              onToggleArchived={handleToggleArchived}
              onDelete={handleDeleteTask}
              onUpdateDescription={updateTaskDescription}
              onShowArchivedToggle={() => setShowArchived(!showArchived)}
              onRefresh={loadData}
              onCheckConfiguration={checkConfiguration}
              onSendToCodingAgent={handleSendToCodingAgent}
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}
