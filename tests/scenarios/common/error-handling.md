# 공통 시나리오: 에러 처리

## Overview

이 문서는 모든 메뉴에서 공통으로 적용되는 에러 처리 시나리오를 정의합니다.

**적용 범위**: 전체 애플리케이션
**우선순위**: High
**테스트 케이스 수**: 10개

---

## 1. API 오류 처리

### TC-COM-ERR001: Network timeout handling

- **Description**: 네트워크 타임아웃 발생 시 애플리케이션이 안전하게 처리하는지 검증
- **Applicable To**: API 호출이 있는 모든 메뉴
- **Preconditions**:
  - 네트워크가 느리거나 불안정한 상태
  - 타임아웃 임계값: 30초
- **Steps**:
  1. Playwright의 `page.route()` 또는 DevTools를 사용하여 30초 이상 네트워크 지연 시뮬레이션
  2. API 호출을 유발하는 액션 수행 (예: 페이지 로드, 데이터 새로고침)
  3. UI 로딩 상태 확인
  4. 타임아웃 후 에러 메시지 표시 확인
  5. Console 에러 로그 확인
- **Expected Result**:
  - 로딩 인디케이터가 즉시 표시됨
  - 타임아웃 후: "네트워크 요청 시간이 초과되었습니다. 다시 시도하시겠습니까?" 형식의 에러 토스트 표시
  - 재시도 버튼 제공
  - Console에 에러 로그 없음 (핸들링된 에러는 예외)
- **Priority**: High

---

### TC-COM-ERR002: Server 500 error handling

- **Description**: 서버 내부 오류(5xx) 발생 시 사용자에게 적절한 메시지를 제공하는지 검증
- **Applicable To**: API 호출이 있는 모든 메뉴
- **Preconditions**:
  - API가 500 Internal Server Error 응답 반환
- **Steps**:
  1. Mock 서버 또는 `page.route()`를 사용하여 500 응답 설정
  2. API 호출 액션 수행
  3. 에러 토스트 메시지 내용 확인
  4. 재시도 옵션 존재 여부 확인
- **Expected Result**:
  - "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." 형식의 에러 메시지 표시
  - 재시도 버튼 또는 자동 재시도 로직 동작
  - 사용자 입력 데이터 보존 (폼 데이터 등)
  - 에러 로그가 적절히 기록됨
- **Priority**: High

---

### TC-COM-ERR003: Server 400 error handling

- **Description**: 클라이언트 요청 오류(4xx) 발생 시 구체적인 에러 메시지를 제공하는지 검증
- **Applicable To**: 폼 제출, 데이터 생성/수정이 있는 모든 메뉴
- **Preconditions**:
  - API가 400 Bad Request 또는 422 Unprocessable Entity 응답 반환
  - 응답 본문에 구체적인 에러 정보 포함 (예: `{field: 'name', message: 'Required'}`)
- **Steps**:
  1. Mock 서버를 사용하여 400 응답 설정 (에러 상세 포함)
  2. 잘못된 데이터로 폼 제출 또는 API 호출
  3. 에러 메시지 표시 위치 확인 (인라인 vs 토스트)
  4. 에러 필드 하이라이트 확인 (폼의 경우)
- **Expected Result**:
  - 서버에서 제공한 구체적인 에러 메시지가 표시됨
  - 폼 필드의 경우: 해당 필드 아래 인라인 에러 메시지 표시
  - 일반 API의 경우: 토스트 또는 배너로 에러 표시
  - 잘못된 필드가 시각적으로 강조됨 (빨간색 테두리 등)
  - 사용자가 입력한 데이터는 유지됨
- **Priority**: High

---

### TC-COM-ERR004: Authentication error handling

- **Description**: 인증 실패(401 Unauthorized) 발생 시 재로그인 프로세스로 안내하는지 검증
- **Applicable To**: 인증이 필요한 모든 메뉴
- **Preconditions**:
  - 사용자 세션이 만료되었거나 유효하지 않은 토큰 사용
  - API가 401 응답 반환
- **Steps**:
  1. Mock 서버를 사용하여 401 응답 설정
  2. 인증이 필요한 API 호출 수행
  3. 에러 메시지 및 리다이렉트 동작 확인
  4. 재로그인 후 원래 페이지로 복귀 여부 확인
- **Expected Result**:
  - "로그인 세션이 만료되었습니다. 다시 로그인해 주세요." 메시지 표시
  - 자동으로 로그인 페이지로 리다이렉트
  - 현재 URL을 `returnUrl` 파라미터로 저장
  - 재로그인 후 저장된 URL로 복귀
  - 진행 중이던 작업 데이터 보존 (가능한 경우)
