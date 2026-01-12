# T1-A: config-parser.ts 테스트 시나리오

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-A |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | Critical |
| 총 항목 수 | 8 |
| 예상 라인 수 | ~200줄 |
| 의존성 | 없음 |
| 병렬 실행 | ✅ 가능 |

---

## Progress

```
[██████████] 100% (8/8)
```

| State | Count |
|-------|-------|
| ✅ DONE | 8 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T1-A-001 | TC-MCP-U-CP001: Parse Claude Desktop config (valid) | ✅ DONE | [] | - | Claude Desktop JSON 형식 정상 파싱 |
| T1-A-002 | TC-MCP-U-CP002: Parse Cursor config (valid) | ✅ DONE | [] | - | Cursor JSON 형식 정상 파싱 |
| T1-A-003 | TC-MCP-U-CP003: Parse config with environment variables | ✅ DONE | [] | - | `${HOME}`, `${USER}` 등 환경변수 치환 |
| T1-A-004 | TC-MCP-U-CP004: Parse config with empty mcpServers | ✅ DONE | [] | - | 빈 mcpServers 객체 처리 |
| T1-A-005 | TC-MCP-U-CP005: Parse invalid JSON format | ✅ DONE | [] | - | 잘못된 JSON 문법 에러 핸들링 |
| T1-A-006 | TC-MCP-U-CP006: Parse config with missing required fields | ✅ DONE | [] | - | command 필드 누락 시 에러 |
| T1-A-007 | TC-MCP-U-CP007: Parse config with nested env objects | ✅ DONE | [] | - | 중첩된 환경변수 객체 평탄화 |
| T1-A-008 | TC-MCP-U-CP008: Parse config with special characters | ✅ DONE | [] | - | 경로에 공백, 특수문자 포함 시 처리 |

---

## Task Details

### T1-A-001: Parse Claude Desktop config (valid)

**Test Case ID**: TC-MCP-U-CP001

**Description**: Claude Desktop JSON 형식의 MCP 설정 파일을 정상적으로 파싱하는지 검증

**Preconditions**:
- 유효한 Claude Desktop 형식의 JSON 파일 준비
- `mcpServers` 객체에 최소 1개의 서버 설정 포함

**Steps**:
1. Claude Desktop 형식의 JSON 문자열 준비
2. `parseConfig(jsonString, 'claude-desktop')` 호출
3. 반환된 서버 목록 검증
4. 각 서버의 필수 필드 존재 확인
5. 필드 값의 타입 검증

**Expected Result**:
- 서버 배열 반환 (length >= 1)
- 각 서버에 `name`, `command`, `args`, `env` 필드 존재
- `args`는 string 배열
- `env`는 key-value 객체

**Priority**: High

---

### T1-A-002: Parse Cursor config (valid)

**Test Case ID**: TC-MCP-U-CP002

**Description**: Cursor JSON 형식의 MCP 설정 파일을 정상적으로 파싱하는지 검증

**Preconditions**:
- 유효한 Cursor 형식의 JSON 파일 준비
- `settings.mcp` 경로에 서버 설정 포함

**Steps**:
1. Cursor 형식의 JSON 문자열 준비
2. `parseConfig(jsonString, 'cursor')` 호출
3. 중첩된 경로에서 서버 목록 추출 확인
4. 반환된 서버 목록 검증

**Expected Result**:
- `settings.mcp` 경로에서 서버 추출
- Claude Desktop과 동일한 출력 형식으로 정규화

**Priority**: High

---

### T1-A-003: Parse config with environment variables

**Test Case ID**: TC-MCP-U-CP003

**Description**: 환경변수가 포함된 설정 파일의 치환 로직 검증

**Preconditions**:
- `${HOME}`, `${USER}` 등 환경변수가 포함된 JSON 준비
- 현재 환경에 해당 환경변수 설정됨

**Steps**:
1. 환경변수가 포함된 JSON 준비: `"command": "${HOME}/bin/server"`
2. `parseConfig()` 호출
3. 반환된 `command` 값에서 환경변수 치환 확인
4. 존재하지 않는 환경변수 처리 확인

