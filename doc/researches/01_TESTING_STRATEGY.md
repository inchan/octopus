# 01. Research: Testing Strategy for v2

**Date**: 2025-12-17
**Status**: Proposed

이 문서는 `align-agents-v2` (Electron + Vite + React + Clean Architecture) 프로젝트를 위한 최적의 테스트 전략을 정의합니다.

## 1. Executive Summary

리서치 결과, 현대적인 Electron 앱 개발의 표준은 **Vitest (Unit/Integration)** 와 **Playwright (E2E)** 의 조합입니다.

| Layer | Tool | Scope | Responsibility |
| :--- | :--- | :--- | :--- |
| **Unit** | **Vitest** | Domain Logic (Services, Utils) | 비즈니스 로직의 정확성 검증 (Electron 의존성 없음) |
| **Integration** | **Vitest** + **RTL** | Components, Hooks, Managers | UI 동작 및 상태 관리 검증 (Mocking Electron IPC) |
| **E2E** | **Playwright** | Full Application | 실제 앱 실행, 프로세스 간 통신, 사용자 시나리오 검증 |

## 2. Layered Testing Strategy

### 2.1 Unit Testing (The Core)
우리의 아키텍처는 Clean Architecture를 따르므로, 비즈니스 로직(`electron/usecases`)은 Electron이나 UI에 의존하지 않는 순수 TypeScript 클래스입니다.
-   **Target**: `McpService`, `RulesService` 등의 Use Cases.
-   **Tool**: `vitest` (Fast, Native ESM, Jest-compatible).
-   **Method**: In-memory mocking of Database/Repository.

### 2.2 Integration Testing (Renderer)
UI 컴포넌트와 IPC 통신 계층을 검증합니다.
-   **Target**: `McpPage.tsx`, `RulesPage.tsx`.
-   **Tool**: `vitest` + `@testing-library/react` + `happy-dom`.
-   **Method**: `window.api` (ContextBridge)를 모킹하여 백엔드 동작을 시뮬레이션합니다.

### 2.3 IPC & Main Process Testing
Main Process의 핸들러와 라우팅 로직을 검증합니다.
-   **Target**: `McpHandler.ts`, `RulesHandler.ts`.
-   **Tool**: `vitest`.
-   **Method**: `ipcMain.handle`을 모킹하거나, 핸들러 함수 자체를 분리하여 순수 함수로 테스트합니다.

### 2.4 E2E Testing (System Verification)
실제 빌드된 앱이 사용자 시나리오대로 동작하는지 확인합니다.
-   **Target**: 전체 앱 흐름 (실행 -> Rule 생성 -> DB 저장 확인).
-   **Tool**: `playwright` (Electron 공식 권장).
-   **Note**: Phase 4 이후 도입 권장 (초기 개발 속도 저하 방지).

## 3. Implementation Plan (Phase 3)

현재 단계(Phase 3)에서는 **Unit & Integration Test** 환경 구축에 집중합니다.

1.  **Dependencies Install**:
    -   `vitest`: Test Runner.
    -   `happy-dom`: Lightweight DOM Implementation.
    -   `@testing-library/react`: React Component Testing.

2.  **Configuration**:
    -   `vitest.config.ts`: 메인/렌더러 환경 분리 설정.

3.  **Proof of Concept (TDD)**:
    -   `McpService`에 대한 Unit Test 작성 (`McpService.test.ts`).
    -   테스트를 통과시키는 코드 구현.

4.  **Enforcement**:
    -   CI 파이프라인(Github Actions)에 `npm run test` 추가 (추후).
