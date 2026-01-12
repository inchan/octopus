# 접근성 공통 시나리오 (Common Accessibility Scenarios)

**Document Version**: 1.0
**Last Updated**: 2025-12-23
**WCAG Standard**: 2.1 AA

---

## Overview

이 문서는 Align Agents v2 애플리케이션의 모든 페이지와 컴포넌트에 적용되는 접근성(Accessibility) 공통 테스트 시나리오를 정의합니다. WCAG 2.1 Level AA 기준을 준수합니다.

### 적용 범위

- 모든 페이지 (Tools, Sync, Rules, MCP 등)
- 모든 대화형 UI 컴포넌트 (버튼, 폼, 모달, 드롭다운 등)
- 동적으로 생성되는 콘텐츠 (알림, 토스트, 라이브 업데이트 등)

### 테스트 도구

- **키보드**: 물리적 키보드 또는 브라우저 DevTools 에뮬레이션
- **스크린 리더**: NVDA (Windows), VoiceOver (macOS), JAWS
- **자동 검사**: axe DevTools, Lighthouse Accessibility Audit
- **색상 대비**: WebAIM Contrast Checker, Chrome DevTools

---

## 1. 키보드 네비게이션 (Keyboard Navigation)

### TC-COM-A11Y001: Tab order logical sequence

- **Description**: Tab 키로 포커스 이동 시 논리적 순서(읽기 순서)를 따르는지 확인
- **WCAG Criterion**: 2.4.3 Focus Order (Level A)
- **Applicable To**: 모든 페이지
- **Preconditions**:
  - 페이지가 완전히 로드됨
  - 모달이나 오버레이가 열려있지 않음
- **Steps**:
  1. 브라우저에서 페이지 로드
  2. 마우스를 사용하지 않고 Tab 키만 사용
  3. 페이지 상단부터 시작하여 Tab을 반복 입력
  4. 포커스가 이동하는 순서를 관찰
- **Expected Result**:
  - 포커스가 좌→우, 위→아래 순서로 이동
  - 예상치 못한 위치로 점프하지 않음
  - 모든 대화형 요소(버튼, 링크, 입력 필드)가 도달 가능
  - 숨겨진 요소는 포커스되지 않음
- **Priority**: High

---

### TC-COM-A11Y002: Focus visible indicator

- **Description**: 현재 포커스된 요소가 시각적으로 명확히 구분되는지 확인
- **WCAG Criterion**: 2.4.7 Focus Visible (Level AA)
- **Applicable To**: 모든 대화형 요소
- **Preconditions**:
  - 페이지 로드 완료
- **Steps**:
  1. Tab 키로 각 대화형 요소에 포커스 이동
  2. 포커스 링(outline) 또는 하이라이트가 표시되는지 확인
  3. 다양한 배경색에서 테스트 (밝은 배경, 어두운 배경)
- **Expected Result**:
  - 모든 포커스된 요소에 뚜렷한 시각적 표시 존재
  - 포커스 링 색상 대비가 3:1 이상 (WCAG 2.4.11 기준)
  - 기본 브라우저 outline이 제거되지 않았거나, 대체 스타일이 제공됨
  - 커스텀 포커스 스타일이 모든 상태(hover, active, disabled)에서 작동
- **Priority**: High

---

### TC-COM-A11Y003: Keyboard trap prevention

- **Description**: 키보드만으로 포커스가 특정 영역에 갇히지 않고 빠져나올 수 있는지 확인
- **WCAG Criterion**: 2.1.2 No Keyboard Trap (Level A)
- **Applicable To**: 모달, 드롭다운, 사이드바, 오버레이 등 모든 동적 UI
- **Preconditions**:
  - 모달 또는 오버레이가 열려 있음
- **Steps**:
  1. 키보드로 모달 열기 (예: Enter 키)
  2. Tab/Shift+Tab으로 모달 내부 요소 탐색
  3. Esc 키 또는 "닫기" 버튼으로 모달 닫기 시도
  4. 모달이 닫힌 후 포커스가 원래 위치로 돌아가는지 확인
- **Expected Result**:
  - Tab 키로 모달 내부를 순환하되, 모달 밖으로 빠져나가지 않음 (포커스 트랩 허용)
  - Esc 키 또는 명시적 닫기 버튼으로 모달 탈출 가능
  - 모달 닫힌 후 포커스가 모달을 연 트리거 요소로 복귀
  - 일반 페이지에서는 포커스 트랩 없음
- **Priority**: Critical

---

### TC-COM-A11Y004: Skip links

- **Description**: 반복되는 네비게이션 블록을 건너뛸 수 있는 링크 제공 여부 확인
- **WCAG Criterion**: 2.4.1 Bypass Blocks (Level A)
- **Applicable To**: 사이드바가 있는 모든 페이지
- **Preconditions**:
  - 페이지 로드 완료
