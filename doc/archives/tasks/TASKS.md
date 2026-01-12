# Test Scenarios - Task List

## Overview
테스트 시나리오 작성 후 자기비판 리뷰(ToT + CoT)에서 발견된 개선 사항 및 후속 작업 목록입니다.

### 리뷰 요약 (2025-12-23)

| 지표 | 값 |
|------|-----|
| 전체 평균 점수 | 84.4/100 |
| 최고점 | Rules (93점) |
| 최저점 | **MCP (61점)** ← 집중 개선 필요 |

### 품질 점수 상세

| 메뉴 | 완성도 | 상세도 | 일관성 | 실행가능 | 정합성 | **총점** |
|------|--------|--------|--------|----------|--------|----------|
| Tools | 18 | 19 | 18 | 18 | 19 | **92/100** |
| Sync | 17 | 18 | 16 | 17 | 18 | **86/100** |
| Projects | 17 | 17 | 18 | 17 | 18 | **87/100** |
| Rules | 19 | 19 | 18 | 18 | 19 | **93/100** |
| **MCP** | 10 | 10 | 15 | 12 | 14 | **61/100** |
| History | 18 | 18 | 17 | 17 | 18 | **88/100** |
| Settings | 16 | 17 | 17 | 17 | 17 | **84/100** |

---

## 발견된 문제점 요약

### Critical (즉시 수정 필요)

| ID | 문제 | 영향도 | 해결책 | 상태 |
|----|------|--------|--------|------|
| C1 | MCP config-parser.ts 테스트 없음 | Import 기능 검증 불가 | 유틸리티 테스트 8개 추가 | 🔴 TODO |
| C2 | MCP Steps 단일 라인 | 테스트 실행 시 검증 부재 | Steps 3-5개로 확장 | 🔴 TODO |

### High (우선 수정)

| ID | 문제 | 영향도 | 해결책 | 상태 |
|----|------|--------|--------|------|
| H1 | Category 필드 일관성 없음 | 분류 체계 불일치 | Sync에서 제거 권장 | 🔴 TODO |
| H2 | ID 형식 불일치 | 추적성 저하 | 표준 형식 적용 | 🔴 TODO |
| H3 | KeyValueList, StringList 미커버 | UI 컴포넌트 검증 누락 | 컴포넌트 테스트 추가 | 🔴 TODO |

### Medium (개선 권장)

| ID | 문제 | 영향도 | 해결책 | 상태 |
|----|------|--------|--------|------|
| M1 | Overview 섹션 일부만 존재 | 가독성 차이 | 모든 파일에 추가 | 🔴 TODO |
| M2 | 접근성 테스트 불균형 | 일부 메뉴만 커버 | 공통 문서로 분리 | 🔴 TODO |
| M3 | 성능 테스트 불균형 | 일부 메뉴만 커버 | 공통 문서로 분리 | 🔴 TODO |

---

## Task 1: MCP 시나리오 확장 (Priority: Critical)

