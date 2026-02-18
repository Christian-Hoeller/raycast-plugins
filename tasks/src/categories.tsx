import { ActionPanel, List, Action, Icon, open } from "@raycast/api";
import { useTasksData } from "./hooks/useTasksData";
import { useCategoryFilters } from "./hooks/useCategoryFilters";
import { ConfigurationFormWrapper } from "./components/ConfigurationFormWrapper";
import { CategoryListItem } from "./components/CategoryListItem";
import { EmptyCategoryListActions } from "./components/actions/EmptyCategoryListActions";

export default function Command() {
  // Custom hooks for data management
  const { tasks, categories, isLoading, isConfigured, loadData, checkConfiguration } = useTasksData();
  const { searchText, setSearchText, showingDetail, toggleDetail, filteredCategories } = useCategoryFilters(
    categories,
    tasks,
  );

  // Navigate to kk command with category filter
  const handleViewTasks = async () => {
    // Raycast doesn't support direct navigation with filters, so we open the kk command
    // Users can then filter manually. This is a limitation of Raycast's API.
    await open("raycast://extensions/hoelc/hoelcy/kk");
  };

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
      searchBarPlaceholder="Search categories..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isShowingDetail={showingDetail}
      isLoading={isLoading}
    >
      {filteredCategories.length === 0 ? (
        <List.EmptyView
          icon={Icon.Tag}
          title="No categories found"
          description="Create a new category with Cmd+N"
          actions={<EmptyCategoryListActions onRefresh={loadData} onCheckConfiguration={checkConfiguration} />}
        />
      ) : (
        <List.Section
          title="Categories"
          subtitle={`${filteredCategories.length} categor${filteredCategories.length !== 1 ? "ies" : "y"} • Sorted alphabetically`}
        >
          {filteredCategories.map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              showingDetail={showingDetail}
              onToggleDetail={toggleDetail}
              onRefresh={loadData}
              onCheckConfiguration={checkConfiguration}
              onViewTasks={handleViewTasks}
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}
