import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { createCategory, updateCategory } from "../../api/categories";
import type { CreateCategoryPayload, TaskCategory } from "../../types";

type CategoryFormProps = {
  category?: TaskCategory;
  onSuccess: () => void;
};

interface CategoryFormValues {
  category: string;
  description: string;
  repositoryUrl: string;
  branchName: string;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { pop } = useNavigation();
  const isEditing = !!category;

  const { handleSubmit, itemProps } = useForm<CategoryFormValues>({
    async onSubmit(values) {
      const payload: CreateCategoryPayload = {
        category: values.category.trim(),
        description: values.description.trim() || undefined,
        repositoryUrl: values.repositoryUrl.trim() || undefined,
        branchName: values.branchName.trim() || undefined,
      };

      let result;
      if (isEditing && category) {
        // Update existing category
        result = await updateCategory(category.id, payload);
      } else {
        // Create new category
        result = await createCategory(payload);
      }

      if (result) {
        onSuccess();
        pop();
      }
    },
    initialValues: {
      category: category?.category || "",
      description: category?.description || "",
      repositoryUrl: category?.repositoryUrl || "",
      branchName: category?.branchName || "",
    },
    validation: {
      category: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={isEditing ? "Update Category" : "Create Category"} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Category Name" placeholder="Enter category name" {...itemProps.category} />
      <Form.TextField title="Description" placeholder="Optional description" {...itemProps.description} />
      <Form.TextField
        title="Repository URL"
        placeholder="https://github.com/username/repo (optional)"
        {...itemProps.repositoryUrl}
      />
      <Form.TextField title="Branch Name" placeholder="main, dev, etc. (optional)" {...itemProps.branchName} />
    </Form>
  );
}
