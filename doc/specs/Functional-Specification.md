# 상세 기능 명세서 (Functional Specification)

## 1. 전체 메뉴 구성 (Menu Structure)
1. **Tools:** 도구별 상태 확인 및 전역/개별 설정 매핑.
2. **Sync:** 도구 그룹별 룰/MCP 서버 일괄 배포 엔진.
3. **Rules:** 3단계 규칙 관리 (Piece → Composite → Set).
4. **MCP Servers:** MCP 서버 등록 및 세트 관리 (3-Pane UI).
5. **Projects:** 프로젝트별 환경 최적화 및 자동 스캔.
6. **Logs:** 동기화 이력 및 자동 백업 관리.
7. **Settings:** 서비스 전역 환경 설정.

---

## 2. 핵심 UI/UX 원칙 (Core UI/UX Principles)
- **태그(Tags) 시스템:** 모든 규칙, 서버, 세트에 태그를 부여하여 강력한 필터링/검색 지원.
- **드래그 앤 드롭:** 모든 리스트의 순서를 자유롭게 변경하여 우선순위 결정.
- **설정 범위(Scope):** `Global`, `Project`, `Project-Local` 3단계 구분.

---

## 3. 상세 기능 시나리오 (Detailed Scenarios)

### 3.1 Tools (도구 관리)
- **그리드 구성:** 첫 번째는 전체(전역) 카드 고정, 이후 개별 도구 나열.
- **정렬:** `설치됨 > CLI > IDE > Desktop` 순으로 자동 정렬 (순서 변경 가능).
- **기능:** Rule/MCP 설정 버튼 제공 (지원하지 않는 기능은 비활성화).

### 3.2 Rules (3단계 계층)
- **Level 1 (Piece):** 최소 단위 원자적 규칙.
- **Level 2 (Composite):** 여러 Piece의 조합. 내부 순서 편집 가능.
- **Level 3 (Set):** 최종 배포 단위. 완성형 룰과 피스들의 집합.

### 3.3 MCP Servers (3-Pane UI)
- **1단 (Set List):** 생성된 서버 세트 목록.
- **2단 (Selected List):** 세트 상세 정보 및 포함된 서버 리스트(순서 변경 가능).
- **3단 (Server Pool):** 전체 서버 리스트(CRUD, 활성/비활성 스위치).

### 3.4 Projects (프로젝트 관리)
- **목록:** Global Settings 고정 후 등록된 프로젝트 리스트 출력.
- **상세:** 도구별 Rule/MCP 설정 리스트 표시 및 개별 변경.
- **프로젝트 스캔:** CLI 도구(git, npm 등) 기반 전략으로 로컬 탐색. 설정 파일이 1개라도 감지된 프로젝트만 자동 등록.

### 3.5 Sync (동기화 엔진)
- **대상:** 기본 Tool Set(All, CLI, IDE, Desktop) 및 커스텀 세트.
- **범위 선택:** 동기화 실행 시 `Global`, `Project`, `Project-Local` 중 지원되는 범위를 선택.
- **전략:** `Overwrite`(기본) 또는 `Smart Update` 지원.
- **안정성:** 실행 직전 자동 백업 및 Logs 기록.

---
