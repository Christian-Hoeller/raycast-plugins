import { ActionPanel, Action, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import { createCategory } from "../../api/categories";
import type { CreateCategoryPayload } from "../../types";

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const { pop } = useNavigation();
  const [categoryName, setCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit() {
    if (!categoryName.trim()) {
      return;
    }

    setIsLoading(true);

    const payload: CreateCategoryPayload = {
      category: categoryName.trim(),
      description: description.trim() || undefined,
    };

    const result = await createCategory(payload);

    setIsLoading(false);

    if (result) {
      onSuccess();
      pop();
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Category" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="category"
        title="Category Name"
        placeholder="Enter category name"
        value={categoryName}
        onChange={setCategoryName}
      />
      <Form.TextField
        id="description"
        title="Description"
        placeholder="Optional description"
        value={description}
        onChange={setDescription}
      />
    </Form>
  );
}
