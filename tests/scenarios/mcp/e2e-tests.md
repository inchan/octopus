# MCP Feature - E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 31 |
| High Priority | 21 |
| Medium Priority | 9 |
| Low Priority | 1 |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 31 | ██████████ 100% |

## 3-Pane Layout

### TC-MCP-E001: Initial page load with empty state
- **Description**: 데이터가 없을 때 MCP 페이지 로드 검증
- **Preconditions**: 새로운 데이터베이스
- **Steps**:
  1. MCP 페이지로 이동
- **Expected Result**:
  - Pane 1: 빈 Set 목록
  - Pane 2: "Select a set to view details" 메시지
  - Pane 3: 빈 서버 Pool
- **Priority**: High

### TC-MCP-E002: Initial page load with existing data
- **Description**: 데이터가 있을 때 MCP 페이지 표시 검증
- **Preconditions**: 2개의 Set, 5개의 서버 존재
- **Steps**:
  1. MCP 페이지로 이동
- **Expected Result**:
  - Set 목록과 서버 목록이 정상적으로 표시됨
- **Priority**: High

## MCP Set CRUD

### TC-MCP-E003: Create new MCP Set
- **Description**: Set 생성 검증
- **Steps**:
  1. Set 목록에서 '+' 버튼 클릭
  2. 이름 입력 "My MCPs"
  3. 생성 버튼 클릭
- **Expected Result**:
  - 목록에 새 Set 추가됨
  - 자동으로 선택됨
- **Priority**: High

### TC-MCP-E004: Select MCP Set
- **Description**: Set 선택 검증
- **Steps**:
  1. Set 클릭
- **Expected Result**:
  - Set이 하이라이트됨
  - Pane 2에 상세 정보 표시됨
- **Priority**: High

### TC-MCP-E005: Delete MCP Set
- **Description**: Set 삭제 검증
- **Steps**:
  1. Set 선택
  2. 삭제 버튼 클릭
  3. 확인
- **Expected Result**:
  - Set이 목록에서 제거됨
  - 서버는 삭제되지 않고 Pool에 남아있음
- **Priority**: High

## MCP Server CRUD

### TC-MCP-E006: Create new MCP Server
- **Description**: 서버 생성 검증
- **Steps**:
  1. Pool 헤더에서 '+' 버튼 클릭
  2. 이름, 명령어, 인자 입력
  3. 생성 버튼 클릭
- **Expected Result**:
  - Pool에 서버 추가됨
- **Priority**: High

### TC-MCP-E007: Edit MCP Server
- **Description**: 서버 수정 검증
- **Steps**:
  1. 서버의 편집 버튼 클릭
  2. 필드 수정
  3. 저장
- **Expected Result**:
  - 서버 정보 업데이트됨
- **Priority**: High

### TC-MCP-E008: Delete MCP Server
- **Description**: 서버 삭제 검증
- **Steps**:
  1. 서버의 삭제 버튼 클릭
  2. 확인
- **Expected Result**:
  - Pool 및 모든 Set에서 서버가 제거됨
- **Priority**: High

### TC-MCP-E009: Search servers in Pool
- **Description**: 검색 기능 검증
- **Steps**:
  1. 검색창에 "Local" 입력
- **Expected Result**:
  - 일치하는 서버만 표시됨
- **Priority**: High

## Set-Server Relationship

### TC-MCP-E010: Add Server to Set
- **Description**: Set에 서버 추가 검증
- **Steps**:
  1. Set 선택
  2. Pool의 서버에서 '+' 버튼 클릭
- **Expected Result**:
  - Set 상세 정보(Pane 2)에 서버 추가됨
- **Priority**: High

### TC-MCP-E011: Remove Server from Set
- **Description**: Set에서 서버 제거 검증
- **Steps**:
  1. Pane 2의 서버에서 'X' 버튼 클릭
- **Expected Result**:
  - Set에서 서버 제거됨 (Pool에는 유지)
- **Priority**: High

### TC-MCP-E012: Reorder servers in Set
- **Description**: 드래그 앤 드롭 순서 변경 검증
- **Steps**:
  1. 서버를 드래그하여 새 위치로 이동
- **Expected Result**:
  - 순서가 변경됨
- **Priority**: Medium

## MCP Server Import

### TC-MCP-E013: Import workflow - Claude Desktop
- **Description**: Claude Desktop 형식의 config 파일을 import하는 전체 워크플로우 E2E 테스트
- **Preconditions**:
  - Octopus 앱 실행됨
  - MCP 메뉴로 이동됨
  - 테스트용 Claude Desktop config 파일 준비