- **Priority**: High

---

## 2. IPC 통신 실패

### TC-COM-ERR011: IPC channel not found

- **Description**: 존재하지 않는 IPC 채널 호출 시 적절한 에러 처리가 되는지 검증
- **Applicable To**: Electron IPC를 사용하는 모든 기능
- **Preconditions**:
  - `contextBridge`에 노출되지 않은 채널을 호출
  - 또는 잘못된 채널명 사용
- **Steps**:
  1. 존재하지 않는 IPC 채널 호출 시도 (예: `window.api.nonExistentChannel()`)
  2. 에러 캐치 여부 확인
  3. 사용자 피드백 확인
  4. Console 에러 로그 확인
- **Expected Result**:
  - "요청을 처리할 수 없습니다. 애플리케이션을 재시작해 주세요." 형식의 에러 토스트 표시
  - Console에 명확한 에러 메시지 출력 (개발 모드)
  - 애플리케이션이 크래시하지 않음
  - 재시도 또는 새로고침 옵션 제공
- **Priority**: High

---

### TC-COM-ERR012: IPC response timeout

- **Description**: IPC 요청이 지정된 시간 내에 응답하지 않을 때 타임아웃 처리가 되는지 검증
- **Applicable To**: 장시간 실행될 수 있는 IPC 작업 (파일 동기화, 빌드 등)
- **Preconditions**:
  - Main Process에서 응답이 30초 이상 지연되는 상황
- **Steps**:
  1. Mock IPC handler에서 의도적으로 응답 지연 (예: `await sleep(35000)`)
  2. Renderer에서 해당 IPC 호출
  3. 로딩 상태 및 타임아웃 메시지 확인
  4. 사용자 취소 옵션 동작 확인
- **Expected Result**:
  - 30초 이상 응답이 없으면 타임아웃 처리
  - "작업 처리 시간이 초과되었습니다. 다시 시도하시겠습니까?" 메시지 표시
  - 사용자가 작업 취소 가능 (가능한 경우)
  - Main Process의 작업이 적절히 정리됨 (메모리 누수 방지)
- **Priority**: Medium

---

### TC-COM-ERR013: IPC serialization error

- **Description**: IPC 메시지 직렬화/역직렬화 실패 시 에러 처리가 되는지 검증
- **Applicable To**: 복잡한 객체를 전달하는 모든 IPC 통신
- **Preconditions**:
  - 직렬화 불가능한 데이터 전달 시도 (예: 순환 참조 객체, 함수)
  - 또는 잘못된 JSON 형식
- **Steps**:
  1. 직렬화 불가능한 데이터로 IPC 호출 시도
  2. 에러 캐치 및 처리 확인
  3. 사용자 피드백 확인
  4. Console 에러 로그 확인
- **Expected Result**:
  - "데이터 형식이 올바르지 않습니다." 형식의 에러 메시지 표시
  - Console에 상세 에러 정보 출력 (개발 모드)
  - 애플리케이션이 정상 동작 유지
  - 필요 시 데이터 검증 강화 제안
- **Priority**: Medium

---

## 3. UI 에러 표시

### TC-COM-ERR021: Toast error message

- **Description**: 토스트 형식의 에러 메시지가 올바르게 표시되고 자동으로 사라지는지 검증
- **Applicable To**: 전역 에러 처리가 필요한 모든 액션
- **Preconditions**:
  - 에러가 발생하여 토스트 표시가 트리거됨
- **Steps**:
  1. 에러를 유발하는 액션 수행 (예: API 실패)
  2. 토스트 메시지 출현 확인
  3. 메시지 내용 및 스타일 확인
  4. 자동 사라짐 시간 측정 (기본 5초)
  5. 수동 닫기 버튼 동작 확인
- **Expected Result**:
  - 화면 우측 상단(또는 설정된 위치)에 토스트 표시
  - 빨간색 또는 경고 색상으로 에러 상태 표시
  - 명확하고 이해하기 쉬운 메시지 포함
  - 5초 후 자동으로 사라짐
  - X 버튼 클릭 시 즉시 닫힘
  - 여러 토스트가 쌓이는 경우 올바른 순서로 표시
- **Priority**: High

---

### TC-COM-ERR022: Inline error message

- **Description**: 폼 필드 아래 인라인 에러 메시지가 올바르게 표시되는지 검증
- **Applicable To**: 폼 입력이 있는 모든 메뉴 (Rules, Tools 설정 등)
- **Preconditions**:
  - 폼 유효성 검사 실패
  - 또는 서버에서 필드별 에러 응답 반환
