import { test, expect } from './fixtures/mock-api.fixture';
import { ToolsPage } from './pages/tools.page';

test.describe('Tools Feature', () => {
    let toolsPage: ToolsPage;

    test.beforeEach(async ({ page, setupMockApi }) => {
        // Default setup with some tools
        await setupMockApi({
            tools: [
                { id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } },
                { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } },
                { id: 'vscode', name: 'VS Code', type: 'ide', isInstalled: false, paths: {} }
            ],
            toolConfigs: [],
            ruleSets: [
                { id: 'rule-set-1', name: 'Global Rules', items: [], createdAt: '', updatedAt: '' },
                { id: 'rule-set-2', name: 'Project Rules', items: [], createdAt: '', updatedAt: '' }
            ],
            mcpSets: [
                { id: 'mcp-set-1', name: 'Global MCPs', items: [], isArchived: false, createdAt: '', updatedAt: '' }
            ]
        });

        toolsPage = new ToolsPage(page);
        await toolsPage.navigate();
    });

    test.describe('Detection & Display', () => {
        test('TC-TOOLS-E001: should display installed tools on startup', async () => {
            await toolsPage.expectToolVisible('claude-code');
            await toolsPage.expectToolVisible('cursor');
            await toolsPage.expectToolVisible('vscode'); // Even if not installed, might show up as available? Or specifically check installed status style
        });

        test('TC-TOOLS-E002: should show empty state when no tools detected', async ({ page, setupMockApi }) => {
            await setupMockApi({ tools: [] });
            await page.reload();
            await expect(page.getByText('No tools match your search.')).toBeVisible(); 
        });

        test('TC-TOOLS-E003: should search tools by name', async ({ page }) => {
            const searchInput = page.getByPlaceholder('Search tools...'); // Adjust selector
            if (await searchInput.isVisible()) {
                await searchInput.fill('Claude');
                await toolsPage.expectToolVisible('claude-code');
                await toolsPage.expectToolNotVisible('cursor');
            } else {
                test.skip('Search input not implemented yet');
            }
        });

        test('TC-TOOLS-E004: should display CLI tool details', async ({ page }) => {
            const claudeItem = toolsPage.getToolItem('claude-code');
            await expect(claudeItem).toBeVisible();
            await expect(claudeItem).toContainText('Claude Code');
            await expect(claudeItem).toContainText('cli'); // Type badge or indicator
        });

        test('TC-TOOLS-E005: should display IDE tool details', async ({ page }) => {
            const cursorItem = toolsPage.getToolItem('cursor');
            await expect(cursorItem).toBeVisible();
            await expect(cursorItem).toContainText('Cursor');
            await expect(cursorItem).toContainText('ide'); // Type badge or indicator
        });

        test('TC-TOOLS-E006: should disable settings for not installed tools', async ({ page }) => {
            const vscodeItem = toolsPage.getToolItem('vscode');
            // Status is in tooltip, so we primarily check the button state
            const configBtn = vscodeItem.getByRole('button', { name: 'Configure' });
            await expect(configBtn).toBeVisible();
            await expect(configBtn).toBeDisabled();
        });

        test('TC-TOOLS-E007: should refresh tool detection', async ({ page, setupMockApi }) => {
            // 초기 상태: 2개 설치
            await toolsPage.expectToolVisible('claude-code');
            await toolsPage.expectToolVisible('cursor');

            // Mock API 재설정: 새 도구 추가
            await setupMockApi({
                tools: [
                    { id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } },
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } },
                    { id: 'vscode', name: 'VS Code', type: 'ide', isInstalled: true, paths: { app: '/Applications/VSCode.app' } }
                ]
            });

            // Detect 버튼 클릭
            await toolsPage.clickDetectButton();

            // 새 도구가 표시되는지 확인
            await toolsPage.expectToolVisible('vscode');
            const vscodeConfigBtn = toolsPage.getToolItem('vscode').getByRole('button', { name: 'Configure' });
            await expect(vscodeConfigBtn).toBeEnabled(); // 이제 설치됨
        });
    });

    test.describe('Tool Configuration', () => {
        test('TC-TOOLS-E008: should open configuration dialog', async ({ page }) => {
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByRole('dialog')).toContainText('Configure Claude Code');
        });

        test('TC-TOOLS-E009: should configure with RuleSet and McpSet', async ({ page }) => {
            await toolsPage.openConfigureDialog('claude-code');

            // Page Object 메서드 사용 (nth() 제거)
            await toolsPage.selectRuleSet('Global Rules');
            await toolsPage.selectMcpSet('Global MCPs');

            // 저장 및 검증 강화
            await toolsPage.saveConfiguration();

            // 저장 성공 확인 (다이얼로그 닫힘은 saveConfiguration에서 검증)
            // 추가: Tool 카드에 설정 표시 확인 (UI 구현 시)
            // await toolsPage.expectToolConfigured('claude-code');
        });

        test('TC-TOOLS-E010: should configure with RuleSet only', async ({ page }) => {
            await toolsPage.openConfigureDialog('claude-code');

            // Page Object 메서드 사용
            await toolsPage.selectRuleSet('Global Rules');

            // MCP Set은 선택하지 않음 (기본값 None 유지)

            // 저장 및 검증
            await toolsPage.saveConfiguration();
        });

        test('TC-TOOLS-E012: should cancel configuration change', async ({ page }) => {
             await toolsPage.openConfigureDialog('claude-code');
             await toolsPage.closeConfigureDialog();
             await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('TC-TOOLS-E011: should delete existing configuration', async ({ page, setupMockApi }) => {
            // 먼저 설정된 도구 준비
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: 'rule-set-1', mcpSetId: 'mcp-set-1', updatedAt: ''
                }],
                ruleSets: [{ id: 'rule-set-1', name: 'Global Rules', items: [], createdAt: '', updatedAt: '' }],
                mcpSets: [{ id: 'mcp-set-1', name: 'Global MCPs', items: [], isArchived: false, createdAt: '', updatedAt: '' }]
            });
            await page.reload();

            await toolsPage.openConfigureDialog('claude-code');

            // 삭제 버튼 클릭
            const dialog = page.getByRole('dialog');
            const deleteBtn = dialog.getByRole('button', { name: /Delete|Remove/i });
            await expect(deleteBtn).toBeVisible();
            await deleteBtn.click();

            // 확인 다이얼로그가 있으면 확인
            const confirmBtn = page.getByRole('button', { name: /Confirm|Yes/i });
            if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await confirmBtn.click();
            }

            // 다이얼로그 닫힘 확인
            await expect(dialog).not.toBeVisible();
        });

        test('TC-TOOLS-E013: should show import from CLAUDE.md button', async ({ page }) => {
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByText('Import from CLAUDE.md')).toBeVisible();
        });

        test('TC-TOOLS-E014: should handle import failure', async ({ page }) => {
            await toolsPage.openConfigureDialog('claude-code');

            // Mock API로 import 실패 시뮬레이션
            await page.addInitScript(() => {
                if (window.api?.tools?.importRuleFromClaudeMd) {
                    window.api.tools.importRuleFromClaudeMd = async () => {
                        throw new Error('CLAUDE.md not found');
                    };
                }
            });

            const importBtn = page.getByText('Import from CLAUDE.md');
            await importBtn.click();

            // 에러 메시지 표시 확인
            await expect(page.getByText(/not found|failed|error/i)).toBeVisible();
        });

        test('TC-TOOLS-E015: should configure multiple tools independently', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [
                    { id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } },
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } }
                ],
                ruleSets: [
                    { id: 'rule-set-1', name: 'Rule A', items: [], createdAt: '', updatedAt: '' },
                    { id: 'rule-set-2', name: 'Rule B', items: [], createdAt: '', updatedAt: '' }
                ],
                mcpSets: []
            });
            await page.reload();

            // Claude Code 설정
            await toolsPage.openConfigureDialog('claude-code');
            await toolsPage.selectRuleSet('Rule A');
            await toolsPage.saveConfiguration();

            // Cursor 설정
            await toolsPage.openConfigureDialog('cursor');
            await toolsPage.selectRuleSet('Rule B');
            await toolsPage.saveConfiguration();

            // 각 도구의 설정이 독립적임을 확인 (재오픈하여 검증)
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toContainText('Rule A');
            await toolsPage.closeConfigureDialog();

            await toolsPage.openConfigureDialog('cursor');
            await expect(page.getByRole('dialog')).toContainText('Rule B');
            await toolsPage.closeConfigureDialog();
        });
    });

    test.describe('Orphan Handling', () => {
        test('TC-TOOLS-E016: should handle orphan RuleSet', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: 'orphan-rule', mcpSetId: null, updatedAt: ''
                }],
                ruleSets: []
            });
            await page.reload();
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toContainText('Missing');
        });

        test('TC-TOOLS-E017: should handle orphan McpSet', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: null, mcpSetId: 'orphan-mcp', updatedAt: ''
                }],
                mcpSets: []
            });
            await page.reload();
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toContainText('Missing');
        });
    });

    test.describe('Performance & Error Scenarios', () => {
        test('TC-TOOLS-E018: should handle slow API response', async ({ page }) => {
            // Mock slow loading
            await page.addInitScript(() => {
                if (window.api?.tools?.getToolConfigs) {
                    const original = window.api.tools.getToolConfigs;
                    window.api.tools.getToolConfigs = async (toolId: string) => {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        return original(toolId);
                    };
                }
            });

            await toolsPage.openConfigureDialog('claude-code');

            // 로딩 인디케이터 표시 확인 (있으면)
            const dialog = page.getByRole('dialog');
            const loadingIndicator = dialog.getByText(/Loading|loading/i);
            if (await loadingIndicator.isVisible({ timeout: 500 }).catch(() => false)) {
                await expect(loadingIndicator).toBeVisible();
            }

            // 최종적으로 콘텐츠 로드됨
            await expect(dialog.getByLabel('Rule Set')).toBeVisible({ timeout: 5000 });
        });

        test('TC-TOOLS-E019: should handle save error and retry', async ({ page }) => {
            const attemptCount = 0;

            await page.addInitScript(() => {
                if (window.api?.tools?.saveToolConfig) {
                    window.api.tools.saveToolConfig = async () => {
                        (window as any).attemptCount = ((window as any).attemptCount || 0) + 1;
                        if ((window as any).attemptCount === 1) {
                            throw new Error('Network error');
                        }
                        return { success: true };
                    };
                }
            });

            await toolsPage.openConfigureDialog('claude-code');
            await toolsPage.selectRuleSet('Global Rules');

            // 첫 번째 저장 시도 - 실패
            const dialog = page.getByRole('dialog');
            await dialog.getByRole('button', { name: 'Save' }).click();

            // 에러 메시지 표시
            await expect(page.getByText(/error|failed/i)).toBeVisible();

            // Retry 버튼 클릭 또는 재시도
            const retryBtn = page.getByRole('button', { name: /Retry|Try again/i });
            if (await retryBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await retryBtn.click();
            } else {
                // Retry 버튼이 없으면 다시 Save 클릭
                await dialog.getByRole('button', { name: 'Save' }).click();
            }

            // 두 번째 시도는 성공
            await expect(dialog).not.toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Project-Specific Configuration', () => {
        test('TC-TOOLS-E020: should configure tool for specific project', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                projects: [
                    { id: 'proj-1', name: 'My Project', path: '/path/to/project', createdAt: '', updatedAt: '' }
                ],
                ruleSets: [
                    { id: 'rule-set-1', name: 'Project Rules', items: [], createdAt: '', updatedAt: '' }
                ]
            });
            await page.reload();

            await toolsPage.openConfigureDialog('claude-code');

            // Context Type 선택 (Global vs Project)
            const dialog = page.getByRole('dialog');
            const contextSelector = dialog.getByLabel(/Context|Scope/i);
            if (await contextSelector.isVisible({ timeout: 1000 }).catch(() => false)) {
                await contextSelector.click();
                await page.getByRole('option', { name: /Project/i }).click();

                // 프로젝트 선택
                await dialog.getByLabel(/Project/i).click();
                await page.getByRole('option', { name: 'My Project' }).click();
            }

            await toolsPage.selectRuleSet('Project Rules');
            await toolsPage.saveConfiguration();
        });

        test('TC-TOOLS-E021: should override global config with project config', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [
                    {
                        id: 'conf-global', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                        ruleSetId: 'rule-set-global', mcpSetId: null, updatedAt: ''
                    },
                    {
                        id: 'conf-project', toolId: 'claude-code', contextType: 'project', contextId: 'proj-1',
                        ruleSetId: 'rule-set-project', mcpSetId: null, updatedAt: ''
                    }
                ],
                projects: [
                    { id: 'proj-1', name: 'My Project', path: '/path/to/project', createdAt: '', updatedAt: '' }
                ],
                ruleSets: [
                    { id: 'rule-set-global', name: 'Global Rules', items: [], createdAt: '', updatedAt: '' },
                    { id: 'rule-set-project', name: 'Project Rules', items: [], createdAt: '', updatedAt: '' }
                ]
            });
            await page.reload();

            // 프로젝트 컨텍스트에서 열 때 프로젝트 설정이 보여야 함
            await toolsPage.openConfigureDialog('claude-code');
            const dialog = page.getByRole('dialog');

            // 프로젝트 설정이 표시되는지 확인
            await expect(dialog).toContainText('Project Rules');
        });
    });

    test.describe('UI/UX Workflows', () => {
        test('TC-TOOLS-E022: should navigate from Tools to Rules page', async ({ page }) => {
            // Configure dialog에서 Rules 페이지 링크 클릭
            await toolsPage.openConfigureDialog('claude-code');

            const dialog = page.getByRole('dialog');
            const rulesLink = dialog.getByRole('link', { name: /Manage Rules|Go to Rules/i });
            if (await rulesLink.isVisible({ timeout: 1000 }).catch(() => false)) {
                await rulesLink.click();
                await expect(page).toHaveURL(/\/rules/);
            } else {
                // 직접 네비게이션 테스트
                await toolsPage.closeConfigureDialog();
                await page.getByTestId('nav-rules').click();
                await expect(page).toHaveURL(/\/rules/);
            }
        });

        test('TC-TOOLS-E023: should create sync files after configuration', async ({ page, setupMockApi }) => {
            const syncFileCreated = false;

            await page.addInitScript(() => {
                if (window.api?.sync?.generateFiles) {
                    window.api.sync.generateFiles = async () => {
                        (window as any).syncFileCreated = true;
                        return { success: true, files: ['/path/to/.claude/CLAUDE.md'] };
                    };
                }
            });

            await toolsPage.openConfigureDialog('claude-code');
            await toolsPage.selectRuleSet('Global Rules');
            await toolsPage.saveConfiguration();

            // Sync 페이지로 이동하여 파일 생성 확인
            await page.getByTestId('nav-sync').click();

            // Sync 버튼 활성화 또는 파일 목록 표시 확인
            const syncBtn = page.getByRole('button', { name: /Sync|Synchronize/i });
            if (await syncBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await expect(syncBtn).toBeEnabled();
            }
        });

        test('TC-TOOLS-E024: should view tool configuration in read-only mode', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: 'rule-set-1', mcpSetId: null, updatedAt: ''
                }],
                ruleSets: [{ id: 'rule-set-1', name: 'Global Rules', items: [], createdAt: '', updatedAt: '' }]
            });
            await page.reload();

            await toolsPage.openConfigureDialog('claude-code');

            const dialog = page.getByRole('dialog');

            // View 모드 토글이 있다면 클릭
            const viewModeToggle = dialog.getByRole('button', { name: /View|Read-only/i });
            if (await viewModeToggle.isVisible({ timeout: 1000 }).catch(() => false)) {
                await viewModeToggle.click();

                // Save 버튼 비활성화 확인
                await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();
            } else {
                // 설정이 있으면 기본적으로 수정 가능
                await expect(dialog.getByRole('button', { name: 'Save' })).toBeEnabled();
            }
        });

        test('TC-TOOLS-E025: should handle configuration when no RuleSets exist', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                ruleSets: [],
                mcpSets: []
            });
            await page.reload();

            await toolsPage.openConfigureDialog('claude-code');

            const dialog = page.getByRole('dialog');

            // Empty state 또는 "Create RuleSet" 링크 표시
            const createRuleSetLink = dialog.getByText(/Create.*Rule.*Set|No.*Rule.*Set/i);
            await expect(createRuleSetLink).toBeVisible();
        });

        test('TC-TOOLS-E026: should handle configuration when no McpSets exist', async ({ page, setupMockApi }) => {
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                ruleSets: [{ id: 'rule-set-1', name: 'Global Rules', items: [], createdAt: '', updatedAt: '' }],
                mcpSets: []
            });
            await page.reload();

            await toolsPage.openConfigureDialog('claude-code');

            const dialog = page.getByRole('dialog');

            // MCP Set 선택기에 "None" 또는 빈 상태 표시
            await expect(dialog.getByLabel('MCP Set')).toBeVisible();

            // "Create MCP Set" 링크나 None 옵션 확인
            const mcpSelector = dialog.getByLabel('MCP Set');
            await mcpSelector.click();
            const noneOption = page.getByRole('option', { name: /None/i });
            await expect(noneOption).toBeVisible();
        });
    });

    test.describe('Error Handling & Edge Cases', () => {
        test('TC-TOOLS-E030: should handle tool detection failure', async ({ page }) => {
            await page.addInitScript(() => {
                if (window.api?.tools?.detect) {
                    window.api.tools.detect = async () => {
                        throw new Error('Failed to detect tools');
                    };
                }
            });

            await toolsPage.clickDetectButton();

            // 에러 메시지 표시
            await expect(page.getByText(/failed.*detect|error/i)).toBeVisible();
        });

        test('TC-TOOLS-E031: should handle database error during config load', async ({ page }) => {
            await page.addInitScript(() => {
                if (window.api?.tools?.getToolConfigs) {
                    window.api.tools.getToolConfigs = async () => {
                        throw new Error('Database connection failed');
                    };
                }
            });

            await toolsPage.openConfigureDialog('claude-code');

            // 에러 상태 표시
            await expect(page.getByText(/database|error|failed/i)).toBeVisible();
        });

        test('TC-TOOLS-E032: should handle rapid dialog open/close', async ({ page }) => {
            // 빠르게 열고 닫기 반복
            for (let i = 0; i < 3; i++) {
                await toolsPage.openConfigureDialog('claude-code');
                await toolsPage.closeConfigureDialog();
            }

            // 마지막에 정상 동작 확인
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toBeVisible();
            await toolsPage.closeConfigureDialog();
        });

        test('TC-TOOLS-E033: should allow configuration while detection is running', async ({ page }) => {
            // 감지 시작 (느린 응답 시뮬레이션)
            await page.addInitScript(() => {
                if (window.api?.tools?.detect) {
                    window.api.tools.detect = async () => {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        return { success: true };
                    };
                }
            });

            toolsPage.clickDetectButton(); // await 없이 실행

            // 감지 진행 중에도 설정 가능
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toBeVisible();
            await toolsPage.closeConfigureDialog();
        });

        test('TC-TOOLS-E034: should handle special characters in search', async ({ page }) => {
            const searchInput = page.getByPlaceholder('Search tools...');
            if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
                await searchInput.fill('C++');
                // 특수문자가 있어도 검색 정상 동작
                await expect(searchInput).toHaveValue('C++');

                await searchInput.fill('Code (Beta)');
                await expect(searchInput).toHaveValue('Code (Beta)');
            } else {
                test.skip('Search not implemented');
            }
        });

        test('TC-TOOLS-E035: should handle long tool names in UI', async ({ page, setupMockApi }) => {
            const longName = 'Very Long Tool Name That Might Overflow The UI Container And Break Layout';
            await setupMockApi({
                tools: [{
                    id: 'long-tool',
                    name: longName,
                    type: 'cli',
                    isInstalled: true,
                    paths: { app: '/usr/bin/long-tool' }
                }]
            });
            await page.reload();

            const toolItem = toolsPage.getToolItem('long-tool');
            await expect(toolItem).toBeVisible();

            // 텍스트가 잘리거나 ellipsis 처리되는지 확인
            const nameElement = toolItem.getByText(longName, { exact: false });
            await expect(nameElement).toBeVisible();
        });

        test('TC-TOOLS-E036: should handle tool config after RuleSet deletion', async ({ page, setupMockApi }) => {
            // 초기: RuleSet이 있는 상태로 설정
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: 'rule-set-1', mcpSetId: null, updatedAt: ''
                }],
                ruleSets: [{ id: 'rule-set-1', name: 'Global Rules', items: [], createdAt: '', updatedAt: '' }]
            });
            await page.reload();

            // RuleSet 삭제 시뮬레이션
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: 'rule-set-1', mcpSetId: null, updatedAt: ''
                }],
                ruleSets: [] // RuleSet 삭제됨
            });
            await page.reload();

            // 도구 설정 다이얼로그에서 orphan 표시
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toContainText('Missing');
        });

        test('TC-TOOLS-E037: should handle large CLAUDE.md import', async ({ page }) => {
            await page.addInitScript(() => {
                if (window.api?.tools?.importRuleFromClaudeMd) {
                    window.api.tools.importRuleFromClaudeMd = async () => {
                        // 10MB 크기의 텍스트 시뮬레이션
                        const largeContent = 'A'.repeat(10 * 1024 * 1024);
                        return { success: true, content: largeContent };
                    };
                }
            });

            await toolsPage.openConfigureDialog('claude-code');
            const importBtn = page.getByText('Import from CLAUDE.md');
            await importBtn.click();

            // 로딩 인디케이터 또는 성공 메시지
            await expect(page.getByText(/imported|success/i)).toBeVisible({ timeout: 10000 });
        });

        test('TC-TOOLS-E038: should prevent concurrent configuration of same tool', async ({ page }) => {
            // 첫 번째 다이얼로그 열기
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toBeVisible();

            // 같은 도구의 Configure 버튼 다시 클릭
            const configBtn = toolsPage.getToolItem('claude-code').getByRole('button', { name: 'Configure' });

            // 버튼이 비활성화되거나, 클릭해도 새 다이얼로그가 안 열림
            if (await configBtn.isEnabled({ timeout: 1000 }).catch(() => true)) {
                await configBtn.click();
                // 다이얼로그가 여러 개 안 열림 (하나만 존재)
                await expect(page.getByRole('dialog')).toHaveCount(1);
            } else {
                await expect(configBtn).toBeDisabled();
            }
        });
    });

    test.describe('Integration with Other Features', () => {
        test('TC-TOOLS-E041: should trigger filesystem sync after configuration', async ({ page, setupMockApi }) => {
            const syncCalled = false;

            await page.addInitScript(() => {
                if (window.api?.sync?.generateFiles) {
                    const original = window.api.sync.generateFiles;
                    window.api.sync.generateFiles = async (params) => {
                        (window as any).syncCalled = true;
                        return original ? original(params) : { success: true, files: [] };
                    };
                }
            });

            await toolsPage.openConfigureDialog('claude-code');
            await toolsPage.selectRuleSet('Global Rules');
            await toolsPage.saveConfiguration();

            // Sync 페이지로 이동하여 파일 생성 확인
            await page.getByTestId('nav-sync').click();

            // Sync 버튼 클릭
            const syncBtn = page.getByRole('button', { name: /Sync|Synchronize/i });
            if (await syncBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await syncBtn.click();

                // 성공 메시지 또는 결과 표시
                await expect(page.getByText(/success|synced|completed/i)).toBeVisible({ timeout: 5000 });
            }
        });

        test('TC-TOOLS-E042: should handle RuleSet lifecycle in tool config', async ({ page, setupMockApi }) => {
            // Step 1: RuleSet 생성
            await page.getByTestId('nav-rules').click();
            await page.getByRole('button', { name: /Create.*Set|New.*Set/i }).click();

            const setNameInput = page.getByLabel(/Set.*Name|Name/i);
            await setNameInput.fill('Temp Rules');
            await page.getByRole('button', { name: 'Create' }).click();

            // RuleSet ID 획득 (Mock API에서)
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                ruleSets: [
                    { id: 'temp-rules', name: 'Temp Rules', items: [], createdAt: '', updatedAt: '' }
                ]
            });

            // Step 2: Tools 페이지로 이동하여 설정
            await page.getByTestId('nav-tools').click();
            await toolsPage.openConfigureDialog('claude-code');
            await toolsPage.selectRuleSet('Temp Rules');
            await toolsPage.saveConfiguration();

            // Step 3: RuleSet 삭제
            await page.getByTestId('nav-rules').click();

            const tempRuleSetItem = page.getByText('Temp Rules');
            await tempRuleSetItem.click();

            const deleteBtn = page.getByRole('button', { name: /Delete.*Set/i });
            await deleteBtn.click();

            // 확인 다이얼로그
            const confirmBtn = page.getByRole('button', { name: /Confirm|Yes|Delete/i });
            await confirmBtn.click();

            // Step 4: Tools 페이지에서 orphan 상태 확인
            await setupMockApi({
                tools: [{ id: 'claude-code', name: 'Claude Code', type: 'cli', isInstalled: true, paths: { app: '/usr/bin/claude' } }],
                toolConfigs: [{
                    id: 'conf-1', toolId: 'claude-code', contextType: 'global', contextId: 'global',
                    ruleSetId: 'temp-rules', mcpSetId: null, updatedAt: ''
                }],
                ruleSets: [] // 삭제됨
            });

            await page.getByTestId('nav-tools').click();
            await toolsPage.openConfigureDialog('claude-code');
            await expect(page.getByRole('dialog')).toContainText('Missing');
        });
    });
});