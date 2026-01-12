# 프로젝트 컨텍스트 및 규칙 (Project Context & Rules)

## 1. 프로젝트 개요 (Project Overview)
- **Type**: 데스크탑 애플리케이션
- **Framework**: Electron, React, TypeScript, Vite
- **Architecture**: 엄격한 Context Isolation을 적용한 모노레포 스타일 구조.

## 2. 기술 스택 (Technology Stack)
- **Build Tool**: electron-vite (Webpack 아님)
- **Frontend**: React 18+, TypeScript, TailwindCSS, Zustand (상태 관리), TanStack Query (비동기 상태)
- **Backend (Main Process)**: Node.js, SQLite (DB 필요 시)
- **Package Manager**: pnpm 또는 yarn

## 3. 아키텍처 및 보안 규칙 (중요) (Architecture & Security Rules)
- **Context Isolation**: 반드시 `true`여야 합니다.
- **Node Integration**: Renderer에서는 반드시 `false`여야 합니다.
- **Communication**:
  - Renderer에서는 `ipcRenderer.invoke`, Main에서는 `ipcMain.handle`을 사용합니다.
  - `remote` 모듈은 절대 사용하지 않습니다.
  - React 컴포넌트에서 Node.js 모듈(fs, path 등)을 직접 import하지 않습니다.
- **Preload Script**:
  - `contextBridge`를 통해 특정 메서드만 노출합니다.
  - `ipcRenderer` 객체 전체를 노출하지 않습니다.

## 4. 코딩 표준 (Coding Standards)
- **Functionality:** Separate Business Logic from UI. Use Service Layer pattern in Main Process.
- **Async:** Always use `async/await`.
- **Types:** Strict TypeScript types for all IPC payloads and responses.
- **File Structure:** Adhere strictly to the defined folder structure.
