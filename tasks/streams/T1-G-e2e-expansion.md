# T1-G: MCP E2E 테스트 시나리오 확장

## Overview

| 항목 | 값 |
|------|-----|
| Stream ID | T1-G |
| Parent Task | T1 (MCP 시나리오 확장) |
| Priority | High |
| 총 항목 수 | 7 |
| 예상 라인 수 | ~250줄 |
| 의존성 | 부분적 (T1-A, T1-B, T1-D) |
| 병렬 실행 | ⚠️ 일부 가능 |

---

## Progress

```
[██████████] 100% (7/7)
```

| State | Count |
|-------|-------|
| ✅ DONE | 7 |
| 🔵 IN_PROGRESS | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |

---

## Tasks

| ID | Title | State | Depends | Assignee | Notes |
|----|-------|-------|---------|----------|-------|
| T1-G-001 | Import workflow - Claude Desktop | ✅ DONE | [T1-A-001] | - | TC-MCP-E013 (구 E-IM001) 추가 완료 |
| T1-G-002 | Import workflow - Cursor | ✅ DONE | [T1-A-002] | - | TC-MCP-E014 (구 E-IM002) 추가 완료 |
| T1-G-003 | Import workflow - Large config | ✅ DONE | [T1-B-002] | - | TC-MCP-E027 (구 E-IM003) 추가 완료 |
| T1-G-004 | Environment variable UI | ✅ DONE | [T1-D-*] | - | TC-MCP-E029 (구 E-ENV001) 추가 완료 |
| T1-G-005 | Sensitive data masking | ✅ DONE | [] | - | TC-MCP-E030 (구 E-SEC001) 추가 완료 |
| T1-G-006 | MCP Set + Sync integration | ✅ DONE | [] | - | TC-MCP-E031 (구 E-INT001) 추가 완료 |
| T1-G-007 | Partial import (selective) | ✅ DONE | [] | - | TC-MCP-E028 (구 E-IM004) 추가 완료 |

---

## Task Details

### T1-G-001: Import workflow - Claude Desktop

**Test Case ID**: TC-MCP-E013

**Description**: Claude Desktop 형식의 config 파일을 import하는 전체 워크플로우 E2E 테스트

**Preconditions**:
- Octopus 앱 실행됨
- MCP 메뉴로 이동됨
- 테스트용 Claude Desktop config 파일 준비

**Steps**:
1. MCP 서버 목록 페이지에서 "Import" 버튼 클릭
2. 파일 선택 다이얼로그에서 config 파일 선택
3. "Claude Desktop" 형식 자동 감지 확인
4. 미리보기에서 import할 서버 목록 확인
5. "Import All" 버튼 클릭
6. 성공 토스트 메시지 확인
7. 서버 목록에 import된 서버 표시 확인

**Expected Result**:
- 파일 선택 후 3초 이내 파싱 완료
- 미리보기에 서버 이름, command, args 표시
- Import 후 서버 목록 자동 갱신
- 각 서버의 상태가 "Active"로 표시

**Priority**: High

---

### T1-G-002: Import workflow - Cursor

**Test Case ID**: TC-MCP-E014

**Description**: Cursor 형식의 config 파일 import E2E 테스트

**Preconditions**:
- Cursor 형식 config 파일 준비 (`settings.mcp` 경로)

**Steps**:
1. Import 버튼 클릭
2. Cursor config 파일 선택
3. 형식 감지 확인 (Cursor)
4. 미리보기 확인
5. Import 실행
6. 결과 확인

**Expected Result**:
- 중첩된 `settings.mcp` 경로에서 서버 추출
- Claude Desktop과 동일한 UX로 import 완료

**Priority**: High

---

### T1-G-003: Import workflow - Large config

**Test Case ID**: TC-MCP-E027

**Description**: 50개 이상의 서버가 포함된 대용량 config 파일 import 성능 및 안정성 테스트

**Preconditions**:
- 50개 이상의 mcpServers가 포함된 config 파일

**Steps**:
1. 대용량 config 파일 선택
2. 파싱 진행률 표시 확인
3. 미리보기 가상 스크롤 동작 확인
4. 전체 import 실행
5. 완료 시간 측정

**Expected Result**:
- 파싱 시 진행률 표시 (또는 스피너)
- 미리보기 목록 스크롤 가능
- Import 완료 시간 < 30초
- 메모리 사용량 급증 없음

