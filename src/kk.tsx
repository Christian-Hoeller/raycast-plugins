import { ActionPanel, List, Action, Icon, Form, confirmAlert, Alert } from "@raycast/api";
import { useState, useEffect } from "react";
import { fetchTasks, updateTask, deleteTask } from "./api/tasks";
import { fetchCategories } from "./api/categories";
import { formatRelativeDate, isOverdue } from "./utils/formatters";
import { hasConfig } from "./utils/config";
import { TaskForm } from "./components/TaskForm";
import { CategoryForm } from "./components/CategoryForm";
import { ConfigurationForm } from "./components/ConfigurationForm";
import type { Task, TaskCategory } from "./types";

export default function Command() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");
  const [showingDetail, setShowingDetail] = useState<boolean>(false);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [taskDescriptions, setTaskDescriptions] = useState<Record<number, string>>({});
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Check configuration on mount
  useEffect(() => {
    checkConfiguration();
  }, []);

  async function checkConfiguration() {
    const configured = await hasConfig();
    setIsConfigured(configured);
    if (configured) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }

  async function loadData() {
    setIsLoading(true);
    const [fetchedCategories, fetchedTasks] = await Promise.all([fetchCategories(), fetchTasks()]);
    setCategories(fetchedCategories);
    setTasks(fetchedTasks);
    setIsLoading(false);
  }

  async function handleToggleDone(task: Task) {
    const updated = await updateTask(task.id, { done: !task.done });
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
    }
  }

  async function handleToggleArchived(task: Task) {
    const updated = await updateTask(task.id, { archived: !task.archived });
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, archived: !t.archived } : t)));
    }
  }

  async function handleDeleteTask(task: Task) {
    const success = await deleteTask(task.id);
    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }
  }

  function updateTaskDescription(taskId: number, description: string) {
    setTaskDescriptions((prev) => ({ ...prev, [taskId]: description }));
  }

  const filteredTasks = tasks.filter((task) => {
    // Filter by archived status
    if (!showArchived && task.archived) {
      return false;
    }

    // Filter by category
    const matchesCategory = selectedCategory === "All" || task.categoryId.toString() === selectedCategory;

    // Filter by search text
    const matchesSearch = task.task.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function getCategoryName(task: Task): string {
    const category = categories.find((cat) => cat.id === task.categoryId);
    return category?.category || "Unknown";
  }

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
                target={<ConfigurationForm onSuccess={checkConfiguration} />}
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
          <List.Dropdown.Item title="All" value="All" />
          {categories.map((category) => (
            <List.Dropdown.Item key={category.id} title={category.category} value={category.id.toString()} />
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
                target={<TaskForm categories={categories} initialTaskName={searchText} onSuccess={loadData} />}
                shortcut={{ modifiers: ["cmd"], key: "n" }}
              />
              <Action
                title={showArchived ? "Hide Archived" : "Show Archived"}
                icon={showArchived ? Icon.EyeDisabled : Icon.Eye}
                onAction={() => setShowArchived(!showArchived)}
                shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
              />
              <Action.Push
                title="Settings"
                icon={Icon.Gear}
                target={<ConfigurationForm onSuccess={checkConfiguration} />}
                shortcut={{ modifiers: ["cmd"], key: "," }}
              />
            </ActionPanel>
          }
        />
      ) : (
        <List.Section title="Tasks" subtitle={`${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}`}>
          {filteredTasks.map((task) => {
            const categoryName = getCategoryName(task);
            const overdue = !task.done && isOverdue(task.due);

            return (
              <List.Item
                key={task.id}
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
                        { tag: { value: categoryName, color: getCategoryColor(categoryName) } },
                        ...(task.archived ? [{ icon: Icon.Box }] : []),
                      ]
                    : undefined
                }
                detail={
                  <List.Item.Detail
                    markdown={generateTaskMarkdown(task, categoryName, taskDescriptions[task.id])}
                    metadata={
                      <List.Item.Detail.Metadata>
                        <List.Item.Detail.Metadata.Label title="Task" text={task.task} />
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label
                          title="Status"
                          text={task.done ? "Done" : "Pending"}
                          icon={task.done ? Icon.CheckCircle : Icon.Circle}
                        />
                        <List.Item.Detail.Metadata.Label title="Category" text={categoryName} />
                        <List.Item.Detail.Metadata.Label
                          title="Archived"
                          text={task.archived ? "Yes" : "No"}
                          icon={task.archived ? Icon.Box : Icon.Circle}
                        />
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label
                          title="Due Date"
                          text={`${formatRelativeDate(task.due)}${overdue ? " (Overdue)" : ""}`}
                          icon={overdue ? { source: Icon.ExclamationMark, tintColor: "#FF0000" } : undefined}
                        />
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label
                          title="Description"
                          text={taskDescriptions[task.id] || "No description"}
                        />
                      </List.Item.Detail.Metadata>
                    }
                  />
                }
                actions={
                  <ActionPanel>
                    <Action
                      title={showingDetail ? "Hide Details" : "Show Details"}
                      icon={showingDetail ? Icon.EyeDisabled : Icon.Eye}
                      onAction={() => setShowingDetail(!showingDetail)}
                      shortcut={{ modifiers: ["cmd"], key: "d" }}
                    />
                    <Action
                      title="Toggle Done"
                      icon={Icon.Check}
                      onAction={() => handleToggleDone(task)}
                      shortcut={{ modifiers: ["cmd"], key: "enter" }}
                    />
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
                          handleToggleArchived(task);
                        }
                      }}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
                    />
                    <Action.Push
                      title="Edit Task"
                      icon={Icon.Pencil}
                      target={<TaskForm categories={categories} task={task} onSuccess={loadData} />}
                      shortcut={{ modifiers: ["cmd"], key: "e" }}
                    />
                    <Action.Push
                      title="Edit Description"
                      icon={Icon.Text}
                      target={
                        <TaskDescriptionForm
                          task={task}
                          description={taskDescriptions[task.id]}
                          onSave={(description) => updateTaskDescription(task.id, description)}
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
                          handleDeleteTask(task);
                        }
                      }}
                      shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                    />
                    <ActionPanel.Section>
                      <Action.Push
                        title="Create New Task"
                        icon={Icon.Plus}
                        target={<TaskForm categories={categories} initialTaskName={searchText} onSuccess={loadData} />}
                        shortcut={{ modifiers: ["cmd"], key: "n" }}
                      />
                      <Action.Push
                        title="Create New Category"
                        icon={Icon.Tag}
                        target={<CategoryForm onSuccess={loadData} />}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
                      />
                      <Action
                        title={showArchived ? "Hide Archived" : "Show Archived"}
                        icon={showArchived ? Icon.EyeDisabled : Icon.Eye}
                        onAction={() => setShowArchived(!showArchived)}
                      />
                      <Action
                        title="Refresh"
                        icon={Icon.ArrowClockwise}
                        onAction={loadData}
                        shortcut={{ modifiers: ["cmd"], key: "r" }}
                      />
                      <Action.Push
                        title="Settings"
                        icon={Icon.Gear}
                        target={<ConfigurationForm onSuccess={checkConfiguration} />}
                        shortcut={{ modifiers: ["cmd"], key: "," }}
                      />
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}

function TaskDescriptionForm({
  task,
  description,
  onSave,
}: {
  task: Task;
  description?: string;
  onSave: (description: string) => void;
}) {
  const [localDescription, setLocalDescription] = useState<string>(description || "");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Save Description"
            onSubmit={() => {
              onSave(localDescription);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description title="Task" text={task.task} />
      <Form.Separator />
      <Form.TextArea
        id="description"
        title="Description"
        placeholder="Enter task description..."
        value={localDescription}
        onChange={setLocalDescription}
      />
    </Form>
  );
}

function generateTaskMarkdown(task: Task, categoryName: string, description?: string): string {
  const overdue = !task.done && isOverdue(task.due);
  return `
# ${task.task}

${description || "_No description provided_"}

---

**Category:** ${categoryName}  
**Status:** ${task.done ? "✅ Done" : "⏳ Pending"}  
**Archived:** ${task.archived ? "📦 Yes" : "No"}  
**Due Date:** ${formatRelativeDate(task.due)}${overdue ? " ⚠️ **Overdue**" : ""}
  `.trim();
}

function getCategoryColor(category: string): string {
  // Generate a consistent color based on category name hash
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = ["#FF6B6B", "#4ECDC4", "#95E1D3", "#F38181", "#AA96DA", "#FCBAD3", "#FFFFD2", "#A8D8EA"];
  return colors[Math.abs(hash) % colors.length];
}
