# Tool Configuration Integration Strategy (Final)

## 1. 개요 (Overview)
사용자가 직접 **도구(Tool)**와 **적용 범위(Scope)**를 선택하면, 그에 맞는 설정 파일이나 가이드를 제공하는 기능입니다.
"자동 동기화(Auto-Sync)"가 아닌 **"선택적 적용(Select & Apply)"** 방식입니다.

## 2. 도구별 스코프 및 파일 매핑 (Scope & File Mapping)

### 2.1 Cursor
가장 유연한 설정을 지원합니다.

| Scope | Rules Target | MCP Target | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | (Guide only) Settings UI 사용 권장 | `~/.cursor/mcp.json` | Global Rules는 파일 접근 불가 (SQLite DB) |
| **Project** | `.cursor/rules/*.mdc` | `.cursor/mcp.json` | Git에 커밋됨 (공유 목적) |
| **Project-Local** | `.cursor/rules/.local/*.mdc` (GitIgnore 권장) | `.cursor/mcp.local.json` (GitIgnore 필) | 로컬 전용 설정. Cursor가 `.local` 폴더를 자동 인식하는지는 불명확하므로, `.gitignores` 설정을 병행해야 함. |

**Strategy**:
- **Project**: `.cursor/rules/` 및 `.cursor/mcp.json` 생성.
- **Project-Local**: `.cursor/rules/local/` 폴더 제안 혹은 `.gitignore`에 자동 추가되는 파일명(`local_rules.mdc`) 사용.

### 2.2 Windsurf
Global 및 Project 스코프가 명확히 나뉩니다.

| Scope | Rules Target | MCP Target | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | `~/.codeium/windsurf/memories/global_rules.md` | `~/.codeium/windsurf/mcp_config.json` | 가장 일반적인 사용 패턴 |
| **Project** | `.windsurfrules.md` (Project Root) | (Project Level 미지원으로 간주) | MCP는 Global만 지원하는 것으로 보임 |
| **Project-Local** | (Not formally supported) | - | `.windsurfrules.md`를 로컬에만 두고 gitignore 하는 방식 |

**Strategy**:
- **Global**: `~/.codeium` 경로에 파일 생성/수정 (User 승인 필요).
- **Project**: `.windsurfrules.md` 생성.

### 2.3 VS Code (Cline)
Cline은 명시적인 Local Override 파일을 지원합니다.

| Scope | Rules Target | MCP Target | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | `~/Documents/Cline/Rules` (OS별 상이) | `cline_mcp_settings.json` (Global Storage) | |
| **Project** | `.clinerules` | (Extension Setting or `.vscode/mcp.json`) | |
| **Project-Local** | `.clinerules.local` (공식 지원) | - | **공식적으로 Local 파일 지원함** |

**Strategy**:
- **Project**: `.clinerules` 생성.
- **Project-Local**: `.clinerules.local` 생성.

### 2.4 Claude Desktop
파일 설정보다는 설정 파일 수정 가이드가 주가 됩니다.

| Scope | Rules Target | MCP Target | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | (System Prompt 개념, 파일 없음) | `claude_desktop_config.json` | OS별 경로 상이 |
| **Project** | `QA_PROMPT.md` (Manual) | `.mcp.json` (Project Root) | |
| **Project-Local** | - | (Project와 동일하게 `.mcp.json` 사용하되 gitignore) | |

## 3. 기능 설계 (Feature Design)

### 3.1 UI Flow (SyncPage)
1.  **Tool Selection**: Dropdown [Cursor | Windsurf | Cline | Claude]
2.  **Scope Selection**: Radio [Global | Project | Project (Local-Only)]
    *   *Note*: 도구별로 지원하지 않는 Scope는 비활성화.
3.  **Preview**: 생성될 파일 경로와 내용 미리보기.
4.  **Action Buttons**:
    *   **"Generate File"**: (로컬/프로젝트 스코프인 경우) 실제 파일 생성.
    *   **"Copy Content"**: (글로벌이거나 파일 접근 권한이 애매한 경우) 클립보드 복사.
    *   **"Open Config"**: (글로벌 설정 파일인 경우) 해당 파일 열기(`open` command).

### 3.2 Backend Service (`ToolIntegrationService`)
```typescript
interface ToolCapability {
  supportsGlobal: boolean;
  supportsProject: boolean;
  supportsLocal: boolean; // e.g., .clinerules.local
}

class ToolIntegrationService {
  async getToolCapabilities(tool: ToolType): Promise<ToolCapability>;
  async generateConfig(tool: ToolType, scope: Scope, data: ConfigData): Promise<GeneratedFile>;
}
```

## 4. Next Steps
1.  `ToolIntegrationService` 구현.
2.  `SyncPage` UI 개편 (Select & Apply).
