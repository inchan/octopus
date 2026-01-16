<div align="center">
  <img src="build/icons/icon.svg" alt="Octopus Logo" width="120" height="120">
  
  # Octopus 🐙
  
  **Centralized AI Tool Configuration Manager**
  
  [![Build](https://github.com/your-org/octopus/workflows/Build/badge.svg)](https://github.com/your-org/octopus/actions)
  [![Release](https://github.com/your-org/octopus/workflows/Release/badge.svg)](https://github.com/your-org/octopus/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
  
</div>

---

Octopus is an Electron-based desktop application that synchronizes Rules and MCP server configurations across multiple AI coding tools.

## Supported Tools

| Tool | Rules | MCP |
|------|:-----:|:---:|
| Claude Desktop | ✅ | ✅ |
| Claude Code | ✅ | ✅ |
| VS Code | - | ✅ |
| Cursor | ✅ | ✅ |
| Windsurf | ✅ | ✅ |
| Cline | ✅ | ✅ |
| Codex CLI | ✅ | ✅ |
| Gemini CLI | ✅ | ✅ |
| Qwen Code | ✅ | ✅ |
| OpenCode | - | ✅ |

## Features

- **Central Management**: Manage all your AI tool configurations in one place
- **One-Click Sync**: Push settings to multiple tools simultaneously
- **Adaptive Sync**: Automatically optimizes settings per tool (e.g., Serena MCP context)
- **Rule Sets**: Organize and group your system prompts/rules
- **MCP Server Management**: Centralized MCP server configuration

## Installation

### macOS

⚠️ **중요**: 개발자 서명이 없는 앱이므로 보안 경고가 표시될 수 있습니다.

#### 설치 방법 (터미널 명령어 불필요)

1. **다운로드**: [Releases](https://github.com/inchan/octopus/releases) 페이지에서 최신 버전 다운로드
   - Apple Silicon (M1/M2/M3): `Octopus_x.x.x_arm64.zip`
   - Intel Mac: `Octopus_x.x.x_x64.zip`

2. **압축 해제**: 다운로드한 ZIP 파일을 더블클릭하여 압축을 풉니다

3. **설치**: `Octopus.app`을 `Applications` 폴더로 드래그합니다

4. **첫 실행** (중요 ⚠️):
   - Applications 폴더를 엽니다
   - ❌ **Octopus 앱을 더블클릭하지 마세요** ("확인되지 않은 개발자" 경고 발생)
   - ✅ **앱 아이콘을 우클릭 (또는 Control + 클릭)**
   - ✅ 메뉴에서 **"열기"** 선택
   - ✅ 경고창에서 **"열기"** 버튼 클릭

5. **이후 실행**: 한 번 이렇게 실행한 후에는 평소처럼 더블클릭으로 실행 가능합니다

#### 왜 이런 과정이 필요한가요?

Apple Developer Program($99/년)에 가입하지 않아 앱이 공식 서명/공증을 받지 못했습니다. 
"우클릭 → 열기"는 Apple이 공식적으로 제공하는 방법으로, 사용자가 앱을 신뢰한다는 것을 시스템에 알립니다.

#### 고급 사용자를 위한 터미널 방법

```bash
# Quarantine 속성 제거 (선택사항)
xattr -cr /Applications/Octopus.app
```

### Windows / Linux

다운로드 후 일반적인 방법으로 설치하세요.

## Development

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Test
npm run test
```

## Tech Stack

- **Frontend**: React 19, TailwindCSS, TanStack Query, Radix UI
- **Backend**: Electron, better-sqlite3
- **Testing**: Vitest (unit), Playwright (E2E)
- **Build**: Vite, electron-builder

## Documentation

- [Master Guide](doc/GUIDE.md) - Start here
- [Core Principles](doc/core/01_PRINCIPLES.md)
- [Project Structure](doc/core/02_STRUCTURE.md)
- [Development Workflow](doc/core/03_WORKFLOW.md)

## License

MIT
