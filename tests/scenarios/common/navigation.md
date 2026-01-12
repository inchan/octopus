# Common Scenarios: Navigation

## Overview
앱 전체 네비게이션 관련 공통 시나리오를 정의합니다.

## 1. Sidebar Navigation

### TC-COM-NAV001: Sidebar menu item click
- **Description**: 사이드바 메뉴 아이템 클릭 시 해당 페이지로 정상 이동하는지 검증
- **Applicable To**: 모든 메뉴 페이지
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 사이드바가 표시된 상태
- **Steps**:
  1. 사이드바에서 임의의 메뉴 아이템 클릭
  2. 페이지 전환 확인
  3. URL 변경 확인
  4. 페이지 콘텐츠 로드 확인
- **Expected Result**:
  - 클릭한 메뉴에 해당하는 페이지로 즉시 전환
  - URL이 해당 페이지 경로로 변경 (예: `/tools`, `/sync`)
  - 페이지 콘텐츠가 정상적으로 렌더링
  - 에러 메시지 없음
- **Priority**: High

### TC-COM-NAV002: Active menu highlighting
- **Description**: 현재 활성화된 페이지에 해당하는 메뉴 아이템이 시각적으로 강조 표시되는지 검증
- **Applicable To**: 모든 메뉴 페이지
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 임의의 페이지에 위치한 상태
- **Steps**:
  1. 현재 페이지에 해당하는 사이드바 메뉴 아이템 확인
  2. 해당 메뉴 아이템의 시각적 스타일 확인
  3. 다른 메뉴로 이동
  4. 이전 메뉴의 강조 표시가 해제되고 새 메뉴가 강조되는지 확인
- **Expected Result**:
  - 현재 페이지 메뉴 아이템에 활성화 스타일 적용 (배경색, 아이콘 색상 등)
  - 다른 메뉴 아이템은 비활성화 스타일 유지
  - 페이지 전환 시 활성화 표시가 즉시 업데이트
- **Priority**: Medium

### TC-COM-NAV003: Menu collapse/expand
- **Description**: 사이드바 축소/확장 기능이 정상 동작하는지 검증 (해당되는 경우)
- **Applicable To**: 사이드바 축소 기능이 있는 모든 페이지
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 사이드바가 확장된 상태
- **Steps**:
  1. 사이드바 축소 버튼 클릭
  2. 사이드바 너비 및 콘텐츠 변화 확인
  3. 메인 콘텐츠 영역 너비 조정 확인
  4. 다시 확장 버튼 클릭
  5. 사이드바가 원래 상태로 복원되는지 확인
- **Expected Result**:
  - 축소 시: 사이드바 너비 감소, 텍스트 숨김, 아이콘만 표시
  - 확장 시: 사이드바 원래 너비 복원, 텍스트 표시
  - 애니메이션 부드럽게 동작 (transition 적용)
  - 메인 콘텐츠 영역이 사이드바 변화에 맞춰 자동 조정
  - 사용자 설정이 로컬 스토리지에 저장되어 재시작 후에도 유지
- **Priority**: Low

## 2. Page Transitions

### TC-COM-NAV011: Route change animation
- **Description**: 페이지 전환 시 애니메이션이 부드럽게 적용되는지 검증
- **Applicable To**: 모든 페이지 간 전환
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 임의의 페이지에 위치한 상태
- **Steps**:
  1. 다른 메뉴로 이동
  2. 페이지 전환 애니메이션 관찰
  3. 브라우저 개발자 도구에서 렌더링 성능 확인
- **Expected Result**:
  - 페이지 전환 시 fade-in/fade-out 또는 슬라이드 애니메이션 적용
  - 애니메이션 지속 시간: 200~300ms (사용자가 지연을 느끼지 않는 수준)
  - 애니메이션 중 레이아웃 깨짐 없음
  - 60fps 이상 유지 (렌더링 성능 저하 없음)
- **Priority**: Medium

### TC-COM-NAV012: Deep link navigation
- **Description**: 딥링크(특정 페이지 URL)를 통한 직접 접근이 정상 동작하는지 검증
- **Applicable To**: 모든 메뉴 페이지
- **Preconditions**:
  - 애플리케이션이 실행되지 않은 상태 또는 다른 페이지에 위치한 상태
- **Steps**:
  1. 브라우저 주소창에 특정 페이지 URL 입력 (예: `http://localhost:5173/tools`)
  2. Enter 키 입력
  3. 페이지 로드 확인
  4. URL과 실제 페이지 콘텐츠 일치 확인
- **Expected Result**:
  - 해당 URL에 맞는 페이지가 즉시 로드
  - 사이드바 활성화 표시가 해당 메뉴로 설정
  - 페이지 초기화 데이터가 정상 로드 (IPC 호출 정상 동작)
  - 인증이 필요한 경우 로그인 페이지로 리다이렉트 (해당 시)
