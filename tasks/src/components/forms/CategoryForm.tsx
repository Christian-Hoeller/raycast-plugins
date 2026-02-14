import { ActionPanel, Action, Form, useNavigation, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { createCategory } from "../../api/categories";
import type { CreateCategoryPayload } from "../../types";

type CategoryFormProps = {
  onSuccess: () => void;
};

interface CategoryFormValues {
  categoryName: string;
  description: string;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<CategoryFormValues>({
    async onSubmit(values) {
      const payload: CreateCategoryPayload = {
        category: values.categoryName.trim(),
        description: values.description.trim() || undefined,
      };

      const result = await createCategory(payload);

      if (result) {
        await showToast({
          style: Toast.Style.Success,
          title: "Category created",
        });
        onSuccess();
        pop();
      }
    },
    initialValues: {
      categoryName: "",
      description: "",
    },
    validation: {
      categoryName: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Category" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Category Name" placeholder="Enter category name" {...itemProps.categoryName} />
      <Form.TextField title="Description" placeholder="Optional description" {...itemProps.description} />
    </Form>
  );
}
