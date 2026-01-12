# MCP Feature - Unit Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 42 |
| High Priority | 35 |
| Medium Priority | 6 |
| Low Priority | 1 |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 7 | ███░░░░░░░ 23% |
| Service | 9 | ████░░░░░░ 40% |
| Handler | 5 | ██░░░░░░░░ 20% |
| Hook | 8 | ███░░░░░░░ 30% |
| Utility | 8 | ███░░░░░░░ 26% |
| Component | 8 | ███░░░░░░░ 26% |

## McpRepository Tests

### TC-MCP-R001: Create MCP Server
- **Description**: McpRepository가 새로운 MCP 서버를 생성할 수 있는지 검증
- **Preconditions**: 데이터베이스 초기화됨
- **Steps**:
  1. 테스트 데이터 준비: `{ name: 'Test Server', command: 'node', args: ['server.js'], env: {} }`
  2. `repository.create(testData)` 호출
  3. 반환된 객체 구조 검증 (id, name, command, args, env, isActive, createdAt 필드 존재 확인)
  4. UUID 형식 검증: `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/` 패턴 일치 확인
  5. 데이터베이스에 직접 쿼리하여 저장 여부 확인
- **Expected Result**:
  - `McpServer` 객체 반환
  - `id`가 UUID v4 패턴과 일치
  - `isActive === true` (기본값)
  - `createdAt`이 현재 시간으로부터 5초 이내
  - 데이터베이스 행이 반환된 객체와 일치
- **Priority**: High

### TC-MCP-R002: Get MCP Server by ID
- **Description**: ID로 서버 조회 검증
- **Preconditions**: 서버 존재함
- **Steps**:
  1. `repository.create()`로 테스트 서버 사전 생성
  2. 생성된 서버의 `id` 값 저장
  3. `repository.getById(id)` 호출
  4. 반환된 객체가 생성 시 데이터와 일치하는지 검증
- **Expected Result**:
  - 존재하는 ID의 경우 `McpServer` 객체 반환
  - 존재하지 않는 ID의 경우 `null` 반환
  - 반환된 객체의 모든 필드 값이 생성 시 입력과 동일
- **Priority**: High

### TC-MCP-R003: Handle args as JSON array
- **Description**: args 직렬화 검증
- **Preconditions**: 없음
- **Steps**:
  1. 복잡한 args 배열 준비: `['--port', '3000', '--host', 'localhost']`
  2. `repository.create({ ..., args: testArgs })` 호출
  3. `repository.getById(id)`로 서버 재조회
  4. 반환된 `args` 필드의 타입이 `Array`인지 검증
  5. 배열 요소 순서 및 값이 원본과 동일한지 확인
- **Expected Result**:
  - `args`가 문자열이 아닌 배열로 반환
  - `Array.isArray(server.args) === true`
  - 배열 길이 및 각 요소 값이 입력과 일치
- **Priority**: High

### TC-MCP-R004: Handle env as JSON object
- **Description**: env 직렬화 검증
- **Preconditions**: 없음
- **Steps**:
  1. 환경변수 객체 준비: `{ NODE_ENV: 'production', API_KEY: 'secret123' }`
  2. `repository.create({ ..., env: testEnv })` 호출
  3. `repository.getById(id)`로 서버 재조회
  4. 반환된 `env` 필드의 타입이 `object`인지 검증
  5. 각 key-value 쌍이 원본과 동일한지 확인
- **Expected Result**:
  - `env`가 객체로 반환 (typeof server.env === 'object')
  - 모든 키와 값이 원본과 정확히 일치
  - 중첩 객체가 있을 경우 재귀적으로 검증
- **Priority**: High

### TC-MCP-R005: List MCP Servers
- **Description**: 전체 서버 목록 조회 검증
- **Preconditions**: 서버 3개 존재
- **Steps**:
  1. 서버 3개 사전 생성
  2. `repository.getAll()` 호출
  3. 반환된 배열 길이 확인
- **Expected Result**:
  - 배열 길이 3 반환
  - 생성된 모든 서버 포함
- **Priority**: High

