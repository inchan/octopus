# T3: Category 필드 제거

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T3 |
| Priority | High |
| 총 항목 수 | 1 |
| 예상 변경 수 | ~60 lines |
| 의존성 | 없음 |
| 병렬 실행 | ✅ 완전 독립 |

---

## Progress

```
[██████████] 100% (1/1)
```

| State | Count |
|-------|-------|
| ✅ DONE | 1 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T3-A-001 | sync/*.md Category 필드 제거 | ✅ DONE | [] | Gemini | E2E + Unit Tests 모두 제거 완료 |

---

## Problem Statement

### 현재 상태

**Sync E2E만 Category 사용**:
```markdown
### TC-SYNC-E0001: Dashboard Layout
- **Description**: Verify Sync dashboard displays correctly
- **Priority**: High
- **Category**: UI Layout  ← 다른 메뉴에는 없는 필드
```

**다른 메뉴 (Tools, Rules, MCP 등)**:
```markdown
### TC-TOOLS-E001: Tool List View
- **Description**: Verify tool list displays correctly
- **Priority**: High
  ← Category 필드 없음
```

### 문제점

| 영향 | 설명 |
|------|------|
| 분류 체계 불일치 | Sync만 Category로 분류 가능, 다른 메뉴는 불가 |
| 검색/필터링 어려움 | 전체 시나리오 통합 검색 시 일관성 부재 |
| 템플릿 혼란 | 신규 시나리오 작성 시 어떤 형식 따를지 불명확 |

### 해결 방안

**옵션 B 채택: Sync에서 Category 제거**

**이유**:
1. Category 정보는 섹션 제목으로 이미 표현됨 (예: "## 4.1 List UI Layout Tests")
2. ID의 계층 코드(R, S, H, E)로 분류 가능
3. 작업량 대비 효과: 최소 변경으로 즉시 일관성 확보

---

## Task Details

### T3-A-001: sync/*.md Category 필드 제거

**Description**: Sync 시나리오 파일들에서 비표준 Category 필드를 제거하여 일관성 확보

**Target File**:
- `tests/scenarios/sync/e2e-tests.md` (완료)
- `tests/scenarios/sync/unit-tests.md` (완료 - 감사 중 추가 발견되어 제거함)

**Before**:
```markdown
### TC-SYNC-E0001: Dashboard Layout
...
- **Category**: UI Layout
```

**After**:
```markdown
### TC-SYNC-E0001: Dashboard Layout
...
```

**Verification**:
```bash
grep -r "- \*\*Category\*\*:" tests/scenarios/
```
**Result**: No matches found.

**Priority**: High

---

## References

- Review: [REVIEW.md 섹션 3.2](../REVIEW.md#32-sync-e2e-추가-필드-분석)
- Parent: [TASKS.md Task 3](../TASKS.md#task-3-category-필드-일관성-해결-priority-high)

---

*Last Updated: 2025-12-23*