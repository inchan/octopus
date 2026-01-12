/**
 * Tools Page Object
 *
 * Tools 페이지 테스트를 위한 Page Object
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID } from '../utils/test-ids';

export class ToolsPage extends BasePage {
  readonly toolsList: Locator;
  readonly detectButton: Locator;

  constructor(page: Page) {
    super(page);
    this.toolsList = page.getByTestId(TESTID.TOOLS.LIST);
    this.detectButton = page.getByTestId(TESTID.TOOLS.DETECT_BUTTON);
  }

  async navigate() {
    await this.goto('/tools');
    await this.page.getByTestId(TESTID.TOOLS.PAGE).waitFor();
  }

  async clickDetectButton() {
    await this.detectButton.click();
  }

  getToolItem(toolId: string) {
    return this.page.getByTestId(`${TESTID.TOOLS.ITEM}-${toolId}`);
  }

  async openConfigureDialog(toolId: string) {
    const toolItem = this.getToolItem(toolId);
    await toolItem.getByRole('button', { name: 'Configure' }).click();
    await this.page.getByRole('dialog').waitFor();
  }

  async getConfigureDialog() {
    return this.page.getByRole('dialog');
  }

  async closeConfigureDialog() {
    const dialog = await this.getConfigureDialog();
    const cancelBtn = dialog.getByRole('button', { name: 'Cancel' });

    try {
      await cancelBtn.waitFor({ state: 'visible', timeout: 2000 });
      await cancelBtn.click();
    } catch {
      // Fallback: Escape 키
      await this.page.keyboard.press('Escape');
    }

    await dialog.waitFor({ state: 'hidden', timeout: 5000 });
  }

  /**
   * Configure Dialog에서 Rule Set 선택
   * @param ruleSetName - Rule Set 이름 (예: 'Global Rules')
   */
  async selectRuleSet(ruleSetName: string) {
    const dialog = await this.getConfigureDialog();
    await dialog.getByLabel('Rule Set').click();
    await this.page.getByRole('option', { name: ruleSetName }).click();
  }

  /**
   * Configure Dialog에서 MCP Set 선택
   * @param mcpSetName - MCP Set 이름 (예: 'Global MCPs')
   */
  async selectMcpSet(mcpSetName: string) {
    const dialog = await this.getConfigureDialog();
    await dialog.getByLabel('MCP Set').click();
    await this.page.getByRole('option', { name: mcpSetName }).click();
  }

  /**
   * Configure Dialog의 Save 버튼 클릭 및 성공 확인
   */
  async saveConfiguration() {
    const dialog = await this.getConfigureDialog();
    await dialog.getByRole('button', { name: 'Save' }).click();

    // 다이얼로그 닫힘 검증
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Tool이 설정되었음을 나타내는 배지 또는 표시 확인
   * @param toolId - Tool ID
   */
  async expectToolConfigured(toolId: string) {
    const toolItem = this.getToolItem(toolId);
    await expect(toolItem.getByText('Configured')).toBeVisible();
  }

  async expectToolVisible(toolId: string) {
    await expect(this.getToolItem(toolId)).toBeVisible();
  }
    
  async expectToolName(toolId: string, name: string) {
      await expect(this.getToolItem(toolId)).toContainText(name);
  }

  async expectToolNotVisible(toolId: string) {
    await expect(this.getToolItem(toolId)).not.toBeVisible();
  }
}