### TC-MCP-R006: Update MCP Server
- **Description**: 서버 정보 업데이트 검증
- **Preconditions**: 서버 존재
- **Steps**:
  1. 서버 생성
  2. `repository.update(id, { name: 'New Name' })` 호출
  3. `repository.getById(id)`로 재조회
- **Expected Result**:
  - 업데이트된 서버 객체 반환
  - DB에 변경사항 반영됨
- **Priority**: High

### TC-MCP-R007: Delete MCP Server
- **Description**: 서버 삭제 검증
- **Preconditions**: 서버 존재
- **Steps**:
  1. 서버 생성
  2. `repository.delete(id)` 호출
  3. `repository.getById(id)` 호출
- **Expected Result**:
  - delete 호출 시 true 반환 (또는 삭제된 객체)
  - getById 호출 시 null 반환
  - DB에서 행 제거됨
- **Priority**: High

## McpSetService Tests

### TC-MCP-S021: Create MCP Set
- **Description**: Set 생성 검증
- **Steps**:
  1. `service.create({ name: 'My MCPs', items: [] })` 호출
- **Expected Result**:
  - Set 생성됨
- **Priority**: High

### TC-MCP-S022: Update MCP Set items
- **Description**: Set에 서버 추가 검증
- **Steps**:
  1. `service.update({ id, items: ['server-1'] })` 호출
- **Expected Result**:
  - Items 업데이트됨
- **Priority**: High

### TC-MCP-S023: Update non-existent set throws error
- **Description**: 에러 핸들링 검증
- **Steps**:
  1. 잘못된 ID로 업데이트 시도
- **Expected Result**:
  - "McpSet not found" 에러 발생
- **Priority**: High

## McpService Tests

### TC-MCP-S001: Create server with history logging
- **Description**: 히스토리 로깅 검증
- **Steps**:
  1. McpService 인스턴스 생성 (Repository 주입)
  2. `service.create({ name: 'Test', command: 'node', args: [], env: {} })` 호출
  3. 반환된 서버 객체의 `id` 저장
  4. History Repository에서 `action === 'CREATE'`인 항목 조회
  5. History 항목의 `entityId`가 생성된 서버 `id`와 일치하는지 검증
- **Expected Result**:
  - 서버 생성 성공
  - History 항목이 1개 이상 존재
  - History의 `action` 필드가 `'CREATE'`
  - `newState`에 생성된 서버 정보 포함
  - `oldState`는 `null` 또는 빈 객체
- **Priority**: High

### TC-MCP-S002: Update server with history
- **Description**: 이전 상태 로깅 검증
- **Steps**:
  1. `service.create()`로 테스트 서버 사전 생성
  2. 생성된 서버의 현재 상태 스냅샷 저장
  3. `service.update({ id, name: 'Updated Name' })` 호출
  4. History Repository에서 `action === 'UPDATE'`인 항목 조회
  5. History의 `oldState`가 스냅샷과 일치하는지 검증
- **Expected Result**:
  - 서버 업데이트 성공
  - History 항목의 `oldState`에 변경 전 상태 저장
  - `newState`에 변경 후 상태 저장
  - `oldState.name !== newState.name` 확인
- **Priority**: High

### TC-MCP-S003: Delete server with history
- **Description**: 삭제 스냅샷 로깅 검증
- **Steps**:
  1. `service.create()`로 테스트 서버 사전 생성
  2. 생성된 서버의 전체 정보 스냅샷 저장
  3. `service.delete(id)` 호출
  4. History Repository에서 `action === 'DELETE'`인 항목 조회
  5. History의 `oldState`에 삭제된 서버의 전체 스냅샷이 포함되는지 검증
- **Expected Result**:
  - 서버 삭제 성공
  - History 항목의 `oldState`에 서버의 모든 필드 포함
  - `newState`는 `null` 또는 빈 객체
  - 삭제된 서버를 `repository.getById(id)`로 조회 시 `null` 반환
- **Priority**: High

### TC-MCP-S004: Validate server config
- **Description**: 서버 설정 유효성 검사
- **Steps**:
  1. 필수 필드 누락된 데이터로 `service.create` 호출
  2. 잘못된 형식(예: args가 문자열)으로 호출
- **Expected Result**:
  - ValidationError 발생
  - 적절한 에러 메시지 반환
- **Priority**: High