- **Priority**: High

### TC-COM-NAV013: Page state preservation
- **Description**: 페이지를 떠났다가 다시 돌아왔을 때 이전 상태가 유지되는지 검증
- **Applicable To**: 상태 보존이 필요한 페이지 (Tools, Sync, MCP 등)
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 특정 페이지에서 사용자 입력/선택 작업 수행
- **Steps**:
  1. 페이지에서 작업 수행 (예: 필터 선택, 검색어 입력)
  2. 다른 페이지로 이동
  3. 다시 원래 페이지로 돌아오기
  4. 이전 상태 확인 (필터, 검색어, 스크롤 위치 등)
- **Expected Result**:
  - 필터/검색어 등 사용자 입력값이 유지됨 (TanStack Query 캐시 활용)
  - 스크롤 위치는 상단으로 리셋 (UX 일관성 유지)
  - 저장되지 않은 임시 데이터(draft)는 경고 메시지와 함께 보존 여부 확인 (해당 시)
- **Priority**: Medium
- **Note**: 장시간(5분 이상) 후 복귀 시 데이터 재검증 필요 (staleTime 설정에 따름)

## 3. Browser History

### TC-COM-NAV021: Back button behavior
- **Description**: 브라우저 뒤로가기 버튼이 정상 동작하는지 검증
- **Applicable To**: 모든 페이지
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 최소 2개 이상의 페이지를 방문한 상태
- **Steps**:
  1. 페이지 A → 페이지 B로 이동
  2. 브라우저 뒤로가기 버튼 클릭
  3. 페이지 A로 복귀하는지 확인
  4. URL 확인
- **Expected Result**:
  - 이전 페이지로 정상 복귀
  - URL이 이전 페이지 경로로 변경
  - 페이지 콘텐츠가 정상 렌더링
  - 사이드바 활성화 표시가 현재 페이지로 업데이트
  - 히스토리 스택에서 정상적으로 pop 동작
- **Priority**: High

### TC-COM-NAV022: Forward button behavior
- **Description**: 브라우저 앞으로가기 버튼이 정상 동작하는지 검증
- **Applicable To**: 모든 페이지
- **Preconditions**:
  - 애플리케이션이 실행된 상태
  - 뒤로가기를 1회 이상 수행한 상태
- **Steps**:
  1. 페이지 A → 페이지 B로 이동
  2. 뒤로가기로 페이지 A로 복귀
  3. 브라우저 앞으로가기 버튼 클릭
  4. 페이지 B로 다시 이동하는지 확인
- **Expected Result**:
  - 다음 페이지로 정상 이동
  - URL이 다음 페이지 경로로 변경
  - 페이지 콘텐츠가 정상 렌더링
  - 사이드바 활성화 표시가 현재 페이지로 업데이트
- **Priority**: Medium

### TC-COM-NAV023: Direct URL access
- **Description**: URL을 직접 입력하여 페이지 접근 시 정상 동작하는지 검증 (TC-COM-NAV012와 유사하나, 애플리케이션 실행 중 동작 검증)
- **Applicable To**: 모든 페이지
- **Preconditions**:
  - 애플리케이션이 실행 중인 상태
  - 임의의 페이지에 위치한 상태
- **Steps**:
  1. 브라우저 주소창에 다른 페이지 URL 직접 입력
  2. Enter 키 입력
  3. 페이지 전환 확인
- **Expected Result**:
  - 해당 URL의 페이지로 즉시 이동
  - 히스토리 스택에 새 항목 추가 (뒤로가기로 이전 페이지 복귀 가능)
  - 페이지 콘텐츠 정상 렌더링
  - 잘못된 URL 입력 시 404 페이지 또는 기본 페이지로 리다이렉트
- **Priority**: Medium

---

## 적용 예시

각 메뉴 테스트 시나리오 파일에서 아래와 같이 참조하세요:

```markdown
## 10. Common Scenarios

이 메뉴에 적용되는 공통 시나리오는 아래 문서를 참조하세요:

- [네비게이션](../common/navigation.md)
  - ✅ TC-COM-NAV001~NAV003 (사이드바)
  - ✅ TC-COM-NAV011~NAV013 (페이지 전환)
  - ✅ TC-COM-NAV021~NAV023 (브라우저 히스토리)

### 메뉴별 예외 사항

- TC-COM-NAV013: Tools 메뉴는 선택된 도구(Tool) 상태도 보존해야 함
```

---

## 관련 문서

- [에러 처리](./error-handling.md)
- [접근성](./accessibility.md)
- [성능](./performance.md)
- [공통 시나리오 개요](./README.md)

---

*Last Updated: 2025-12-23*
