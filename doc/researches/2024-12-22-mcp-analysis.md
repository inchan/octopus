# MCP Feature Analysis & Redesign Proposal

## 1. Current Implementation Analysis

### Architecture
- **Structure**: 3-Pane Layout (Mac Mail style)
  1. **Left**: Pattern Sets (Grouping)
  2. **Middle**: Set Details (Members of the set)
  3. **Right**: Server Pool (All available servers)
- **Data Model**:
  - `McpServer`: Basic unit (name, command, args, env, isActive).
  - `McpSet`: Collection of server IDs + metadata.

### Current User Flow (Pain Points)
1. **Creation Experience**: 
   - Uses `McpServerEditor` generic component.
   - **Args Input**: Requires comma-separated string (e.g., `arg1, arg2`), which breaks if args contain commas or need specific quoting.
   - **Env Input**: Uses a raw JSON editor. Flexible but user-unfriendly for simple Key-Value pairs.
   - **Validation**: Minimal client-side validation.
2. **Context Switching**:
   - The "Pool" concept (Pane 3) confuses the hierarchy. Users often just want to "Add a server to this set" but have to "Create in Pool" -> "Add to Set".
3. **Visual Hierarchy**:
   - The editor is constrained within a scroll area or small container, limiting visibility for complex configurations.

## 2. Redesign Direction (Proposal)

### Core Concept
**"Task-Centric Flow"** instead of "Database-Centric Flow".
Focus on *what the user wants to do* (e.g., "Connect a Claude MCP Server") rather than *managing records*.

### Key Improvements
1. **Dedicated Editor UI**:
   - Move away from the small inline editor.
   - Use a **Sheet** (Side Drawer) or **Dialog** for focused editing.
2. **Smart Inputs**:
   - **Arguments**: Dynamic list builder (Add Item button) instead of CSV string.
   - **Environment**: Key-Value pair grid with "Add Variable" interactivity.
   - **Presets**: (Future) Templates for common MCP servers (e.g., "Brave Search", "Filesystem").
3. **Simplified Hierarchy**:
   - While Sets are useful, the primary action should be intuitive. 
   - Allow creating a server *directly inside* a set context without worrying about the "Pool".

## 3. Implementation Plan
1. **Refactor Backend** (If needed): Ensure `create` API returns the created object to immediately link it.
2. **New UI Components**:
   - `McpServerForm`: A full-featured form with validation.
   - `KeyValueEditor`: Reusable component for Env vars.
   - `StringArrayEditor`: Reusable component for Args.
3. **Layout Update**:
   - Revamp the main `McpPage` to be more inviting.

## 4. Question to User
- Do you agree with moving away from the "CSV string" style for arguments to a "List Builder" UI?
- Should the "Environment Variables" be a simple Table/Grid editor instead of raw JSON?