- **Steps**:
  1. MCP 서버 목록 페이지에서 "Import" 버튼 클릭
  2. 파일 선택 다이얼로그에서 config 파일 선택
  3. "Claude Desktop" 형식 자동 감지 확인
  4. 미리보기에서 import할 서버 목록 확인
  5. "Import All" 버튼 클릭
  6. 성공 토스트 메시지 확인
  7. 서버 목록에 import된 서버 표시 확인
- **Expected Result**:
  - 파일 선택 후 3초 이내 파싱 완료
  - 미리보기에 서버 이름, command, args 표시
  - Import 후 서버 목록 자동 갱신
  - 각 서버의 상태가 "Active"로 표시
- **Priority**: High

### TC-MCP-E014: Import workflow - Cursor
- **Description**: Cursor 형식의 config 파일 import E2E 테스트
- **Preconditions**:
  - Cursor 형식 config 파일 준비 (`settings.mcp` 경로)
- **Steps**:
  1. Import 버튼 클릭
  2. Cursor config 파일 선택
  3. 형식 감지 확인 (Cursor)
  4. 미리보기 확인
  5. Import 실행
  6. 결과 확인
- **Expected Result**:
  - 중첩된 `settings.mcp` 경로에서 서버 추출
  - Claude Desktop과 동일한 UX로 import 완료
- **Priority**: High

### TC-MCP-E015: Import invalid JSON shows error
- **Description**: 잘못된 JSON 에러 처리 검증
- **Steps**:
  1. 잘못된 JSON 붙여넣기
- **Expected Result**:
  - 에러 메시지 표시
  - Import 버튼 비활성화
- **Priority**: High

### TC-MCP-E016: Import multiple servers at once
- **Description**: 대량 Import 검증
- **Steps**:
  1. 5개 서버가 포함된 JSON 붙여넣기
  2. Import
- **Expected Result**:
  - 5개 서버 모두 생성됨
- **Priority**: Medium

## Server Configuration Fields

### TC-MCP-E017: Configure server with environment variables
- **Description**: 환경변수 설정 검증
- **Steps**:
  1. 서버 생성/편집
  2. Env 추가: PORT=3000, DEBUG=true
  3. 저장
- **Expected Result**:
  - 환경변수 정상 저장됨
- **Priority**: High

### TC-MCP-E018: Configure server with multiple args
- **Description**: 인자 처리 검증
- **Steps**:
  1. Args 입력: "--port 3000 --verbose"
  2. 저장
- **Expected Result**:
  - 배열 형태로 저장됨
- **Priority**: High

### TC-MCP-E019: Toggle server active state
- **Description**: 활성 상태 토글 검증
- **Steps**:
  1. 서버 편집
  2. Active/Inactive 토글
  3. 저장
- **Expected Result**:
  - 상태 변경됨
  - 비활성 서버는 Sync 시 제외될 수 있음
- **Priority**: Medium

## Integration Workflows

### TC-MCP-E020: Create set, add servers, use in sync
- **Description**: 전체 통합 워크플로우
- **Steps**:
  1. MCP Set 생성
  2. 서버 생성
  3. Set에 서버 추가
  4. Tool 설정에서 MCP Set 연결
  5. Sync 실행
- **Expected Result**:
  - 생성된 설정 파일에 MCP 서버 포함됨
- **Priority**: High

### TC-MCP-E021: Delete server updates sync preview
- **Description**: 삭제 시 Sync 반영 검증
- **Steps**:
  1. MCP Set이 연결된 Tool 설정
  2. Set에서 서버 삭제
  3. Sync Preview 생성
- **Expected Result**:
  - 삭제된 서버가 Preview에 없음
- **Priority**: Medium

### TC-MCP-E022: Import servers then assign to set
- **Description**: Import 후 Set 할당 워크플로우
- **Steps**:
  1. 서버 3개 Import
  2. Set 생성
  3. 3개 서버를 Set에 추가
- **Expected Result**:
  - Set에 3개 서버 포함됨
- **Priority**: Medium

## Error Handling

### TC-MCP-E023: Handle API error on create
- **Description**: API 에러 처리 검증
- **Steps**:
  1. API 실패 Mocking
  2. 생성 시도
- **Expected Result**:
  - 에러 메시지 표시
  - UI 멈춤 없음
- **Priority**: Medium

### TC-MCP-E024: Handle duplicate server name
- **Description**: 중복 이름 처리 검증
- **Steps**:
  1. "Test" 이름으로 서버 생성
  2. "Test" 이름으로 또 생성 시도
- **Expected Result**:
  - 둘 다 생성됨 (이름 중복 허용 시)
  - 또는 유효성 에러 (중복 불허 시)
- **Priority**: Low

## Accessibility

