# T5: 메타데이터 및 통계 자동화

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T5 |
| Priority | Medium |
| 총 항목 수 | 3 |
| 의존성 | **T5-B, T5-C는 다른 모든 Task 완료 후** |
| 병렬 실행 | 🚫 순차 실행 필요 |

---

## Progress

```
[██████████] 100% (3/3)
```

| State | Count |
|-------|-------|
| ✅ DONE | 3 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T5-A-001 | 통계 생성 스크립트 작성 | ✅ DONE | [] | Gemini | `scripts/generate-scenario-stats.cjs` 작성 완료 |
| T5-B-001 | 각 파일 헤더 통계 추가 | ✅ DONE | [T1-*, T2-*, T3-*, T4-*] | Gemini | 모든 시나리오 파일에 통계 섹션 추가 완료 |
| T5-C-001 | scenarios/README.md 생성 | ✅ DONE | [T5-B-001] | Gemini | 전체 요약 `tests/scenarios/README.md` 생성 완료 |

---

## Task Details

### T5-A-001: 통계 생성 스크립트 작성

**Description**: 시나리오 파일을 분석하여 통계를 자동 생성하는 스크립트

**Output**: `scripts/generate-scenario-stats.cjs`

**Features**:
1. 파일별 시나리오 수 카운트 (RegExp)
2. Priority 분포 분석
3. 계층별 커버리지 (Layer Map)
4. Markdown 파일 헤더 자동 업데이트

**Priority**: Medium

---

### T5-B-001: 각 파일 헤더 통계 추가

**Description**: 각 시나리오 파일 상단에 통계 섹션 추가

**Target Files**: 14개 (`tests/scenarios/{menu}/*.md`)

**Result**:
- 모든 파일에 `## Statistics` 및 `### Coverage by Layer` 섹션 자동 삽입
- 날짜(Last Updated) 및 진행률 시각화(ProgressBar) 포함

**Priority**: Medium

---

### T5-C-001: scenarios/README.md 생성

**Description**: 전체 시나리오 개요 및 사용법 문서 생성

**Output**: `tests/scenarios/README.md`

**Content Structure**:
- Summary Table (Menu vs Test Type)
- Priority Distribution (Overall)
- Directory Structure
- How to Use & Contributing Guide

**Priority**: Medium

---

## Dependency Graph

```
T1-*, T2-*, T3-*, T4-* (모든 시나리오 변경) [DONE]
            │
            ▼
      T5-A-001 (스크립트 작성) [DONE]
            │
            ▼
      T5-B-001 (파일 헤더 추가) [DONE]
            │
            ▼
      T5-C-001 (README 생성) [DONE]
```

---

## References

- Review: [REVIEW.md 섹션 4 - Medium](../REVIEW.md#medium-개선-권장)
- Parent: [TASKS.md Task 5](../TASKS.md#task-5-시나리오-통계-및-메타데이터-추가-priority-medium)

---

*Last Updated: 2025-12-23*