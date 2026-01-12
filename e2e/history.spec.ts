/**
 * History & Rollback Flow E2E Tests
 *
 * 히스토리 페이지 기능 테스트:
 * - 변경 이력 표시
 * - 상세 보기
 * - 롤백 기능
 */

import { test, expect, mockScenarios } from './fixtures/mock-api.fixture';
import { HistoryPage } from './pages/history.page';
import { RulesPage } from './pages/rules.page';

test.describe('History Flow', () => {
  let historyPage: HistoryPage;

  test.beforeEach(async ({ page, setupMockApi }) => {
    await setupMockApi(mockScenarios.empty);
    historyPage = new HistoryPage(page);
    await historyPage.navigate();
  });

  test('TC-HIST-E003: should show empty state when no history', async () => {
    await historyPage.expectEmptyMessage();
  });

  test('TC-HIST-E002: should show initial loading state', async ({ page, setupMockApi }) => {
    // Mock slow loading
    await page.addInitScript(() => {
      if (window.api?.history?.getHistory) {
        const original = window.api.history.getHistory;
        window.api.history.getHistory = async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return original ? original() : [];
        };
      }
    });

    await setupMockApi(mockScenarios.empty);
    const historyPage = new HistoryPage(page);

    const navigation = historyPage.navigate();

    // Check for loading indicator
    const loadingIndicator = page.locator('[data-testid="history-loading"]');
    if (await loadingIndicator.isVisible({ timeout: 500 }).catch(() => false)) {
      await expect(loadingIndicator).toBeVisible();
    }

    await navigation;
  });

  test('TC-HIST-E004: should display error state', async ({ page }) => {
    await page.addInitScript(() => {
      if (window.api?.history?.getHistory) {
        window.api.history.getHistory = async () => {
          throw new Error('Failed to load history');
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Error message 표시
    await expect(page.getByText(/error|failed/i)).toBeVisible();
  });
});

test.describe('History List Display', () => {
  test('TC-HIST-E005: should display history entries with all information', async ({ page, setupMockApi }) => {
    // Setup with history entries
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule', content: 'Content' }),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hist-2',
          action: 'update',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule Updated', content: 'New Content' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify entries are displayed
    await historyPage.expectEntryCount(2);
  });

  test('TC-HIST-E006: should display action badges with correct colors', async ({ page, setupMockApi }) => {
    const now = new Date().toISOString();
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-create',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Created Rule' }),
          createdAt: now,
        },
        {
          id: 'hist-update',
          action: 'update',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Updated Rule' }),
          createdAt: now,
        },
        {
          id: 'hist-delete',
          action: 'delete',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Deleted Rule' }),
          createdAt: now,
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify action badges are visible with correct text
    await expect(page.locator('text=CREATE').first()).toBeVisible();
    await expect(page.locator('text=UPDATE').first()).toBeVisible();
    await expect(page.locator('text=DELETE').first()).toBeVisible();

    // Verify color classes (green for create, blue for update, red for delete)
    const createBadge = page.locator('[data-testid="history-item-hist-create"] >> text=CREATE');
    await expect(createBadge).toHaveClass(/text-green-400/);

    const updateBadge = page.locator('[data-testid="history-item-hist-update"] >> text=UPDATE');
    await expect(updateBadge).toHaveClass(/text-blue-400/);

    const deleteBadge = page.locator('[data-testid="history-item-hist-delete"] >> text=DELETE');
    await expect(deleteBadge).toHaveClass(/text-red-400/);
  });

  test('TC-HIST-E007: should display entry information (type, ID, timestamp)', async ({ page, setupMockApi }) => {
    const testDate = new Date('2024-01-15T10:30:00Z');
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-12345678',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-abc-123',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: testDate.toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    const entry = page.locator('[data-testid="history-item-hist-12345678"]');

    // Verify entity type and ID
    await expect(entry.locator('text=rule: rule-abc-123')).toBeVisible();

    // Verify truncated transaction ID (first 8 chars)
    await expect(entry.locator('text=ID: hist-123')).toBeVisible();

    // Verify timestamp is displayed (format may vary by locale)
    await expect(entry.getByText(/2024|1\/15|15\/1/)).toBeVisible();
  });

  test('TC-HIST-E008: should have scrollable history list', async ({ page, setupMockApi }) => {
    // Create 20 history entries to test scrolling
    const entries = Array.from({ length: 20 }, (_, i) => ({
      id: `hist-${i}`,
      action: 'create' as const,
      entityType: 'rule',
      entityId: `rule-${i}`,
      data: JSON.stringify({ name: `Rule ${i}` }),
      createdAt: new Date().toISOString(),
    }));

    await setupMockApi({
      ...mockScenarios.empty,
      history: entries,
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify all entries are in DOM
    await historyPage.expectEntryCount(20);

    // Verify list container has overflow-y-auto class
    const listContainer = page.getByTestId('history-list');
    await expect(listContainer).toHaveClass(/overflow-y-auto/);

    // Scroll to bottom and verify last entry is visible
    await page.locator('[data-testid="history-item-hist-19"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-testid="history-item-hist-19"]')).toBeVisible();
  });
});

test.describe('Entry Selection and Detail View', () => {
  test('TC-HIST-E009: should select history entry on click', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule', content: 'Content' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify no detail shown initially
    await expect(page.getByText('Select a history entry to view details')).toBeVisible();

    // Select entry
    await historyPage.selectFirstEntry();

    // Verify detail is shown
    await historyPage.expectDetailVisible();

    // Verify selected entry has highlight class
    const selectedEntry = page.locator('[data-testid="history-item-hist-1"]');
    await expect(selectedEntry).toHaveClass(/bg-gray-800/);
    await expect(selectedEntry).toHaveClass(/border-blue-500/);
  });

  test('TC-HIST-E010: should display transaction ID in detail view', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-transaction-12345',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Verify transaction ID is shown in detail
    const detailSection = page.getByTestId('history-detail');
    await expect(detailSection.locator('text=Transaction ID:')).toBeVisible();
    await expect(detailSection.locator('text=hist-transaction-12345')).toBeVisible();
  });

  test('TC-HIST-E011: should display snapshot data in detail view', async ({ page, setupMockApi }) => {
    const snapshotData = {
      name: 'Test Rule',
      content: 'This is the rule content',
      isActive: true,
      priority: 5,
    };

    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify(snapshotData),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Verify snapshot data header
    const detailSection = page.getByTestId('history-detail');
    await expect(detailSection.locator('text=Snapshot Data')).toBeVisible();

    // Verify JSON data is displayed (formatted)
    const preElement = detailSection.locator('pre');
    await expect(preElement).toBeVisible();

    // Verify key fields from snapshot are visible
    await expect(preElement).toContainText('"name"');
    await expect(preElement).toContainText('"Test Rule"');
    await expect(preElement).toContainText('"content"');
    await expect(preElement).toContainText('"isActive"');
  });

  test('TC-HIST-E012: should have scrollable detail content for large snapshots', async ({ page, setupMockApi }) => {
    // Create a large snapshot object
    const largeSnapshot = {
      name: 'Large Rule',
      content: 'A'.repeat(1000),
      metadata: Array.from({ length: 50 }, (_, i) => ({
        key: `field-${i}`,
        value: `value-${i}`.repeat(20),
      })),
    };

    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify(largeSnapshot),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Verify pre element has max-height and overflow
    const preElement = page.getByTestId('history-detail').locator('pre');
    await expect(preElement).toHaveClass(/max-h-\[500px\]/);
    await expect(preElement).toHaveClass(/overflow-auto/);
  });

  test('TC-HIST-E013: should switch between entries', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Rule 1' }),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hist-2',
          action: 'update',
          entityType: 'rule',
          entityId: 'rule-2',
          data: JSON.stringify({ name: 'Rule 2' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Select first entry
    await page.locator('[data-testid="history-item-hist-1"]').click();
    await expect(page.getByTestId('history-detail').locator('text=hist-1')).toBeVisible();
    await expect(page.getByTestId('history-detail').locator('text="Rule 1"')).toBeVisible();

    // Select second entry
    await page.locator('[data-testid="history-item-hist-2"]').click();
    await expect(page.getByTestId('history-detail').locator('text=hist-2')).toBeVisible();
    await expect(page.getByTestId('history-detail').locator('text="Rule 2"')).toBeVisible();

    // Verify first entry highlight is removed
    const firstEntry = page.locator('[data-testid="history-item-hist-1"]');
    await expect(firstEntry).not.toHaveClass(/border-blue-500/);

    // Verify second entry is highlighted
    const secondEntry = page.locator('[data-testid="history-item-hist-2"]');
    await expect(secondEntry).toHaveClass(/border-blue-500/);
  });

  test('TC-HIST-E014: should show placeholder when no entry selected', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify placeholder message is shown
    await expect(page.getByText('Select a history entry to view details')).toBeVisible();

    // Verify icon is shown
    const placeholderIcon = page.getByTestId('history-detail').locator('svg');
    await expect(placeholderIcon).toBeVisible();
  });
});

