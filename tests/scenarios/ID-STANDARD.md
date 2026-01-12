# ID 형식 표준

## Overview

모든 테스트 시나리오(Unit, E2E)에서 사용하는 ID의 형식을 정의합니다.

## 표준 형식

```
TC-{MENU}-{LAYER}{NUMBER}
```

| 구성요소 | 값 | 설명 |
|----------|-----|------|
| TC | 고정 | Test Case |
| MENU | TOOLS, SYNC, PROJ, RULES, MCP, HIST, SET | 메뉴 약어 (3-5자) |
| LAYER | R, S, H, C, U, E, K | 계층 코드 |
| NUMBER | 001-999 | 순차 번호 (3자리) |

## 메뉴 약어 (MENU)

| 코드 | 전체 이름 | 설명 |
|------|-----------|------|
| TOOLS | Tools | 도구 관리 (Tool Detection, Configuration) |
| SYNC | Sync | 설정 동기화 (Preview, Apply) |
| PROJ | Projects | 프로젝트 관리 |
| RULES | Rules | 룰 관리 (Rules, Rule Sets) |
| MCP | MCP | MCP 서버 관리 |
| HIST | History | 변경 이력 관리 |
| SET | Settings | 애플리케이션 설정 |

## 계층 코드 (LAYER)

| 코드 | 계층 | 설명 |
|------|------|------|
| R | Repository | 데이터 접근 계층 (DB, File System) |
| S | Service | 비즈니스 로직 계층 |
| H | Handler | IPC 핸들러 계층 |
| C | Component | UI 컴포넌트 |
| U | Utility | 유틸리티 함수 |
| E | E2E | End-to-End 테스트 |
| K | Hook | React Hook (TanStack Query) |

## 번호 부여 규칙 (NUMBER)

- **3자리 숫자**: `001`부터 시작하여 `999`까지 사용
- **그룹화**: 관련 테스트는 10단위나 100단위로 그룹화 가능
  - 예: `TC-TOOLS-R001` ~ `TC-TOOLS-R009` (Detection)
  - 예: `TC-TOOLS-R010` ~ `TC-TOOLS-R019` (Configuration)

## 예외 사항

- 기존에 작성된 `TC-COM-*` (공통 시나리오)는 이 표준을 따르지 않을 수 있습니다.
- 외부 시스템과의 호환성을 위해 유지해야 하는 경우 별도 문서화합니다.

## 변환 예시

| 기존 ID | 새 ID | 설명 |
|---------|-------|------|
| TC-TD-001 | TC-TOOLS-R001 | Tools Repository (Detection) |
| TC-TS-005 | TC-TOOLS-S005 | Tools Service |
| TC-SYNC-R0001 | TC-SYNC-R001 | Sync Repository |
| TC-RULE-E0012 | TC-RULES-E012 | Rules E2E |
| TC-MCP-R001 | TC-MCP-R001 | (유지) |