### TC-MCP-S005: Bulk operations
- **Description**: 다중 작업 처리 검증
- **Steps**:
  1. 서버 목록으로 `service.createMany([...])` 호출 (가정)
  2. 또는 트랜잭션 내 여러 작업 수행
- **Expected Result**:
  - 모든 작업 성공 또는 전체 롤백
- **Priority**: Medium

### TC-MCP-S006: Error handling
- **Description**: 일반적인 에러 처리
- **Steps**:
  1. DB 연결 실패 시나리오 모의
  2. 서비스 메서드 호출
- **Expected Result**:
  - ServiceError로 래핑되어 던져짐
- **Priority**: Medium

## McpHandler Tests

### TC-MCP-H001: List servers via IPC
- **Description**: mcp:list 핸들러 검증
- **Steps**:
  1. Mock 또는 실제 서버 3개 사전 생성 (Repository 레벨)
  2. IPC 핸들러 `ipcMain.handle('mcp:list', ...)`에 테스트 요청 전송
  3. 응답 형식이 `Result<McpServer[]>` 타입인지 검증
  4. `success === true` 확인 및 `data` 배열 길이 확인
- **Expected Result**:
  - `{ success: true, data: McpServer[] }` 형식으로 반환
  - `data.length === 3`
  - 각 항목에 필수 필드 (`id`, `name`, `command`) 포함
- **Priority**: High

### TC-MCP-H002: Create server with validation
- **Description**: Zod 입력 검증 확인
- **Steps**:
  1. 유효한 입력 데이터 준비: `{ name: 'Test', command: 'node', args: [], env: {} }`
  2. IPC 핸들러 `'mcp:create'`에 요청 전송
  3. 응답의 `success` 필드 확인
  4. 생성된 서버의 `id` 추출 및 UUID 형식 검증
- **Expected Result**:
  - `{ success: true, data: McpServer }` 반환
  - Zod 검증 통과
  - 서버가 Repository에 실제로 저장됨
- **Priority**: High

### TC-MCP-H003: Validation error handling
- **Description**: 잘못된 이름에 대한 검증 실패 확인
- **Steps**:
  1. 잘못된 입력 데이터 준비: `{ name: '', command: 'node', args: [], env: {} }`
  2. IPC 핸들러 `'mcp:create'`에 요청 전송
  3. 응답의 `success` 필드가 `false`인지 확인
  4. 에러 메시지에 "name" 또는 "required" 키워드 포함 확인
  5. Repository에 서버가 생성되지 않았는지 확인
- **Expected Result**:
  - `{ success: false, error: { code: 'VALIDATION_ERROR', message: '...' } }` 반환
  - 에러 메시지가 사용자 친화적
  - 서버 생성 실패
- **Priority**: High

### TC-MCP-H004: Update server handler
- **Description**: mcp:update 핸들러 검증
- **Steps**:
  1. 서버 생성
  2. `ipcMain.handle('mcp:update', ...)` 호출
- **Expected Result**:
  - 성공 응답 반환
  - 데이터 업데이트됨
- **Priority**: High

### TC-MCP-H005: Delete server handler
- **Description**: mcp:delete 핸들러 검증
- **Steps**:
  1. 서버 생성
  2. `ipcMain.handle('mcp:delete', ...)` 호출
- **Expected Result**:
  - 성공 응답 반환
  - 데이터 삭제됨
- **Priority**: High

## useMcp Hook Tests

### TC-MCP-K001: Fetch servers on mount
- **Description**: 서버 목록 로드 검증
- **Steps**:
  1. Mock IPC 응답 설정: `ipcRenderer.invoke('mcp:list')` → `{ success: true, data: [...] }`
  2. React Testing Library로 `useMcp` 훅을 사용하는 컴포넌트 렌더링
  3. 초기 로딩 상태 확인 (`isLoading === true`)
  4. 로딩 완료 후 `servers` 배열에 데이터가 채워졌는지 검증
- **Expected Result**:
  - 마운트 시 IPC 호출 자동 실행
  - `servers` 배열에 Mock 데이터 반영
  - `isLoading === false`, `error === null`
  - React Query 캐시에 데이터 저장됨
- **Priority**: High

