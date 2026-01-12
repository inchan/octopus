/**
 * Rules Page Object
 *
 * Rules 기능의 3-Pane 레이아웃을 테스트하기 위한 Page Object
 * - Pane 1: Rule Set 목록
 * - Pane 2: 선택된 Set의 상세 (포함된 규칙들)
 * - Pane 3: 전체 Rule Pool
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID, testId } from '../utils/test-ids';

export class RulesPage extends BasePage {
  // ===========================================
  // Locators - Pane 1: Set List
  // ===========================================
  readonly setList: Locator;
  readonly setNewButton: Locator;
  readonly setCreateInput: Locator;
  readonly setCreateSubmit: Locator;
  readonly setCreateCancel: Locator;

  // ===========================================
  // Locators - Pane 2: Set Detail
  // ===========================================
  readonly setDetail: Locator;
  readonly setDetailTitle: Locator;
  readonly setDetailDelete: Locator;

  // ===========================================
  // Locators - Pane 3: Rule Pool
  // ===========================================
  readonly pool: Locator;
  readonly poolNewButton: Locator;
  readonly poolImportButton: Locator;
  readonly editorNameInput: Locator;
  readonly editorContentTextarea: Locator;
  readonly editorSaveButton: Locator;
  readonly editorDeleteButton: Locator;

  constructor(page: Page) {
    super(page);

    // Pane 1
    this.setList = page.getByTestId(TESTID.RULES.SET_LIST);
    this.setNewButton = page.getByTestId(TESTID.RULES.SET_NEW_BUTTON);
    this.setCreateInput = page.getByTestId(TESTID.RULES.SET_CREATE_INPUT);
    this.setCreateSubmit = page.getByTestId(TESTID.RULES.SET_CREATE_SUBMIT);
    this.setCreateCancel = page.getByTestId(TESTID.RULES.SET_CREATE_CANCEL);

    // Pane 2
    this.setDetail = page.getByTestId(TESTID.RULES.SET_DETAIL);
    this.setDetailTitle = page.getByTestId(TESTID.RULES.SET_DETAIL_TITLE);
    this.setDetailDelete = page.getByTestId(TESTID.RULES.SET_DETAIL_DELETE);

    // Pane 3
    this.pool = page.getByTestId(TESTID.RULES.POOL);
    this.poolNewButton = page.getByTestId(TESTID.RULES.POOL_NEW_BUTTON);
    this.poolImportButton = page.getByTestId('rules-import-button');
    this.editorNameInput = page.getByTestId(TESTID.RULES.EDITOR_NAME_INPUT);
    this.editorContentTextarea = page.getByTestId(TESTID.RULES.EDITOR_CONTENT_TEXTAREA);
    this.editorSaveButton = page.getByTestId(TESTID.RULES.EDITOR_SAVE_BUTTON);
    this.editorDeleteButton = page.getByTestId(TESTID.RULES.EDITOR_DELETE_BUTTON);
  }

  // ===========================================
  // Navigation
  // ===========================================

  async goto() {
    await this.page.goto('/');
    await this.navigateToRules();
  }

  async navigate() {
    await this.goto();
  }

  // ===========================================
  // Actions - Rule Set
  // ===========================================

  /**
   * 새 Rule Set 생성
   * @returns 생성된 Set의 이름 (검증용)
   */
  async createRuleSet(name: string): Promise<string> {
    await this.setNewButton.click();
    await expect(this.setCreateInput).toBeVisible();
    await this.setCreateInput.fill(name);
    await this.setCreateSubmit.click();

    // 생성 완료 대기 - 입력 폼이 사라지는 것으로 확인
    await expect(this.setCreateInput).toBeHidden();

    return name;
  }

  /**
   * Rule Set 선택
   */
  async selectRuleSet(setId: string) {
    const setItem = this.page.getByTestId(testId.rulesSetItem(setId));
    await setItem.click();

    // 선택 상태 확인 - Set Detail에 제목이 표시되는 것으로 확인
    await expect(this.setDetail).toBeVisible();
  }

  /**
   * Rule Set 선택 (이름으로)
   */
  async selectRuleSetByName(name: string) {
    // Set 목록에서 해당 이름을 가진 아이템의 부모 요소 클릭
    const nameElement = this.setList.locator('[data-testid$="-name"]').filter({
      hasText: name,
    });
    // 부모 요소(실제 클릭 대상) 클릭
    await nameElement.click();
    await expect(this.setDetail).toBeVisible();
  }

  /**
   * 선택된 Rule Set 삭제
   */
  async deleteSelectedRuleSet() {
    await this.setDetailDelete.click();
    // AlertDialog 확인 버튼 클릭
    await this.page.getByTestId(TESTID.ALERT_DIALOG.CONFIRM_BUTTON).click();
    // Set Detail이 초기 상태로 돌아감
    await expect(this.setDetailTitle).toBeHidden();
  }

  // ===========================================
  // Actions - Rule (Pool)
  // ===========================================

  /**
   * 새 Rule 생성
   * @returns 생성된 Rule의 이름 (검증용)
   */
  async createRule(name: string, content: string): Promise<string> {
    await this.poolNewButton.click();
    await expect(this.editorNameInput).toBeVisible();
    await this.editorNameInput.fill(name);
    await this.editorContentTextarea.fill(content);
    await this.editorSaveButton.click();

    // 저장 완료 대기 - Pool에서 해당 이름의 -name 요소가 보이는지 확인
    await expect(
      this.pool.locator('[data-testid$="-name"]').filter({ hasText: name })
    ).toBeVisible();

    return name;
  }

  /**
   * Rule 선택 (Pool에서)
   */
  /**
   * Rule 선택 (Pool에서)
   */
  async selectRuleFromPool(ruleId: string) {
    const ruleItem = this.page.getByTestId(testId.rulesPoolItem(ruleId));
    await ruleItem.click();
  }

  /**
   * Rule 선택 (이름으로)
   */
  async selectRuleByName(name: string) {
    const ruleItem = this.pool.locator(`[data-testid^="${TESTID.RULES.POOL_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: name })
    }).first();
    await ruleItem.click();
  }

  /**
   * Rule을 Set에 추가 (이름으로)
   * UI가 변경되어 선택(Select) 후 추가가 아닌, 리스트 아이템의 + 버튼을 직접 클릭함
   */
  async addRuleToSetByName(name: string) {
    // 해당 이름을 가진 아이템 찾기
    const ruleItem = this.pool.locator(`[data-testid^="${TESTID.RULES.POOL_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: name })
    }).first();

    // 아이템 내의 추가 버튼 찾아서 클릭
    const addButton = ruleItem.locator('[data-testid^="rules-pool-add-to-set-"]');
    await addButton.click();
  }

  /**
   * Rule Set 이름 변경
   */
  async renameRuleSet(newName: string) {
    await this.setDetailTitle.click();
    const input = this.setDetail.locator('input');
    await input.fill(newName);
    await input.press('Enter');
    await expect(this.setDetailTitle).toHaveText(newName);
  }

  /**
   * Rule Edit Dialog 열기 (공통 로직)
   * @private
   */
  private async openRuleEditDialog(name: string) {
    const ruleItem = this.pool.locator(`[data-testid^="${TESTID.RULES.POOL_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: name })
    }).first();

    // Item 내의 more 버튼 클릭
    await ruleItem.hover();
    await ruleItem.locator('[data-testid$="-more"]').click();

    // 팝오버에서 Edit 클릭
    await this.page.locator('[data-testid$="-edit"]').filter({ hasText: 'Edit' }).first().click();
  }

  /**
   * Rule 수정
   */
  async updateRule(name: string, updates: { name?: string; content?: string }) {
    // 공통 메서드 사용
    await this.openRuleEditDialog(name);

    // Dialog should be open
    if (updates.name) {
      await this.editorNameInput.fill(updates.name);
    }
    if (updates.content) {
      await this.editorContentTextarea.fill(updates.content);
    }

    // Wait for input to have the new value to avoid race condition
    if (updates.name) {
      await expect(this.editorNameInput).toHaveValue(updates.name);
    }
    if (updates.content) {
      await expect(this.editorContentTextarea).toHaveValue(updates.content);
    }

    await this.editorSaveButton.click();
    // Wait for dialog to close
    await expect(this.editorNameInput).toBeHidden();

    // Verify change is reflected in the pool list
    if (updates.name) {
      await this.expectPoolHasRule(updates.name);
    } else {
      await this.expectPoolHasRule(name);
    }
  }

  /**
   * Rule 활성화 상태 토글
   */
  async toggleRuleStatus(name: string) {
    // 공통 메서드 사용
    await this.openRuleEditDialog(name);

    // Toggle button in dialog
    const toggleBtn = this.page.getByTestId('rules-editor-toggle-active-button');
    const oldTitle = await toggleBtn.getAttribute('title');
    await toggleBtn.click();

    // Wait for button title to change in dialog before saving
    const expectedBtnTitle = oldTitle === 'Archive Rule' ? 'Activate Rule' : 'Archive Rule';
    await expect(toggleBtn).toHaveAttribute('title', expectedBtnTitle);

    await this.editorSaveButton.click();
    await expect(this.editorNameInput).toBeHidden();

    // Verify status reflected in the pool list
    const isActiveAfter = expectedBtnTitle === 'Archive Rule';
    await this.expectRuleStatus(name, isActiveAfter);
  }

  /**
   * Set에서 Rule 제거
   */
  async removeRuleFromSet(ruleName: string) {
    // Set Detail 목록에서 해당 이름을 가진 아이템 찾기
    const ruleItem = this.setDetail.locator('[data-testid^="rules-set-rule-item-"]').filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: ruleName })
    }).first();

    const testIdAttr = await ruleItem.getAttribute('data-testid');
    const ruleId = testIdAttr?.replace('rules-set-rule-item-', '');

    await ruleItem.hover();
    await this.page.getByTestId(`rules-set-rule-remove-${ruleId}`).click();
    await expect(ruleItem).toBeHidden();
  }

  // ===========================================
  // Assertions - 정확한 검증
  // ===========================================

  /**
   * Rule의 활성화 상태 검증
   */
  async expectRuleStatus(name: string, isActive: boolean) {
    const ruleItem = this.pool.locator(`[data-testid^="${TESTID.RULES.POOL_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: name })
    }).first();

    await expect(ruleItem).toBeVisible();

    const expectedTitle = isActive ? 'Active' : 'Inactive';
    // Item 내의 status dot (title 속성 포함 div) 검증
    await expect(ruleItem.locator(`div[title="${expectedTitle}"]`)).toBeVisible();
  }

  /**
   * Rule Set 개수 검증
   * 정규식으로 정확한 패턴만 매칭 (rules-set-item-{id} 만, rules-set-item-{id}-name 제외)
   */
  async expectSetCount(expectedCount: number) {
    // rules-set-item-{id} 형식만 매칭하되 -name 요소를 가진 컨테이너만 필터링
    const setItems = this.setList.locator(`[data-testid^="${TESTID.RULES.SET_ITEM}-"]`).filter({
      has: this.page.locator('[data-testid$="-name"]')
    });
    await expect(setItems).toHaveCount(expectedCount);
  }

  /**
   * Rule Set이 존재하는지 검증 (이름으로)
   */
  async expectSetExists(name: string) {
    const setItem = this.setList.locator(`[data-testid^="${TESTID.RULES.SET_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: name })
    });
    await expect(setItem).toBeVisible();
  }

  /**
   * Rule Set이 존재하지 않는지 검증 (이름으로)
   */
  async expectSetNotExists(name: string) {
    const setItem = this.setList.locator(`[data-testid^="${TESTID.RULES.SET_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: name })
    });
    await expect(setItem).toHaveCount(0);
  }

  /**
   * 선택된 Set의 이름 검증
   */
  async expectSelectedSetName(name: string) {
    await expect(this.setDetailTitle).toHaveText(name);
  }

  /**
   * 선택된 Set에 포함된 Rule 개수 검증
   */
  async expectSetRuleCount(expectedCount: number) {
    // 각 아이템당 유일한 -name 요소 개수 확인 (중복 카운트 방지)
    const ruleItems = this.setDetail.locator('[data-testid$="-name"]');
    await expect(ruleItems).toHaveCount(expectedCount);
  }

  /**
   * Pool의 Rule 개수 검증
   */
  async expectPoolRuleCount(expectedCount: number) {
    // 각 아이템당 유일한 -name 요소 개수 확인 (중복 카운트 방지)
    const ruleItems = this.pool.locator('[data-testid$="-name"]');
    await expect(ruleItems).toHaveCount(expectedCount);
  }

  /**
   * Pool에 Rule이 존재하는지 검증
   */
  async expectPoolHasRule(name: string) {
    const ruleNameElement = this.pool.locator('[data-testid$="-name"]').filter({ hasText: name });
    await expect(ruleNameElement).toBeVisible();
  }

  async importRules(json: string): Promise<void> {
    await this.poolImportButton.click();
    await this.page.getByPlaceholder('Paste JSON here...').fill(json);
    await this.page.locator('text=Valid JSON').waitFor();
    await this.page.getByRole('button', { name: 'Import', exact: false }).click();
  }

  async expectSetContainsRule(ruleName: string) {
    const ruleItem = this.setDetail.locator('[data-testid$="-name"]').filter({ hasText: ruleName });
    await expect(ruleItem).toBeVisible();
  }

  async expectSetNotContainsRule(ruleName: string) {
    const ruleItem = this.setDetail.locator('[data-testid$="-name"]').filter({ hasText: ruleName });
    await expect(ruleItem).toHaveCount(0);
  }

  /**
   * Set의 아이템 배지 숫자 검증
   */
  async expectSetItemCount(setName: string, expectedCount: number) {
    const setItem = this.setList.locator(`[data-testid^="${TESTID.RULES.SET_ITEM}"]`).filter({
      has: this.page.locator('[data-testid$="-name"]').filter({ hasText: setName })
    }).first();
    const badge = setItem.getByTestId(TESTID.RULES.SET_ITEM_COUNT);
    await expect(badge).toHaveText(String(expectedCount));
  }

  // ===========================================
  // State Queries
  // ===========================================

  /**
   * Set 생성 폼이 열려있는지
   */
  async isCreateSetFormOpen(): Promise<boolean> {
    return await this.setCreateInput.isVisible();
  }

  /**
   * Set Detail이 표시되어 있는지 (Set이 선택되었는지)
   */
  async isSetSelected(): Promise<boolean> {
    return await this.setDetailTitle.isVisible();
  }
}
