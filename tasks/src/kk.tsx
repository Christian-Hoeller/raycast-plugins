import { ActionPanel, List, Action, Icon } from "@raycast/api";
import { useState } from "react";
import { useTasksData } from "./hooks/useTasksData";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { useTaskActions } from "./hooks/useTaskActions";
import { useDetailToggle } from "./hooks/useDetailToggle";
import { getCategoryName } from "./utils/categoryHelpers";
import { getTaskCountByCategory, type SortMode } from "./utils/taskHelpers";
import { ConfigurationFormWrapper } from "./components/ConfigurationFormWrapper";
import { TaskListItem } from "./components/TaskListItem";
import { EmptyTaskListActions } from "./components/actions/EmptyTaskListActions";

export default function Command() {
  // Custom hooks for data management
  const { tasks, setTasks, categories, priorities, isLoading, isConfigured, loadData, checkConfiguration } =
    useTasksData();
  const [sortMode, setSortMode] = useState<SortMode>("createdAt");
  const { showingDetail, setShowingDetail } = useDetailToggle();
  const {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    showArchived,
    setShowArchived,
    showDueToday,
    setShowDueToday,
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
            <EmptyTaskListActions
              categories={categories}
              priorities={priorities}
              searchText={searchText}
              showArchived={showArchived}
              showDueToday={showDueToday}
              sortMode={sortMode}
              onRefresh={loadData}
              onShowArchivedToggle={() => setShowArchived(!showArchived)}
              onShowDueTodayToggle={() => setShowDueToday(!showDueToday)}
              onSortModeToggle={() => setSortMode(sortMode === "priority" ? "createdAt" : "priority")}
              onCheckConfiguration={checkConfiguration}
            />
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
              showDueToday={showDueToday}
              searchText={searchText}
              description={taskDescriptions[task.id]}
              onToggleDetail={() => setShowingDetail(!showingDetail)}
              onToggleDone={handleToggleDone}
              onToggleArchived={handleToggleArchived}
              onDelete={handleDeleteTask}
              onUpdateDescription={updateTaskDescription}
              onShowArchivedToggle={() => setShowArchived(!showArchived)}
              onShowDueTodayToggle={() => setShowDueToday(!showDueToday)}
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
