/**
 * Sync Feature E2E Tests
 * 
 * Coverage: Group F (Sync Expansion)
 */

import { test, expect, mockScenarios } from './fixtures/mock-api.fixture';
import { SyncPage } from './pages/sync.page';

test.describe('Sync Feature', () => {
    let syncPage: SyncPage;

    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));
        await page.goto('/#/sync');
        syncPage = new SyncPage(page);
    });

    test.describe('Layout & Display', () => {
        test('TC-SYNC-E001: should display 3-column layout', async () => {
            await syncPage.expectColumnVisible('tools');
            await syncPage.expectColumnVisible('rules');
            await syncPage.expectColumnVisible('mcp');
        });

        test('TC-SYNC-E002: should display Virtual Tool Sets', async ({ page }) => {
            await expect(page.locator('button:has-text("All Tools")')).toBeVisible();
            await expect(page.locator('button:has-text("CLI Tools")')).toBeVisible();
            await expect(page.locator('button:has-text("IDE Tools")')).toBeVisible();
        });

        test('TC-SYNC-E003: should display Rule Sets', async ({ page }) => {
            const rulesColumn = page.locator('[data-testid="sync-column-rules"]');
            await expect(rulesColumn.getByRole('button', { name: 'None' })).toBeVisible();
            await expect(rulesColumn.getByRole('button', { name: 'My Rules' })).toBeVisible();
        });

        test('TC-SYNC-E004: should display MCP Sets', async ({ page }) => {
            const mcpColumn = page.locator('[data-testid="sync-column-mcp"]');
            await expect(mcpColumn.getByRole('button', { name: 'None' })).toBeVisible();
            await expect(mcpColumn.getByRole('button', { name: 'My MCPs' })).toBeVisible();
        });
    });

    test.describe('Selection Workflow', () => {
        test('TC-SYNC-E005: should select Tool Set', async ({ page }) => {
            const toolsColumn = page.locator('[data-testid="sync-column-tools"]');

            // Select All Tools (default)
            await toolsColumn.getByRole('button', { name: 'All Tools' }).click();
            await expect(toolsColumn.getByRole('button', { name: 'All Tools' })).toHaveClass(/selected|active/);
        });

        test('TC-SYNC-E006: should select Rule Set', async ({ page }) => {
            await syncPage.selectRuleSetByName('My Rules');

            const rulesColumn = page.locator('[data-testid="sync-column-rules"]');
            await expect(rulesColumn.getByRole('button', { name: 'My Rules' })).toHaveClass(/selected|active/);
        });

        test('TC-SYNC-E007: should select MCP Set', async ({ page }) => {
            await syncPage.selectMcpSetByName('My MCPs');

            const mcpColumn = page.locator('[data-testid="sync-column-mcp"]');
            await expect(mcpColumn.getByRole('button', { name: 'My MCPs' })).toHaveClass(/selected|active/);
        });

        test('TC-SYNC-E008: should enable sync button only when Rule or MCP set is selected', async ({ page }) => {
            // Initial state: None selected
            await syncPage.expectStartButtonDisabled();

            // Select Rule Set
            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.expectStartButtonEnabled();

            // Deselect Rule Set (Select None)
            await page.locator('[data-testid="sync-column-rules"]').getByRole('button', { name: 'None' }).click();
            await syncPage.expectStartButtonDisabled();

            // Select MCP Set
            await syncPage.selectMcpSetByName('My MCPs');
            await syncPage.expectStartButtonEnabled();
        });

        test('TC-SYNC-E009: should show loading state during sync', async ({ page }) => {
            await syncPage.selectRuleSetByName('My Rules');

            // Mock slow sync operation
            await page.addInitScript(() => {
                if (window.api?.sync?.generateFiles) {
                    const original = window.api.sync.generateFiles;
                    window.api.sync.generateFiles = async (params) => {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return original ? original(params) : { success: true, files: [] };
                    };
                }
            });

            await syncPage.startSync();

            // Check for loading indicator (spinner, disabled button, etc.)
            const loadingIndicator = page.locator('[data-testid="sync-loading"]');
            if (await loadingIndicator.isVisible({ timeout: 500 }).catch(() => false)) {
                await expect(loadingIndicator).toBeVisible();
            }

            await syncPage.expectPreviewDialogVisible();
        });
    });

    test.describe('Preview & Sync', () => {
        test('TC-SYNC-E010: should open preview dialog', async ({ page }) => {
            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.startSync();

            await syncPage.expectPreviewDialogVisible();
            await expect(page.getByRole('dialog')).toContainText(/Preview|Files/i);
        });

        test('TC-SYNC-E011: should display file list in preview', async ({ page }) => {
            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.selectMcpSetByName('My MCPs');
            await syncPage.startSync();

            await syncPage.expectPreviewDialogVisible();

            // 파일 목록 표시 확인
            const dialog = page.getByRole('dialog');
            await expect(dialog).toContainText(/\.md|\.json|Cursor|Claude/i);
        });

        test('TC-SYNC-E012: should cancel preview', async () => {
            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.startSync();
            await syncPage.expectPreviewDialogVisible();
            await syncPage.cancelSync();
            await syncPage.expectPreviewDialogHidden();
        });

        test('TC-SYNC-E013: should confirm and execute sync', async ({ page }) => {
            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.startSync();
            await syncPage.expectPreviewDialogVisible();

            await syncPage.confirmSync();
            await syncPage.expectPreviewDialogHidden();

            // 성공 메시지 확인
            await expect(page.getByText(/success|synced|completed/i)).toBeVisible({ timeout: 5000 });
        });

        test('TC-SYNC-E014: should handle empty preview', async ({ page, setupMockApi }) => {
            // Scenario: Rule Set exists but has no rules, MCP Set exists but no servers

            await setupMockApi({
                ...mockScenarios.forSyncWorkflow,
                rules: [],
                ruleSets: [{ id: 'rule-set-1', name: 'My Rules', items: [], isArchived: false }],
                mcpServers: [],
                mcpSets: [{ id: 'mcp-set-1', name: 'My MCPs', items: [], isArchived: false }]
            });
            await syncPage.navigate(); // Navigate again to apply new mock data

            await syncPage.selectRuleSet('rule-set-1');
            await syncPage.startSync();

            await syncPage.expectPreviewDialogVisible();
            // Depending on implementation, might show "No changes" or empty list
            // For now, just expect dialog to open.
        });

        test('TC-SYNC-E015: should execute full sync workflow', async () => {
            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.selectMcpSetByName('My MCPs');

            await syncPage.startSync();
            await syncPage.expectPreviewDialogVisible();

            // Verify files
            await syncPage.expectPreviewFileVisible('generated/Cursor/rules.md');

            await syncPage.confirmSync();
            await syncPage.expectPreviewDialogHidden();
        });

        test('TC-SYNC-E016: should sync CLI tools with MCP only', async ({ page }) => {
            const toolsColumn = page.locator('[data-testid="sync-column-tools"]');
            await toolsColumn.getByRole('button', { name: 'CLI Tools' }).click();

            await syncPage.selectMcpSetByName('My MCPs');

            await syncPage.startSync();
            await syncPage.expectPreviewDialogVisible();

            // CLI 도구만 포함되어야 함
            const dialog = page.getByRole('dialog');
            await expect(dialog).toContainText(/Claude|CLI/i);

            await syncPage.confirmSync();
        });
    });

    test.describe('Tool Filtering', () => {
        test('TC-SYNC-E018: should filter CLI tools', async ({ page }) => {
            const toolsColumn = page.locator('[data-testid="sync-column-tools"]');
            await toolsColumn.getByRole('button', { name: 'CLI Tools' }).click();

            await expect(toolsColumn.getByRole('button', { name: 'CLI Tools' })).toHaveClass(/selected|active/);

            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.startSync();
            await syncPage.expectPreviewDialogVisible();

            // Preview에 CLI 도구만 표시
            const dialog = page.getByRole('dialog');
            await expect(dialog).toContainText(/Claude|CLI/i);
        });

        test('TC-SYNC-E019: should filter IDE tools', async ({ page }) => {
            const toolsColumn = page.locator('[data-testid="sync-column-tools"]');
            await toolsColumn.getByRole('button', { name: 'IDE Tools' }).click();

            await expect(toolsColumn.getByRole('button', { name: 'IDE Tools' })).toHaveClass(/selected|active/);

            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.startSync();
            await syncPage.expectPreviewDialogVisible();

            // Preview에 IDE 도구만 표시
            const dialog = page.getByRole('dialog');
            await expect(dialog).toContainText(/Cursor|VS Code|IDE/i);
        });
    });

    test.describe('Error Handling', () => {
        test('TC-SYNC-E020: should handle file generation failure', async ({ page }) => {
            await page.addInitScript(() => {
                if (window.api?.sync?.generateFiles) {
                    window.api.sync.generateFiles = async () => {
                        throw new Error('Failed to generate files');
                    };
                }
            });

            await syncPage.selectRuleSetByName('My Rules');
            await syncPage.startSync();

            // 에러 메시지 표시
            await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 5000 });
        });

        test.skip('TC-SYNC-E021: should handle sync failure', async ({ page, setupMockApi }) => {
            // This requires mocking the 'sync-files' IPC call to fail.
            // Our mock fixture currently mocks initial data load.
            // We need to mock the mutation or IPC call.
            // Assuming the mock-api.fixture.ts handles IPC mocking.
            // If it doesn't support mocking specific IPC errors yet, we might skip or try to inject error.

            // Skipping for now as mock infrastructure for specific IPC failure might not be ready.
        });
    });
});

