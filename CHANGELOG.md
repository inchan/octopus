# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.7] - 2026-01-15

### Fixed
- **Build Process:** Fixed a build failure in GitHub Actions caused by empty environment variables.

## [0.0.6] - 2026-01-15

## [0.0.5] - 2026-01-15

### Added
- **macOS Distribution:** Re-configured the app for "Unidentified Developer" distribution. This resolves the persistent "Damaged App" error by allowing users to open the app via the standard macOS security workaround (Right-click > Open).
- **Deployment Documentation:** Updated `배포.md` with detailed instructions for the unsigned macOS distribution process.

## [0.0.3] - 2026-01-15

### Added
- **Auto-Update System:** Implemented a hybrid auto-update mechanism for macOS and Windows.
  - Windows: Supports automatic download and installation.
  - macOS: Detects updates and guides users to the download page due to code signing restrictions.
- **Update Notification UI:** Added a dialog to notify users when a new version is available.

### Fixed
- **macOS App Launch:** Resolved "Damaged App" error by enabling ad-hoc signing for macOS builds. Users can now open the app via right-click > Open.
- **Tests:** Fixed `App.test.tsx` failure in CI by mocking `window.api` correctly.
- **Tests:** Fixed `KeyValueList.test.tsx` import error.

## [0.0.2] - 2025-05-20

### Added
- **Tool Configuration:** Added detailed configuration UI for detected tools.
- **Sync Preview:** Enhanced sync preview with diff view for configuration files.
- **Project Scanning:** Improved project scanning performance and accuracy.

## [0.0.1] - 2025-05-15

### Added
- Initial release of Octopus.
- **Core Features:**
  - Rule Management (Create, Read, Update, Delete).
  - MCP Server Management.
  - Tool Detection (VS Code, Cursor, Windsurf, Claude Desktop, etc.).
  - Synchronization Engine.