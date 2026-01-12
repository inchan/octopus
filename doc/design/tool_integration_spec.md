# Tool Integration Feature Specification

## 1. 개요 (Overview)
AI 에이전트 도구(Cursor, Windsurf, Cline, Claude Desktop)의 **Rule(지침)** 및 **MCP(Context)** 설정을 사용자가 선택한 **Scope(Global/Project/Local)** 에 맞춰 생성하거나 가이드하는 기능입니다.

## 2. 사용자 스토리 (User Stories)
1.  **도구 선택**: 사용자는 설정하고 싶은 도구(예: Cursor)를 선택할 수 있다.
2.  **범위 선택**: 사용자는 설정을 적용할 범위(전역, 프로젝트 공용, 프로젝트 로컬)를 선택할 수 있다.
    *   *Project*: Git에 공유되는 설정 (`.cursor/rules/`, `.clinerules`)
    *   *Project-Local*: 나만 사용하는 설정, GitIgnore 처리됨 (`.clinerules.local`)
    *   *Global*: 모든 프로젝트에 적용되는 설정 (User Home Dir)
3.  **파일 생성**: 프로젝트/로컬 범위 선택 시, 버튼 클릭으로 해당 경로에 파일이 자동 생성된다.
4.  **가이드 제공**: 파일 접근 권한이 없거나 Global 설정인 경우, 설정할 내용(JSON/Markdown)을 보여주고 복사할 수 있는 가이드를 제공한다.

## 3. 지원 매트릭스 (Support Matrix)

| Tool | Feature | Global (User Home) | Project (Git Shared) | Project-Local (Git Ignored) |
| :--- | :--- | :--- | :--- | :--- |
| **Cursor** | Rule | ❌ (DB) | ✅ `.cursor/rules/*.mdc` | ✅ `.cursor/rules/.local/*.mdc` (Custom) |
| | MCP | ✅ `~/.cursor/mcp.json` | ✅ `.cursor/mcp.json` | ✅ `.cursor/mcp.local.json` (Custom) |
| **Propose** | **Strategy** | **Manual Guide** | **Auto-Generate** | **Auto-Generate** |
| --- | --- | --- | --- | --- |
| **Windsurf** | Rule | ✅ `global_rules.md` | ✅ `.windsurfrules.md` | ❌ (미지원) |
| | MCP | ✅ `mcp_config.json` | ❌ (Global Only) | ❌ |
| **Propose** | **Strategy** | **Manual Guide** | **Auto-Generate** | - |
| --- | --- | --- | --- | --- |
| **Cline** | Rule | ✅ `Rules/` | ✅ `.clinerules` | ✅ `.clinerules.local` |
| | MCP | ✅ `cline_mcp_settings.json` | ❌ (Global Only) | ❌ |
| **Propose** | **Strategy** | **Manual Guide** | **Auto-Generate** | **Auto-Generate** |
| --- | --- | --- | --- | --- |
| **Claude** | Rule | ❌ | ❌ | ❌ |
| | MCP | ✅ `config.json` | ✅ `.mcp.json` | ✅ `.mcp.json` (w/ gitignore) |
| **Propose** | **Strategy** | **Manual Guide** | **Auto-Generate** | **Auto-Generate** |

## 4. 아키텍처 및 API 설계 (Architecture & API)

### 4.1 Backend Architecture
*   **`ToolIntegrationService`**: 도구별 설정 생성 로직의 진입점.
*   **`ToolGeneratorFactory`**: `CursorGenerator`, `WindsurfGenerator` 등 도구별 구현체 반환.
*   **`ConfigGenerator` Interface**:
    ```typescript
    interface ConfigGenerator {
      generateRules(scope: Scope, rules: Rule[]): GeneratedFile[];
      generateMcpConfig(scope: Scope, mcpSet: McpSet): GeneratedFile;
      getSupportStatus(scope: Scope): SupportStatus;
    }
    ```

### 4.2 API Endpoints
*   `GET /api/tools/capabilities`: 각 도구별 지원되는 Scope 정보 반환.
*   `POST /api/tools/preview`: 선택한 도구/스코프에 대해 생성될 파일 내용 미리보기 반환.
*   `POST /api/tools/generate`: 실제 파일 생성 요청. (Local/Project scope)

## 5. UI/UX 디자인 (Frontend)
*   **Page**: `SyncPage` 내 "Tool Integration" 탭 신설.
*   **Components**:
    *   `ToolSelector`: Card 형태의 도구 선택 (아이콘 포함).
    *   `ScopeSelector`: Radio Button Group.
    *   `PreviewPanel`: Code Block으로 생성될 내용 표시.
    *   `ActionPanel`: "Generate Files" (Primary), "Copy to Clipboard" (Secondary).

## 6. 구현 로드맵 (Roadmap)

### Phase 1: Core Logic (Backend)
1.  `ToolIntegrationService` 및 `ConfigGenerator` 인터페이스 정의.
2.  각 도구별(Cursor, Windsurf, Cline, Claude) Generator 구현.
    *   Rule -> Markdown/JSON 변환 로직.
    *   MCP -> JSON 변환 로직 (절대 경로 처리 포함).

### Phase 2: API & Interfacing
1.  Electron IPC 핸들러 구현 (`tool:preview`, `tool:generate`).
2.  실제 파일 시스템 쓰기 로직 (`FileSystemAdapter` 확장).

### Phase 3: Frontend UI
1.  `SyncPage` UI 리팩토링 (탭 구조 도입).
2.  `ToolIntegration` 컴포넌트 구현 (Select -> Preview -> Action).

### Phase 4: Verification
1.  각 도구에서 생성된 파일이 정상 인식되는지 테스트.
2.  E2E 테스트 시나리오 추가.
