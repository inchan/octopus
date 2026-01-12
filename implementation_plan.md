# Implementation Plan - MCP Redesign

# Goal Description
Redesign the MCP Server management UI to be more user-friendly and task-centric. 
We will replace the current "tiny popover" editor and "JSON-based" configuration with a **full-featured Dialog-based Editor** and **Structured Input Fields**.
We will also streamline the flow to allow creating servers directly within the context of a Set.

## User Review Required
> [!IMPORTANT]
> The "Pool" column (3rd pane) will remain as a "Server Library", but the primary creation flow will move to a Modal Dialog.

## Proposed Changes

### Frontend Components (`src/features/mcp/components`)

#### [NEW] `McpServerDialog.tsx`
- A shadcn/ui `Dialog` component for creating/editing servers.
- **Features**:
  - Distinct "General" and "Configuration" sections.
  - Integration of new `KeyValueList` and `StringList` inputs.
  - "Test Connection" button (Mock for now, or real if backend supports).

#### [NEW] `KeyValueList.tsx`
- A reusable component for editing `Record<string, string>` (Environment Variables).
- Grid layout: [Key Input] [Value Input] [Delete Button].
- "Add Variable" button.

#### [NEW] `StringList.tsx`
- A reusable component for editing `string[]` (Arguments).
- Drag-and-drop reordering support (optional but nice).
- "Add Argument" button.

#### [MODIFY] `McpPage.tsx`
- Integrate `McpServerDialog` at the page level.
- Handle state for "Creating Server" and "Editing Server".

#### [MODIFY] `McpPool.tsx`
- Remove inline Popovers.
- "Edit" button now opens `McpServerDialog`.
- "Create" button now opens `McpServerDialog`.

#### [MODIFY] `McpSetDetail.tsx`
- Add "Create New Server" button directly in the set detail view.
- This creates a server AND adds it to the set in one transaction (frontend logic).

### Backend (`electron/`)
No major schema changes required. Existing `McpService` supports the necessary operations.

## Verification Plan

### Automated Tests
- Run existing E2E tests: `npm run test -- e2e/mcp.spec.ts`
- Update E2E tests to interact with the new Dialog instead of Popovers.

### Manual Verification
1. **Creation**: Click "New Server" -> Verify Dialog opens -> Fill Form (using structured inputs) -> Save -> Verify in list.
2. **Context Creation**: Select a Set -> Click "New Server" (in Set) -> Save -> Verify Server is created AND added to Set.
3. **Editing**: Click Edit on a server -> Verify data pre-filled -> Change Env var -> Save -> Verify persistence.
