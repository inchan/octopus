# 5. E2E 테스트 표준 (E2E Testing Standards)

## 5.1 핵심 원칙 (Core Principles)

### 5.1.1 테스트 격리 (Test Isolation)
- 각 테스트는 완전히 독립적으로 실행되어야 합니다.
- 테스트 간 상태 공유 금지 - 이전 테스트의 결과가 다음 테스트에 영향을 주면 안 됩니다.
- 테스트 데이터는 각 테스트에서 생성하고, 종료 시 정리합니다.

### 5.1.2 안정성 우선 (Stability First)
- **Flaky Test는 없는 것보다 나쁩니다** - 신뢰할 수 없는 테스트는 팀의 피로도를 높입니다.
- 모든 테스트는 로컬과 CI에서 동일하게 통과해야 합니다.
- 실패 시 원인 파악이 가능하도록 명확한 assertion을 사용합니다.

---

## 5.2 절대 금지 사항 (Never Do This)

| 금지 패턴 | 이유 | 대안 |
|-----------|------|------|
| `waitForTimeout(ms)` | 환경마다 속도가 달라 실패 유발 | `waitForSelector`, `toBeVisible` 등 조건부 대기 |
| CSS 클래스 셀렉터 (`.btn-primary`) | 스타일 리팩토링 시 테스트 깨짐 | `data-testid` 사용 |
| 동적 ID 셀렉터 (`#item-${uuid}`) | 매 실행마다 값이 변경됨 | `data-testid` 패턴 사용 |
| 테스트 내 하드코딩 문자열 | 번역/문구 변경 시 깨짐 | 핵심 요소는 `data-testid` 사용 |
| 순서 의존 셀렉터 (`:nth-child(3)`) | DOM 구조 변경 시 깨짐 | 명시적 `data-testid` |

### 5.2.1 금지 코드 예시
```typescript
// ❌ 절대 금지
await page.waitForTimeout(1000);
await page.click('.p-2.space-y-1 div');
await page.locator(':nth-child(3)').click();

// ✅ 올바른 방법
await expect(page.getByTestId('rules-list-item')).toBeVisible();
await page.getByTestId('rules-list-item').click();
```

---

## 5.3 셀렉터 우선순위 (Selector Priority)

Playwright 공식 권장사항과 프로젝트 특성을 반영한 우선순위:

| 순위 | 셀렉터 | 사용 시점 | 예시 |
|------|--------|-----------|------|
| 1 | `getByTestId()` | **기본값** - 모든 인터랙션 요소 | `getByTestId('sync-start-button')` |
| 2 | `getByRole()` | 접근성이 중요한 요소 | `getByRole('button', { name: 'Submit' })` |
| 3 | `getByLabel()` | 폼 입력 필드 | `getByLabel('Email')` |
| 4 | `getByText()` | 정적 콘텐츠 확인 (assertion용) | `expect(page.getByText('Success'))` |

### 5.3.1 왜 `data-testid`가 최우선인가?
- **안정성**: UI 변경에 영향받지 않음
- **명시성**: 테스트 목적임을 코드에서 명확히 표현
- **협업**: 개발자가 실수로 변경할 가능성 낮음
- **다국어**: 번역에 영향받지 않음

---

## 5.4 data-testid 네이밍 컨벤션 (Naming Convention)

### 5.4.1 패턴
```
{feature}-{component}-{element}
```

### 5.4.2 규칙
- **소문자 케밥 케이스** 사용 (`rules-editor-save-button`)
- **feature**: 도메인/기능 영역 (rules, sync, mcp, settings, history)
- **component**: 컴포넌트 또는 섹션 이름 (list, editor, dialog, preview)
- **element**: 구체적 요소 (button, input, item, count)

### 5.4.3 예시
```typescript
// 페이지/섹션 레벨
data-testid="rules-page"
data-testid="sync-preview-dialog"

// 목록 아이템
data-testid="rules-list-item"           // 개별 아이템
data-testid="rules-list-item-name"      // 아이템 내 이름 영역
data-testid="rules-list-count"          // 목록 개수 표시

// 버튼/액션
data-testid="rules-editor-save-button"
data-testid="rules-editor-delete-button"
data-testid="sync-start-button"
data-testid="sync-preview-confirm-button"

// 입력 필드
data-testid="rules-editor-name-input"
data-testid="rules-editor-content-textarea"
```

