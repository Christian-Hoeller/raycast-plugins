import { List, Icon } from "@raycast/api";
import { getCategoryColor } from "../utils/categoryHelpers";
import { CategoryDetail } from "./CategoryDetail";
import { CategoryListItemActions } from "./actions/CategoryListItemActions";
import type { CategoryWithStats } from "../hooks/useCategoryFilters";

type CategoryListItemProps = {
  category: CategoryWithStats;
  showingDetail: boolean;
  onToggleDetail: () => void;
  onRefresh: () => void;
  onCheckConfiguration: () => void;
  onViewTasks: (categoryId: number) => void;
};

export function CategoryListItem({
  category,
  showingDetail,
  onToggleDetail,
  onRefresh,
  onCheckConfiguration,
  onViewTasks,
}: CategoryListItemProps) {
  const hasRepository = Boolean(category.repositoryUrl);

  return (
    <List.Item
      icon={{ source: Icon.Tag, tintColor: getCategoryColor(category.category) }}
      title={category.category}
      subtitle={!showingDetail ? category.description || "" : undefined}
      accessories={
        !showingDetail
          ? [
              {
                text: `${category.stats.active} active`,
                icon: category.stats.active > 0 ? Icon.Circle : Icon.CheckCircle,
              },
              {
                tag: {
                  value: `${category.stats.total} total`,
                  color: getCategoryColor(category.category),
                },
              },
              ...(hasRepository
                ? [
                    {
                      icon: Icon.CodeBlock,
                      tooltip: `${category.repositoryUrl}${category.branchName ? ` (${category.branchName})` : ""}`,
                    },
                  ]
                : []),
            ]
          : undefined
      }
      detail={<CategoryDetail category={category} />}
      actions={
        <CategoryListItemActions
          category={category}
          showingDetail={showingDetail}
          onToggleDetail={onToggleDetail}
          onRefresh={onRefresh}
          onCheckConfiguration={onCheckConfiguration}
          onViewTasks={onViewTasks}
        />
      }
    />
  );
}
