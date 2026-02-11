import { ActionPanel, List, Action, Icon, Form } from "@raycast/api";
import { useState } from "react";

interface Task {
  id: string;
  archived: boolean;
  done: boolean;
  task: string;
  due: string;
  category: string;
  description?: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    task: "Review pull requests",
    category: "Work",
    done: false,
    archived: false,
    due: "2026-02-15",
    description: "Review the pending PRs in the team repository. Focus on code quality and test coverage.",
  },
  {
    id: "2",
    task: "Buy groceries",
    category: "Personal",
    done: false,
    archived: false,
    due: "2026-02-12",
    description: "Weekly grocery shopping: milk, eggs, bread, vegetables, fruits",
  },
  {
    id: "3",
    task: "Schedule dentist appointment",
    category: "Health",
    done: true,
    archived: false,
    due: "2026-02-11",
  },
  {
    id: "4",
    task: "Update project documentation",
    category: "Work",
    done: false,
    archived: false,
    due: "2026-02-20",
    description: "Update README and API documentation for the new features released in v2.0",
  },
  {
    id: "5",
    task: "Plan weekend trip",
    category: "Personal",
    done: false,
    archived: false,
    due: "2026-02-13",
  },
  {
    id: "6",
    task: "Review budget",
    category: "Finance",
    done: false,
    archived: false,
    due: "2026-02-28",
    description: "Review monthly expenses and adjust budget categories for next quarter",
  },
  {
    id: "7",
    task: "Call mom",
    category: "Personal",
    done: true,
    archived: false,
    due: "2026-02-11",
    description: "Weekly catch-up call with mom to discuss family updates",
  },
  {
    id: "8",
    task: "Fix production bug",
    category: "Work",
    done: false,
    archived: false,
    due: "2026-02-12",
    description: "Critical bug causing user authentication failures. Affecting 5% of users.",
  },
];

const CATEGORIES = ["All", "Work", "Personal", "Health", "Finance"];

export default function Command() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");
  const [showingDetail, setShowingDetail] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const toggleTaskDone = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  };

  const toggleTaskArchived = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? { ...t, archived: !t.archived } : t)));
  };

  const updateTaskDescription = (taskId: string, description: string) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? { ...t, description } : t)));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
    const matchesSearch = task.task.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <List
      searchBarPlaceholder="Add new task or search..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isShowingDetail={showingDetail}
      searchBarAccessory={
        <List.Dropdown tooltip="Select Category" value={selectedCategory} onChange={setSelectedCategory}>
          {CATEGORIES.map((category) => (
            <List.Dropdown.Item key={category} title={category} value={category} />
          ))}
        </List.Dropdown>
      }
    >
      <List.Section title="Tasks" subtitle={`${filteredTasks.length} tasks`}>
        {filteredTasks.map((task) => (
          <List.Item
            key={task.id}
            icon={task.done ? Icon.CheckCircle : Icon.Circle}
            title={task.task}
            subtitle={!showingDetail ? task.category : undefined}
            accessories={
              !showingDetail
                ? [
                    { text: task.done ? "Done" : "Pending" },
                    { tag: { value: task.category, color: getCategoryColor(task.category) } },
                  ]
                : undefined
            }
            detail={
              <List.Item.Detail
                markdown={generateTaskMarkdown(task)}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Task" text={task.task} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label
                      title="Status"
                      text={task.done ? "Done" : "Pending"}
                      icon={task.done ? Icon.CheckCircle : Icon.Circle}
                    />
                    <List.Item.Detail.Metadata.Label title="Category" text={task.category} />
                    <List.Item.Detail.Metadata.Label
                      title="Archived"
                      text={task.archived ? "Yes" : "No"}
                      icon={task.archived ? Icon.Box : Icon.Circle}
                    />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Due Date" text={task.due} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Description" text={task.description || "No description"} />
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
                  onAction={() => toggleTaskDone(task.id)}
                  shortcut={{ modifiers: ["cmd"], key: "enter" }}
                />
                <Action
                  title="Toggle Archive"
                  icon={Icon.Box}
                  onAction={() => toggleTaskArchived(task.id)}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
                />
                <Action.Push
                  title="Edit Description"
                  icon={Icon.Pencil}
                  target={
                    <TaskDescriptionForm
                      task={task}
                      onSave={(description) => updateTaskDescription(task.id, description)}
                    />
                  }
                  shortcut={{ modifiers: ["cmd"], key: "e" }}
                />
                <Action
                  title="Delete Task"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={() => console.log("Delete", task.id)}
                  shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

function TaskDescriptionForm({ task, onSave }: { task: Task; onSave: (description: string) => void }) {
  const [description, setDescription] = useState<string>(task.description || "");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Save Description"
            onSubmit={() => {
              onSave(description);
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
        value={description}
        onChange={setDescription}
      />
    </Form>
  );
}

function generateTaskMarkdown(task: Task): string {
  return `
# ${task.task}

${task.description || "_No description provided_"}

---

**Category:** ${task.category}  
**Status:** ${task.done ? "✅ Done" : "⏳ Pending"}  
**Archived:** ${task.archived ? "📦 Yes" : "No"}  
**Due Date:** ${task.due}
  `.trim();
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Work: "#FF6B6B",
    Personal: "#4ECDC4",
    Health: "#95E1D3",
    Finance: "#F38181",
  };
  return colors[category] || "#999999";
}