### 5.4.4 컴포넌트에 적용
```tsx
// ✅ 올바른 적용
<Button data-testid="rules-editor-save-button">Save</Button>
<Input data-testid="rules-editor-name-input" name="name" />

// ✅ 동적 아이템 - 고유 식별자 포함
<div data-testid={`rules-list-item-${rule.id}`}>
  <span data-testid={`rules-list-item-${rule.id}-name`}>{rule.name}</span>
</div>
```

---

## 5.5 Page Object Model (POM) 구조

### 5.5.1 디렉토리 구조
```
e2e/
├── pages/                    # Page Object 클래스
│   ├── base.page.ts         # 공통 기능 (navigation, wait 등)
│   ├── rules.page.ts        # Rules 페이지 POM
│   ├── sync.page.ts         # Sync 페이지 POM
│   ├── mcp.page.ts          # MCP 페이지 POM
│   └── settings.page.ts     # Settings 페이지 POM
├── fixtures/                 # Playwright Fixtures
│   ├── test.fixture.ts      # 확장된 test fixture
│   └── mock-api.fixture.ts  # API Mock fixture
├── utils/                    # 유틸리티
│   └── test-ids.ts          # data-testid 상수 정의
├── rules.spec.ts            # 테스트 파일
├── sync.spec.ts
└── ...
```

### 5.5.2 Base Page 예시
```typescript
// e2e/pages/base.page.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  // 공통 네비게이션
  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  // 공통 대기 - waitForTimeout 대신 사용
  async waitForElement(testId: string) {
    await this.page.getByTestId(testId).waitFor({ state: 'visible' });
  }
}
```

### 5.5.3 Page Object 예시
```typescript
// e2e/pages/rules.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID } from '../utils/test-ids';

export class RulesPage extends BasePage {
  // Locators - 모든 셀렉터를 여기서 관리
  readonly page: Page;
  readonly newButton: Locator;
  readonly listItems: Locator;
  readonly listCount: Locator;
  readonly editor: {
    nameInput: Locator;
    contentTextarea: Locator;
    saveButton: Locator;
    deleteButton: Locator;
  };

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.newButton = page.getByTestId(TESTID.RULES.NEW_BUTTON);
    this.listItems = page.getByTestId(TESTID.RULES.LIST_ITEM);
    this.listCount = page.getByTestId(TESTID.RULES.LIST_COUNT);
    this.editor = {
      nameInput: page.getByTestId(TESTID.RULES.EDITOR_NAME_INPUT),
      contentTextarea: page.getByTestId(TESTID.RULES.EDITOR_CONTENT_TEXTAREA),
      saveButton: page.getByTestId(TESTID.RULES.EDITOR_SAVE_BUTTON),
      deleteButton: page.getByTestId(TESTID.RULES.EDITOR_DELETE_BUTTON),
    };
  }

  // Actions - 비즈니스 동작을 메서드로 캡슐화
  async goto() {
    await this.navigateTo('/');
    await this.page.getByTestId('nav-rules').click();
  }

  async createRule(name: string, content: string) {
    await this.newButton.click();
    await this.editor.nameInput.fill(name);
    await this.editor.contentTextarea.fill(content);
    await this.editor.saveButton.click();
  }

  async deleteRule() {
    await this.editor.deleteButton.click();
    await this.page.getByTestId('dialog-confirm-button').click();
  }

  // Assertions - 검증 로직
  async expectRuleCount(count: number) {
    await expect(this.listCount).toHaveText(`(${count})`);
  }

  async expectRuleVisible(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }
}
```

### 5.5.4 테스트 파일 예시
```typescript
// e2e/rules.spec.ts
import { test, expect } from '@playwright/test';
import { RulesPage } from './pages/rules.page';

test.describe('Rules Management', () => {
  let rulesPage: RulesPage;

  test.beforeEach(async ({ page }) => {
    rulesPage = new RulesPage(page);
    await rulesPage.goto();
  });

  test('should create and delete a rule', async () => {
    // Create
    await rulesPage.createRule('Test Rule', 'Test Content');
    await rulesPage.expectRuleCount(1);
    await rulesPage.expectRuleVisible('Test Rule');

    // Delete
    await rulesPage.deleteRule();
    await rulesPage.expectRuleCount(0);
  });
});
```