- **Steps**:
  1. 잘못된 데이터 입력 (예: 빈 필수 필드, 잘못된 형식)
  2. 폼 제출 또는 실시간 검증 트리거
  3. 인라인 에러 메시지 표시 확인
  4. 필드 하이라이트 확인
  5. 올바른 데이터 입력 후 에러 메시지 사라짐 확인
- **Expected Result**:
  - 에러가 있는 필드 바로 아래 에러 메시지 표시
  - 필드 테두리가 빨간색으로 변경
  - 에러 메시지는 구체적이고 해결 방법 제시 (예: "이메일 형식이 올바르지 않습니다")
  - 필드 수정 시 실시간으로 에러 메시지 업데이트
  - 올바른 값 입력 시 에러 메시지 즉시 제거
- **Priority**: High

---

### TC-COM-ERR023: Error boundary fallback

- **Description**: React Error Boundary가 예상치 못한 에러를 캐치하고 Fallback UI를 표시하는지 검증
- **Applicable To**: 모든 React 컴포넌트 트리
- **Preconditions**:
  - 컴포넌트 렌더링 중 예외 발생
  - 또는 생명주기 메서드에서 에러 발생
- **Steps**:
  1. 테스트용 컴포넌트에서 의도적으로 에러 발생 (예: `throw new Error('Test')`)
  2. Error Boundary 활성화 확인
  3. Fallback UI 표시 확인
  4. 에러 정보 로깅 확인
  5. 복구 옵션 동작 확인
- **Expected Result**:
  - 전체 애플리케이션이 크래시하지 않음
  - Fallback UI 표시: "문제가 발생했습니다. 페이지를 새로고침해 주세요."
  - 새로고침 버튼 제공
  - Console 및 서버(필요 시)에 에러 로그 전송
  - 사용자 데이터 손실 최소화
  - 개발 모드에서는 에러 스택 트레이스 표시
- **Priority**: High

---

## 사용 가이드

### 메뉴 파일에서 참조 방법

각 메뉴 시나리오 파일(예: `scenarios/tools/tools.md`)의 "Common Scenarios" 섹션에서 다음과 같이 참조하세요:

```markdown
## 10. Common Scenarios

이 메뉴에 적용되는 공통 시나리오:

- [에러 처리](../common/error-handling.md)
  - 적용: TC-COM-ERR001~004 (API 호출 있음)
  - 적용: TC-COM-ERR011~013 (IPC 통신 사용)
  - 적용: TC-COM-ERR021~023 (폼 및 UI 에러)

### 메뉴별 예외 사항

- TC-COM-ERR003: Tools 메뉴에서는 400 에러 시 자동 재시도 없음 (사용자 확인 필요)
```

### 테스트 구현 예시 (Playwright)

```typescript
// TC-COM-ERR001: Network timeout handling
test('handles network timeout gracefully', async ({ page }) => {
  // 1. Simulate network delay
  await page.route('**/api/**', route => {
    setTimeout(() => route.abort('timedout'), 31000);
  });

  // 2. Trigger API call
  await page.goto('/tools');

  // 3. Verify loading state
  await expect(page.getByRole('status')).toBeVisible();

  // 4. Verify error toast after timeout
  await expect(page.getByText(/네트워크 요청 시간이 초과/)).toBeVisible({ timeout: 35000 });

  // 5. Verify retry option
  await expect(page.getByRole('button', { name: '다시 시도' })).toBeVisible();
});
```

---

## 체크리스트

새로운 메뉴 개발 시 아래 항목을 확인하세요:

- [ ] API 호출이 있는가? → TC-COM-ERR001~004 테스트 작성
- [ ] IPC 통신을 사용하는가? → TC-COM-ERR011~013 테스트 작성
- [ ] 폼 입력이 있는가? → TC-COM-ERR022 테스트 작성
- [ ] Error Boundary로 보호되는가? → TC-COM-ERR023 테스트 작성
- [ ] 모든 에러 메시지가 한글로 작성되었는가?
- [ ] 에러 발생 시 사용자 데이터가 보존되는가?

---

## References

- 관련 문서: [IPC 표준](../../../doc/core/04_IPC_STANDARDS.md)
- 상위 태스크: [T4-common-scenarios.md](../../../tasks/streams/T4-common-scenarios.md)
- WCAG 2.1 AA: [Error Identification (3.3.1)](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)

---

*Last Updated: 2025-12-23*
