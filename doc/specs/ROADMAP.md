# 프로젝트 로드맵 (Project Roadmap)

**Goal:** v1의 모든 기능을 Electron 기반의 프리미엄 데스크탑 앱으로 완벽하게 이식하고, 안정성과 확장성을 확보합니다.

## 1. 기반 마련 (Phase 1: Foundation)
**기간:** 1주차 (완료)
**목표:** 기반 기술 스택 및 아키텍처 수립
- [x] **Project Setup:** Vite + React + TypeScript + TailwindCSS + Electron.
- [x] **Clean Architecture:** `src`(Renderer)와 `electron`(Main)의 엄격한 분리.
- [x] **Secure IPC:** `contextBridge` 기반의 안전한 통신 패턴(Two-way Promise) 확립.
- [x] **Database Infra:** `better-sqlite3` 연동 및 초기 설정.

## 2. Rules 관리 (Phase 2: Rules Management)
**기간:** 1주차 (완료)
**목표:** 핵심 기능 1 - Rules 관리 이식
- [x] **Backend:** `RulesService` (CRUD) 및 SQLite 테이블 구현.
- [x] **Frontend:** 직관적인 Master-Detail UI 구현.
- [x] **IPC:** Zod 기반의 엄격한 데이터 검증 시스템 구축.

## 3. MCP 관리 (Phase 3: MCP Management)
**상태:** 완료
**목표:** 핵심 기능 2 - MCP 서버 관리 이식
- [x] **TDD Setup:** Vitest 기반의 단위 테스트 환경 구축.
- [x] **Backend:** `McpService` 구현 및 JSON 데이터(Args, Env) 처리 로직.
- [x] **Integration:** Zod Schema 검증 및 IPC 연결.
- [x] **Frontend:** 동적 폼(Key-Value Env) 및 서버 목록 UI.

## 4. 동기화 및 자동 탐지 (Phase 4: Sync & Auto-Detection)
**상태:** 완료
**목표:** 실제 AI 도구와의 연동 구현
- [x] **Auto Detection:** 시스템에 설치된 AI 도구(Claude, Cursor 등) 자동 탐지 로직 이식.
- [x] **File Parsing:** 도구별 설정 파일(JSON, TOML, Markdown) 파서 구현.
- [x] **Sync Logic:** DB 상태를 실제 로컬 파일(`CLAUDE.md`, `config.toml` 등)에 동기화.
- [x] **Diff View:** 동기화 전 변경 사항 미리보기(Diff) UI.

## 5. UI/UX 개편 (Phase 4.5: UI/UX Overhaul)
**상태:** 완료
**스타일:** Linear-Style Redesign
- [x] **Design System Setup:**
    - [x] `doc/design/DESIGN_SYSTEM_V2.md` 작성.
    - [x] Install `shadcn-ui` & configure Tailwind for Dark Mode (Zinc).
    - [x] Global Reset: Remove old CSS & Layouts.
- [x] **Core Layout (Shell):**
    - [x] `AppShell` Component (Sidebar + Header + Main Area).
    - [x] Navigation System (Route to Menu mapping).
- [x] **Component Migration:**
    - [x] Tools Grid (Card Component).
    - [x] Sync Menu (Column Selection UI).
    - [x] Rules & MCP Config Editors.
- [x] **Refinement:**
    - [x] Micro-animations & Transitions.
    - [x] Typographic Polish (Inter/JetBrains Mono).
    - [x] Dialog Refactoring (SyncPreviewDialog).
- [x] **Sidebar:** 메뉴 구조 개편 (Tools, Sync, Rules, MCP Sets, Projects, History, Settings).

## 6. 안정성 및 고급 기능 (Phase 5: Stability & Advanced)
**상태:** 완료
- [x] Global Settings (Theme, Auto Sync)
- [x] Backend Verification (Integration Tests)
- [x] History & Rollback System (HistoryPage UI 및 revert API 구현)

## 7. 자동화 검증 (Phase 6: Automated Verification)
**상태:** 진행 중
- [x] Mocked E2E Tests (Playwright) - 6개 테스트 파일 구현 (`e2e/*.spec.ts`)
- [ ] Final Polish & Release

## 8. 릴리즈 엔지니어링 (Phase 7: Release Engineering)
**목표:** 배포 및 상품화 준비
**상태:** 부분 완료
- [x] **Packaging:** `electron-builder` 설정 완료 (Mac/Windows/Linux).
- [ ] **Signing:** 코드 서명(Code Signing) 및 공증(Notarization).
- [ ] **Auto Update**: `electron-updater` 연동.
- [x] **CI/CD**: Github Actions 기본 파이프라인 구축 (`build.yml` - test + build).
