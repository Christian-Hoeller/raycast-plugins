# Agent Development Guide

This document provides guidelines for AI coding agents working in this Raycast extension codebase.

## Project Overview

**Type**: Raycast Extension (desktop productivity tool)  
**Purpose**: Interface for interacting with a personal n8n instance  
**Tech Stack**: TypeScript 5.8+ | React 19 | Node.js 22.14+  
**Platform**: Raycast Desktop (macOS, Windows)

## Build & Development Commands

### Essential Commands

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Run linter
npm run lint

# Auto-fix linting issues
npm run fix-lint

# Publish to Raycast Store
npm run publish
```

### Testing

**Note**: No testing framework is currently configured. When adding tests:

- Consider using Vitest (recommended for Raycast extensions)
- Place test files alongside source files with `.test.tsx` or `.test.ts` extensions
- Run tests with: `npm test` (after configuration)

### Running Single Tests

Not applicable yet - testing framework needs to be set up first.

## Code Style Guidelines

### Import Organization

```typescript
// 1. External dependencies (Raycast API)
import { ActionPanel, Detail, List, Action, Icon } from "@raycast/api";
import { useFetch, usePromise } from "@raycast/utils";

// 2. Internal modules (when they exist)
import { formatWorkflow } from "./utils/formatters";
import { N8nClient } from "./services/n8n-client";

// 3. Types
import type { Workflow, Execution } from "./types";
```

### Formatting Rules

- **Line width**: 120 characters maximum
- **Quotes**: Double quotes (not single quotes)
- **Formatting tool**: Prettier (automatic via ESLint)
- **Run formatter**: `npm run fix-lint`

### TypeScript Guidelines

#### Strict Mode Enabled

- All code must pass TypeScript strict mode checks
- No `any` types unless absolutely necessary (use `unknown` instead)
- Explicit return types for exported functions

#### Type Definitions

```typescript
// ✅ Good: Explicit types
export function fetchWorkflows(): Promise<Workflow[]> {
  // ...
}

// ✅ Good: Interface for component props
interface CommandProps {
  workflowId: string;
  onComplete?: () => void;
}

// ❌ Bad: Implicit any
export function processData(data) {
  // ...
}

// ❌ Bad: Using any
function handleError(error: any) {
  // ...
}
```

#### React Components

```typescript
// ✅ Good: Default export for commands
export default function Command() {
  return <List>...</List>;
}

// ✅ Good: Named export for reusable components
export function WorkflowItem({ workflow }: { workflow: Workflow }) {
  return <List.Item title={workflow.name} />;
}

// Note: No need to import React (using automatic JSX runtime)
```

### Naming Conventions

#### Files

- Commands: Use kebab-case or simple names (e.g., `kk.tsx`, `list-workflows.tsx`)
- Components: Use PascalCase (e.g., `WorkflowList.tsx`, `ExecutionDetail.tsx`)
- Utils: Use kebab-case (e.g., `format-date.ts`, `api-client.ts`)
- Types: Use PascalCase (e.g., `Workflow.ts`, `N8nTypes.ts`)

#### Variables & Functions

```typescript
// ✅ Good: camelCase for variables and functions
const workflowCount = 5;
function fetchWorkflowData() {}

// ✅ Good: PascalCase for types and interfaces
interface WorkflowData {}
type ExecutionStatus = "success" | "error" | "running";

// ✅ Good: UPPER_CASE for constants
const API_BASE_URL = "https://api.example.com";
const MAX_RETRIES = 3;
```

### Error Handling

#### Use Raycast's Built-in Error UI

```typescript
import { showToast, Toast } from "@raycast/api";

// ✅ Good: User-friendly error messages
try {
  await executeWorkflow(id);
  await showToast({
    style: Toast.Style.Success,
    title: "Workflow executed",
  });
} catch (error) {
  await showToast({
    style: Toast.Style.Failure,
    title: "Failed to execute workflow",
    message: error instanceof Error ? error.message : "Unknown error",
  });
}

// ✅ Good: Use @raycast/utils hooks for data fetching
import { useFetch } from "@raycast/utils";

function Command() {
  const { isLoading, data, error } = useFetch<Workflow[]>(API_URL);

  if (error) {
    return <Detail markdown={`Error: ${error.message}`} />;
  }
  // ...
}
```

#### Error Propagation

```typescript
// ✅ Good: Re-throw with context
async function fetchWorkflow(id: string): Promise<Workflow> {
  try {
    const response = await fetch(`/workflows/${id}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch workflow ${id}: ${error}`);
  }
}
```

## Project Structure

```
hoelcy/
├── src/
│   ├── kk.tsx                    # Command implementations
│   ├── components/               # Reusable React components (future)
│   ├── services/                 # API clients, data fetching (future)
│   ├── utils/                    # Helper functions (future)
│   └── types/                    # TypeScript type definitions (future)
├── assets/
│   └── extension-icon.png        # Extension icon
├── package.json                  # Raycast extension manifest
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
└── .prettierrc                   # Prettier configuration
```

## Raycast-Specific Guidelines

### Command Structure

```typescript
// Commands must export a default function component
export default function Command() {
  // Use Raycast UI components: List, Detail, Form, etc.
  return <List>...</List>;
}
```

### Common Patterns

```typescript
// Loading states
if (isLoading) {
  return <List isLoading={true} />;
}

// Search filtering
<List onSearchTextChange={setSearchText} filtering={true}>

// Actions
<ActionPanel>
  <Action.OpenInBrowser url={workflow.url} />
  <Action.CopyToClipboard content={workflow.id} />
</ActionPanel>
```

### Auto-generated Files

- `raycast-env.d.ts` is auto-generated from `package.json` - **DO NOT edit manually**
- Provides type-safe access to preferences and command arguments

## Git Workflow

### Commit Messages

- Use conventional commit format: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep first line under 72 characters
- Example: `feat: add workflow execution command`

### Files to Ignore

- `node_modules/` (dependencies)
- `raycast-env.d.ts` (auto-generated)
- `.raycast-swift-build/` (build artifacts)
- `.DS_Store` (macOS system files)

## Best Practices

1. **Use Raycast's official patterns**: Follow [@raycast/api documentation](https://developers.raycast.com/)
2. **Leverage @raycast/utils**: Use hooks like `useFetch`, `usePromise` for data fetching
3. **Type safety first**: Enable strict TypeScript checks, avoid `any`
4. **User experience**: Provide loading states, error messages, and empty states
5. **Performance**: Use React memoization (`useMemo`, `useCallback`) for expensive operations
6. **Accessibility**: Use semantic Raycast components and provide meaningful labels
7. **Code organization**: Keep commands focused - extract reusable logic to utils/services

## Resources

- [Raycast API Documentation](https://developers.raycast.com/api-reference)
- [Raycast Utils](https://www.npmjs.com/package/@raycast/utils)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
