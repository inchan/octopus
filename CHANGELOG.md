# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.4] - 2026-01-15

## [0.0.3] - 2026-01-15

## [0.0.2] - 2025-01-15

### Added
- **Brand Identity**: Complete brand identity with octopus logo 🐙
  - Purple to pink gradient color scheme (#8B5CF6 → #EC4899)
  - Minimalist, modern design representing multiple AI tool connections
- **Icons for All Platforms**:
  - macOS: icon.icns (380KB, 10 resolutions with Retina support)
  - Windows: icon.ico (35KB, 7 resolutions)
  - Linux: icon.png (256x256)
  - Web: icon.svg (vector) + favicon.png
- **Automated Icon Generation**:
  - `npm run icons:generate` - Generate PNG set from SVG
  - `npm run icons:ico` - Generate Windows ICO file
  - Custom ICO generation script without external dependencies
- **Release Automation**:
  - GitHub Actions workflow for multi-platform releases
  - Automated building for macOS, Windows, Linux
  - Changelog-based release notes
  - Version management scripts (`npm run version:patch/minor/major`)
- **Documentation**:
  - Complete branding guide (`doc/design/BRANDING.md`)
  - Release process guide (`doc/core/RELEASE_PROCESS.md`)
  - Code signing guide (`doc/core/CODE_SIGNING.md`)
  - Icon completion report (`doc/design/ICON_COMPLETION_REPORT.md`)

### Changed
- Updated README with logo and badges
- Updated favicon references in index.html
- Enhanced electron-builder configuration with icon paths

### Technical
- Added `sharp` dependency for image processing
- Implemented custom ICO format generation
- Optimized Playwright browser caching in CI/CD

## [0.0.1] - 2025-01-15

### Added
- Central management of AI tool configurations
- Support for multiple AI tools (Claude Desktop, Cursor, Windsurf, Cline, etc.)
- MCP server management
- Rule sets for system prompts
- One-click synchronization across tools
- Project-based configuration
- SQLite database for persistent storage
- E2E testing with Playwright
- Unit testing with Vitest

### Technical
- React 19 frontend with TailwindCSS
- Electron backend with better-sqlite3
- Vite build system
- electron-builder for packaging

[Unreleased]: https://github.com/your-org/octopus/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/your-org/octopus/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/your-org/octopus/releases/tag/v0.0.1
