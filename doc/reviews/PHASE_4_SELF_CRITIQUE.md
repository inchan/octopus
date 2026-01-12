# Self-Critical Review: Phase 4 (Auto Detection & Sync)

**Date**: 2025-12-17
**Reviewer**: Antigravity (AI Agent)
**Scope**: Enhanced Tool Detection, Sync Workflow, Diff View

## 1. Summary of Achievements
- **Robust Detection**: Successfully implemented a "Composite Strategy" (CLI + App Bundle + Config Dir) that detects tools like `claude-code`, `antigravity`, `vscode` in the user's environment.
- **Extensible Design**: `ToolDefinitions.ts` allows adding new tools without tough logic changes.
- **Visual Validation**: The `DiffViewer` provides a safe "Preview before Apply" workflow.

## 2. Critical Issues & Gaps (The "Ugly")

### 🔴 2.1 The "Target Path" Disconnect
**Severity: High**
- **Analysis**: We detect where the *tool binary* lives (e.g., `/opt/homebrew/bin/claude`), but `CLAUDE.md` and `.cursorrules` are typically **Project-Level** configuration files.
- **Problem**: Currently, `SyncButton.tsx` hardcodes the target to `/Users/chans/Desktop/CLAUDE.md`. We have **no mechanism** for the user to select *which project* they want to apply these rules to.
- **Risk**: The feature is practically useless for real work until the user can pick a target directory (e.g., `/Users/chans/my-project`).
- **Fix Required**: Introduce a "Select Target Project" dialog or input in the Sync UI.

### 🔴 2.2 Coupling in UI (`SyncButton.tsx`)
**Severity: Medium**
- **Analysis**: `SyncButton.tsx` contains too much business logic:
    - Auto-detect orchestration
    - File path resolution logic (`if cursor then .cursorrules else ...`)
    - Preview/Apply flow state management
- **Violation**: Single Responsibility Principle. The UI should just trigger actions.
- **Fix Required**: Move orchestration logic to a React Hook (`useSyncWorkflow`) or push path resolution logic to the Backend `SyncService`.

### 🔴 2.3 `cursor.config.json` Ambiguity
**Severity: Medium**
- **Analysis**: We implemented a generator for `cursor.config.json` but commented it out because we don't know where to put it or if Cursor strictly enforces it.
- **Risk**: We might be missing the "MCP Sync" part for Cursor entirely if `.cursorrules` doesn't cover MCP settings (it usually doesn't).
- **Fix Required**: Research Cursor's *global* vs *workspace* MCP settings storage (likely `settings.json` or a specific DB).

## 3. Code Quality & Architecture

### 3.1 `ToolDetector.ts`
- **Strengths**: Clean separation of strategies. Good usage of `ToolDefinitions`.
- **Weakness**: `execPromise` implementation is manual.
- **Nit**: Tests mock `fs` and `child_process` heavily. Integration tests on a real filesystem (read-only) would be more confident, though harder to stabilize in CI.

### 3.2 Types (`shared/api.ts`)
- **Observation**: `ToolDetectionResult.paths` is flexible, but `SyncService` receives `toolId` and triggers generators.
- **Gap**: We cast `targetTool as any` in `SyncButton.tsx`, bypassing type safety. This needs to be strictly typed now that `api.ts` is updated.

## 4. Action Plan (Recommendations)

1.  **Immediate Fix (Phase 5 Prep)**:
    - Implement **"Select Project Directory"** feature in `SyncButton`.
    - Remove hardcoded Desktop paths.

2.  **Refactoring**:
    - Extract `useSyncWorkflow` hook to clean up `SyncButton.tsx`.
    - Move "Filename Resolution" (e.g., `cursor` -> `.cursorrules`) to `SyncService` or `FileGenerator` metadata, removing it from frontend.

3.  **Research**:
    - Definitively solve: "How do we sync MCP servers to Cursor?" (Is it `settings.json`? A SQLite DB?).

4.  **Testing**:
    - Add a test case for "Syncing to a provided project path".

## 5. Score
- **Functionality**: 85/100 (Detection works great, Sync is "fake" due to hardcoded path)
- **Architecture**: 80/100 (Solid backend, cluttered frontend)
- **Stability**: 90/100 (Tests pass, error handling in place)
