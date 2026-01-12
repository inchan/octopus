# T2: 시나리오 ID 형식 통일

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T2 |
| Priority | High |
| 총 항목 수 | 9 |
| 예상 변경 수 | ~450 IDs |
| 의존성 | 순차적 (A → B → C-*) |
| 병렬 실행 | ⚠️ T2-C-* 항목들만 병렬 가능 |

---

## Progress

```
[██████████] 100% (9/9)
```

| State | Count |
|-------|-------|
| ✅ DONE | 9 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T2-A-001 | ID 표준 정의 문서 작성 | ✅ DONE | [] | Gemini | `tests/scenarios/ID-STANDARD.md` 생성 완료 |
| T2-B-001 | 변환 스크립트 작성 | ✅ DONE | [T2-A-001] | Gemini | `scripts/convert-scenario-ids.cjs` 생성 완료 |
| T2-C-001 | tools/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 68 Unit + 50 E2E IDs 변환 완료 |
| T2-C-002 | sync/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 36 Unit + 38 E2E IDs 변환 완료 |
| T2-C-003 | projects/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 57 Unit + 36 E2E IDs 변환 완료 |
| T2-C-004 | rules/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 96 Unit + 63 E2E IDs 변환 완료 |
| T2-C-005 | mcp/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 20 Unit + 26 E2E IDs 변환 완료 |
| T2-C-006 | history/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 53 Unit + 58 E2E IDs 변환 완료 |
| T2-C-007 | settings/*.md 적용 | ✅ DONE | [T2-B-001] | Gemini | 28 Unit + 50 E2E IDs 변환 완료 |

---

## ID 형식 표준

### 현재 문제점

| 파일 | 현재 형식 | 예시 | 문제점 |
|------|-----------|------|--------|
| tools/*.md | TC-TD-XXX, TC-TS-XXX | TC-TD-001 | 계층 코드 불명확 |
| sync/*.md | TC-SYNC-RXXXX | TC-SYNC-R0001 | 숫자 4자리 불필요 |
| rules/*.md | TC-RULE-RXXXX | TC-RULE-R0001 | RULE 단수형 |
| mcp/*.md | TC-MCP-RXXX | TC-MCP-R001 | 상대적으로 양호 |
| history/*.md | TC-HIST-RXXX | TC-HIST-R001 | 상대적으로 양호 |

### 새 표준 형식

```
TC-{MENU}-{LAYER}{NUMBER}
```

| 구성요소 | 값 | 설명 |
|----------|-----|------|
| TC | 고정 | Test Case |
| MENU | TOOLS, SYNC, PROJ, RULES, MCP, HIST, SET | 메뉴 약어 (4-5자) |
| LAYER | R, S, H, C, U, E, K | 계층 코드 |
| NUMBER | 001-999 | 순차 번호 (3자리) |

### 계층 코드 정의

| 코드 | 계층 | 설명 |
|------|------|------|
| R | Repository | 데이터 접근 계층 |
| S | Service | 비즈니스 로직 계층 |
| H | Handler | IPC 핸들러 계층 |
| C | Component | UI 컴포넌트 |
| U | Utility | 유틸리티 함수 |
| E | E2E | End-to-End 테스트 |
| K | Hook | React Hook (TanStack Query) |

### 변환 예시

| 현재 ID | 새 ID | 설명 |
|---------|-------|------|
| TC-TD-001 | TC-TOOLS-R001 | Tools Repository |
| TC-TS-005 | TC-TOOLS-S005 | Tools Service |
| TC-SYNC-R0001 | TC-SYNC-R001 | Sync Repository |
| TC-RULE-E0012 | TC-RULES-E012 | Rules E2E |
| TC-MCP-R001 | TC-MCP-R001 | (유지) |

---

## Task Details

### T2-A-001: ID 표준 정의 문서 작성

**Description**: 모든 시나리오에서 사용할 ID 형식 표준 문서 작성

**Output**: `tests/scenarios/ID-STANDARD.md`

**Content**:
1. 형식 정의 및 예시
2. 계층 코드 목록
3. 메뉴 약어 목록
4. 번호 부여 규칙
5. 예외 사항

**Priority**: High

---

### T2-B-001: 변환 스크립트 작성

**Description**: 기존 ID를 새 형식으로 일괄 변환하는 스크립트 작성

**Output**: `scripts/convert-scenario-ids.cjs`

**Requirements**:
1. 파일별 변환 규칙 정의
2. Dry-run 모드 지원 (생략)
3. 변환 로그 출력
4. 롤백 지원 (수동 백업 권장)

**Priority**: High

---

### T2-C-001 ~ T2-C-007: 파일별 적용

**Description**: 변환 스크립트를 각 메뉴 파일에 적용

**Process**:
1. 스크립트 실행: `node scripts/convert-scenario-ids.cjs`
2. 변환 결과 검증 (grep & uniq check)

**변환 결과 요약**:

| Task | 파일 | ID 수 (Total) |
|------|------|---------------|
| T2-C-001 | tools/*.md | 118 |
| T2-C-002 | sync/*.md | 74 |
| T2-C-003 | projects/*.md | 93 |
| T2-C-004 | rules/*.md | 159 |
| T2-C-005 | mcp/*.md | 46 |
| T2-C-006 | history/*.md | 111 |
| T2-C-007 | settings/*.md | 78 |
| **Total** | | **679** |

---

## Dependency Graph

```
T2-A-001 (표준 정의) [DONE]
    │
    ▼
T2-B-001 (스크립트 작성) [DONE]
    │
    ▼
T2-C-001 ~ 007 (변환 실행) [DONE]
```

---

## References

- Review: [REVIEW.md 섹션 4 - High](../REVIEW.md#high-우선-수정)
- Parent: [TASKS.md Task 2](../TASKS.md#task-2-시나리오-id-형식-통일-priority-high)

---

*Last Updated: 2025-12-23*