# raycast-extensions

A collection of custom Raycast extensions for my personal productivity and workflow automation.

## Overview

This repository contains multiple Raycast extensions, each organized in its own subfolder.

## Extensions

### [Tasks](./tasks)

Interface for interacting with a personal n8n instance, enabling task management from the Raycast extension.

## Development

### Prerequisites

- Node.js 22.14+
- Raycast desktop application
- npm package manager

### Starting the application

```bash
# Navigate to an extension
cd <extension-directory>

# Install dependencies
npm install

# Start development mode with hot reload
npm run dev
```

### Creating a New Extension

New extensions can be created directly from within Raycast:

- Open the command palette
- Run `Create New Extension`
- Configure settings for extension creation
- Create extension

## Publishing

Each extension can be independently published to the Raycast Store:

```bash
cd <extension-directory>
npm run publish
```
