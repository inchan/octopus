# Tool Configuration Scopes: Rules & MCP

## 1. 개요 (Overview)
본 문서는 주요 AI 코딩 도구(IDE 및 Desktop App)별 **Rule(지침)**과 **MCP(Context & Tools)** 설정의 지원 범위(Global, Project, Local)와 설정 파일 위치를 조사한 결과입니다.
프로젝트 `align-agents-v2`에서 각 도구에 맞는 설정을 자동화하거나 가이드하기 위한 기초 자료로 활용됩니다.

## 2. 도구별 설정 분석 (Analysis by Tool)

### 2.1 Cursor IDE
Cursor는 가장 세분화된 스코핑을 지원하며, 최근 `.cursorrules`에서 `.cursor/rules` 디렉토리 기반으로 구조가 변경되었습니다.

| Scope | Rules Configuration | MCP Configuration | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | Cursor Settings > General > Rules for AI | `~/.cursor/mcp.json` (또는 Settings UI) | 모든 프로젝트에 적용됨 |
| **Project** | `.cursor/rules/*.mdc` (권장)<br>`.cursor/rules/index.mdc` | `.cursor/mcp.json` | 프로젝트별 독립적인 룰/툴 설정 가능 |
| **Local** | `.cursor/rules/` 내 개인 설정 (Git ignore 활용 가능) | (Project 설정과 동일) | |

* **특이사항**: `.mdc` 포맷을 통해 파일 패턴(glob)별로 룰을 적용할 수 있어 가장 강력한 제어력을 제공합니다.

### 2.2 Windsurf IDE
Windsurf는 Wave 8 업데이트 이후 프로젝트별 룰 구조가 강화되었습니다.

| Scope | Rules Configuration | MCP Configuration | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | `~/.codeium/windsurf/memories` (Global Context)<br>또는 UI 설정 | `~/.codeium/windsurf/mcp_config.json` | |
| **Project** | `.windsurf/rules/*.md`<br>(구버전: `.windsurfrules`) | (명시적 문서 부족, 통상 Global 사용)<br>`.windsurf/mcp_config.json` (지원 여부 확인 필요) | `.md` 파일 기반의 단순 구조 |
| **Local** | - | - | |

* **특이사항**: MCP 설정은 주로 Global(`mcp_config.json`)에서 관리되는 경향이 강하며, 프로젝트별 분리 지원이 Cursor만큼 명시적이지 않습니다.

### 2.3 Claude Desktop
Desktop App 특성상 "프로젝트" 개념보다는 "Session" 위주였으나, 최근 파일 시스템 연동과 MCP를 통해 프로젝트 단위 컨텍스트 주입이 가능해지고 있습니다.

| Scope | Rules Configuration | MCP Configuration | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | System Prompts (설정 파일 없음, 매번 주입 필요) | `claude_desktop_config.json`<br>(macOS: `~/Library/Application Support/Claude/`) | 가장 일반적인 방식 |
| **Project** | (직접적 설정 파일 없음)<br>MCP 서버를 통해 프롬프트 주입 가능 | `.mcp.json` (Project Root) | 프로젝트 루트의 설정을 우선시함 |
| **Local** | - | - | |

* **특이사항**: "Rule"이라는 명시적 파일 규격은 없으며, MCP를 통해 프롬프트를 제공하거나 수동으로 Context를 주입해야 합니다. MCP 설정은 `.mcp.json` 표준을 따릅니다.

### 2.4 VS Code (Cline / Roo Code)
Extension 기반이므로 VS Code의 설정 체계를 따르거나 독자적인 룰 파일을 사용합니다.

| Scope | Rules Configuration | MCP Configuration | 비고 |
| :--- | :--- | :--- | :--- |
| **Global** | Extension Settings > Custom Instructions | VS Code User Settings (`settings.json`) | |
| **Project** | `.clinerules` (Project Root) | `.vscode/mcp.json` (VS Code 표준 제안)<br>또는 Extension 별도 config | `.clinerules`가 강력한 역할을 함 |
| **Local** | - | - | |

* **특이사항**: `.clinerules` 파일 하나로 프로젝트 룰을 관리하며, MCP는 VS Code 자체의 MCP 지원(`chat.mcp`) 흐름을 타거나 세팅 파일에 정의합니다.

## 3. 통합 전략 제안 (Integration Strategy)

우리 프로젝트(`align-agents-v2`)에서 이 지원 사항들을 녹여내기 위한 전략입니다.

### 3.1 설정 우선순위 대원칙
1. **Rule**: **Project Scope**를 최우선으로 생성합니다. (협업 및 프로젝트 일관성)
2. **MCP**: **Project Scope** 설정을 우선하되, 지원하지 않는 도구(일부 구형 설정)를 위해 Global 설정 가이드나 Export 기능을 제공합니다.

### 3.2 도구별 적용 방안

| 대상 도구 | Rule 생성 위치 (Target) | MCP 생성 위치 (Target) | 전략 |
| :--- | :--- | :--- | :--- |
| **Cursor** | `.cursor/rules/*.mdc` | `.cursor/mcp.json` | 가장 완벽한 타겟. Rule과 MCP 모두 프로젝트 내에 생성하여 버전 관리 추천. |
| **Windsurf** | `.windsurf/rules/rules.md` | `mcp_config.json` (Export 제공) | Rule은 프로젝트 내 생성. MCP는 사용자가 Global 위치로 복사하도록 유도(또는 심볼릭 링크). |
| **Claude** | `QA_PROMPT.md` (참고용) | `.mcp.json` | Rule은 텍스트로 제공하여 복사/붙여넣기 유도. MCP는 표준 파일 생성. |
| **Cline** | `.clinerules` | `.vscode/mcp.json` | 단일 룰 파일 생성. MCP는 VS Code 표준 위치에 생성. |

### 3.3 구현 고려사항
- **Rule Converter**: 내부적으로 관리하는 Rule(지침) 데이터를 각 도구의 포맷(`.mdc`, `.md`, `.clinerules`)으로 변환하는 모듈 필요.
- **MCP Config Generator**: 등록된 MCP 서버 정보를 바탕으로 `.json` 설정을 생성해주는 기능 필요. Path는 절대 경로로 변환하여 기록해야 함.
