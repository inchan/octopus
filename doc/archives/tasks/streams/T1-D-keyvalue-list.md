# T1-D: KeyValueList 컴포넌트 테스트 시나리오

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-D |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | High |
| 총 항목 수 | 6 |
| 예상 라인 수 | ~150줄 |
| 의존성 | 없음 |
| 병렬 실행 | ✅ 가능 |

---

## Progress

```
[██████████] 100% (6/6)
```

| State | Count |
|-------|-------|
| ✅ DONE | 6 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T1-D-001 | TC-MCP-U-KV001: Add new key-value pair | ✅ DONE | [] | - | 새 항목 추가 |
| T1-D-002 | TC-MCP-U-KV002: Edit existing key-value pair | ✅ DONE | [] | - | 기존 항목 수정 |
| T1-D-003 | TC-MCP-U-KV003: Delete key-value pair | ✅ DONE | [] | - | 항목 삭제 |
| T1-D-004 | TC-MCP-U-KV004: Render empty state | ✅ DONE | [] | - | 빈 상태 렌더링 |
| T1-D-005 | TC-MCP-U-KV005: Handle duplicate key validation | ✅ DONE | [] | - | 중복 키 유효성 검사 |
| T1-D-006 | TC-MCP-U-KV006: Keyboard navigation | ✅ DONE | [] | - | 키보드 네비게이션 |

---

## Task Details

### T1-D-001: Add new key-value pair

**Test Case ID**: TC-MCP-U-KV001

**Description**: KeyValueList 컴포넌트에서 새로운 key-value 쌍을 추가하는 기능 검증

**Preconditions**:
- KeyValueList 컴포넌트 렌더링됨
- `onChange` 콜백 prop 전달됨

**Steps**:
1. 컴포넌트 렌더링: `<KeyValueList value={{}} onChange={mockFn} />`
2. "Add" 버튼 클릭
3. Key 입력 필드에 "API_KEY" 입력
4. Value 입력 필드에 "secret123" 입력
5. 포커스 이동 또는 Enter 키

**Expected Result**:
- 새 입력 행이 추가됨
- `onChange({ API_KEY: "secret123" })` 호출됨
- 입력 필드가 초기화됨

**Priority**: High

---

### T1-D-002: Edit existing key-value pair

**Test Case ID**: TC-MCP-U-KV002

**Description**: 기존 key-value 쌍을 수정하는 기능 검증

**Preconditions**:
- 초기값: `{ NODE_ENV: "development" }`

**Steps**:
1. 컴포넌트 렌더링 with 초기값
2. "development" 값 클릭하여 편집 모드 진입
3. "production"으로 변경
4. 포커스 아웃

**Expected Result**:
- `onChange({ NODE_ENV: "production" })` 호출됨
- UI에 변경된 값 표시

**Priority**: High

---

### T1-D-003: Delete key-value pair

**Test Case ID**: TC-MCP-U-KV003

**Description**: key-value 쌍을 삭제하는 기능 검증

**Preconditions**:
- 초기값: `{ KEY1: "val1", KEY2: "val2" }`

**Steps**:
1. 컴포넌트 렌더링 with 초기값
2. KEY1 행의 삭제 버튼 클릭
3. 확인 다이얼로그 (있는 경우) 확인

**Expected Result**:
- `onChange({ KEY2: "val2" })` 호출됨 (KEY1 제거)
- UI에서 해당 행 제거됨

**Priority**: High

---

### T1-D-004: Render empty state

**Test Case ID**: TC-MCP-U-KV004

**Description**: 데이터가 없을 때 빈 상태 UI 렌더링 검증

**Preconditions**:
- 초기값: `{}` 또는 `undefined`

**Steps**:
1. 빈 값으로 컴포넌트 렌더링
2. UI 상태 확인

**Expected Result**:
- "환경변수가 없습니다" 또는 유사한 placeholder 표시
- "Add" 버튼 활성화됨
- 에러 없이 렌더링됨

**Priority**: Medium

---

### T1-D-005: Handle duplicate key validation

**Test Case ID**: TC-MCP-U-KV005

**Description**: 중복 키 입력 시 유효성 검사 동작 검증

**Preconditions**:
- 초기값: `{ EXISTING_KEY: "value" }`

**Steps**:
1. 컴포넌트 렌더링 with 초기값
2. 새 항목 추가 시도
3. Key에 "EXISTING_KEY" 입력
4. 저장 시도

**Expected Result**:
- 에러 메시지 표시: "이미 존재하는 키입니다"
- 저장 차단됨
- 기존 값 유지됨

**Priority**: High

---

### T1-D-006: Keyboard navigation

**Test Case ID**: TC-MCP-U-KV006

**Description**: 키보드만으로 컴포넌트 조작 가능 여부 검증

**Preconditions**:
- 여러 key-value 쌍이 존재하는 상태

**Steps**:
1. 컴포넌트에 포커스
2. Tab 키로 필드 간 이동
3. Enter 키로 편집 모드 진입
4. Escape 키로 편집 취소
5. Delete 키로 삭제 (선택된 행)

**Expected Result**:
- Tab: 다음 필드로 포커스 이동
- Shift+Tab: 이전 필드로 이동
- Enter: 편집 모드 진입/저장
- Escape: 편집 취소, 원래 값 복원

**Priority**: Medium

---

## References

- Source: `src/features/mcp/components/KeyValueList.tsx`
- Review: [REVIEW.md 섹션 3.3](../REVIEW.md#33-mcp-분석)
- Parent: [TASKS.md Task 1.3.1](../TASKS.md#131-keyvaluelist-컴포넌트-테스트-6개)

---

*Last Updated: 2025-12-23*
