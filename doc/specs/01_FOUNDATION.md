# 01. Foundation & Architecture Spec (v1.2 - Final)

**Status**: Ready for Implementation
**Phase**: Phase 1

This document defines the technical foundation for `octopus` v2, incorporating 2025 industry best practices for Electron/React.

## 1. Core Architecture Principles
Based on "Clean Architecture for Electron" best practices:

-   **Strict Layering**: Dependencies point INWARDS. UI -> Presenters -> Use Cases -> Entities.
-   **Isolation**: The Renderer NEVER imports `electron` or Node.js modules directly.
-   **Feature-First**: Code is organized by domain feature (`features/rules`, `features/mcp`), not file type.

## 2. Technology Stack & Rationale

| Category | Technology | Best Practice Justification |
| :--- | :--- | :--- |
| **Runtime** | Electron (Latest) | with `sandbox: true` and `contextIsolation: true` for maximum security. |
| **Build** | Vite | Fastest HMR. Configured to **externalize** `better-sqlite3` to avoid bundling native C++ modules. |
| **IPC** | **Typed Bridge** | We implement a "tRPC-lite" pattern. A shared `IAPI` interface guarantees compile-time safety between Main and Renderer without heavy runtime overhead. |
| **Database** | `better-sqlite3` | Synchronous, crash-safe, and faster than async alternatives for local desktop apps. |

## 3. Detailed Directory Structure

```
octopus/
├── electron/                 # [Infrastructure Layer]
│   ├── main.ts              # Entry Point
│   ├── preload.ts           # The "Anti-Corruption Layer" (Bridge)
│   ├── infra/               # Database implementation, FileSystem adapters
│   ├── usecases/            # [Application Business Rules]
│   │   ├── rules/           # Pure TS classes, generic Repositories
│   │   └── mcp/
│   └── handlers/            # [Interface Adapters]
│       └── IpcRouter.ts     # Routes 'channel' -> UseCase
├── src/                      # [Presentation Layer] (React)
│   ├── features/            # Feature Modules
│   │   ├── rules/           # - components/
│   │   │                    # - hooks/ (TanStack Query)
│   │   └── ...
│   └── lib/                 # Shared UI Utilities
│       └── apiClient.ts     # Typed implementation of IAPI
└── shared/                   # [Domain Layer]
    ├── api-contract.ts      # export interface IAPI { ... }
    └── entities.ts          # export interface Rule { ... }
```

## 4. Native Module Strategy (`better-sqlite3`)

To prevent the common "Node version mismatch" error:
1.  **Vite Config**: Add `build.rollupOptions.external: ['better-sqlite3']`.
2.  **Electron Builder**: Add `asarUnpack: ['**/node_modules/better-sqlite3/**']`.
3.  **NPM Scripts**: 
    - `predev`: Runs `electron-rebuild` before dev server for Electron compatibility.
    - `prebuild`: Runs `electron-rebuild` before production build.

> **상세 가이드**: [06_NATIVE_MODULES.md](./06_NATIVE_MODULES.md) 참조

## 5. Security & IPC Pattern

**The "Safe Bridge" Pattern:**
1.  **Renderer** calls `window.api.rules.getRules()`.
2.  **Preload** validates inputs (basic checks) and forwards via `ipcRenderer.invoke`.
3.  **Main** receives request.
4.  **Zod Middleware** validates arguments against a schema.
5.  **UseCase** executes logic.
6.  **Response** is returned.

## 6. Execution Plan

1.  **Scaffold**: Initialize Vite+React+TS project.
2.  **Electronize**: Add Electron, configure concurrent execution (concurrently).
3.  **Hardening**: Configure `tsconfig` to strictly separate `electron/` and `src/`.
4.  **Native Setup**: Install `better-sqlite3` and configure build externals.
5.  **IPC Proof**: Implement the `IAPI` pattern with a dummy "Ping/Pong".
