/**
 * History Page Object
 *
 * 히스토리 페이지 테스트를 위한 Page Object
 * - 변경 이력 목록
 * - 상세 보기
 * - 롤백 기능
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID, testId } from '../utils/test-ids';

export class HistoryPage extends BasePage {
  readonly page: Page;

  // Containers
  readonly historyList: Locator;
  readonly historyDetail: Locator;

  // Actions
  readonly revertButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.historyList = page.getByTestId(TESTID.HISTORY.LIST);
    this.historyDetail = page.getByTestId(TESTID.HISTORY.DETAIL);
    this.revertButton = page.getByTestId(TESTID.HISTORY.REVERT_BUTTON);
  }

  // ==========================================
  // Navigation
  // ==========================================

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.navigateTo('history');
    await this.page.getByTestId(TESTID.HISTORY.PAGE).waitFor();
  }

  // ==========================================
  // History Operations
  // ==========================================

  async selectEntry(id: string): Promise<void> {
    await this.page.getByTestId(testId.historyItem(id)).click();
  }

  async selectFirstEntry(): Promise<void> {
    await this.historyList.locator('[data-testid^="history-item-"]').first().click();
  }

  async revertToSelected(): Promise<void> {
    this.page.on('dialog', (dialog) => dialog.accept());
    await this.revertButton.click();
  }

  // ==========================================
  // Assertions
  // ==========================================

  async expectEntryCount(count: number): Promise<void> {
    const entries = this.historyList.locator('[data-testid^="history-item-"]');
    await this.expect(entries).toHaveCount(count);
  }

  async expectEntryExists(id: string): Promise<void> {
    await this.expect(this.page.getByTestId(testId.historyItem(id))).toBeVisible();
  }

  async expectDetailVisible(): Promise<void> {
    await this.expect(this.historyDetail.locator('h3:has-text("History Detail")')).toBeVisible();
  }

  async expectEmptyMessage(): Promise<void> {
    await this.expect(this.page.locator('text=No history found')).toBeVisible();
  }

  async expectLoadingMessage(): Promise<void> {
    await this.expect(this.page.locator('text=Loading history')).toBeVisible();
  }

  async expectActionBadge(action: 'CREATE' | 'UPDATE' | 'DELETE'): Promise<void> {
    await this.expect(this.historyDetail.locator(`text=${action}`)).toBeVisible();
  }
}
