# Migration Protocol: v1 to v2 (Electron)

이 문서는 align-agents v2 (Electron 버전) 개발을 위한 작업 방식(Protocol)을 정의합니다.

## 1. 문서화 전략 (Where to write)

모든 기획과 설계는 코드를 작성하기 전에 문서로 확정합니다.

- **임시 기획 (Drafts)**: `implementation_plan.md` (Artifact)
    - 에이전트와 사용자 간의 빠른 피드백 루프를 위해 사용.
    - 승인이 완료되면 영구 저장소로 이동.
- **영구 보관 (Permanent Specs)**: `doc/specs/`
    - 승인된 기획서는 이 폴더에 마크다운으로 저장.
    - 예: `doc/specs/01_FOUNDATION.md`, `doc/specs/02_IPC_DESIGN.md`
- **진척도 관리**: `task.md` (Artifact)
    - 현재 작업의 세부 단계 추적.

## 2. 계획 수립 방식 (How to plan)

1.  **초터 (Input)**: Feature Request or Refactor Need.
2.  **분석 (Reasoning)**: 현재 상태 파악, 영향 범위 분석.
3.  **제안 (Plan)**: `implementation_plan.md` 작성 (필수).
4.  **확정 (Commit)**: 승인된 내용을 `doc/specs/`에 저장하고 작업 착수.

## 3. 작업 수행 방식 (How to execute)

`GEMINI.md`의 원칙(Clean Architecture, SOLID)을 엄격히 준수합니다.

1.  **환경 격리 (Isolation)**:
    - Main Process (`electron/`)와 Renderer Process (`src/`)를 철저히 분리.
    - 오직 `contextBridge`를 통해서만 통신.
2.  **검증 주도 (Verification First)**:
    - 코드를 작성하기 전에 "어떻게 테스트할 것인가"를 먼저 정의.
    - 작업 완료 후 `walkthrough.md`에 스크린샷/로그로 증명.
3.  **단계적 구현 (Iterative Dev)**:
    - 한 번에 하나의 레이어만 건드리지 않고, 수직적(Vertical Slice)으로 기능 구현.
    - 예: UI 버튼 -> IPC -> Service -> DB -> 다시 UI 반영.

## 4. 제안된 로드맵 (Proposed Roadmap)

1.  **Phase 0: 프로토콜 정의 (Protocol Definition)** (Current)
    - 작업 방식 확정.
2.  **Phase 1: 기반 마련 (Foundation)**
    - Electron + React 보일러플레이트 세팅.
    - Clean Architecture 폴더 구조 잡기 (`electron/`, `src/`, `shared/`).
3.  **Phase 2: 핵심 이식 (Core Migration)**
    - Rules 기능 이식.
    - MCP 기능 이식.
4.  **Phase 3: Verify & Polish**
    - E2E 테스트 및 UI 폴리싱.
