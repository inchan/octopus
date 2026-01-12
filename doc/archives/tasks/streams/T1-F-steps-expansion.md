# T1-F: MCP 시나리오 Steps/Expected Result 확장

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-F |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | Critical |
| 총 항목 수 | 4 (그룹) / 42개 (개별 시나리오) |
| 예상 라인 수 | ~600줄 |
| 의존성 | **[T2-C]** (ID 형식 통일 완료 후) |
| 병렬 실행 | 🚫 의존성 있음 |

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
| T1-F-001 | Repository 시나리오 확장 (R001~R007) | ✅ DONE | [T2-C-005] | Claude | 7개 시나리오 확장 완료 |
| T1-F-002 | Service 시나리오 확장 (S001~S006, S021~S023) | ✅ DONE | [T2-C-005] | Claude | 9개 시나리오 확장 완료 |
| T1-F-003 | Handler 시나리오 확장 (H001~H005) | ✅ DONE | [T2-C-005] | Claude | 5개 시나리오 확장 완료 |
| T1-F-004 | Hook 시나리오 확장 (K001~K008) | ✅ DONE | [T2-C-005] | Claude | 8개 시나리오 확장 완료 |

---

## Problem Statement

### 현재 MCP 시나리오 문제점

```markdown
### TC-MCP-R001: Create MCP Server
- **Steps**:
  1. Call `repository.create({ ... })`   ← 단일 라인!
- **Expected Result**:
  - Server created with UUID             ← 일반적 서술
```

### 개선 목표

```markdown
### TC-MCP-R001: Create MCP Server
- **Steps**:
  1. Call `repository.create(testData)`
  2. Verify returned object contains valid UUID (v4 format)
  3. Verify `isActive` defaults to `true`
  4. Verify `createdAt` is within last 5 seconds
  5. Query database directly to confirm persistence
- **Expected Result**:
  - Returns McpServer object with UUID matching /^[0-9a-f]{8}-...-[0-9a-f]{12}$/
  - `isActive === true`
  - `env` contains expected key-value pairs
```

---

## Task Details

### T1-F-001: Repository 시나리오 확장

**Target File**: `scenarios/mcp/unit-tests.md` (Repository 섹션)

**Implemented Scenarios**:

| ID | 제목 | 상태 |
|----|------|------|
| TC-MCP-R001 | Create MCP Server | ✅ DONE |
| TC-MCP-R002 | Get MCP Server by ID | ✅ DONE |
| TC-MCP-R003 | Handle args as JSON array | ✅ DONE |
| TC-MCP-R004 | Handle env as JSON object | ✅ DONE |
| TC-MCP-R005 | List MCP Servers | ✅ DONE |
| TC-MCP-R006 | Update MCP Server | ✅ DONE |
| TC-MCP-R007 | Delete MCP Server | ✅ DONE |

---

### T1-F-002: Service 시나리오 확장

**Target File**: `scenarios/mcp/unit-tests.md` (Service 섹션)

**Implemented Scenarios**:

| ID | 제목 | 상태 |
|----|------|------|
| TC-MCP-S001 | Create server with history logging | ✅ DONE |
| TC-MCP-S002 | Update server with history | ✅ DONE |
| TC-MCP-S003 | Delete server with history | ✅ DONE |
| TC-MCP-S004 | Validate server config | ✅ DONE |
| TC-MCP-S005 | Bulk operations | ✅ DONE |
| TC-MCP-S006 | Error handling | ✅ DONE |
| TC-MCP-S021 | Create MCP Set | ✅ DONE |
| TC-MCP-S022 | Update MCP Set items | ✅ DONE |
| TC-MCP-S023 | Update non-existent set throws error | ✅ DONE |

---

### T1-F-003: Handler 시나리오 확장

**Target File**: `scenarios/mcp/unit-tests.md` (Handler 섹션)

**Implemented Scenarios**:

| ID | 제목 | 상태 |
|----|------|------|
| TC-MCP-H001 | List servers via IPC | ✅ DONE |
| TC-MCP-H002 | Create server with validation | ✅ DONE |
| TC-MCP-H003 | Validation error handling | ✅ DONE |
| TC-MCP-H004 | Update server handler | ✅ DONE |
| TC-MCP-H005 | Delete server handler | ✅ DONE |

---

### T1-F-004: Hook 시나리오 확장

**Target File**: `scenarios/mcp/unit-tests.md` (Hook 섹션)

**Implemented Scenarios**:

| ID | 제목 | 상태 |
|----|------|------|
| TC-MCP-K001 | Fetch servers on mount | ✅ DONE |
| TC-MCP-K002 | Create server mutation invalidates cache | ✅ DONE |
| TC-MCP-K003 | Update server mutation | ✅ DONE |
| TC-MCP-K004 | Error state handling | ✅ DONE |
| TC-MCP-K005 | useMcpServerStatus | ✅ DONE |
| TC-MCP-K006 | Manual cache invalidation | ✅ DONE |
| TC-MCP-K007 | Optimistic update | ✅ DONE |
| TC-MCP-K008 | Loading state details | ✅ DONE |

---

## Blocking Dependencies

```
T2-C-005 (mcp/*.md ID 형식 적용)
    │
    └──► T1-F-001, T1-F-002, T1-F-003, T1-F-004
         (ID 형식 통일 및 시나리오 확장 완료)
```

---

## References

- Source: `scenarios/mcp/unit-tests.md`
- Review: [REVIEW.md 섹션 6.1](../REVIEW.md#61-즉시-조치-1일-내)
- Parent: [TASKS.md Task 1.2](../TASKS.md#12-steps-및-expected-result-확장-c2)

---

*Last Updated: 2025-12-23*