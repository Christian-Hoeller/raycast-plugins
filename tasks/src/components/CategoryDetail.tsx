import { List, Icon } from "@raycast/api";
import { formatRelativeDate } from "../utils/formatters";
import { generateCategoryMarkdown } from "../utils/categoryHelpers";
import type { CategoryWithStats } from "../hooks/useCategoryFilters";

type CategoryDetailProps = {
  category: CategoryWithStats;
};

export function CategoryDetail({ category }: CategoryDetailProps) {
  return (
    <List.Item.Detail
      markdown={generateCategoryMarkdown(category, category.stats)}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="ID" text={`${category.id}`} />
          <List.Item.Detail.Metadata.Separator />

          <List.Item.Detail.Metadata.Label title="Total Tasks" text={`${category.stats.total}`} />
          <List.Item.Detail.Metadata.Label
            title="Active Tasks"
            text={`${category.stats.active}`}
            icon={category.stats.active > 0 ? Icon.Circle : Icon.CheckCircle}
          />
          <List.Item.Detail.Metadata.Label title="Completed Tasks" text={`${category.stats.done}`} />
          <List.Item.Detail.Metadata.Label title="Archived Tasks" text={`${category.stats.archived}`} />

          {category.repositoryUrl && (
            <>
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Link
                title="Repository"
                text={category.repositoryUrl}
                target={category.repositoryUrl}
              />
              {category.branchName && (
                <List.Item.Detail.Metadata.Label title="Branch" text={category.branchName} icon={Icon.CodeBlock} />
              )}
            </>
          )}

          {(category.createdAt || category.updatedAt) && (
            <>
              <List.Item.Detail.Metadata.Separator />
              {category.createdAt && (
                <List.Item.Detail.Metadata.Label
                  title="Created"
                  text={formatRelativeDate(category.createdAt)}
                  icon={Icon.Calendar}
                />
              )}
              {category.updatedAt && (
                <List.Item.Detail.Metadata.Label
                  title="Updated"
                  text={formatRelativeDate(category.updatedAt)}
                  icon={Icon.Clock}
                />
              )}
            </>
          )}
        </List.Item.Detail.Metadata>
      }
    />
  );
}