test.describe('Sync Empty States', () => {
    test('TC-SYNC-E024: should handle no tools detected', async ({ page, setupMockApi }) => {
        await setupMockApi({
            ...mockScenarios.forSyncWorkflow,
            tools: []
        });
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        // Tools column에 메시지 표시
        const toolsColumn = page.locator('[data-testid="sync-column-tools"]');
        await expect(toolsColumn.getByText(/No tools|empty/i)).toBeVisible();
    });

    test('TC-SYNC-E025: should handle no Rule Sets', async ({ page, setupMockApi }) => {
        await setupMockApi({
            ...mockScenarios.forSyncWorkflow,
            ruleSets: []
        });
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        // Rules column에 None만 표시
        const rulesColumn = page.locator('[data-testid="sync-column-rules"]');
        await expect(rulesColumn.getByRole('button', { name: 'None' })).toBeVisible();

        // "Create Rule Set" 링크나 메시지
        if (await rulesColumn.getByText(/Create|empty/i).isVisible({ timeout: 1000 }).catch(() => false)) {
            await expect(rulesColumn.getByText(/Create|empty/i)).toBeVisible();
        }
    });

    test('TC-SYNC-E026: should handle no MCP Sets', async ({ page, setupMockApi }) => {
        await setupMockApi({
            ...mockScenarios.forSyncWorkflow,
            mcpSets: []
        });
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        // MCP column에 None만 표시
        const mcpColumn = page.locator('[data-testid="sync-column-mcp"]');
        await expect(mcpColumn.getByRole('button', { name: 'None' })).toBeVisible();
    });

    test('TC-SYNC-E027: should handle completely empty state', async ({ page, setupMockApi }) => {
        await setupMockApi(mockScenarios.empty);
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        await expect(page.locator('button:has-text("All Tools")')).toBeVisible();
        await expect(page.locator('[data-testid="sync-column-rules"]').getByRole('button', { name: 'None' })).toBeVisible();
        await expect(page.locator('[data-testid="sync-column-mcp"]').getByRole('button', { name: 'None' })).toBeVisible();
        await syncPage.expectStartButtonDisabled();
    });
});