**Expected Result**:
- `${HOME}`이 실제 홈 디렉토리로 치환
- 존재하지 않는 변수는 원본 유지 또는 빈 문자열

**Priority**: Medium

---

### T1-A-004: Parse config with empty mcpServers

**Test Case ID**: TC-MCP-U-CP004

**Description**: 빈 mcpServers 객체 처리 검증

**Preconditions**:
- `mcpServers: {}` 형태의 JSON 준비

**Steps**:
1. 빈 mcpServers가 포함된 JSON 준비
2. `parseConfig()` 호출
3. 반환값 확인

**Expected Result**:
- 빈 배열 `[]` 반환
- 에러 발생하지 않음

**Priority**: Medium

---

### T1-A-005: Parse invalid JSON format

**Test Case ID**: TC-MCP-U-CP005

**Description**: 잘못된 JSON 형식 에러 핸들링 검증

**Preconditions**:
- 문법 오류가 있는 JSON 문자열 준비

**Steps**:
1. 잘못된 JSON 문자열 준비: `{ "mcpServers": }`
2. `parseConfig()` 호출
3. 에러 발생 확인
4. 에러 메시지 형식 검증

**Expected Result**:
- `ConfigParseError` 또는 유사한 에러 throw
- 에러 메시지에 "JSON" 또는 "parse" 키워드 포함
- 에러 위치 정보 포함 권장

**Priority**: High

---

### T1-A-006: Parse config with missing required fields

**Test Case ID**: TC-MCP-U-CP006

**Description**: 필수 필드 누락 시 에러 핸들링 검증

**Preconditions**:
- `command` 필드가 누락된 서버 설정 준비

**Steps**:
1. command 누락된 JSON 준비: `{ "server1": { "args": [] } }`
2. `parseConfig()` 호출
3. 에러 발생 확인
4. name 필드 자동 생성 로직 확인 (key 이름 사용)

**Expected Result**:
- `command` 누락 시 `ValidationError` throw
- `name` 필드 누락 시 객체 key를 name으로 자동 설정

**Priority**: High

---

### T1-A-007: Parse config with nested env objects

**Test Case ID**: TC-MCP-U-CP007

**Description**: 중첩된 환경변수 객체 평탄화 검증

**Preconditions**:
- 중첩된 env 객체가 포함된 JSON 준비

**Steps**:
1. 중첩된 env 준비: `{ "env": { "nested": { "KEY": "value" } } }`
2. `parseConfig()` 호출
3. env 객체 평탄화 확인

**Expected Result**:
- 중첩 객체가 `NESTED_KEY=value` 형태로 평탄화
- 또는 에러와 함께 평탄 구조 요구

**Priority**: Low

---

### T1-A-008: Parse config with special characters

**Test Case ID**: TC-MCP-U-CP008

**Description**: 특수문자가 포함된 경로 처리 검증

**Preconditions**:
- 공백, 한글, 특수문자가 포함된 경로

**Steps**:
1. 특수 경로 JSON 준비: `"command": "/path/with spaces/한글/server.js"`
2. `parseConfig()` 호출
3. 경로가 변형 없이 보존되는지 확인

**Expected Result**:
- 특수문자 포함 경로가 원본 그대로 보존
- 이스케이프 처리 불필요

**Priority**: Medium

---

## References

- Source: `src/features/mcp/utils/config-parser.ts`
- Review: [REVIEW.md 섹션 3.3](../REVIEW.md#33-mcp-분석)
- Parent: [TASKS.md Task 1.1.1](../TASKS.md#111-config-parserts-테스트-시나리오-8개-추가-필요)

---

## Completion Summary

모든 8개의 테스트 시나리오가 `/Users/chans/workspace/pilot/octopus/tests/scenarios/mcp/unit-tests.md`에 성공적으로 추가되었습니다.

- 추가된 시나리오: TC-MCP-U-CP001 ~ TC-MCP-U-CP008
- 총 시나리오 수: 26개 (기존 20개 - 중복 2개 + 신규 8개)
- Utility 레이어 커버리지: 2개 → 8개로 증가

---

*Last Updated: 2025-12-23*