- **Steps**:
  1. 페이지 로드 후 첫 번째 Tab 키 입력
  2. "본문으로 건너뛰기" 또는 "메인 콘텐츠로 건너뛰기" 링크가 나타나는지 확인
  3. Enter 키로 링크 활성화
  4. 포커스가 메인 콘텐츠로 이동하는지 확인
- **Expected Result**:
  - 첫 Tab에서 Skip link가 시각적으로 표시됨
  - Enter 키로 활성화 시 사이드바를 건너뛰고 메인 콘텐츠로 포커스 이동
  - Skip link는 숨겨져 있다가 포커스 시에만 표시 가능 (권장)
- **Priority**: Medium

---

## 2. 스크린 리더 호환성 (Screen Reader Compatibility)

### TC-COM-A11Y011: ARIA labels on interactive elements

- **Description**: 모든 대화형 요소에 적절한 접근 가능한 이름(accessible name) 제공 여부 확인
- **WCAG Criterion**: 4.1.2 Name, Role, Value (Level A)
- **Applicable To**: 버튼, 링크, 폼 컨트롤, 커스텀 컴포넌트
- **Preconditions**:
  - 스크린 리더 활성화 (NVDA, VoiceOver 등)
- **Steps**:
  1. 스크린 리더 실행
  2. Tab 키로 각 대화형 요소에 포커스
  3. 스크린 리더가 읽어주는 내용 확인
- **Expected Result**:
  - 모든 버튼/링크가 명확한 텍스트 라벨 또는 `aria-label` 보유
  - 아이콘 전용 버튼에 `aria-label` 또는 `aria-labelledby` 존재
  - 폼 필드에 `<label>` 또는 `aria-label` 연결
  - 역할(role)이 암묵적 또는 명시적으로 정의됨
  - 예: "저장 버튼", "도구 추가 버튼", "이메일 입력 필드"
- **Priority**: Critical

---

### TC-COM-A11Y012: Live region announcements

- **Description**: 동적으로 변경되는 콘텐츠(토스트, 알림 등)가 스크린 리더에 자동 읽힘 확인
- **WCAG Criterion**: 4.1.3 Status Messages (Level AA)
- **Applicable To**: 토스트 메시지, 알림, 에러 메시지, 로딩 상태
- **Preconditions**:
  - 스크린 리더 활성화
  - 동적 콘텐츠가 발생하는 액션 준비 (예: 저장 버튼 클릭)
- **Steps**:
  1. 스크린 리더 실행
  2. 동적 변화를 유발하는 액션 수행 (예: 도구 저장)
  3. 스크린 리더가 변화를 알리는지 확인
- **Expected Result**:
  - 성공 메시지: `role="status"` 또는 `aria-live="polite"` 사용
  - 에러 메시지: `role="alert"` 또는 `aria-live="assertive"` 사용
  - 스크린 리더가 "도구가 저장되었습니다" 등을 자동 읽음
  - 사용자가 포커스를 옮기지 않아도 알림 청취 가능
- **Priority**: High

---

### TC-COM-A11Y013: Heading hierarchy

- **Description**: 페이지 제목과 섹션 제목이 올바른 계층 구조(`<h1>`~`<h6>`)를 따르는지 확인
- **WCAG Criterion**: 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)
- **Applicable To**: 모든 페이지
- **Preconditions**:
  - 페이지 로드 완료
- **Steps**:
  1. axe DevTools 또는 WAVE 도구 실행
  2. Heading 구조 분석
  3. 스크린 리더 헤딩 네비게이션 모드 사용 (H 키)
- **Expected Result**:
  - 페이지당 `<h1>` 태그 1개만 존재
  - 하위 제목이 순차적 레벨 증가 (`<h2>`, `<h3>`, ...)
  - 레벨 건너뛰기 없음 (예: `<h2>` 다음 바로 `<h4>` 금지)
  - 모든 섹션이 의미 있는 제목으로 구분됨
- **Priority**: Medium

---

## 3. 시각적 접근성 (Visual Accessibility)

### TC-COM-A11Y021: Color contrast ratio (4.5:1)

- **Description**: 텍스트와 배경 간 색상 대비가 WCAG 기준을 충족하는지 확인
- **WCAG Criterion**: 1.4.3 Contrast (Minimum) (Level AA)
- **Applicable To**: 모든 텍스트, 아이콘, 버튼 라벨
- **Preconditions**:
  - 페이지 로드 완료
  - 다양한 테마(라이트/다크) 테스트