### TC-MCP-E025: Keyboard navigation
- **Description**: 키보드 접근성 검증
- **Steps**:
  1. Tab 키로 이동
  2. Enter 키로 실행
- **Expected Result**:
  - 모든 상호작용 요소를 키보드로 접근 가능
- **Priority**: Medium

## Performance

### TC-MCP-E026: Handle 50+ servers in pool
- **Description**: 대량 데이터 성능 검증
- **Steps**:
  1. 50개 서버 로드
- **Expected Result**:
  - 빠른 로딩, 부드러운 스크롤
- **Priority**: Low

## Extended Scenarios

### TC-MCP-E027: Import workflow - Large config
- **Description**: 50개 이상의 서버가 포함된 대용량 config 파일 import 성능 및 안정성 테스트
- **Preconditions**:
  - 50개 이상의 mcpServers가 포함된 config 파일
- **Steps**:
  1. 대용량 config 파일 선택
  2. 파싱 진행률 표시 확인
  3. 미리보기 가상 스크롤 동작 확인
  4. 전체 import 실행
  5. 완료 시간 측정
- **Expected Result**:
  - 파싱 시 진행률 표시 (또는 스피너)
  - 미리보기 목록 스크롤 가능
  - Import 완료 시간 < 30초
  - 메모리 사용량 급증 없음
- **Priority**: Medium

### TC-MCP-E028: Partial import (selective)
- **Description**: 사용자가 선택한 서버만 import하는 기능 E2E 테스트
- **Preconditions**:
  - 10개 서버가 포함된 config 파일
- **Steps**:
  1. Import 다이얼로그 열기
  2. Config 파일 선택
  3. 미리보기에서 3개 서버만 체크박스 선택
  4. "Import Selected" 버튼 클릭
  5. 결과 확인
- **Expected Result**:
  - 체크박스로 개별 선택 가능
  - "Select All" / "Deselect All" 버튼 존재
  - 선택한 3개 서버만 import됨
  - 미선택 7개는 import되지 않음
  - 결과 메시지: "3개 서버 import 완료, 7개 건너뜀"
- **Priority**: Medium

### TC-MCP-E029: Environment variable UI
- **Description**: MCP 서버 환경변수 편집 UI의 E2E 테스트
- **Preconditions**:
  - 최소 1개의 MCP 서버 존재
  - 해당 서버에 env 필드 있음
- **Steps**:
  1. MCP 서버 목록에서 서버 선택
  2. 편집 모드 진입
  3. Environment Variables 섹션 확인
  4. 새 환경변수 추가: `NEW_VAR=value`
  5. 기존 환경변수 수정
  6. 저장 버튼 클릭
  7. 서버 재조회하여 변경 확인
- **Expected Result**:
  - KeyValueList 컴포넌트 정상 렌더링
  - 추가/수정/삭제 모두 동작
  - 저장 후 DB에 반영됨
  - 재조회 시 변경사항 유지
- **Priority**: High

### TC-MCP-E030: Sensitive data masking
- **Description**: API 키, 시크릿 등 민감 정보 마스킹 동작 검증
- **Preconditions**:
  - 서버에 `API_KEY`, `SECRET`, `PASSWORD` 등의 환경변수 존재
- **Steps**:
  1. MCP 서버 편집 화면 진입
  2. Environment Variables 섹션 확인
  3. 민감 키의 값 표시 확인
  4. "Show" 버튼 클릭
  5. 값 표시 확인
  6. "Hide" 버튼 클릭
- **Expected Result**:
  - `API_KEY`, `SECRET`, `PASSWORD`, `TOKEN` 등은 기본적으로 `••••••••`로 마스킹
  - Show 버튼 클릭 시 실제 값 표시
  - Hide 버튼 클릭 시 다시 마스킹
  - 저장 시 원본 값 유지
- **Priority**: Medium

### TC-MCP-E031: MCP Set + Sync integration
- **Description**: MCP Set 생성부터 Tool 설정, Sync까지 전체 통합 플로우 테스트
- **Preconditions**:
  - 최소 2개의 MCP 서버 존재
  - 최소 1개의 Tool 설정 존재
- **Steps**:
  1. MCP Sets 메뉴로 이동
  2. 새 Set 생성: "Development Set"
  3. Set에 서버 2개 추가
  4. Tools 메뉴로 이동
  5. Tool에 생성한 Set 연결
  6. Sync 메뉴로 이동
  7. Sync 실행
  8. 동기화 결과 확인
- **Expected Result**:
  - Set에 서버 추가 성공
  - Tool에 Set 연결 성공
  - Sync 실행 시 Set 내 서버들이 Tool config에 반영
  - 동기화 히스토리에 기록됨
- **Priority**: High