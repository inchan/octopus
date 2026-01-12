# T1-E: StringList 컴포넌트 테스트 시나리오

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-E |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | High |
| 총 항목 수 | 5 |
| 예상 라인 수 | ~120줄 |
| 의존성 | 없음 |
| 병렬 실행 | ✅ 가능 |

---

## Progress

```
[██████████] 100% (5/5)
```

| State | Count |
|-------|-------|
| ✅ DONE | 5 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T1-E-001 | TC-MCP-C-SL001: Add new string item | ✅ DONE | [] | - | 새 항목 추가 |
| T1-E-002 | TC-MCP-C-SL002: Edit existing string item | ✅ DONE | [] | - | 기존 항목 수정 |
| T1-E-003 | TC-MCP-C-SL003: Delete string item | ✅ DONE | [] | - | 항목 삭제 |
| T1-E-004 | TC-MCP-C-SL004: Drag and drop reorder | ✅ DONE | [] | - | 드래그 앤 드롭 순서 변경 |
| T1-E-005 | TC-MCP-C-SL005: Render empty state with placeholder | ✅ DONE | [] | - | 빈 상태 placeholder |

---

## Task Details

### T1-E-001: Add new string item

**Test Case ID**: TC-MCP-C-SL001

**Description**: StringList 컴포넌트에서 새로운 문자열 항목을 추가하는 기능 검증

**Preconditions**:
- StringList 컴포넌트 렌더링됨
- `onChange` 콜백 prop 전달됨
- 초기값: `["arg1", "arg2"]`

**Steps**:
1. 컴포넌트 렌더링: `<StringList value={["arg1", "arg2"]} onChange={mockFn} />`
2. "Add" 버튼 클릭
3. 새 입력 필드에 "--port=3000" 입력
4. Enter 키 또는 포커스 이동

**Expected Result**:
- 새 항목이 목록 끝에 추가됨
- `onChange(["arg1", "arg2", "--port=3000"])` 호출됨
- 입력 필드 초기화 또는 새 빈 행 추가

**Priority**: High

---

### T1-E-002: Edit existing string item

**Test Case ID**: TC-MCP-C-SL002

**Description**: 기존 문자열 항목을 수정하는 기능 검증

**Preconditions**:
- 초기값: `["--watch", "--verbose"]`

**Steps**:
1. 컴포넌트 렌더링 with 초기값
2. "--watch" 항목 더블클릭하여 편집 모드 진입
3. "--no-watch"로 변경
4. Enter 키로 저장

**Expected Result**:
- `onChange(["--no-watch", "--verbose"])` 호출됨
- UI에 변경된 값 표시
- 편집 모드 종료

**Priority**: High

---

### T1-E-003: Delete string item

**Test Case ID**: TC-MCP-C-SL003

**Description**: 문자열 항목을 삭제하는 기능 검증

**Preconditions**:
- 초기값: `["item1", "item2", "item3"]`

**Steps**:
1. 컴포넌트 렌더링 with 초기값
2. "item2" 행의 삭제 버튼 클릭
3. 결과 확인

**Expected Result**:
- `onChange(["item1", "item3"])` 호출됨
- "item2"가 UI에서 제거됨
- 인덱스가 재정렬됨

**Priority**: High

---

### T1-E-004: Drag and drop reorder

**Test Case ID**: TC-MCP-C-SL004

**Description**: 드래그 앤 드롭으로 항목 순서를 변경하는 기능 검증

**Preconditions**:
- 초기값: `["first", "second", "third"]`
- 드래그 앤 드롭 라이브러리 사용 (예: dnd-kit)

**Steps**:
1. 컴포넌트 렌더링 with 초기값
2. "first" 항목의 드래그 핸들 클릭 및 홀드
3. "third" 위치로 드래그
4. 드롭

**Expected Result**:
- `onChange(["second", "third", "first"])` 호출됨
- UI에서 순서 변경 반영
- 드래그 중 시각적 피드백 (예: 드롭 위치 표시)

**Priority**: Medium

---

### T1-E-005: Render empty state with placeholder

**Test Case ID**: TC-MCP-C-SL005

**Description**: 빈 배열일 때 placeholder UI 렌더링 검증

**Preconditions**:
- 초기값: `[]`
- `placeholder` prop 전달됨

**Steps**:
1. 컴포넌트 렌더링: `<StringList value={[]} placeholder="인자 추가" />`
2. UI 상태 확인

**Expected Result**:
- "인자 추가" placeholder 텍스트 표시
- "Add" 버튼 또는 "+ 추가" 링크 표시
- 에러 없이 렌더링

**Priority**: Medium

---

## References

- Source: `src/features/mcp/components/StringList.tsx`
- Review: [REVIEW.md 섹션 3.3](../REVIEW.md#33-mcp-분석)
- Parent: [TASKS.md Task 1.3.2](../TASKS.md#132-stringlist-컴포넌트-테스트-5개)

---

*Last Updated: 2025-12-23*