### TC-MCP-K002: Create server mutation invalidates cache
- **Description**: 캐시 무효화 검증
- **Steps**:
  1. `useMcp` 훅 렌더링 및 초기 서버 목록 로드 (2개)
  2. `createServer.mutate({ name: 'New', command: 'node', ... })` 호출
  3. Mutation 성공 후 React Query의 캐시 무효화 트리거 확인
  4. 서버 목록이 자동으로 재조회되어 3개로 증가하는지 검증
  5. UI에 새 서버가 즉시 반영되는지 확인
- **Expected Result**:
  - Mutation 성공 후 `queryClient.invalidateQueries(['mcp', 'servers'])` 호출
  - 서버 목록이 자동으로 리페치
  - `servers.length === 3`
  - 새로 생성된 서버가 목록에 포함
- **Priority**: High

### TC-MCP-K003: Update server mutation
- **Description**: 서버 수정 Mutation 검증
- **Steps**:
  1. `updateServer.mutate({ id, ... })` 호출
  2. 캐시 업데이트 확인
- **Expected Result**:
  - 변경사항 반영
  - 목록 리페치
- **Priority**: High

### TC-MCP-K004: Error state handling
- **Description**: 에러 상태 UI 반영 검증
- **Steps**:
  1. IPC 에러 Mocking
  2. 훅 렌더링
- **Expected Result**:
  - `isError === true`
  - `error` 객체에 메시지 포함
- **Priority**: High

### TC-MCP-K005: useMcpServerStatus
- **Description**: 서버 상태 조회 훅 검증
- **Steps**:
  1. `useMcpServerStatus(id)` 호출
- **Expected Result**:
  - 상태 정보 반환 (connected, error 등)
- **Priority**: Medium

### TC-MCP-K006: Manual cache invalidation
- **Description**: 수동 캐시 무효화 검증
- **Steps**:
  1. `utils.invalidate()` 호출
- **Expected Result**:
  - 쿼리 리페치 발생
- **Priority**: Medium

### TC-MCP-K007: Optimistic update
- **Description**: 낙관적 업데이트 검증
- **Steps**:
  1. Mutation 시작 시 캐시 즉시 수정
  2. 실패 시 롤백
- **Expected Result**:
  - UI 즉각 반응
  - 실패 시 원복
- **Priority**: Low

### TC-MCP-K008: Loading state details
- **Description**: 로딩 상태 세분화 검증
- **Steps**:
  1. `isFetching` vs `isLoading` 확인
- **Expected Result**:
  - 백그라운드 업데이트 시 `isFetching` true
- **Priority**: Low

## Config Parser Tests

### TC-MCP-U001: Parse Claude Desktop config (valid)
- **Description**: Claude Desktop JSON 형식의 MCP 설정 파일을 정상적으로 파싱하는지 검증
- **Preconditions**:
  - 유효한 Claude Desktop 형식의 JSON 파일 준비
  - `mcpServers` 객체에 최소 1개의 서버 설정 포함
- **Steps**:
  1. Claude Desktop 형식의 JSON 문자열 준비
  2. `parseConfig(jsonString, 'claude-desktop')` 호출
  3. 반환된 서버 목록 검증
  4. 각 서버의 필수 필드 존재 확인
  5. 필드 값의 타입 검증
- **Expected Result**:
  - 서버 배열 반환 (length >= 1)
  - 각 서버에 `name`, `command`, `args`, `env` 필드 존재
  - `args`는 string 배열
  - `env`는 key-value 객체
- **Priority**: High

### TC-MCP-U002: Parse Cursor config (valid)
- **Description**: Cursor JSON 형식의 MCP 설정 파일을 정상적으로 파싱하는지 검증
- **Preconditions**:
  - 유효한 Cursor 형식의 JSON 파일 준비
  - `settings.mcp` 경로에 서버 설정 포함
- **Steps**:
  1. Cursor 형식의 JSON 문자열 준비
  2. `parseConfig(jsonString, 'cursor')` 호출
  3. 중첩된 경로에서 서버 목록 추출 확인
  4. 반환된 서버 목록 검증
- **Expected Result**:
  - `settings.mcp` 경로에서 서버 추출
  - Claude Desktop과 동일한 출력 형식으로 정규화