---

## 5.6 Test ID 상수 관리

### 5.6.1 상수 파일
```typescript
// e2e/utils/test-ids.ts
export const TESTID = {
  // Navigation
  NAV: {
    RULES: 'nav-rules',
    SYNC: 'nav-sync',
    MCP: 'nav-mcp',
    SETTINGS: 'nav-settings',
  },

  // Rules Feature
  RULES: {
    PAGE: 'rules-page',
    NEW_BUTTON: 'rules-new-button',
    LIST_ITEM: 'rules-list-item',
    LIST_COUNT: 'rules-list-count',
    EDITOR_NAME_INPUT: 'rules-editor-name-input',
    EDITOR_CONTENT_TEXTAREA: 'rules-editor-content-textarea',
    EDITOR_SAVE_BUTTON: 'rules-editor-save-button',
    EDITOR_DELETE_BUTTON: 'rules-editor-delete-button',
  },

  // Sync Feature
  SYNC: {
    PAGE: 'sync-page',
    START_BUTTON: 'sync-start-button',
    PREVIEW_DIALOG: 'sync-preview-dialog',
    PREVIEW_CONFIRM_BUTTON: 'sync-preview-confirm-button',
    COLUMN_TOOLS: 'sync-column-tools',
    COLUMN_RULES: 'sync-column-rules',
    COLUMN_MCP: 'sync-column-mcp',
  },

  // Common
  DIALOG: {
    CONFIRM_BUTTON: 'dialog-confirm-button',
    CANCEL_BUTTON: 'dialog-cancel-button',
  },
} as const;
```

### 5.6.2 프론트엔드에서도 동일 상수 사용 (권장)
```typescript
// shared/test-ids.ts - 프론트엔드와 E2E에서 공유
// 빌드 시 E2E에서 import 가능하도록 설정
```

---

## 5.7 Mock API 전략

### 5.7.1 Fixture 기반 Mock
```typescript
// e2e/fixtures/mock-api.fixture.ts
import { test as base } from '@playwright/test';

type MockApiFixture = {
  setupMockApi: () => Promise<void>;
};

export const test = base.extend<MockApiFixture>({
  setupMockApi: async ({ page }, use) => {
    const setup = async () => {
      await page.addInitScript(() => {
        window.api = {
          rules: {
            list: async () => ({ success: true, data: [] }),
            create: async (data) => ({ success: true, data: { id: 'new-id', ...data } }),
            update: async (id, data) => ({ success: true, data: { id, ...data } }),
            delete: async (id) => ({ success: true }),
          },
          // ... 다른 API들
        };
      });
    };
    await use(setup);
  },
});

export { expect } from '@playwright/test';
```

### 5.7.2 사용법
```typescript
// e2e/rules.spec.ts
import { test, expect } from './fixtures/mock-api.fixture';

test.beforeEach(async ({ setupMockApi }) => {
  await setupMockApi();
});
```

---

## 5.8 CI 환경 설정

### 5.8.1 playwright.config.ts 권장 설정
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // data-testid 속성 이름 설정
    testIdAttribute: 'data-testid',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'VITE_USE_MOCK=true npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

---

## 5.9 마이그레이션 체크리스트

기존 테스트 파일을 이 표준으로 마이그레이션할 때 확인할 사항:

- [ ] `waitForTimeout()` 모두 제거
- [ ] CSS 클래스 셀렉터를 `data-testid`로 변경
- [ ] 텍스트 기반 셀렉터를 `data-testid`로 변경
- [ ] Page Object 클래스 생성
- [ ] 컴포넌트에 `data-testid` 속성 추가
- [ ] Mock API를 fixture로 이동
- [ ] 테스트 파일에서 POM 사용

---

## 5.10 참고 자료 (References)

- [Playwright Best Practices (공식)](https://playwright.dev/docs/best-practices)
- [Page Object Model (공식)](https://playwright.dev/docs/pom)
- [BetterStack Playwright Guide](https://betterstack.com/community/guides/testing/playwright-best-practices/)
- [Houseful Playwright Standards](https://www.houseful.blog/posts/2023/playwright-standards/)
