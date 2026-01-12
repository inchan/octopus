/**
 * Sync Page Object
 *
 * 3-Column Sync 페이지 테스트를 위한 Page Object
 * - Column 1: Target Tools
 * - Column 2: Rules
 * - Column 3: MCP Servers
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID, testId } from '../utils/test-ids';

export class SyncPage extends BasePage {
  // Page Container
  readonly page: Page;

  // Columns
  readonly toolsColumn: Locator;
  readonly rulesColumn: Locator;
  readonly mcpColumn: Locator;

  // Actions
  readonly startSyncButton: Locator;

  // Preview Dialog
  readonly previewDialog: Locator;
  readonly previewConfirmButton: Locator;
  readonly previewCancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Columns
    this.toolsColumn = page.getByTestId(TESTID.SYNC.COLUMN_TOOLS);
    this.rulesColumn = page.getByTestId(TESTID.SYNC.COLUMN_RULES);
    this.mcpColumn = page.getByTestId(TESTID.SYNC.COLUMN_MCP);

    // Actions
    this.startSyncButton = page.getByTestId(TESTID.SYNC.START_BUTTON);

    // Preview Dialog
    this.previewDialog = page.getByTestId(TESTID.SYNC.PREVIEW_DIALOG);
    this.previewConfirmButton = page.getByTestId(TESTID.SYNC.PREVIEW_CONFIRM);
    this.previewCancelButton = page.getByTestId(TESTID.SYNC.PREVIEW_CANCEL);
  }

  // ==========================================
  // Navigation
  // ==========================================

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.navigateTo('sync');
    await this.page.getByTestId(TESTID.SYNC.PAGE).waitFor();
  }

  // ==========================================
  // Tool Selection (Column 1)
  // ==========================================

  async selectToolSet(id: string): Promise<void> {
    await this.toolsColumn.getByTestId(testId.syncColumnToolsItem(id)).click();
  }

  async expectToolSetSelected(id: string): Promise<void> {
    const item = this.toolsColumn.getByTestId(testId.syncColumnToolsItem(id));
    await item.waitFor();
  }

  // ==========================================
  // Rules Selection (Column 2)
  // ==========================================

  async selectRuleSet(id: string): Promise<void> {
    await this.rulesColumn.getByTestId(testId.syncColumnRulesItem(id)).click();
  }

  async selectRuleSetByName(name: string): Promise<void> {
    await this.rulesColumn.getByRole('button').filter({ hasText: name }).click();
  }

  // ==========================================
  // MCP Selection (Column 3)
  // ==========================================

  async selectMcpSet(id: string): Promise<void> {
    await this.mcpColumn.getByTestId(testId.syncColumnMcpItem(id)).click();
  }

  async selectMcpSetByName(name: string): Promise<void> {
    await this.mcpColumn.getByRole('button').filter({ hasText: name }).click();
  }

  // ==========================================
  // Sync Actions
  // ==========================================

  async startSync(): Promise<void> {
    await this.startSyncButton.click();
  }

  async confirmSync(): Promise<void> {
    await this.previewConfirmButton.click();
  }

  async cancelSync(): Promise<void> {
    await this.previewCancelButton.click();
  }

  // ==========================================
  // Assertions
  // ==========================================

  async expectStartButtonEnabled(): Promise<void> {
    await this.expect(this.startSyncButton).toBeEnabled();
  }

  async expectStartButtonDisabled(): Promise<void> {
    await this.expect(this.startSyncButton).toBeDisabled();
  }

  async expectPreviewDialogVisible(): Promise<void> {
    await this.expect(this.previewDialog).toBeVisible();
  }

  async expectPreviewDialogHidden(): Promise<void> {
    await this.expect(this.previewDialog).not.toBeVisible();
  }

  async expectPreviewFileVisible(path: string): Promise<void> {
    await this.expect(this.previewDialog.locator(`text=${path}`)).toBeVisible();
  }

  async expectPreviewFileCount(count: number): Promise<void> {
    const files = this.previewDialog.locator('[data-testid^="sync-preview-file-"]');
    await this.expect(files).toHaveCount(count);
  }

  async expectColumnVisible(column: 'tools' | 'rules' | 'mcp'): Promise<void> {
    const titles: Record<string, string> = {
      tools: '1. Target Tools',
      rules: '2. Rules',
      mcp: '3. MCP Servers',
    };
    await this.expect(this.page.locator(`text=${titles[column]}`)).toBeVisible();
  }
}