- **Priority**: High

### TC-MCP-U003: Parse config with environment variables
- **Description**: 환경변수가 포함된 설정 파일의 치환 로직 검증
- **Preconditions**:
  - `${HOME}`, `${USER}` 등 환경변수가 포함된 JSON 준비
  - 현재 환경에 해당 환경변수 설정됨
- **Steps**:
  1. 환경변수가 포함된 JSON 준비: `"command": "${HOME}/bin/server"`
  2. `parseConfig()` 호출
  3. 반환된 `command` 값에서 환경변수 치환 확인
  4. 존재하지 않는 환경변수 처리 확인
- **Expected Result**:
  - `${HOME}`이 실제 홈 디렉토리로 치환 (예: `/Users/username`)
  - 존재하지 않는 변수는 원본 유지 또는 빈 문자열
- **Priority**: Medium

### TC-MCP-U004: Parse config with empty mcpServers
- **Description**: 빈 mcpServers 객체 처리 검증
- **Preconditions**:
  - `mcpServers: {}` 형태의 JSON 준비
- **Steps**:
  1. 빈 mcpServers가 포함된 JSON 준비
  2. `parseConfig()` 호출
  3. 반환값 확인
- **Expected Result**:
  - 빈 배열 `[]` 반환
  - 에러 발생하지 않음
- **Priority**: Medium

### TC-MCP-U005: Parse invalid JSON format
- **Description**: 잘못된 JSON 형식 에러 핸들링 검증
- **Preconditions**:
  - 문법 오류가 있는 JSON 문자열 준비
- **Steps**:
  1. 잘못된 JSON 문자열 준비: `{ "mcpServers": }`
  2. `parseConfig()` 호출
  3. 에러 발생 확인
  4. 에러 메시지 형식 검증
- **Expected Result**:
  - `ConfigParseError` 또는 유사한 에러 throw
  - 에러 메시지에 "JSON" 또는 "parse" 키워드 포함
  - 에러 위치 정보 포함 권장
- **Priority**: High

### TC-MCP-U006: Parse config with missing required fields
- **Description**: 필수 필드 누락 시 에러 핸들링 검증
- **Preconditions**:
  - `command` 필드가 누락된 서버 설정 준비
- **Steps**:
  1. command 누락된 JSON 준비: `{ "server1": { "args": [] } }`
  2. `parseConfig()` 호출
  3. 에러 발생 확인
  4. name 필드 자동 생성 로직 확인 (key 이름 사용)
- **Expected Result**:
  - `command` 누락 시 `ValidationError` throw
  - `name` 필드 누락 시 객체 key를 name으로 자동 설정
- **Priority**: High

### TC-MCP-U007: Parse config with nested env objects
- **Description**: 중첩된 환경변수 객체 평탄화 검증
- **Preconditions**:
  - 중첩된 env 객체가 포함된 JSON 준비
- **Steps**:
  1. 중첩된 env 준비: `{ "env": { "nested": { "KEY": "value" } } }`
  2. `parseConfig()` 호출
  3. env 객체 평탄화 확인
- **Expected Result**:
  - 중첩 객체가 `NESTED_KEY=value` 형태로 평탄화
  - 또는 에러와 함께 평탄 구조 요구
- **Priority**: Low

### TC-MCP-U008: Parse config with special characters
- **Description**: 특수문자가 포함된 경로 처리 검증
- **Preconditions**:
  - 공백, 한글, 특수문자가 포함된 경로
- **Steps**:
  1. 특수 경로 JSON 준비: `"command": "/path/with spaces/한글/server.js"`
  2. `parseConfig()` 호출
  3. 경로가 변형 없이 보존되는지 확인
- **Expected Result**:
  - 특수문자 포함 경로가 원본 그대로 보존
  - 이스케이프 처리 불필요
- **Priority**: Medium

## Component Tests

### TC-MCP-C001: McpSetList renders sets
- **Description**: Set 목록 표시 검증
- **Steps**:
  1. 3개의 Set으로 렌더링
- **Expected Result**:
  - 3개 항목 표시됨
- **Priority**: High

### TC-MCP-C002: McpPool search filter
- **Description**: 검색 필터 검증
- **Steps**:
  1. 검색어 입력
