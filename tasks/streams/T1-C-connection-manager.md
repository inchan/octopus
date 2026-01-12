# T1-C: McpConnectionManager 테스트 시나리오

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-C |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | Critical |
| 총 항목 수 | 4 |
| 예상 라인 수 | ~100줄 |
| 의존성 | 없음 |
| 병렬 실행 | ✅ 가능 |

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
| T1-C-001 | TC-MCP-S-CM001: Connect to MCP server | ✅ DONE | [] | Claude | 정상 연결 수립 |
| T1-C-002 | TC-MCP-S-CM002: Disconnect from MCP server | ✅ DONE | [] | Claude | 정상 연결 해제 |
| T1-C-003 | TC-MCP-S-CM003: Handle connection failure | ✅ DONE | [] | Claude | 연결 실패 처리 |
| T1-C-004 | TC-MCP-S-CM004: Manage multiple connections | ✅ DONE | [] | Claude | 다중 연결 관리 |

---

## Task Details

### T1-C-001: Connect to MCP server

**Test Case ID**: TC-MCP-S-CM001

**Description**: MCP 서버에 정상적으로 연결을 수립하는 기능 검증

**Preconditions**:
- 유효한 MCP 서버 설정 존재
- 서버 프로세스가 실행 가능한 상태

**Steps**:
1. 서버 설정 준비: `{ command: "node", args: ["server.js"] }`
2. `connectionManager.connect(serverId)` 호출
3. 연결 상태 확인
4. 타임아웃 설정 검증 (기본 30초)
5. 연결 성공 이벤트 발생 확인

**Expected Result**:
- 연결 상태가 `connected`로 변경
- `onConnect` 콜백 호출됨
- 연결 객체가 반환됨

**Priority**: High

---

### T1-C-002: Disconnect from MCP server

**Test Case ID**: TC-MCP-S-CM002

**Description**: MCP 서버 연결을 정상적으로 해제하는 기능 검증

**Preconditions**:
- 서버와 연결이 수립된 상태

**Steps**:
1. 연결된 서버 확인
2. `connectionManager.disconnect(serverId)` 호출
3. 연결 상태 확인
4. 프로세스 종료 확인
5. 리소스 정리 확인 (파일 핸들, 소켓 등)

**Expected Result**:
- 연결 상태가 `disconnected`로 변경
- 서버 프로세스가 graceful하게 종료됨
- 메모리 누수 없음

**Priority**: High

---

### T1-C-003: Handle connection failure

**Test Case ID**: TC-MCP-S-CM003

**Description**: 연결 실패 시 에러 핸들링 및 재시도 로직 검증

**Preconditions**:
- 존재하지 않는 command 설정
- 또는 네트워크 오류 시뮬레이션

**Steps**:
1. 잘못된 서버 설정 준비: `{ command: "nonexistent" }`
2. `connectionManager.connect(serverId)` 호출
3. 에러 발생 확인
4. 재시도 로직 동작 확인 (최대 3회)
5. 최종 실패 시 상태 확인

**Expected Result**:
- `ConnectionError` throw
- 연결 상태가 `failed`로 변경
- 재시도 횟수만큼 시도 후 포기
- 에러 메시지에 실패 원인 포함

**Priority**: High

---

### T1-C-004: Manage multiple connections

**Test Case ID**: TC-MCP-S-CM004

**Description**: 다중 MCP 서버 동시 연결 관리 기능 검증

**Preconditions**:
- 3개 이상의 MCP 서버 설정 존재
- 각 서버가 독립적으로 실행 가능

**Steps**:
1. 3개 서버 설정 준비
2. 순차적으로 `connect()` 호출
3. 모든 연결 상태 확인
4. 특정 서버만 disconnect
5. 나머지 서버 연결 유지 확인
6. 전체 disconnect 테스트

**Expected Result**:
- 각 서버가 독립적으로 관리됨
- 하나의 연결 실패가 다른 연결에 영향 없음
- `getConnections()`로 전체 연결 목록 조회 가능
- 연결 풀 최대 개수 제한 동작

**Priority**: Medium

---

## References

- Source: `electron/services/McpConnectionManager.ts` (예상)
- Review: [REVIEW.md 섹션 3.3](../REVIEW.md#33-mcp-분석) - "McpConnectionManager 미커버 ❌"
- Parent: [TASKS.md Task 1.1.3](../TASKS.md#113-mcpconnectionmanager-테스트-시나리오-4개-추가-필요)

---

*Last Updated: 2025-12-23 09:57 KST*

## Implementation Notes

테스트 파일: `electron/services/sync/McpConnectionManager.test.ts`

### 구현 결과
- 15개 테스트 케이스 작성 완료
- MCP SDK (`@modelcontextprotocol/sdk`) 모킹 패턴 적용
- 4개 시나리오 모두 통과
