# 02. Rules Management Spec

**Status**: Approved
**Phase**: Phase 2

This document defines the technical specification for the "Rules Management" feature.

## 1. Database Schema

We use valid SQLite syntax. ID is a UUID v4 string.

```sql
CREATE TABLE IF NOT EXISTS rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);
```

## 2. Domain Entities

`shared/types.ts`:

```typescript
export interface Rule {
    id: string;
    name: string;
    content: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateRuleParams = Pick<Rule, 'name' | 'content'>;
export type UpdateRuleParams = Partial<CreateRuleParams> & { id: string };
```

## 3. API Contract

`shared/api.ts`:

```typescript
export interface IRulesAPI {
    list(): Promise<Rule[]>;
    get(id: string): Promise<Rule | null>;
    create(params: CreateRuleParams): Promise<Rule>;
    update(params: UpdateRuleParams): Promise<Rule>;
    delete(id: string): Promise<void>;
}
```

## 4. Architecture Implementation

-   **Service**: `electron/services/RulesService.ts`
    -   Uses `better-sqlite3` prepared statements.
    -   Handles UUID generation.
-   **Handler**: `electron/handlers/RulesHandler.ts`
    -   Validates inputs using `zod`.
    -   Calls `RulesService`.
-   **Preload**: Exposes `api.rules.*`.

## 5. User Interface

-   **List View**: Table showing Name, Status, Last Updated.
-   **Detail/Edit View**: Markdown editor for Content.

## 6. UI/UX Improvements (Phase 2.1)

### Rule Sets
-   **Ordering**: Drag and drop support for rules within a set. Activated via long-press (or handle).
-   **Creation**: "New Set" popup should be positioned relative to the trigger button (Popover/Tooltip style) rather than a centered modal.
-   **Inline Editing**: Rule Set title should be editable on click (toggle to input field).

### Rule Pool
-   **Interface Simplification**:
    -   Replace "+ New Rule" text button with a simple "+" icon button.
    -   Show "New Rule" tooltip on hover.
    -   Inactive rules in the list should show an "Inactive" badge/text instead of an "Add" button if they are not selectable.
-   **Unified Editor**:
    -   Use the same popup component for both Creation and Editing.
    -   Position the popup relative to the trigger button where possible.
    -   **Editor UI**:
        -   Remove toggle switch for Active/Inactive.
        -   Use a dedicated button (e.g., "Archive/Activate") to change state.
        -   Title input should be single-line only.
