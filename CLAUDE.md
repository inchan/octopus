# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Octopus는 Electron 기반 AI 도구 설정 동기화 데스크탑 애플리케이션입니다. 여러 AI 코딩 도구들의 Rules와 MCP 서버 설정을 중앙에서 관리하고 동기화합니다.

**필수 문서**: 작업 전 [마스터 가이드](doc/GUIDE.md)를 숙지해야 합니다.

## Commands

```bash
# 개발
npm run dev              # Vite 개발 서버 (localhost:5173)

# 빌드
npm run build            # TypeScript 컴파일 + Vite 빌드 + Electron 패키징

# 테스트
npm run test             # Vitest 단위 테스트 실행
npm run test:watch       # 테스트 감시 모드

# 단일 테스트 파일 실행
npx vitest run electron/services/settings/SettingsService.test.ts

# E2E 테스트
npx playwright test                    # 전체 E2E
npx playwright test e2e/rules.spec.ts  # 단일 스펙

# Lint
npm run lint
```

## Architecture

```
[Renderer Process]      [Bridge]           [Main Process]
+----------------+    +----------+    +------------------------+
|  Presentation  | -> |  IPC     | -> |  Handler (Controller)  |
|  (React/View)  |    | (Preload)|    |      (Input Validation)|
+----------------+    +----------+    +-----------+------------+
                                                  |
                                          +-------v-------+
                                          |  Service Layer| <--- 핵심 비즈니스 로직
                                          |  (Use Cases)  |      (Pure TypeScript)
                                          +-------+-------+
                                                  |
                                          +-------v-------+
                                          | Infrastructure|
                                          | (Repository)  |
                                          +---------------+
```

### Directory Structure

- **`electron/`**: Main Process (Backend)
  - `handlers/`: IPC 요청 수신, 검증 후 Service 호출
  - `services/`: 순수 비즈니스 로직 (외부 의존성 최소화)
  - `repositories/`: DB/파일 시스템 접근
  - `main.ts`: 앱 생명주기 관리
  - `preload.ts`: contextBridge API 정의

- **`src/`**: Renderer Process (Frontend)
  - `features/`: 도메인별 기능 (rules, projects, mcp, sync, tools, settings, history)
  - `components/`: 재사용 UI 컴포넌트
  - `hooks/`: React Query 기반 서버 상태 동기화

- **`shared/`**: Renderer/Main 공유
  - `types.ts`: IPC DTO 및 인터페이스
  - `api.ts`: API 채널 정의

- **`e2e/`**: Playwright E2E 테스트
  - Page Object 패턴 (`pages/`)

### Path Aliases

```typescript
@/         -> src/
@shared/   -> shared/
@electron/ -> electron/
```

## Core Principles

### IPC Security (엄격히 준수)
- Context Isolation: `true`
- Node Integration in Renderer: `false`
- `remote` 모듈 사용 금지
- `ipcRenderer` 객체 전체 노출 금지
- React에서 Node.js 모듈(fs, path) 직접 import 금지

### Dependency Rule
소스 코드 의존성은 안쪽(고수준)으로만 향해야 합니다:
- UI → Handler → Service → Repository
- Service는 UI를 알면 안 됨

### TDD Workflow
1. 실패하는 테스트 작성 (Red)
2. 테스트 통과하는 최소 코드 (Green)
3. 리팩토링 (Refactor)

## Development Workflow Commands

프로젝트는 `.agent/workflows/`에 정의된 워크플로우를 따릅니다:
- `/feature`: 기능 구현 (Core 문서 정독 → TDD → Architecture Check)
- `/fix`: 버그 수정 (재현 → 원인 분석 → 수정 검증)
- `/refactor`: 리팩토링 (테스트 존재 확인 필수)
- `/adr`: 아키텍처 결정 기록

## Key Technologies

- **Frontend**: React 19, TailwindCSS, TanStack Query, Radix UI
- **Backend**: Electron, better-sqlite3
- **Testing**: Vitest (unit), Playwright (E2E)
- **Build**: Vite, electron-builder
