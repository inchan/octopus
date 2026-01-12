# Research: Enhanced Tool Detection Strategies

## 1. Objective
Define robust detection strategies for the following set of AI tools on **macOS**.
The detection must cover installation presence and potentially version checks.

## 2. Supported Tools Definition

| Category | Tools |
| :--- | :--- |
| **CLI** | `claude-code`, `codex`, `gemini-cli`, `qwen-code` |
| **IDE** | `Cursor`, `VS Code`, `Windsurf`, `Antigravity` |
| **Desktop** | `Claude Desktop` |

## 3. Detection Strategies

### 3.1 CLI Tools (Command-Line Interfaces)
Detection Logic:
1. **Primary**: Check if the command executable exists in the user's `$PATH`.
2. **Secondary**: Run `<command> --version` to confirm functionality.

| Tool | Command | Detection Command | Notes |
| :--- | :--- | :--- | :--- |
| **Claude Code** | `claude` | `claude --version` or `claude doctor` | Installed via `npm i -g @anthropic-ai/claude-code`. Binary is usually `claude`. |
| **Codex** | `codex` | `codex --version` | *Assumption based on typical CLI conventions. Requires validation.* |
| **Gemini CLI** | `gemini` | `gemini --version` | Installed via `npm i -g @google/gemini-cli`. |
| **Qwen Code** | `qwen` | `qwen --version` | Installed via pip or npm. |

**Implementation Note**:
- Getting the user's PATH environment variable in an Electron app (especially packaged) effectively is critical. `fix-path` or similar libraries might be needed.
- `exec('which <command>')` is a quick check.

### 3.2 Integrated Development Environments (IDEs)
Detection Logic:
1. **Primary**: Check for the Application bundle in standard macOS locations (`/Applications`, `~/Applications`).
2. **Configuration Path**: Check for the existence of user configuration directories to verify usage.

| Tool | App Name | App Path | Config Path (macOS) |
| :--- | :--- | :--- | :--- |
| **Cursor** | `Cursor.app` | `/Applications/Cursor.app` | `~/Library/Application Support/Cursor` |
| **VS Code** | `Visual Studio Code.app` | `/Applications/Visual Studio Code.app` | `~/Library/Application Support/Code` |
| **Windsurf** | `Windsurf.app` | `/Applications/Windsurf.app` | `~/Library/Application Support/Windsurf` (Probable) |
| **Antigravity** | `Antigravity.app` | `/Applications/Antigravity.app` | `~/Library/Application Support/Antigravity` (Fork of VS Code) |

**Notes**:
- **Antigravity** is a VS Code fork, so its config structure will likely mirror VS Code's.
- **Windsurf** installation puts it in `/Applications`.

### 3.3 Desktop Applications
Detection Logic:
1. **Primary**: Check for Application bundle.

| Tool | App Name | App Path | Config Path / Notes |
| :--- | :--- | :--- | :--- |
| **Claude Desktop** | `Claude.app` | `/Applications/Claude.app` | `~/Library/Application Support/Claude` |

## 4. Ground Truth Verification (User Environment)
Performed on 2025-12-17.

### 4.1 CLI Tools
All requested CLI tools were found in `/opt/homebrew/bin` and verified with `--version`.
- **claude-code**: `2.0.70` (Command: `claude`)
- **gemini-cli**: `0.21.0` (Command: `gemini`)
- **qwen-code**: `0.5.0` (Command: `qwen`)
- **codex**: `0.73.0` (Command: `codex`)

### 4.2 IDEs & Desktop
- **Antigravity**: Found at `/Applications/Antigravity.app`.
- **VS Code**: Found at `/Applications/Visual Studio Code.app`. config at `~/Library/Application Support/Code`.
- **Claude Desktop**: Found at `/Applications/Claude.app`. config at `~/Library/Application Support/Claude`.
- **Cursor**: **NOT FOUND** in `/Applications` or `~/Applications`. Config dir `~/Library/Application Support/Cursor` also missing.
- **Windsurf**: **NOT FOUND** in `/Applications` or `~/Applications`.

## 5. Finalized Detection Strategy Implementation

The `ToolDetector` will implement a **Composite Pattern**:

1.  **CLI Detector**:
    - Uses `which` command to find path.
    - Executes `--version` to verify and get metadata.
    - *Fallback*: Check common paths like `/opt/homebrew/bin`, `/usr/local/bin`.

2.  **App Bundle Detector** (Mac Specific):
    - Checks `/Applications/{AppName}.app` and `~/Applications/{AppName}.app`.
    - Returns `isInstalled: true` if found.

3.  **Config Directory Detector**:
    - Checks `~/Library/Application Support/{ConfigDir}`.
    - Important for Sync: Even if App Bundle is missing (e.g. portable mode), if Config Dir exists, we might still want to sync rules there. *However, for "Detection" usually App presence is key.*
    - **Decision**: We will report `configPath` if it exists, regardless of App Bundle, but `isInstalled` will primarily rely on App Bundle OR CLI presence.

4.  **Antigravity Special Case**:
    - As a fork of VS Code, it likely uses a similar config structure. We will assume `~/Library/Application Support/Antigravity`.

## 6. Proposed Data Structure

```typescript
export interface ToolDefinition {
    id: string;
    name: string;
    type: 'cli' | 'ide' | 'desktop';
    detection: {
        macAppPath?: string[]; // e.g. ["/Applications/Cursor.app"]
        cliCommand?: string;   // e.g. "claude"
        configDir?: string;    // e.g. "Cursor" (under Application Support)
    };
}
```