- **Steps**:
  1. Chrome DevTools 또는 WebAIM Contrast Checker 사용
  2. 각 텍스트 요소의 색상 대비 측정
  3. 18pt 미만 일반 텍스트: 4.5:1 이상 확인
  4. 18pt 이상 또는 bold 14pt 이상: 3:1 이상 확인
- **Expected Result**:
  - 본문 텍스트: 대비 4.5:1 이상
  - 대형 텍스트: 대비 3:1 이상
  - 비활성(disabled) 요소는 예외 가능
  - 버튼 텍스트, 링크 텍스트 모두 기준 충족
- **Priority**: High
- **Test Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### TC-COM-A11Y022: Text resizing support

- **Description**: 텍스트 크기를 200%까지 확대했을 때도 콘텐츠가 읽기 가능하고 기능 유지되는지 확인
- **WCAG Criterion**: 1.4.4 Resize Text (Level AA)
- **Applicable To**: 모든 페이지, 모든 텍스트 콘텐츠
- **Preconditions**:
  - 브라우저 확대/축소 100% 상태
- **Steps**:
  1. 브라우저 확대 기능 사용 (Ctrl/Cmd + "+")
  2. 200%까지 확대 (2단계 정도)
  3. 모든 텍스트가 읽기 가능한지 확인
  4. 레이아웃이 깨지지 않는지 확인
- **Expected Result**:
  - 모든 텍스트가 200%까지 확대 가능
  - 텍스트가 잘리거나 겹치지 않음
  - 가로 스크롤이 필요할 수 있으나, 콘텐츠는 여전히 접근 가능
  - 버튼, 입력 필드도 확대되어 사용 가능
- **Priority**: Medium

---

### TC-COM-A11Y023: Motion reduction respect

- **Description**: 사용자의 애니메이션 감소 설정(`prefers-reduced-motion`)을 존중하는지 확인
- **WCAG Criterion**: 2.3.3 Animation from Interactions (Level AAA - 권장)
- **Applicable To**: 애니메이션이 있는 모든 UI (페이지 전환, 모달, 토스트 등)
- **Preconditions**:
  - OS 설정에서 "애니메이션 줄이기" 활성화
  - Windows: 설정 > 접근성 > 시각 효과
  - macOS: 시스템 환경설정 > 손쉬운 사용 > 디스플레이 > "움직임 줄이기"
- **Steps**:
  1. OS에서 "애니메이션 줄이기" 설정 활성화
  2. 애플리케이션 재시작 또는 새로고침
  3. 페이지 전환, 모달 열기/닫기 등 애니메이션 트리거
  4. 애니메이션 동작 관찰
- **Expected Result**:
  - `prefers-reduced-motion: reduce` 감지 시 애니메이션 비활성화 또는 단순화
  - 페이지 전환이 즉시 발생 (fade/slide 효과 제거)
  - 모션이 필수 기능이 아님 (애니메이션 없이도 사용 가능)
  - 스피너나 프로그레스바는 예외 가능 (정보 전달 목적)
- **Priority**: Low
- **CSS Example**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

---

## 4. 테스트 자동화 권장사항

### 자동 검사 도구

| 도구 | 용도 | 실행 시점 |
|------|------|----------|
| axe DevTools | 전체 접근성 스캔 | CI/CD, 수동 검증 |
| Lighthouse Accessibility | 자동 점수 측정 | PR 체크 |
| eslint-plugin-jsx-a11y | React 코드 린팅 | 개발 중 실시간 |
| Playwright axe | E2E 테스트 통합 | 자동화 테스트 |

### E2E 테스트 예시 (Playwright + axe)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Tools page should have no accessibility violations', async ({ page }) => {
  await page.goto('/tools');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

## 5. 우선순위 가이드

| Priority | 기준 | WCAG Level |
|----------|------|------------|
| **Critical** | 법적 필수 준수, 기능 접근 불가 | Level A |
| **High** | 사용성에 심각한 영향 | Level AA |
| **Medium** | 사용성 개선 | Level AA |
| **Low** | 추가 개선 사항 | Level AAA |

---

## 6. 메뉴별 적용 방법

각 메뉴의 시나리오 문서에서 다음과 같이 참조:

```markdown
## 10. Common Scenarios

이 메뉴에 적용되는 공통 시나리오는 아래 문서를 참조하세요:

- [접근성](../common/accessibility.md)
  - TC-COM-A11Y001~004: 키보드 네비게이션 (전체 적용)
  - TC-COM-A11Y011~013: 스크린 리더 (전체 적용)
  - TC-COM-A11Y021~023: 시각적 접근성 (전체 적용)

### 메뉴별 추가 요구사항

- (있을 경우) 메뉴 특화 접근성 시나리오 기술
```

---

## 7. 참고 자료

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

*Last Updated: 2025-12-23*