**문제점 ID**: C1, C2, H3
**출처**: [REVIEW.md 섹션 4 - Critical](./REVIEW.md#4-문제점-우선순위-priority-matrix), [섹션 6.1](./REVIEW.md#61-즉시-조치-1일-내)
**현재 상태**: 다른 메뉴 대비 1/3 수준 (455줄 vs 평균 1,200줄)
**목표**: MCP 점수 61점 → 85점 이상

### 1.0 품질 비교 분석

#### 현재 MCP 시나리오 문제점 (Poor Example)
```markdown
### TC-MCP-R001: Create MCP Server
- **Description**: Verify McpRepository can create a new MCP server
- **Preconditions**: Database initialized
- **Steps**:
  1. Call `repository.create({ name: 'Test Server', command: 'node', args: ['server.js'], env: {} })`
- **Expected Result**:
  - Server created with UUID
  - isActive defaults to true
- **Priority**: High
```

#### 개선 목표 (Good Example - Tools 참고)
```markdown
### TC-MCP-R001: Create MCP Server
- **Description**: Verify McpRepository can create a new MCP server with all required fields
- **Preconditions**:
  - Database initialized with empty mcp_servers table
  - Test data prepared: { name: 'Test Server', command: 'node', args: ['server.js'], env: { NODE_ENV: 'test' } }
- **Steps**:
  1. Call `repository.create(testData)`
  2. Verify returned object contains valid UUID (v4 format)
  3. Verify `isActive` defaults to `true`
  4. Verify `createdAt` is within last 5 seconds
  5. Query database directly to confirm persistence
- **Expected Result**:
  - Returns McpServer object with UUID matching /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
  - `isActive === true`
  - `env` contains { NODE_ENV: 'test' }
- **Priority**: High
```

### 1.1 누락된 유틸리티 테스트 (C1)

현재 코드 구조 대비 누락 분석:
```
src/features/mcp/utils/
├── config-parser.ts  → ❌ 테스트 0개 (필요: 8개)
└── mcp-import.ts     → ❌ 테스트 0개 (필요: 5개)
```

#### 1.1.1 config-parser.ts 테스트 시나리오 (8개 추가 필요)
- [ ] TC-MCP-U-CP001: Parse Claude Desktop config (valid)
  - Claude Desktop JSON 형식 정상 파싱
  - mcpServers 객체 추출 검증
- [ ] TC-MCP-U-CP002: Parse Cursor config (valid)
  - Cursor JSON 형식 정상 파싱
  - settings.mcp 경로 추출 검증
- [ ] TC-MCP-U-CP003: Parse config with environment variables
  - `${HOME}`, `${USER}` 등 환경변수 치환 로직
  - 치환 실패 시 원본 유지 검증
- [ ] TC-MCP-U-CP004: Parse config with empty mcpServers
  - 빈 mcpServers 객체 처리
  - 빈 배열 반환 검증
- [ ] TC-MCP-U-CP005: Parse invalid JSON format
  - 잘못된 JSON 문법 에러 핸들링
  - 적절한 에러 메시지 반환
- [ ] TC-MCP-U-CP006: Parse config with missing required fields
  - command 필드 누락 시 에러
  - name 필드 자동 생성 로직
- [ ] TC-MCP-U-CP007: Parse config with nested env objects
  - 중첩된 환경변수 객체 평탄화
- [ ] TC-MCP-U-CP008: Parse config with special characters in values
  - 경로에 공백, 특수문자 포함 시 처리

#### 1.1.2 mcp-import.ts 테스트 시나리오 (5개 추가 필요)
- [ ] TC-MCP-U-IM001: Import single server
- [ ] TC-MCP-U-IM002: Import multiple servers
- [ ] TC-MCP-U-IM003: Import with duplicate name handling
- [ ] TC-MCP-U-IM004: Import with validation errors
- [ ] TC-MCP-U-IM005: Import partial (selective import)

#### 1.1.3 McpConnectionManager 테스트 시나리오 (4개 추가 필요)

**출처**: REVIEW.md 섹션 3.3 - "McpConnectionManager 미커버 ❌"

- [ ] TC-MCP-S-CM001: Connect to MCP server
  - 정상적인 서버 연결 수립
  - 연결 상태 확인 및 타임아웃 처리
- [ ] TC-MCP-S-CM002: Disconnect from MCP server
  - 정상 연결 해제
  - 리소스 정리 검증
- [ ] TC-MCP-S-CM003: Handle connection failure
  - 연결 실패 시 에러 핸들링
  - 재시도 로직 검증
- [ ] TC-MCP-S-CM004: Manage multiple connections
  - 다중 서버 동시 연결
  - 연결 풀 관리

### 1.2 Steps 및 Expected Result 확장 (C2)

**출처**: [REVIEW.md 섹션 6.1](./REVIEW.md#61-즉시-조치-1일-내)

**문제**: 현재 모든 MCP 시나리오의 Steps가 1줄, Expected Result가 일반적 서술

**해결**:
1. 모든 시나리오의 Steps를 3-5단계로 확장
2. Expected Result에 구체적 값 추가 (정규식, 구체적 숫자, 정확한 상태값)

| 시나리오 ID | 현재 Steps | 목표 Steps |
|-------------|------------|------------|
| TC-MCP-R001 | 1단계 | 5단계 (생성→UUID검증→기본값검증→DB확인→정리) |
| TC-MCP-R002 | 1단계 | 4단계 (조회→필드검증→정렬검증→빈목록검증) |
| TC-MCP-R003 | 1단계 | 4단계 (수정→변경확인→타임스탬프→영향범위) |
| TC-MCP-S001 | 1단계 | 5단계 (서비스호출→유효성→비즈니스로직→결과→부수효과) |
| ... | ... | ... |

### 1.3 UI 컴포넌트 테스트 (H3)

현재 코드 구조 대비 누락 분석:
```
src/features/mcp/components/
├── KeyValueList.tsx    → ❌ 테스트 0개 (필요: 6개)
├── StringList.tsx      → ❌ 테스트 0개 (필요: 5개)
└── McpServerEditor.tsx → ⚠️ 간략 커버 (추가 필요: 4개)
```

#### 1.3.1 KeyValueList 컴포넌트 테스트 (6개)
- [ ] TC-MCP-U-KV001: Add new key-value pair
- [ ] TC-MCP-U-KV002: Edit existing key-value pair
- [ ] TC-MCP-U-KV003: Delete key-value pair
- [ ] TC-MCP-U-KV004: Render empty state
- [ ] TC-MCP-U-KV005: Handle duplicate key validation
- [ ] TC-MCP-U-KV006: Keyboard navigation (Tab, Enter)

#### 1.3.2 StringList 컴포넌트 테스트 (5개)
- [ ] TC-MCP-U-SL001: Add new string item
- [ ] TC-MCP-U-SL002: Edit existing string item
- [ ] TC-MCP-U-SL003: Delete string item
- [ ] TC-MCP-U-SL004: Drag and drop reorder
- [ ] TC-MCP-U-SL005: Render empty state with placeholder

### 1.4 E2E Tests 확장

- [ ] Import 워크플로우 상세 시나리오
  - 다양한 JSON 형식 import (Claude Desktop, Cursor, VSCode)
  - 대용량 config 파일 import (50개 이상 서버)
  - 부분 import (선택적 서버)
- [ ] 환경변수 관리 워크플로우
  - env 필드 편집 UI 테스트
  - 민감정보 마스킹 확인 (API_KEY, SECRET 등)
- [ ] MCP Set과 Sync 통합 테스트
  - Set 생성 → 서버 추가 → Tool 설정 → Sync 전체 플로우

### 1.5 예상 작업량

| 항목 | 추가 시나리오 수 | 예상 라인 수 |
|------|------------------|--------------|
| config-parser.ts | 8개 | ~200줄 |
| mcp-import.ts | 5개 | ~120줄 |
| McpConnectionManager | 4개 | ~100줄 |
| KeyValueList | 6개 | ~150줄 |
| StringList | 5개 | ~120줄 |
| 기존 시나리오 Steps/Expected Result 확장 | 23개 | ~350줄 |
| E2E 확장 | 8개 | ~250줄 |
| **합계** | **59개** | **~1,290줄** |

목표: 455줄 → 1,745줄 (평균 1,200줄 상회)

---

## Task 2: 시나리오 ID 형식 통일 (Priority: High)

**문제점 ID**: H2
**출처**: [REVIEW.md 섹션 4 - High](./REVIEW.md#high-우선-수정), [섹션 6.2](./REVIEW.md#62-단기-조치-1주-내)
**현재 상태**: 파일별로 불일치하는 ID 형식 사용

### 2.0 현재 ID 형식 분석

| 파일 | 현재 ID 형식 | 예시 | 문제점 |
|------|--------------|------|--------|
| tools/unit-tests.md | TC-TD-XXX, TC-TS-XXX | TC-TD-001 | 계층 코드 불명확 |
| sync/unit-tests.md | TC-SYNC-RXXXX | TC-SYNC-R0001 | 숫자 4자리 불필요 |
| rules/unit-tests.md | TC-RULE-RXXXX | TC-RULE-R0001 | RULE 단수형 |
| mcp/unit-tests.md | TC-MCP-RXXX | TC-MCP-R001 | 상대적으로 양호 |
| history/unit-tests.md | TC-HIST-RXXX | TC-HIST-R001 | 상대적으로 양호 |

### 2.1 ID 형식 표준 정의

**권장 형식**: `TC-{MENU}-{LAYER}{NUMBER}`

| 구성요소 | 값 | 설명 |
|----------|-----|------|
| TC | 고정 | Test Case |
| MENU | TOOLS, SYNC, PROJ, RULES, MCP, HIST, SET | 메뉴 약어 (4-5자) |
| LAYER | R(Repository), S(Service), H(Handler), C(Component), U(Utility), E(E2E) | 계층 코드 |
| NUMBER | 001-999 | 순차 번호 (3자리) |

**예시**:
- `TC-TOOLS-R001`: Tools Repository 첫 번째 테스트
- `TC-MCP-U005`: MCP Utility 다섯 번째 테스트
- `TC-SYNC-E012`: Sync E2E 열두 번째 테스트

### 2.2 기존 파일 업데이트 작업

| 파일 | 예상 변경 수 | 변환 예시 |
|------|-------------|-----------|
| tools/unit-tests.md | ~30개 | TC-TD-001 → TC-TOOLS-R001 |
| tools/e2e-tests.md | ~50개 | TC-TE-001 → TC-TOOLS-E001 |
| sync/unit-tests.md | ~23개 | TC-SYNC-R0001 → TC-SYNC-R001 |
| sync/e2e-tests.md | ~38개 | TC-SYNC-E0001 → TC-SYNC-E001 |
| projects/unit-tests.md | ~28개 | TC-PROJ-R0001 → TC-PROJ-R001 |
| projects/e2e-tests.md | ~38개 | TC-PROJ-E0001 → TC-PROJ-E001 |
| rules/unit-tests.md | ~89개 | TC-RULE-R0001 → TC-RULES-R001 |
| rules/e2e-tests.md | ~45개 | TC-RULE-E0001 → TC-RULES-E001 |
| mcp/unit-tests.md | ~23개 | (유지 또는 미세 조정) |
| mcp/e2e-tests.md | ~26개 | (유지 또는 미세 조정) |
| history/unit-tests.md | ~44개 | (유지) |
| history/e2e-tests.md | ~38개 | (유지) |
| settings/unit-tests.md | ~28개 | TC-SET-S001 → TC-SET-S001 |
| settings/e2e-tests.md | ~50개 | (검토 필요) |

**총 예상 변경**: ~450개 ID

### 2.3 자동화 스크립트 고려

```bash
# ID 형식 변환 스크립트 (예시)
# sed 또는 Node.js 스크립트로 일괄 변환 권장
```

- [ ] ID 변환 스크립트 작성
- [ ] 변환 전 백업
- [ ] 일괄 변환 실행
- [ ] 변환 결과 검증

---

## Task 3: Category 필드 일관성 해결 (Priority: High)

**문제점 ID**: H1
**출처**: [REVIEW.md 섹션 3.2](./REVIEW.md#32-sync-e2e-추가-필드-분석), [섹션 6.2](./REVIEW.md#62-단기-조치-1주-내)
**현재 상태**: Sync E2E 시나리오에만 Category 필드 존재

### 3.0 현재 상태 분석

**Sync E2E만 Category 사용**:
```markdown
- **Priority**: High
- **Category**: UI Layout  ← 다른 메뉴에는 없음
```

**다른 메뉴 (Tools, Rules, MCP 등)**:
```markdown
- **Priority**: High
  ← Category 필드 없음
```

### 3.1 문제점

| 영향 | 설명 |
|------|------|
| 분류 체계 불일치 | Sync만 Category로 분류 가능, 다른 메뉴는 불가 |
| 검색/필터링 어려움 | 전체 시나리오 통합 검색 시 일관성 부재 |
| 템플릿 혼란 | 신규 시나리오 작성 시 어떤 형식 따를지 불명확 |

### 3.2 해결 옵션

#### 옵션 A: 모든 파일에 Category 추가
- **장점**: 풍부한 메타데이터, 세분화된 분류
- **단점**: 작업량 많음 (~450개 시나리오 수정)
- **권장 Category 값**:
  - Unit: `Repository`, `Service`, `Handler`, `Utility`, `Component`, `Hook`
  - E2E: `CRUD`, `Navigation`, `Validation`, `Integration`, `Accessibility`, `Error Handling`

#### 옵션 B: Sync에서 Category 제거 (권장)
- **장점**: 최소 변경, 즉시 일관성 확보
- **단점**: 분류 정보 손실
- **변경 파일**: `sync/e2e-tests.md` 1개

### 3.3 권장 결정: 옵션 B

**이유**:
1. Category 정보는 섹션 제목으로 이미 표현됨 (예: "## 4.1 List UI Layout Tests")
2. ID의 계층 코드(R, S, H, E)로 분류 가능
3. 작업량 대비 효과 낮음

**작업 항목**:
- [x] `sync/e2e-tests.md`에서 Category 필드 제거 (~38개) - 완료
- [x] `sync/unit-tests.md`에서 Category 필드 제거 - 완료
- [x] 다른 파일에 Category 없음 확인 (검증) - 완료

**완료 일자**: 2025-12-23
**완료자**: Gemini Agent
**검증 결과**:
```bash
grep -r "- \*\*Category\*\*:" tests/scenarios/
# No matches found - 모든 Category 필드 제거 완료
```

---

## Task 4: 공통 테스트 시나리오 추출 (Priority: Medium)

**문제점 ID**: M2, M3
**출처**: [REVIEW.md 섹션 4 - Medium](./REVIEW.md#medium-개선-권장), [섹션 6.3](./REVIEW.md#63-중기-조치-1개월-내)
**현재 상태**: 접근성, 성능 테스트가 일부 메뉴에만 산발적으로 존재

### 4.1 공통 시나리오 문서 생성
- [ ] `scenarios/common/error-handling.md` 생성
  - API 오류 처리
  - 네트워크 타임아웃
  - IPC 통신 실패
- [ ] `scenarios/common/navigation.md` 생성
  - 사이드바 네비게이션
  - 페이지 전환
  - 뒤로가기/앞으로가기
- [ ] `scenarios/common/accessibility.md` 생성
  - 키보드 네비게이션
  - 스크린 리더 호환성
  - 포커스 관리
- [ ] `scenarios/common/performance.md` 생성
  - 페이지 로드 시간
  - 대용량 데이터 처리
  - 메모리 누수 방지

### 4.2 각 메뉴 문서에서 공통 시나리오 참조로 대체
- [ ] 중복 시나리오 식별
- [ ] 공통 문서 참조 링크로 대체

---

## Task 5: 시나리오 통계 및 메타데이터 추가 (Priority: Medium)

**문제점 ID**: M1
**출처**: [REVIEW.md 섹션 4 - Medium](./REVIEW.md#medium-개선-권장), [섹션 6.3](./REVIEW.md#63-중기-조치-1개월-내)
**현재 상태**: Overview 섹션이 일부 파일에만 존재

### 5.1 각 파일 헤더에 통계 추가
- [ ] 총 시나리오 수
- [ ] 우선순위별 분류 (High/Medium/Low)
- [ ] 카테고리별 분류
- [ ] 마지막 업데이트 날짜

### 5.2 전체 요약 문서 생성
- [ ] `scenarios/README.md` 생성
  - 전체 시나리오 개요
  - 파일별 통계
  - 테스트 실행 가이드

### 5.3 자동화 스크립트로 통계 생성

**출처**: [REVIEW.md 섹션 6.3](./REVIEW.md#63-중기-조치-1개월-내) - "자동화 스크립트로 통계 생성"

- [ ] 시나리오 통계 생성 스크립트 작성
  - 각 파일별 시나리오 수 카운트
  - Priority 분포 분석
  - 계층별 커버리지 자동 계산
- [ ] CI/CD 통합 (선택)
  - PR 시 통계 변화 자동 리포트
  - 커버리지 감소 경고

---

## Task 6: 테스트 구현 우선순위 (Priority: Reference)

시나리오를 실제 테스트 코드로 구현할 때의 권장 순서

### 6.1 Phase 1 - Critical Path (High Priority)
- [ ] Tools 기능 단위 테스트
- [ ] Rules CRUD E2E 테스트
- [ ] Sync 워크플로우 E2E 테스트
- [ ] Settings 영속성 테스트

### 6.2 Phase 2 - Core Features (Medium Priority)
- [ ] MCP 기능 전체
- [ ] Projects 관리
- [ ] History 조회/복구

### 6.3 Phase 3 - Polish (Low Priority)
- [ ] 접근성 테스트
- [ ] 성능 테스트
- [ ] 시각적 회귀 테스트

---

## Current Status

| Task | Priority | 관련 문제점 ID | Status | Progress |
|------|----------|---------------|--------|----------|
| Task 1: MCP 시나리오 확장 | Critical | C1, C2, H3 | 🔴 TODO | 0% |
| Task 2: ID 형식 통일 | High | H2 | 🔴 TODO | 0% |
| Task 3: Category 필드 일관성 | High | H1 | ✅ DONE | 100% |
| Task 4: 공통 시나리오 추출 | Medium | M2, M3 | 🔴 TODO | 0% |
| Task 5: 메타데이터 및 자동화 | Medium | M1 | 🔴 TODO | 0% |
| Task 6: 구현 우선순위 | Reference | - | 📋 Reference | - |

> **참조**: 모든 Task의 상세 근거는 [REVIEW.md](./REVIEW.md) 참조

---

## Appendix: 계층별 커버리지 현황

| 계층 | Tools | Sync | Projects | Rules | MCP | History | Settings |
|------|-------|------|----------|-------|-----|---------|----------|
| Repository | ✅ | ✅ | ✅ | ✅ | ⚠️ 간략 | ✅ | N/A |
| Service | ✅ | ✅ | ✅ | ✅ | ⚠️ 간략 | ✅ | ✅ |
| Handler | ✅ | ✅ | ✅ | ✅ | ⚠️ 간략 | ✅ | ✅ |
| Hook | ✅ | N/A | N/A | ✅ | ⚠️ 간략 | N/A | N/A |
| Component | ✅ | N/A | ✅ | ✅ | ❌ 누락 | ✅ | N/A |
| Utility | N/A | ✅ | ✅ | ✅ | ❌ 누락 | N/A | N/A |

**범례**: ✅ 충분 | ⚠️ 간략 | ❌ 누락 | N/A 해당없음

---

*Generated: 2025-12-23*
*Last Review: 2025-12-23 (ToT + CoT Self-Critique)*
*Total Scenarios: ~450개 (14 files, 8,788 lines)*
