/**
 * Base Page Object - 모든 Page Object의 부모 클래스
 *
 * 공통 기능:
 * - 네비게이션
 * - 대기 유틸리티 (waitForTimeout 금지!)
 * - 공통 assertion
 */

import { Page, Locator, expect } from '@playwright/test';
import { TESTID } from '../utils/test-ids';

export abstract class BasePage {
  constructor(protected readonly page: Page) { }

  // ===========================================
  // Navigation
  // ===========================================

  /**
   * 특정 경로로 이동
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  /**
   * 네비게이션 메뉴를 통해 Rules 페이지로 이동
   */
  async navigateToRules() {
    await this.page.getByTestId(TESTID.NAV.RULES).click();
    await this.page.getByTestId(TESTID.RULES.PAGE).waitFor({ state: 'visible' });
  }

  /**
   * 네비게이션 메뉴를 통해 Sync 페이지로 이동
   */
  async navigateToSync() {
    await this.page.getByTestId(TESTID.NAV.SYNC).click();
    await this.page.getByTestId(TESTID.SYNC.PAGE).waitFor({ state: 'visible' });
  }

  /**
   * 네비게이션 메뉴를 통해 MCP 페이지로 이동
   */
  async navigateToMcp() {
    await this.page.getByTestId(TESTID.NAV.MCP).click();
    await this.page.getByTestId(TESTID.MCP.PAGE).waitFor({ state: 'visible' });
  }

  /**
   * 네비게이션 메뉴를 통해 Tools 페이지로 이동
   */
  async navigateToTools() {
    await this.page.getByTestId(TESTID.NAV.TOOLS).click();
    await this.page.getByTestId(TESTID.TOOLS.PAGE).waitFor({ state: 'visible' });
  }

  /**
   * 네비게이션 메뉴를 통해 Settings 페이지로 이동
   */
  async navigateToSettings() {
    await this.page.getByTestId(TESTID.NAV.SETTINGS).click();
    await this.page.getByTestId(TESTID.SETTINGS.PAGE).waitFor({ state: 'visible' });
  }

  /**
   * 네비게이션 메뉴를 통해 History 페이지로 이동
   */
  async navigateToHistory() {
    await this.page.getByTestId(TESTID.NAV.HISTORY).click();
    await this.page.getByTestId(TESTID.HISTORY.PAGE).waitFor({ state: 'visible' });
  }

  /**
   * 통합 네비게이션 메서드
   */
  async navigateTo(target: 'rules' | 'sync' | 'mcp' | 'tools' | 'settings' | 'history' | 'projects') {
    switch (target) {
      case 'rules':
        await this.navigateToRules();
        break;
      case 'sync':
        await this.navigateToSync();
        break;
      case 'mcp':
        await this.navigateToMcp();
        break;
      case 'tools':
        await this.navigateToTools();
        break;
      case 'settings':
        await this.navigateToSettings();
        break;
      case 'history':
        await this.navigateToHistory();
        break;
      case 'projects':
        await this.navigateToProjects();
        break;
    }
  }

  /**
   * 네비게이션 메뉴를 통해 Projects 페이지로 이동
   */
  async navigateToProjects() {
    await this.page.getByTestId('nav-projects').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Playwright expect 래퍼
   */
  expect(locator: Locator) {
    return expect(locator);
  }

  // ===========================================
  // Wait Utilities (waitForTimeout 대신 사용)
  // ===========================================

  /**
   * 특정 testId를 가진 요소가 보일 때까지 대기
   */
  async waitForTestId(testId: string, timeout?: number) {
    await this.page.getByTestId(testId).waitFor({
      state: 'visible',
      timeout: timeout ?? 10000,
    });
  }

  /**
   * 특정 testId를 가진 요소가 사라질 때까지 대기
   */
  async waitForTestIdHidden(testId: string, timeout?: number) {
    await this.page.getByTestId(testId).waitFor({
      state: 'hidden',
      timeout: timeout ?? 10000,
    });
  }

  /**
   * 네트워크 요청이 완료될 때까지 대기
   */
  async waitForNetworkIdle(timeout?: number) {
    await this.page.waitForLoadState('networkidle', { timeout: timeout ?? 10000 });
  }

  // ===========================================
  // Common Assertions
  // ===========================================

  /**
   * 특정 testId 요소가 보이는지 확인
   */
  async expectVisible(testId: string) {
    await expect(this.page.getByTestId(testId)).toBeVisible();
  }

  /**
   * 특정 testId 요소가 숨겨져 있는지 확인
   */
  async expectHidden(testId: string) {
    await expect(this.page.getByTestId(testId)).toBeHidden();
  }

  /**
   * 특정 testId 요소의 텍스트 확인
   */
  async expectText(testId: string, text: string) {
    await expect(this.page.getByTestId(testId)).toHaveText(text);
  }

  /**
   * 특정 testId 요소의 텍스트 포함 여부 확인
   */
  async expectContainsText(testId: string, text: string) {
    await expect(this.page.getByTestId(testId)).toContainText(text);
  }

  // ===========================================
  // Locator Helpers
  // ===========================================

  /**
   * testId로 Locator 획득
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * 동적 testId로 Locator 획득 (e.g., rules-set-item-{id})
   */
  getByDynamicTestId(baseTestId: string, id: string): Locator {
    return this.page.getByTestId(`${baseTestId}-${id}`);
  }
}
