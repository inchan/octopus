# T1-B: mcp-import.ts 테스트 시나리오

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-B |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | Critical |
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
| T1-B-001 | TC-MCP-U-IM001: Import single server | ✅ DONE | [] | Claude | 3 tests |
| T1-B-002 | TC-MCP-U-IM002: Import multiple servers | ✅ DONE | [] | Claude | 3 tests |
| T1-B-003 | TC-MCP-U-IM003: Import with duplicate name handling | ✅ DONE | [] | Claude | 4 tests |
| T1-B-004 | TC-MCP-U-IM004: Import with validation errors | ✅ DONE | [] | Claude | 5 tests |
| T1-B-005 | TC-MCP-U-IM005: Import partial (selective import) | ✅ DONE | [] | Claude | 5 tests |

---

## Task Details

### T1-B-001: Import single server

**Test Case ID**: TC-MCP-U-IM001

**Description**: 단일 MCP 서버를 config 파일에서 import하는 기능 검증

**Preconditions**:
- 파싱된 서버 목록에 1개의 서버 존재
- 데이터베이스에 동일 이름의 서버 없음

**Steps**:
1. 단일 서버 데이터 준비
2. `importServers([serverData])` 호출
3. 반환된 결과 확인
4. 데이터베이스에 서버 저장 확인
5. 저장된 서버의 필드 값 검증

**Expected Result**:
- 성공 결과 반환: `{ success: 1, failed: 0 }`
- 서버가 DB에 저장됨
- `isActive`가 기본값 `true`로 설정

**Priority**: High

---

### T1-B-002: Import multiple servers

**Test Case ID**: TC-MCP-U-IM002

**Description**: 다중 MCP 서버를 한 번에 import하는 기능 검증

**Preconditions**:
- 파싱된 서버 목록에 5개 이상의 서버 존재
- 트랜잭션 지원 확인

**Steps**:
1. 5개 서버 데이터 준비
2. `importServers(serverList)` 호출
3. 모든 서버 저장 확인
4. 트랜잭션 롤백 시나리오 테스트 (3번째 서버 실패 시)

**Expected Result**:
- 성공 시: `{ success: 5, failed: 0 }`
- 모든 서버가 원자적으로 저장됨
- 실패 시 전체 롤백 또는 부분 성공 정책에 따름

**Priority**: High

---

### T1-B-003: Import with duplicate name handling

**Test Case ID**: TC-MCP-U-IM003

**Description**: 이미 존재하는 이름의 서버 import 시 처리 검증

**Preconditions**:
- 데이터베이스에 "existing-server" 이름의 서버 존재
- import 목록에 동일 이름의 서버 포함

**Steps**:
1. 기존 서버 생성: `{ name: "existing-server", ... }`
2. 동일 이름으로 import 시도
3. 처리 옵션 확인: skip, overwrite, rename
4. 각 옵션별 결과 검증

**Expected Result**:
- `skip`: 기존 서버 유지, import 건너뜀
- `overwrite`: 기존 서버 업데이트
- `rename`: "existing-server-1" 등으로 자동 이름 변경
- 결과에 중복 처리 정보 포함

**Priority**: High

---

### T1-B-004: Import with validation errors

**Test Case ID**: TC-MCP-U-IM004

**Description**: 유효성 검사 실패 시 에러 처리 검증

**Preconditions**:
- 잘못된 형식의 서버 데이터 준비 (빈 command, 잘못된 args 타입 등)

**Steps**:
1. 유효하지 않은 서버 데이터 준비
2. `importServers()` 호출
3. 에러 응답 확인
4. 부분 성공/실패 시나리오 테스트

**Expected Result**:
- 유효성 에러 상세 정보 반환
- `{ success: 3, failed: 2, errors: [...] }` 형식
- 각 에러에 서버 이름과 실패 이유 포함

**Priority**: Medium

---

### T1-B-005: Import partial (selective import)

**Test Case ID**: TC-MCP-U-IM005

**Description**: 사용자가 선택한 서버만 import하는 기능 검증

**Preconditions**:
- 10개의 서버가 파싱됨
- 사용자가 3개만 선택

**Steps**:
1. 10개 서버 파싱
2. 선택 목록 생성: `selectedIds: ["server1", "server5", "server8"]`
3. `importServers(servers, { selectedIds })` 호출
4. 선택된 3개만 저장 확인

**Expected Result**:
- 선택된 3개 서버만 import됨
- 미선택 7개는 무시됨
- `{ success: 3, skipped: 7 }` 형식 반환

**Priority**: Medium

---

## References

- Source: `src/features/mcp/utils/mcp-import.ts`
- Review: [REVIEW.md 섹션 3.3](../REVIEW.md#33-mcp-분석)
- Parent: [TASKS.md Task 1.1.2](../TASKS.md#112-mcp-importts-테스트-시나리오-5개-추가-필요)

---

*Last Updated: 2025-12-23 (Completed)*