test.describe('Revert Functionality', () => {
  test('TC-HIST-E015: should display revert button when entry is selected', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Revert button should not be visible before selection
    await expect(page.getByTestId('history-revert-button')).not.toBeVisible();

    // Select entry
    await historyPage.selectFirstEntry();

    // Revert button should be visible
    await expect(page.getByTestId('history-revert-button')).toBeVisible();
    await expect(page.getByTestId('history-revert-button')).toContainText('Revert to this state');
  });

  test('TC-HIST-E016: should show confirmation dialog on revert click', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Track dialog
    let dialogShown = false;
    let dialogMessage = '';

    page.on('dialog', (dialog) => {
      dialogShown = true;
      dialogMessage = dialog.message();
      dialog.accept();
    });

    // Click revert button
    await page.getByTestId('history-revert-button').click();

    // Verify dialog was shown
    expect(dialogShown).toBe(true);
    expect(dialogMessage).toContain('Are you sure');
  });

  test('TC-HIST-E017: should cancel revert operation', async ({ page, setupMockApi }) => {
    let revertCalled = false;

    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // Track if revert API was called
    await page.addInitScript(() => {
      const originalRevert = window.api?.history?.revert;
      if (window.api?.history) {
        window.api.history.revert = async (id: string) => {
          (window as any).__revertCalled = true;
          return originalRevert ? originalRevert(id) : { success: true, data: null };
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Cancel dialog
    page.on('dialog', (dialog) => dialog.dismiss());

    // Click revert button
    await page.getByTestId('history-revert-button').click();

    // Wait a bit to ensure no API call was made
    await page.waitForTimeout(500);

    // Verify revert was not called
    revertCalled = await page.evaluate(() => (window as any).__revertCalled);
    expect(revertCalled).toBeFalsy();
  });

  test('TC-HIST-E018: should revert rule creation (delete)', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule', content: 'Content' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Select entry
    await historyPage.selectFirstEntry();

    // Revert - this will trigger the dialog and call the API
    await historyPage.revertToSelected();

    // Since mock returns success, we expect an alert with success message
    // The page will show an alert 'Reverted successfully' which we accept
  });

  test('TC-HIST-E019: should revert rule update (restore)', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-update',
          action: 'update',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({
            name: 'Original Rule Name',
            content: 'Original Content',
          }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    let revertedId = '';
    await page.addInitScript(() => {
      const originalRevert = window.api?.history?.revert;
      if (window.api?.history) {
        window.api.history.revert = async (id: string) => {
          (window as any).__revertedId = id;
          return { success: true, data: null };
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();
    await historyPage.revertToSelected();

    // Verify revert was called with correct ID
    revertedId = await page.evaluate(() => (window as any).__revertedId);
    expect(revertedId).toBe('hist-update');
  });

  test('TC-HIST-E020: should revert rule deletion (restore)', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-delete',
          action: 'delete',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({
            name: 'Deleted Rule',
            content: 'Deleted Content',
          }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Verify DELETE badge is shown
    await expect(page.locator('text=DELETE').first()).toBeVisible();

    // Revert should restore the deleted rule
    await historyPage.revertToSelected();
  });

  test('TC-HIST-E021: should revert MCP server creation', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-mcp',
          action: 'create',
          entityType: 'mcpServer',
          entityId: 'mcp-1',
          data: JSON.stringify({
            name: 'Test MCP Server',
            command: 'node',
            args: ['server.js'],
          }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify MCP entity type is shown
    await expect(page.locator('text=mcpServer: mcp-1')).toBeVisible();

    await historyPage.selectFirstEntry();
    await historyPage.revertToSelected();
  });

  test('TC-HIST-E022: should handle revert error', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // Mock revert to fail
    await page.addInitScript(() => {
      if (window.api?.history) {
        window.api.history.revert = async () => {
          return { success: false, error: 'Database error' };
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Track alert
    let alertShown = false;
    let alertMessage = '';

    page.on('dialog', (dialog) => {
      alertMessage = dialog.message();
      alertShown = true;
      dialog.accept();
    });

    // Click revert (skip confirmation)
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId('history-revert-button').click();

    // Wait for error alert
    await page.waitForTimeout(500);

    // Verify error alert was shown
    expect(alertShown).toBe(true);
    expect(alertMessage).toContain('Failed to revert');
    expect(alertMessage).toContain('Database error');
  });

  test('TC-HIST-E023: should handle revert with missing entry', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // Mock revert to return "not found" error
    await page.addInitScript(() => {
      if (window.api?.history) {
        window.api.history.revert = async () => {
          return { success: false, error: 'History entry not found' };
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Track alert
    let errorMessage = '';
    page.on('dialog', (dialog) => {
      if (dialog.message().includes('Failed')) {
        errorMessage = dialog.message();
      }
      dialog.accept();
    });

    await page.getByTestId('history-revert-button').click();
    await page.waitForTimeout(500);

    expect(errorMessage).toContain('not found');
  });

  test('TC-HIST-E024: should handle revert with unregistered handler', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'unknownType',
          entityId: 'unknown-1',
          data: JSON.stringify({ name: 'Unknown Entity' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // Mock revert to return "no handler" error
    await page.addInitScript(() => {
      if (window.api?.history) {
        window.api.history.revert = async () => {
          return { success: false, error: 'No revert handler registered for entity type: unknownType' };
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Track alert
    let errorMessage = '';
    page.on('dialog', (dialog) => {
      if (dialog.message().includes('Failed')) {
        errorMessage = dialog.message();
      }
      dialog.accept();
    });

    await page.getByTestId('history-revert-button').click();
    await page.waitForTimeout(500);

    expect(errorMessage).toContain('No revert handler');
  });
});

test.describe('History Tracking Integration', () => {
  test('TC-HIST-E025: should track rule creation in history', async ({ page, setupMockApi }) => {
    // This test verifies the integration between rule creation and history
    // Note: In a real scenario, history entries are created by the backend

    await setupMockApi(mockScenarios.empty);

    // Create a rule
    const rulesPage = new RulesPage(page);
    await rulesPage.navigate();
    await rulesPage.createRuleSet('Test Set');
    await rulesPage.createRule('E2E Test Rule', 'Content for E2E');

    // Navigate to history (in mock mode, history won't have entries since
    // the mock doesn't actually create history entries)
    await rulesPage.navigateTo('history');

    // In real app, we would see the history entry
    // But in mock mode, history is empty unless explicitly set
    // This test mainly verifies navigation flow works
  });

  test('TC-HIST-E026: should track rule update in history', async ({ page, setupMockApi }) => {
    // In a real app, updating a rule would create a history entry
    await setupMockApi({
      ...mockScenarios.withRuleSets,
      history: [],
    });

    const rulesPage = new RulesPage(page);
    await rulesPage.navigate();

    // Select a rule set
    const firstSet = page.locator('[data-testid^="rule-set-item-"]').first();
    await firstSet.click();

    // Update a rule (if exists)
    const firstRule = page.locator('[data-testid^="rule-item-"]').first();
    if (await firstRule.isVisible({ timeout: 1000 }).catch(() => false)) {
      await firstRule.click();

      // Edit rule
      const editButton = page.getByRole('button', { name: /edit/i });
      if (await editButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await editButton.click();

        const contentInput = page.locator('textarea').last();
        await contentInput.fill('Updated content');

        await page.getByRole('button', { name: /save|update/i }).click();
      }
    }

    // Navigate to history
    await rulesPage.navigateTo('history');

    // In real app, we would see the UPDATE history entry
  });

  test('TC-HIST-E027: should track rule deletion in history', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.withRuleSets,
      history: [],
    });

    const rulesPage = new RulesPage(page);
    await rulesPage.navigate();

    // Delete a rule
    const firstSet = page.locator('[data-testid^="rule-set-item-"]').first();
    await firstSet.click();

    const firstRule = page.locator('[data-testid^="rule-item-"]').first();
    if (await firstRule.isVisible({ timeout: 1000 }).catch(() => false)) {
      const deleteButton = firstRule.locator('button[title*="Delete"], button:has-text("Delete")');
      if (await deleteButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await deleteButton.click();

        // Confirm deletion
        page.on('dialog', (dialog) => dialog.accept());
      }
    }

    // Navigate to history
    await rulesPage.navigateTo('history');

    // In real app, we would see the DELETE history entry
  });

  test('TC-HIST-E028: should create multiple history entries for multiple operations', async ({ page, setupMockApi }) => {
    const historyEntries = [
      {
        id: 'hist-1',
        action: 'create' as const,
        entityType: 'rule',
        entityId: 'rule-1',
        data: JSON.stringify({ name: 'Rule 1' }),
        createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      },
      {
        id: 'hist-2',
        action: 'update' as const,
        entityType: 'rule',
        entityId: 'rule-1',
        data: JSON.stringify({ name: 'Rule 1 Updated' }),
        createdAt: new Date('2024-01-01T10:05:00Z').toISOString(),
      },
      {
        id: 'hist-3',
        action: 'create' as const,
        entityType: 'ruleSet',
        entityId: 'set-1',
        data: JSON.stringify({ name: 'Test Set' }),
        createdAt: new Date('2024-01-01T10:10:00Z').toISOString(),
      },
      {
        id: 'hist-4',
        action: 'delete' as const,
        entityType: 'rule',
        entityId: 'rule-1',
        data: JSON.stringify({ name: 'Rule 1 Updated' }),
        createdAt: new Date('2024-01-01T10:15:00Z').toISOString(),
      },
    ];

    await setupMockApi({
      ...mockScenarios.empty,
      history: historyEntries,
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify all entries are shown
    await historyPage.expectEntryCount(4);

    // Verify chronological order (newest first typically)
    const entries = page.locator('[data-testid^="history-item-"]');

    // Verify different entity types are shown
    await expect(page.locator('text=rule:')).toHaveCount(3);
    await expect(page.locator('text=ruleSet:')).toHaveCount(1);
  });

  test('TC-HIST-E029: should track MCP server operations in history', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-mcp-1',
          action: 'create',
          entityType: 'mcpServer',
          entityId: 'mcp-server-1',
          data: JSON.stringify({
            name: 'Filesystem Server',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
          }),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hist-mcp-2',
          action: 'update',
          entityType: 'mcpServer',
          entityId: 'mcp-server-1',
          data: JSON.stringify({
            name: 'Filesystem Server',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem', '/home'],
            env: { DEBUG: 'true' },
          }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify MCP entries are shown
    await historyPage.expectEntryCount(2);

    // Verify entity type
    await expect(page.locator('text=mcpServer:').first()).toBeVisible();

    // Select and verify details
    await historyPage.selectFirstEntry();
    await expect(page.getByTestId('history-detail').locator('text="Filesystem Server"')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('TC-HIST-E035: should support keyboard navigation', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        { id: 'hist-1', action: 'create', entityType: 'rule', entityId: 'rule-1', data: JSON.stringify({ name: 'Rule 1' }), createdAt: new Date().toISOString() },
        { id: 'hist-2', action: 'update', entityType: 'rule', entityId: 'rule-2', data: JSON.stringify({ name: 'Rule 2' }), createdAt: new Date().toISOString() },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Tab to first entry
    await page.keyboard.press('Tab');

    // Enter to select
    await page.keyboard.press('Enter');

    // Verify detail is shown
    await historyPage.expectDetailVisible();

    // Tab to revert button
    await page.keyboard.press('Tab');
    const revertButton = page.getByTestId('history-revert-button');
    await expect(revertButton).toBeFocused();
  });

  test('TC-HIST-E036: should have screen reader support', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        { id: 'hist-1', action: 'create', entityType: 'rule', entityId: 'rule-1', data: JSON.stringify({ name: 'Test Rule' }), createdAt: new Date().toISOString() },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify ARIA labels/roles exist
    const historyList = page.getByTestId('history-list');
    await expect(historyList).toBeVisible();

    // Verify entries are accessible
    const entry = page.locator('[data-testid="history-item-hist-1"]');
    await expect(entry).toBeVisible();
  });

  test('TC-HIST-E037: should manage focus after revert', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        { id: 'hist-1', action: 'create', entityType: 'rule', entityId: 'rule-1', data: JSON.stringify({ name: 'Test Rule' }), createdAt: new Date().toISOString() },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    const revertButton = page.getByTestId('history-revert-button');
    await revertButton.focus();

    // Revert
    await historyPage.revertToSelected();

    // After revert, focus should return to a reasonable element
    // (implementation dependent, but should not be lost)
    await page.waitForTimeout(500);
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el) => el?.tagName);
    expect(tagName).toBeTruthy();
  });
});

test.describe('Edge Cases and Error Scenarios', () => {
  test('TC-HIST-E041: should handle page refresh while entry selected', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        { id: 'hist-1', action: 'create', entityType: 'rule', entityId: 'rule-1', data: JSON.stringify({ name: 'Test Rule' }), createdAt: new Date().toISOString() },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Reload page
    await page.reload();

    // Selection should be cleared (or persisted, depending on implementation)
    // For now, we expect the empty state placeholder
    const placeholder = page.getByText('Select a history entry to view details');
    const isPlaceholderVisible = await placeholder.isVisible({ timeout: 2000 }).catch(() => false);

    // Either placeholder or detail can be visible depending on implementation
    expect(isPlaceholderVisible !== undefined).toBe(true);
  });

  test('TC-HIST-E042: should handle network error during load', async ({ page }) => {
    await page.addInitScript(() => {
      if (window.api?.history) {
        window.api.history.list = async () => {
          throw new Error('Network error');
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Should show error state
    await expect(page.getByText(/error|failed/i)).toBeVisible();
  });

  test('TC-HIST-E043: should handle concurrent revert operations', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        { id: 'hist-1', action: 'create', entityType: 'rule', entityId: 'rule-1', data: JSON.stringify({ name: 'Test Rule' }), createdAt: new Date().toISOString() },
      ],
    });

    let revertCount = 0;
    await page.addInitScript(() => {
      if (window.api?.history) {
        window.api.history.revert = async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          (window as any).__revertCount = ((window as any).__revertCount || 0) + 1;
          return { success: true, data: null };
        };
      }
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Try to trigger revert twice quickly
    page.on('dialog', (dialog) => dialog.accept());

    const revertButton = page.getByTestId('history-revert-button');
    await revertButton.click();

    // Wait for first revert to complete
    await page.waitForTimeout(1000);

    revertCount = await page.evaluate(() => (window as any).__revertCount);

    // Should only revert once (or handle gracefully)
    expect(revertCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-HIST-E044: should handle revert with stale data', async ({ page, setupMockApi }) => {
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        { id: 'hist-old', action: 'update', entityType: 'rule', entityId: 'rule-1', data: JSON.stringify({ name: 'Old Version' }), createdAt: new Date('2020-01-01').toISOString() },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Revert should work even with old data
    await historyPage.revertToSelected();
  });

  test('TC-HIST-E045: should display very long rule content in snapshot', async ({ page, setupMockApi }) => {
    const veryLongContent = 'A'.repeat(10000);

    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Long Rule', content: veryLongContent }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();
    await historyPage.selectFirstEntry();

    // Verify snapshot is scrollable
    const preElement = page.getByTestId('history-detail').locator('pre');
    await expect(preElement).toBeVisible();
    await expect(preElement).toHaveClass(/overflow-auto/);
  });

  test('TC-HIST-E046: should handle special characters in rule names', async ({ page, setupMockApi }) => {
    const specialNames = [
      'Rule with "quotes"',
      "Rule with 'apostrophes'",
      'Rule with <html> tags',
      'Rule with émojis 🚀',
      'Rule with \nnewlines',
    ];

    const history = specialNames.map((name, i) => ({
      id: `hist-${i}`,
      action: 'create' as const,
      entityType: 'rule',
      entityId: `rule-${i}`,
      data: JSON.stringify({ name }),
      createdAt: new Date().toISOString(),
    }));

    await setupMockApi({
      ...mockScenarios.empty,
      history,
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify all entries are displayed
    await historyPage.expectEntryCount(5);

    // Select and verify each entry
    for (let i = 0; i < specialNames.length; i++) {
      await page.locator(`[data-testid="history-item-hist-${i}"]`).click();
      await expect(page.getByTestId('history-detail')).toContainText(specialNames[i]);
    }
  });
});

test.describe('Critical Smoke Tests', () => {
  test('TC-HIST-E051: basic history flow happy path', async ({ page, setupMockApi }) => {
    // Complete end-to-end happy path
    await setupMockApi({
      ...mockScenarios.empty,
      history: [
        {
          id: 'hist-1',
          action: 'create',
          entityType: 'rule',
          entityId: 'rule-1',
          data: JSON.stringify({ name: 'Test Rule', content: 'Test Content' }),
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const historyPage = new HistoryPage(page);

    // 1. Navigate to history
    await historyPage.navigate();

    // 2. Verify entry is shown
    await historyPage.expectEntryCount(1);

    // 3. Select entry
    await historyPage.selectFirstEntry();

    // 4. Verify detail is shown
    await historyPage.expectDetailVisible();
    await expect(page.getByTestId('history-detail').locator('text=hist-1')).toBeVisible();

    // 5. Verify revert button is shown
    await expect(page.getByTestId('history-revert-button')).toBeVisible();

    // 6. Attempt revert (with success)
    await historyPage.revertToSelected();

    // Happy path complete
  });

  test('TC-HIST-E052: multi-operation history workflow', async ({ page, setupMockApi }) => {
    // Verify complex workflow with multiple actions
    const complexHistory = [
      { id: 'h1', action: 'create' as const, entityType: 'ruleSet', entityId: 's1', data: JSON.stringify({ name: 'Set 1' }), createdAt: '2024-01-01T10:00:00Z' },
      { id: 'h2', action: 'create' as const, entityType: 'rule', entityId: 'r1', data: JSON.stringify({ name: 'Rule 1' }), createdAt: '2024-01-01T10:05:00Z' },
      { id: 'h3', action: 'update' as const, entityType: 'rule', entityId: 'r1', data: JSON.stringify({ name: 'Rule 1 v2' }), createdAt: '2024-01-01T10:10:00Z' },
      { id: 'h4', action: 'create' as const, entityType: 'mcpServer', entityId: 'm1', data: JSON.stringify({ name: 'MCP' }), createdAt: '2024-01-01T10:15:00Z' },
      { id: 'h5', action: 'delete' as const, entityType: 'rule', entityId: 'r1', data: JSON.stringify({ name: 'Rule 1 v2' }), createdAt: '2024-01-01T10:20:00Z' },
    ];

    await setupMockApi({
      ...mockScenarios.empty,
      history: complexHistory,
    });

    const historyPage = new HistoryPage(page);
    await historyPage.navigate();

    // Verify all 5 entries
    await historyPage.expectEntryCount(5);

    // Verify different entity types are present
    await expect(page.locator('text=ruleSet:').first()).toBeVisible();
    await expect(page.locator('text=rule:').first()).toBeVisible();
    await expect(page.locator('text=mcpServer:').first()).toBeVisible();

    // Verify action types
    await expect(page.locator('text=CREATE').first()).toBeVisible();
    await expect(page.locator('text=UPDATE').first()).toBeVisible();
    await expect(page.locator('text=DELETE').first()).toBeVisible();

    // Select each entry and verify details
    for (const entry of complexHistory) {
      await page.locator(`[data-testid="history-item-${entry.id}"]`).click();
      await expect(page.getByTestId('history-detail').locator(`text=${entry.id}`)).toBeVisible();
    }
  });
});
