# T4: 공통 테스트 시나리오 추출

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T4 |
| Priority | Medium |
| 총 항목 수 | 4 |
| 예상 라인 수 | ~470줄 |
| 의존성 | 없음 |
| 병렬 실행 | ✅ 모든 항목 독립 |

---

## Progress

```
[██████████] 100% (4/4)
```

| State | Count |
|-------|-------|
| ✅ DONE | 4 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T4-A-001 | common/error-handling.md 생성 | ✅ DONE | [] | Gemini | `TC-COM-ERR` 시리즈 정의 완료 |
| T4-B-001 | common/navigation.md 생성 | ✅ DONE | [] | Gemini | `TC-COM-NAV` 시리즈 정의 완료 |
| T4-C-001 | common/accessibility.md 생성 | ✅ DONE | [] | Gemini | `TC-COM-A11Y` 시리즈 정의 완료 |
| T4-D-001 | common/performance.md 생성 | ✅ DONE | [] | Gemini | `TC-COM-PERF` 시리즈 정의 완료 |

---

## Background

### 현재 문제점

- 접근성, 성능 테스트가 일부 메뉴에만 산발적으로 존재
- 동일한 테스트 시나리오가 여러 파일에 중복
- 공통 패턴에 대한 표준 없음

### 해결 방안

1. 공통 시나리오를 별도 파일로 추출
2. 각 메뉴 파일에서 공통 시나리오 참조
3. 메뉴별 특화 시나리오만 해당 파일에 유지

---

## Task Details

### T4-A-001: error-handling.md 생성

**Output**: `tests/scenarios/common/error-handling.md`

**Content Summary**:
- API Error Handling (Timeout, 500, 400, Auth)
- IPC Error Handling (Channel missing, Timeout, Serialization)
- UI Error Display (Toast, Inline, Boundary)

---

### T4-B-001: navigation.md 생성

**Output**: `tests/scenarios/common/navigation.md`

**Content Summary**:
- Sidebar Navigation
- Page Transitions
- Browser History (Back/Forward)

---

### T4-C-001: accessibility.md 생성

**Output**: `tests/scenarios/common/accessibility.md`

**Content Summary**:
- Keyboard Navigation (Tab order, Focus trap)
- Screen Reader (ARIA labels, Live regions)
- Visual (Contrast, Zoom, Motion)

---

### T4-D-001: performance.md 생성

**Output**: `tests/scenarios/common/performance.md`

**Content Summary**:
- Load Performance (FCP, TTI)
- Rendering Performance (List virtualization)
- Resource Management (Memory leaks)

---

## Output Structure

```
tests/scenarios/
├── common/
│   ├── error-handling.md      # T4-A-001
│   ├── navigation.md          # T4-B-001
│   ├── accessibility.md       # T4-C-001
│   └── performance.md         # T4-D-001
```

---

## References

- Review: [REVIEW.md 섹션 4 - Medium](../REVIEW.md#medium-개선-권장)
- Parent: [TASKS.md Task 4](../TASKS.md#task-4-공통-테스트-시나리오-추출-priority-medium)

---

*Last Updated: 2025-12-23*