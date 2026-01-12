# 개발 워크플로우 및 가이드라인 (Development Workflow & Guidelines)

## 1. 개발 프로세스 (TDD) (Development Process)
모든 기능 구현은 다음 사이클을 따릅니다.

1.  **RED (Test First)**:
    -   구현하려는 기능의 인터페이스(Type)를 먼저 정의합니다.
    -   해당 기능을 검증할 수 있는 실패하는 테스트 케이스를 작성합니다.
    -   *Hint: `McpService.test.ts`를 먼저 만드세요.*

2.  **GREEN (Implementation)**:
    -   테스트를 통과하기 위한 최소한의 비즈니스 로직을 구현합니다.
    -   이 단계에서는 코드의 품질보다 "동작 확인"에 집중합니다.

3.  **REFACTOR (Improvement)**:
    -   테스트가 보호해주는 상태에서 코드를 정리합니다.
    -   중복 제거, 변수명 개선, 구조 최적화를 수행합니다.

## 2. Feature Migration Workflow
v1에서 v2로 기능을 이식할 때는 다음 절차를 따릅니다.

1.  **Spec Definition**: `../specs/`에 스펙 문서 작성 (Protocol).
2.  **Domain & Infra**: Entity 정의 및 DB 테이블 생성.
3.  **Service TDD**: Service 클래스에 대한 Unit Test 작성 및 구현.
4.  **IPC & UI**: 핸들러 연결 및 UI 구현 (UI는 수동 검증).

## 3. Technology & Architecture

### 3.1 Tech Stack
- **Runtime:** Electron (Latest Stable)
- **Language:** TypeScript (Strict Mode)
- **Build:** Electron-Vite (No Webpack)
- **Frontend:** React, TailwindCSS, Shadcn/UI
- **State Management:**
  - Server State: TanStack Query (React Query)
  - Client State: Zustand
- **Testing:** Vitest (Unit), Playwright (E2E)

### 3.2 Security Rules (Non-Negotiable)
1. **Context Isolation:** MUST be `true`.
2. **Node Integration:** MUST be `false` in Renderer.
3. **Sandbox:** Enable wherever possible.
4. **External Links:** Never open within the app; delegate to OS default browser via `shell.openExternal`.
5. **IPC:** Never expose complete `ipcRenderer`. Expose only specific methods.

### 3.3 Data Flow Strategy (Server State Pattern)
Electron 앱이지만 웹 앱처럼 데이터를 다룹니다.
- **Fetch:** Renderer는 데이터를 소유하지 않고, `useQuery`를 통해 Main Process에서 "빌려와서" 캐싱합니다.
- **Mutate:** 데이터 변경은 `useMutation` -> `ipcRenderer.invoke` -> `Main` 처리 -> `Query Invalidation` 순서로 이루어집니다.
