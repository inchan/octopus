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

## Quick Start

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
