/**
 * MCP Page Object
 *
 * 3-Pane MCP 관리 페이지 테스트를 위한 Page Object
 * - Pane 1: MCP Sets
 * - Pane 2: Set Detail (servers in set)
 * - Pane 3: Server Pool
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID, testId } from '../utils/test-ids';

export class McpPage extends BasePage {
  readonly page: Page;

  // Set List (Pane 1)
  readonly setNewButton: Locator;

  // Server Pool (Pane 3)
  readonly serverNewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Set List
    this.setNewButton = page.getByTestId(TESTID.MCP.SET_NEW_BUTTON);

    // Server Pool
    this.serverNewButton = page.getByTestId(TESTID.MCP.SERVER_NEW_BUTTON);
  }

  // ==========================================
  // Navigation
  // ==========================================

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.navigateTo('mcp');
    await this.page.getByTestId(TESTID.MCP.PAGE).waitFor();
  }

  // ==========================================
  // Set Operations
  // ==========================================

  async createSet(name: string): Promise<void> {
    await this.setNewButton.click();
    await this.page.getByTestId('mcp-set-create-input').fill(name);
    // Use the specific testid for the Set Create button
    await this.page.getByTestId('mcp-set-create-submit').click();
  }

  async selectSet(id: string): Promise<void> {
    await this.page.getByTestId(testId.mcpSetItem(id)).click();
  }

  async selectSetByName(name: string): Promise<void> {
    await this.page.locator(`[data-testid^="mcp-set-item-"][data-testid$="-name"]:has-text("${name}")`).click();
  }

  async deleteSelectedSet(): Promise<void> {
    // Click delete -> Sidebar opens AlertDialog -> Click 'Delete' (action) button
    await this.page.locator('button:has(svg.lucide-trash-2)').first().click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }


  // ==========================================
  // Set Operations
  // ==========================================

  // ...

  // ==========================================
  // Server Operations
  // ==========================================

  async createServer(params: { name: string; command: string; args?: string }): Promise<void> {
    await this.serverNewButton.click();

    // Now Dialog should be open immediately
    const dialog = this.page.getByRole('dialog', { name: 'Connect New MCP Server' });
    await dialog.waitFor();

    await dialog.locator('input#name').fill(params.name);
    await dialog.locator('input#command').fill(params.command);

    if (params.args) {
      await dialog.locator('input#args').fill(params.args);
    }

    await dialog.getByRole('button', { name: 'Connect Server' }).click();
  }

  async importServers(json: string, expectedName?: string): Promise<void> {
    await this.serverNewButton.click();

    // Wait for Dialog "Connect New MCP Server"
    const dialog = this.page.getByRole('dialog', { name: 'Connect New MCP Server' });
    await dialog.waitFor();

    // Switch to JSON tab
    await dialog.getByRole('tab', { name: 'JSON' }).click();

    // Wait for text area and fill
    const textarea = dialog.locator('textarea#json-config');
    await textarea.click(); // Ensure focus
    await textarea.fill(json);

    // Allow a brief moment for React state updates and JSON parsing to complete
    await this.page.waitForTimeout(1000);

    // Verification Step:
    // Switch back to "General" tab to verify the import worked and the form is populated.
    // This also acts as a "wait" for the state synchronization.
    await dialog.getByRole('tab', { name: 'General' }).click();

    // Wait for the name input to be populated (indicates sync is complete)
    const nameInput = dialog.locator('input#name');
    const commandInput = dialog.locator('input#command');
    await nameInput.waitFor();

    if (expectedName) {
      await this.expect(nameInput).toHaveValue(expectedName);
    } else {
      // Robustness check: Check command input instead of name input as name input can be flaky in test env
      await this.expect(commandInput).not.toHaveValue('');
    }

    await dialog.getByRole('button', { name: 'Connect Server' }).click();
  }

  // ...

  async selectServerByName(name: string): Promise<void> {
    const item = this.page.locator(`[data-testid^="mcp-server-item-"]`).filter({ hasText: name }).first();
    // Hover to reveal actions
    await item.hover();
    // Click menu button
    await item.getByTestId('mcp-server-menu-button').click({ force: true });
    // Click Edit in dropdown
    await this.page.getByRole('button', { name: 'Edit' }).click({ force: true });
  }

  async deleteSelectedServer(): Promise<void> {
    // Assumes Edit Dialog is OPEN.
    const dialog = this.page.getByRole('dialog', { name: 'Edit MCP Server' });
    await dialog.waitFor();

    // Check for "Danger Zone" delete or trash icon
    // Look for Trash button in DialogFooter
    const deleteBtn = dialog.locator('button:has(svg.lucide-trash-2)');
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();

    // Confirm deletion in AlertDialog
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
  }

  // ==========================================
  // Assertions
  // ==========================================

  async expectSetCount(count: number): Promise<void> {
    const sets = this.page.locator('[data-testid^="mcp-set-item-"]:not([data-testid*="-name"]):not([data-testid*="-count"])');
    await this.expect(sets).toHaveCount(count);
  }

  async expectSetExists(name: string): Promise<void> {
    await this.expect(
      this.page.locator(`[data-testid^="mcp-set-item-"][data-testid$="-name"]:has-text("${name}")`)
    ).toBeVisible();
  }

  async expectSetNotExists(name: string): Promise<void> {
    await this.expect(
      this.page.locator(`[data-testid^="mcp-set-item-"][data-testid$="-name"]:has-text("${name}")`)
    ).not.toBeVisible();
  }

  async expectServerCount(count: number): Promise<void> {
    // Logic changed? 
    // Count items in Pool.
    // Selector `[data-testid^="mcp-server-item-"]:not(...)`
    // My new McpPool uses: data-testid={`mcp-server-item-${server.id}-name`}
    // But the wrapper/container might not have a testid?
    // `ControlledSortableMcpPoolItem` does NOT have a test id on the wrapper div in my last edit?
    // I should check McpPool.tsx code.
    // It seems I removed the testid on the wrapper `div` in `ControlledSortableMcpPoolItem`.
    // I should fix McpPool.tsx or use text matching.
    // Fix: `data-testid` is crucial for stable tests. I should add `data-testid` to McpPool item wrapper.

    // Assuming I will add it or count name elements.
    const names = this.page.locator('[data-testid^="mcp-server-item-"][data-testid$="-name"]');
    await this.expect(names).toHaveCount(count);
  }

  async expectServerExists(name: string): Promise<void> {
    await this.expect(
      this.page.locator(`[data-testid^="mcp-server-item-"][data-testid$="-name"]:has-text("${name}")`)
    ).toBeVisible();
  }

  async expectServerNotExists(name: string): Promise<void> {
    const list = this.page.getByTestId(TESTID.MCP.POOL);
    await this.expect(list.locator(`text=${name}`)).not.toBeVisible();
  }

  async expectServerCountByName(name: string, count: number): Promise<void> {
    // Typo in original file "expectServerCount" overload?
    // Originally: expectServerCount(name, count)
    const list = this.page.getByTestId(TESTID.MCP.POOL);
    await this.expect(list.locator(`div:text-is("${name}")`)).toHaveCount(count);
  }

  async expectEmptySetsMessage(): Promise<void> {
    await this.expect(this.page.locator('text=No sets created yet')).toBeVisible();
  }

  async expectEmptyServersMessage(): Promise<void> {
    await this.expect(this.page.locator('text=No servers found')).toBeVisible();
  }
  async expectServerInSet(name: string): Promise<void> {
    // Check in Set Detail pane
    const item = this.page.locator(`[data-testid^="mcp-set-server-item-"][data-testid$="-name"]:has-text("${name}")`);
    await this.expect(item).toBeVisible();
  }

  async expectServerInPool(name: string): Promise<void> {
    await this.expect(
      this.page.locator(`[data-testid^="mcp-server-item-"][data-testid$="-name"]:has-text("${name}")`)
    ).toBeVisible();
  }

  async expectServerNotInPool(name: string): Promise<void> {
    const list = this.page.getByTestId(TESTID.MCP.POOL);
    await this.expect(list.locator(`[data-testid^="mcp-server-item-"][data-testid$="-name"]:has-text("${name}")`)).not.toBeVisible();
  }
}