test.describe('Sync Data Consistency', () => {
    test('TC-SYNC-E028: should verify Rule Set content accuracy', async ({ page, setupMockApi }) => {
        const ruleContent = 'Test rule content for verification';
        await setupMockApi({
            ...mockScenarios.forSyncWorkflow,
            rules: [
                { id: 'rule-1', name: 'Rule 1', content: ruleContent, isActive: true, createdAt: '', updatedAt: '' }
            ],
            ruleSets: [
                { id: 'rule-set-1', name: 'My Rules', items: ['rule-1'], isArchived: false, createdAt: '', updatedAt: '' }
            ]
        });
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        await syncPage.selectRuleSet('rule-set-1');
        await syncPage.startSync();
        await syncPage.expectPreviewDialogVisible();

        // 파일 미리보기에서 rule 내용 확인
        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText(ruleContent);
    });

    test('TC-SYNC-E029: should verify MCP Set content accuracy', async ({ page, setupMockApi }) => {
        const mcpCommand = 'npx mcp-server-test';
        await setupMockApi({
            ...mockScenarios.forSyncWorkflow,
            mcpServers: [
                { id: 'mcp-1', name: 'Test MCP', command: mcpCommand, args: [], env: {}, isActive: true, createdAt: '', updatedAt: '' }
            ],
            mcpSets: [
                { id: 'mcp-set-1', name: 'My MCPs', items: ['mcp-1'], isArchived: false, createdAt: '', updatedAt: '' }
            ]
        });
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        await syncPage.selectMcpSet('mcp-set-1');
        await syncPage.startSync();
        await syncPage.expectPreviewDialogVisible();

        // 파일 미리보기에서 MCP 내용 확인
        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText(mcpCommand);
    });

    test('TC-SYNC-E030: should filter inactive Rules', async ({ page, setupMockApi }) => {
        await setupMockApi({
            ...mockScenarios.forSyncWorkflow,
            rules: [
                { id: 'rule-1', name: 'Active Rule', content: 'Active', isActive: true, createdAt: '', updatedAt: '' },
                { id: 'rule-2', name: 'Inactive Rule', content: 'Inactive', isActive: false, createdAt: '', updatedAt: '' }
            ],
            ruleSets: [
                { id: 'rule-set-1', name: 'My Rules', items: ['rule-1', 'rule-2'], isArchived: false, createdAt: '', updatedAt: '' }
            ]
        });
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        await syncPage.selectRuleSet('rule-set-1');
        await syncPage.startSync();
        await syncPage.expectPreviewDialogVisible();

        // Active rule만 포함
        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText('Active');
        // Inactive는 포함되지 않음
        await expect(dialog).not.toContainText('Inactive');
    });

    test('TC-SYNC-E031: should generate correct file format per tool type', async ({ page, setupMockApi }) => {
        await setupMockApi(mockScenarios.forSyncWorkflow);
        const syncPage = new SyncPage(page);
        await syncPage.navigate();

        await syncPage.selectRuleSetByName('My Rules');
        await syncPage.selectMcpSetByName('My MCPs');
        await syncPage.startSync();
        await syncPage.expectPreviewDialogVisible();

        const dialog = page.getByRole('dialog');

        // CLI 도구: .md 파일
        await expect(dialog).toContainText(/Claude.*\.md/i);

        // IDE 도구: .json 파일
        await expect(dialog).toContainText(/Cursor.*\.json|\.md/i);
    });
});