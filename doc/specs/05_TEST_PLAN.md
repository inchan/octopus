# 05. Test Plan: Tools & Sync 2.0

**Target Features**: Tools Page, Sync Page, Set Logic (Tool/Rule/Mcp Sets), and Configuration Generation.

## 1. Testing Strategy Overview

We will employ a "Test Pyramid" strategy:
1.  **Unit Tests (Jest)**: Focus on complex logic in Backend Services (CRUD, resolving items) and utility functions.
2.  **Integration Tests (Jest/Playwright)**: Verify the connection between Frontend (React) and Backend (Electron IPC).
3.  **End-to-End (E2E) Tests (Playwright)**: Simulate full user journeys starting from the UI to file system effects.

---

## 2. Unit Tests (Backend Logic)

**Location**: `electron/services/sets/*.test.ts`, `electron/services/tool-integration/*.test.ts`

### 2.1 McpSetService / RuleSetService / ToolSetService
- [ ] **CRUD Operations**:
    -   `create()`: Verify correctly stores JSON items and timestamps.
    -   `update()`: Verify partial updates work and `updatedAt` refreshes.
    -   `delete()`: Verify hard delete works.
- [ ] **Data Integrity**:
    -   Ensure `items` array handles duplicate IDs correctly (should typically enforce uniqueness or order).
- [ ] **Default Sets (ToolSet)**:
    -   Verify "All Tools", "CLI Tools" etc. cannot be deleted or renamed if implemented as locked DB entries.

### 2.2 ToolIntegrationService
- [ ] **Configuration Generation (`generateConfig`)**:
    -   **Input**: Mock `Rule[]` and `McpSet`.
    -   **Process**:
        -   Verify that valid Rule content is injected into the appropriate template.
        -   Verify that `mcp.json` structure is valid according to the tool's schema.
    -   **Output**: Verify `GeneratedFile[]` contains correct paths and content strings.

---

## 3. Integration / Component Tests (Frontend)

**Location**: `src/features/**/*.test.tsx` (using React Testing Library or Playwright Component Testing)

### 3.1 ToolsPage
- [ ] **Rendering**: 
    -   Verify all detected tools are rendered as cards.
    -   Verify "Global" card is always first.
    -   Verify installed status indicator (Green/Gray).
- [ ] **Interaction**:
    -   Clicking "Config" buttons on cards should invoke the correct mock API.

### 3.2 SyncPage
- [ ] **3-Column Selection Flow**:
    -   Initial state: "All Tools" selected, Rules "None", MCP "None".
    -   **Step 1**: Select a different Tool Set -> Verify selection highlight.
    -   **Step 2**: Select a Rule Set -> Verify state update.
    -   **Step 3**: Select an MCP Set -> Verify state update.
    -   **Sync Button**: Should be disabled if Rules & MCP are both "None". Should enable otherwise.
- [ ] **Preview Generation**:
    -   Click "Preview" -> Verify `window.api.toolIntegration.generateConfig` is called with correct args.
    -   Verify **Preview Dialog** opens with returned file list.

---

## 4. End-to-End (E2E) Tests (Playwright)

**Location**: `e2e/tools-sync.spec.ts`

### 4.1 Scenario: Full Sync Workflow (Critical Path)
1.  **Setup**:
    -   Mock `toolDetection` to return specific tools (e.g., Cursor, VSCode).
    -   Seed DB with 1 Rule Set ("My Rules") and 1 MCP Set ("My MCPs").
2.  **Navigation**:
    -   Open App -> Click "Sync" tab.
3.  **Interaction**:
    -   Click "All Tools" (Column 1).
    -   Click "My Rules" (Column 2).
    -   Click "My MCPs" (Column 3).
    -   Click "START SYNC".
4.  **Preview Verification**:
    -   Expect "Sync Preview" dialog to appear.
    -   Check for presence of specific filenames (e.g., `.cursor/rules/my-rule.mdc`).
5.  **Execution**:
    -   Click "Confirm & Sync".
    -   Expect success notification (or dialog close).
6.  **Verification**:
    -   **File System Check**: Verify that the files were actually written to the temp testing directory.

### 4.2 Scenario: Sync Validation
1.  **Empty Selection**:
    -   Select "None" for both Rules and MCPs.
    -   Verify "START SYNC" button is **Disabled**.
2.  **Partial Selection**:
    -   Select "My Rules", leave MCP as "None".
    -   Verify "START SYNC" button is **Enabled**.
    -   Run Sync -> Verify only Rule files are generated.

---

## 5. Implementation Roadmap

1.  **Create Test Specs**: `e2e/tools-sync.spec.ts`.
2.  **Refactor Backend Tests**: Ensure `ToolIntegrationService` tests cover the new `Set` based logic.
3.  **Run & Fix**: Execute tests and fix any implementation bugs found.