- **Expected Result**:
  - 필터링된 결과 표시
- **Priority**: High

### TC-MCP-C003: McpServerDialog validation
- **Description**: 폼 유효성 검사 검증
- **Steps**:
  1. 필수 필드 비우고 시도
- **Expected Result**:
  - 제출 버튼 비활성화
- **Priority**: High

### TC-MCP-C004: Add new string item
- **Description**: StringList 컴포넌트에서 새로운 문자열 항목을 추가하는 기능 검증
- **Preconditions**:
  - StringList 컴포넌트 렌더링됨
  - `onChange` 콜백 prop 전달됨
  - 초기값: `["arg1", "arg2"]`
- **Steps**:
  1. 컴포넌트 렌더링: `<StringList value={["arg1", "arg2"]} onChange={mockFn} />`
  2. "Add" 버튼 클릭
  3. 새 입력 필드에 "--port=3000" 입력
  4. Enter 키 또는 포커스 이동
- **Expected Result**:
  - 새 항목이 목록 끝에 추가됨
  - `onChange(["arg1", "arg2", "--port=3000"])` 호출됨
  - 입력 필드 초기화 또는 새 빈 행 추가
- **Priority**: High

### TC-MCP-C005: Edit existing string item
- **Description**: 기존 문자열 항목을 수정하는 기능 검증
- **Preconditions**:
  - StringList 컴포넌트 렌더링됨
  - `onChange` 콜백 prop 전달됨
  - 초기값: `["--watch", "--verbose"]`
- **Steps**:
  1. 컴포넌트 렌더링 with 초기값
  2. "--watch" 항목 더블클릭하여 편집 모드 진입
  3. "--no-watch"로 변경
  4. Enter 키로 저장
- **Expected Result**:
  - `onChange(["--no-watch", "--verbose"])` 호출됨
  - UI에 변경된 값 표시
  - 편집 모드 종료
- **Priority**: High

### TC-MCP-C006: Delete string item
- **Description**: 문자열 항목을 삭제하는 기능 검증
- **Preconditions**:
  - StringList 컴포넌트 렌더링됨
  - `onChange` 콜백 prop 전달됨
  - 초기값: `["item1", "item2", "item3"]`
- **Steps**:
  1. 컴포넌트 렌더링 with 초기값
  2. "item2" 행의 삭제 버튼 클릭
  3. 결과 확인
  4. 인덱스 재정렬 검증
- **Expected Result**:
  - `onChange(["item1", "item3"])` 호출됨
  - "item2"가 UI에서 제거됨
  - 인덱스가 재정렬됨
- **Priority**: High

### TC-MCP-C007: Drag and drop reorder
- **Description**: 드래그 앤 드롭으로 항목 순서를 변경하는 기능 검증
- **Preconditions**:
  - StringList 컴포넌트 렌더링됨
  - `onChange` 콜백 prop 전달됨
  - 초기값: `["first", "second", "third"]`
  - 드래그 앤 드롭 라이브러리 사용 (예: dnd-kit)
- **Steps**:
  1. 컴포넌트 렌더링 with 초기값
  2. "first" 항목의 드래그 핸들 클릭 및 홀드
  3. "third" 위치로 드래그
  4. 드롭
- **Expected Result**:
  - `onChange(["second", "third", "first"])` 호출됨
  - UI에서 순서 변경 반영
  - 드래그 중 시각적 피드백 (예: 드롭 위치 표시)
- **Priority**: Medium

### TC-MCP-C008: Render empty state with placeholder
- **Description**: 빈 배열일 때 placeholder UI 렌더링 검증
- **Preconditions**:
  - StringList 컴포넌트 렌더링됨
  - 초기값: `[]`
  - `placeholder` prop 전달됨
- **Steps**:
  1. 컴포넌트 렌더링: `<StringList value={[]} placeholder="인자 추가" />`
  2. UI 상태 확인
  3. placeholder 텍스트 표시 검증
  4. 에러 발생 여부 확인
- **Expected Result**:
  - "인자 추가" placeholder 텍스트 표시
  - "Add" 버튼 또는 "+ 추가" 링크 표시
  - 에러 없이 렌더링
- **Priority**: Medium