**Priority**: Medium

---

### T1-G-004: Environment variable UI

**Test Case ID**: TC-MCP-E029

**Description**: MCP 서버 환경변수 편집 UI의 E2E 테스트

**Preconditions**:
- 최소 1개의 MCP 서버 존재
- 해당 서버에 env 필드 있음

**Steps**:
1. MCP 서버 목록에서 서버 선택
2. 편집 모드 진입
3. Environment Variables 섹션 확인
4. 새 환경변수 추가: `NEW_VAR=value`
5. 기존 환경변수 수정
6. 저장 버튼 클릭
7. 서버 재조회하여 변경 확인

**Expected Result**:
- KeyValueList 컴포넌트 정상 렌더링
- 추가/수정/삭제 모두 동작
- 저장 후 DB에 반영됨
- 재조회 시 변경사항 유지

**Priority**: High

---

### T1-G-005: Sensitive data masking

**Test Case ID**: TC-MCP-E030

**Description**: API 키, 시크릿 등 민감 정보 마스킹 동작 검증

**Preconditions**:
- 서버에 `API_KEY`, `SECRET`, `PASSWORD` 등의 환경변수 존재

**Steps**:
1. MCP 서버 편집 화면 진입
2. Environment Variables 섹션 확인
3. 민감 키의 값 표시 확인
4. "Show" 버튼 클릭
5. 값 표시 확인
6. "Hide" 버튼 클릭

**Expected Result**:
- `API_KEY`, `SECRET`, `PASSWORD`, `TOKEN` 등은 기본적으로 `••••••••`로 마스킹
- Show 버튼 클릭 시 실제 값 표시
- Hide 버튼 클릭 시 다시 마스킹
- 저장 시 원본 값 유지

**Priority**: Medium

---

### T1-G-006: MCP Set + Sync integration

**Test Case ID**: TC-MCP-E031

**Description**: MCP Set 생성부터 Tool 설정, Sync까지 전체 통합 플로우 테스트

**Preconditions**:
- 최소 2개의 MCP 서버 존재
- 최소 1개의 Tool 설정 존재

**Steps**:
1. MCP Sets 메뉴로 이동
2. 새 Set 생성: "Development Set"
3. Set에 서버 2개 추가
4. Tools 메뉴로 이동
5. Tool에 생성한 Set 연결
6. Sync 메뉴로 이동
7. Sync 실행
8. 동기화 결과 확인

**Expected Result**:
- Set에 서버 추가 성공
- Tool에 Set 연결 성공
- Sync 실행 시 Set 내 서버들이 Tool config에 반영
- 동기화 히스토리에 기록됨

**Priority**: High

---

### T1-G-007: Partial import (selective)

**Test Case ID**: TC-MCP-E028

**Description**: 사용자가 선택한 서버만 import하는 기능 E2E 테스트

**Preconditions**:
- 10개 서버가 포함된 config 파일

**Steps**:
1. Import 다이얼로그 열기
2. Config 파일 선택
3. 미리보기에서 3개 서버만 체크박스 선택
4. "Import Selected" 버튼 클릭
5. 결과 확인

**Expected Result**:
- 체크박스로 개별 선택 가능
- "Select All" / "Deselect All" 버튼 존재
- 선택한 3개 서버만 import됨
- 미선택 7개는 import되지 않음
- 결과 메시지: "3개 서버 import 완료, 7개 건너뜀"

**Priority**: Medium

## Dependency Graph

```
T1-A-001 (Parse Claude Desktop) ──► T1-G-001 (Import Claude Desktop E2E)
T1-A-002 (Parse Cursor) ──────────► T1-G-002 (Import Cursor E2E)
T1-B-002 (Import multiple) ───────► T1-G-003 (Large config E2E)
T1-D-* (KeyValueList tests) ──────► T1-G-004 (Env UI E2E)

(독립)
├── T1-G-005 (Sensitive masking)
├── T1-G-006 (Set + Sync integration)
└── T1-G-007 (Partial import)
```

---

## References

- Source: `scenarios/mcp/e2e-tests.md`
- Review: [REVIEW.md 섹션 3.3](../REVIEW.md#33-mcp-분석)
- Parent: [TASKS.md Task 1.4](../TASKS.md#14-e2e-tests-확장)

---

*Last Updated: 2025-12-23*