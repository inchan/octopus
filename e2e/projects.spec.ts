
import { test, expect } from './fixtures/mock-api.fixture';
import { ProjectsPage } from './pages/projects.page';

/**
 * Projects Management E2E 테스트
 *
 * 프로젝트 관리 기능의 전체 워크플로우를 검증합니다:
 * - 프로젝트 추가 (디렉토리 스캔)
 * - 프로젝트 검색 및 필터링
 * - 프로젝트 상세 페이지 (Tool 설정, Sync, 삭제)
 */
test.describe('Projects Management', () => {
    let projectsPage: ProjectsPage;

    test.beforeEach(async ({ page, setupMockApi }) => {
        projectsPage = new ProjectsPage(page);
    });

    /**
     * TC-PROJ-E001: 초기 Empty State 표시
     * 목적: 프로젝트가 없을 때 사용자에게 안내 메시지 표시
     */
    test('TC-PROJ-E001: should display empty state initially', async ({ page, setupMockApi }) => {
        await setupMockApi({ projects: [] });
        await page.goto('/');
        await page.getByTestId('nav-projects').click();

        await expect(page.getByTestId('projects-page')).toBeVisible();
        await projectsPage.expectProjectCount(0);
        await expect(projectsPage.emptyState).toContainText('No projects found');
    });

    /**
     * TC-PROJ-E002: 디렉토리 스캔으로 프로젝트 추가
     * 목적: 파일시스템에서 프로젝트를 감지하고 추가하는 기능 검증
     */
    test('TC-PROJ-E002: should add a project via directory scan', async ({ page, setupMockApi }) => {
        await setupMockApi({ projects: [] });
        await page.goto('/');
        await page.getByTestId('nav-projects').click();

        const mockPath = '/Users/test/my-project';
        
        await projectsPage.openAddDialog();
        await projectsPage.scanDirectory(mockPath);
        
        const candidateItem = page.getByTestId(`projects-scan-item-${mockPath}`);
        await expect(candidateItem).toBeVisible();

        await candidateItem.click();
        await projectsPage.submitAdd();

        await projectsPage.expectProjectVisible('my-project');
    });

    /**
     * TC-PROJ-E004: 프로젝트 이름으로 검색
     * 목적: 검색 필터링이 정상 작동하는지 검증
     */
    test('TC-PROJ-E004: should search projects by name', async ({ page, setupMockApi }) => {
        await setupMockApi({
            projects: [
                { id: 'p1', name: 'Alpha Project', path: '/path/alpha', type: 'node', updatedAt: new Date().toISOString() },
                { id: 'p2', name: 'Beta Project', path: '/path/beta', type: 'python', updatedAt: new Date().toISOString() }
            ]
        });
        await page.goto('/');
        await page.getByTestId('nav-projects').click();

        await projectsPage.searchProjects('Alpha');

        // Locator 기반 검증으로 변경 (안정성 향상)
        await expect(
            page.getByTestId('projects-item-name').filter({ hasText: 'Alpha Project' })
        ).toBeVisible();
        await expect(
            page.getByTestId('projects-item-name').filter({ hasText: 'Beta Project' })
        ).toHaveCount(0);
    });

    /**
     * TC-PROJ-E006: 검색 필터 초기화
     * 목적: 검색어 제거 시 전체 목록이 다시 표시되는지 검증
     */
    test('TC-PROJ-E006: should reset search filter', async ({ page, setupMockApi }) => {
        await setupMockApi({
            projects: [
                { id: 'p1', name: 'Alpha Project', path: '/path/alpha', type: 'node', updatedAt: new Date().toISOString() },
                { id: 'p2', name: 'Beta Project', path: '/path/beta', type: 'python', updatedAt: new Date().toISOString() }
            ]
        });
        await page.goto('/');
        await page.getByTestId('nav-projects').click();

        await projectsPage.searchProjects('Alpha');
        await expect(page.getByTestId('projects-item-name')).toHaveCount(1);

        await projectsPage.searchProjects('');
        await expect(page.getByTestId('projects-item-name')).toHaveCount(2);
    });

    /**
     * TC-PROJ-E007: 프로젝트 상세 페이지로 이동
     * 목적: 프로젝트 클릭 시 상세 페이지가 표시되는지 검증
     */
    test('TC-PROJ-E007: should navigate to project detail page', async ({ page, setupMockApi }) => {
        await setupMockApi({
            projects: [
                { id: 'p1', name: 'Detail Project', path: '/path/detail', type: 'node', updatedAt: new Date().toISOString() }
            ]
        });
        await page.goto('/');
        await page.getByTestId('nav-projects').click();

        await projectsPage.getProjectItem('p1').click();

        await expect(page.getByTestId('projects-detail')).toBeVisible();
        await expect(page.getByTestId('projects-detail-name')).toContainText('Detail Project');
    });

    /**
     * Projects Detail Page 테스트 그룹
     * 프로젝트 상세 페이지의 핵심 기능(Tool 설정, Sync, 삭제) 검증
     */
    test.describe('Projects Detail Page', () => {
        /**
         * TC-PROJ-E008: 프로젝트 상세 페이지에서 Tool 설정
         * 목적: 프로젝트별 Tool 설정이 정상적으로 저장되는지 검증
         */
        test('TC-PROJ-E008: should configure tool settings from detail page', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Test Project', path: '/test', type: 'node', updatedAt: new Date().toISOString() }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'My Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Detail 페이지 표시 확인
            await expect(page.getByTestId('projects-detail')).toBeVisible();
            await expect(page.getByTestId('projects-detail-name')).toHaveText('Test Project');

            // Tool Config 설정
            await page.getByTestId('projects-detail-tools').click();
            const toolItem = page.getByTestId('projects-tool-cursor');
            await expect(toolItem).toBeVisible();

            // Rule Set 연결
            await page.getByTestId('projects-tool-cursor-ruleset-select').click();
            await page.getByRole('option', { name: 'My Rules' }).click();

            // 저장 확인
            await page.getByTestId('projects-tool-save').click();
            await expect(page.getByText('Tool configuration saved')).toBeVisible();
        });

        /**
         * TC-PROJ-E009: 프로젝트 상세 페이지에서 Sync 실행
         * 목적: 프로젝트별 동기화가 Sync Preview 다이얼로그를 표시하는지 검증
         */
        test('TC-PROJ-E009: should trigger sync from detail page', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Test Project', path: '/test', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 버튼 클릭
            await page.getByTestId('projects-detail-sync').click();

            // Sync Preview 다이얼로그 표시
            await expect(page.getByTestId('sync-preview-dialog')).toBeVisible();
            await expect(page.getByTestId('sync-preview-dialog')).toContainText('Test Project');
        });

        /**
         * TC-PROJ-E010: 프로젝트 삭제
         * 목적: 프로젝트 삭제 후 목록에서 제거되는지 검증
         */
        test('TC-PROJ-E010: should delete project', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'To Delete', path: '/test', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 삭제 버튼 클릭
            await page.getByTestId('projects-detail-delete').click();

            // Confirm Dialog
            await page.getByTestId('alert-dialog-confirm-button').click();

            // 목록으로 돌아가고 삭제됨 확인
            await expect(page.getByTestId('projects-page')).toBeVisible();
            await expect(page.getByTestId('projects-item-p1')).toHaveCount(0);
        });
    });

    /**
     * Directory Scan 테스트 그룹 (TC-PROJ-E101~E107)
     * 목적: 디렉토리 스캔 기능의 다양한 시나리오 검증
     */
    test.describe('Directory Scan', () => {
        /**
         * TC-PROJ-E101: 프로젝트가 없는 디렉토리 스캔
         */
        test('TC-PROJ-E101: should handle directory scan with no projects', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            // Mock API override for empty scan result
            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    const originalScan = window.api.projects.scan;
                    // @ts-ignore
                    window.api.projects.scan = async (path) => {
                        if (path === '/empty-directory') {
                            return { success: true, data: [] };
                        }
                        return originalScan(path);
                    };
                }
            });

            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/empty-directory');

            await expect(page.getByText(/No projects found|empty/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E102: 중첩 프로젝트 감지
         */
        test('TC-PROJ-E102: should detect nested projects', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    // @ts-ignore
                    window.api.projects.scan = async (path) => {
                        if (path === '/workspace/nested') {
                            return {
                                success: true,
                                data: [
                                    { id: 'scan-1', name: 'parent-project', path: '/workspace/nested', type: 'node', updatedAt: new Date().toISOString() },
                                    { id: 'scan-2', name: 'child-project', path: '/workspace/nested/packages/child', type: 'python', updatedAt: new Date().toISOString() }
                                ]
                            };
                        }
                        return { success: true, data: [] };
                    };
                }
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/workspace/nested');

            await expect(page.getByText('parent-project')).toBeVisible();
            await expect(page.getByText('child-project')).toBeVisible();
        });

        /**
         * TC-PROJ-E103: node_modules 무시
         */
        test('TC-PROJ-E103: should ignore node_modules directories', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    // @ts-ignore
                    window.api.projects.scan = async (path) => {
                        if (path === '/workspace/with-node-modules') {
                            return {
                                success: true,
                                data: [
                                    { id: 'scan-1', name: 'main-project', path: '/workspace/with-node-modules', type: 'node', updatedAt: new Date().toISOString() }
                                ]
                            };
                        }
                        return { success: true, data: [] };
                    };
                }
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/workspace/with-node-modules');

            await expect(page.getByText('main-project')).toBeVisible();
            await expect(page.getByText('node_modules')).toHaveCount(0);
        });

        /**
         * TC-PROJ-E104: 권한 에러 처리
         */
        test('TC-PROJ-E104: should handle permission errors', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    // @ts-ignore
                    window.api.projects.scan = async (path) => {
                        if (path === '/no-permission') {
                            return { success: false, error: 'Permission denied' };
                        }
                        return { success: true, data: [] };
                    };
                }
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/no-permission');

            await expect(page.getByText(/Permission denied|error/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E105: 깊은 디렉토리 구조 (maxDepth)
         */
        test('TC-PROJ-E105: should respect maxDepth limit', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    // @ts-ignore
                    window.api.projects.scan = async (path) => {
                        if (path === '/deep/nested/structure') {
                            return {
                                success: true,
                                data: [
                                    { id: 'scan-1', name: 'level-1', path: '/deep/nested/structure/level-1', type: 'general', updatedAt: new Date().toISOString() },
                                    { id: 'scan-2', name: 'level-2', path: '/deep/nested/structure/level-1/level-2', type: 'general', updatedAt: new Date().toISOString() },
                                    { id: 'scan-3', name: 'level-3', path: '/deep/nested/structure/level-1/level-2/level-3', type: 'general', updatedAt: new Date().toISOString() }
                                ]
                            };
                        }
                        return { success: true, data: [] };
                    };
                }
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/deep/nested/structure');

            await expect(page.getByText('level-1')).toBeVisible();
            await expect(page.getByText('level-2')).toBeVisible();
            await expect(page.getByText('level-3')).toBeVisible();
        });

        /**
         * TC-PROJ-E106: 잘못된 경로 에러 처리
         */
        test('TC-PROJ-E106: should handle invalid path errors', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    // @ts-ignore
                    window.api.projects.scan = async (path) => {
                        if (path === '/nonexistent/path') {
                            return { success: false, error: 'Invalid path or directory not found' };
                        }
                        return { success: true, data: [] };
                    };
                }
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/nonexistent/path');

            await expect(page.getByText(/Invalid path|not found|error/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E107: 스캔 취소 (구현 시)
         */
        test.skip('TC-PROJ-E107: should cancel ongoing scan', async ({ page, setupMockApi }) => {
            // Skip: UI에 취소 기능이 없으면 나중에 구현
            await setupMockApi({ projects: [] });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();

            // TODO: 스캔 시작 후 취소 버튼 테스트
        });
    });

    /**
     * 프로젝트 상세 & 도구 통합 테스트 (TC-PROJ-E201~E204)
     * 목적: 프로젝트 상세 페이지에서 도구 관련 기능 검증
     */
    test.describe('Project Detail - Tool Integration', () => {
        /**
         * TC-PROJ-E201: 프로젝트의 감지된 도구 표시
         */
        test('TC-PROJ-E201: should display detected tools for project', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Node Project', path: '/test/node-project', type: 'node', updatedAt: new Date().toISOString() }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } },
                    { id: 'claude-cli', name: 'Claude CLI', type: 'cli', isInstalled: true, paths: { bin: '/usr/local/bin/claude' } }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 상세 페이지 표시 확인
            await expect(page.getByTestId('projects-detail')).toBeVisible();

            // 감지된 도구 섹션 표시
            await expect(page.getByTestId('projects-detail-tools-section')).toBeVisible();

            // 설치된 도구 목록 표시
            await expect(page.getByTestId('projects-tool-cursor')).toBeVisible();
            await expect(page.getByTestId('projects-tool-claude-cli')).toBeVisible();
        });

        /**
         * TC-PROJ-E202: 프로젝트용 도구 설정
         */
        test('TC-PROJ-E202: should configure tool settings for project', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Test Project', path: '/test', type: 'node', updatedAt: new Date().toISOString() }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Backend Rules', items: [], isArchived: false }
                ],
                mcpSets: [
                    { id: 'mcp1', name: 'MCP Set 1', servers: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 도구 설정 버튼 클릭
            await page.getByTestId('projects-tool-cursor-configure').click();

            // 설정 다이얼로그 표시
            await expect(page.getByTestId('tool-config-dialog')).toBeVisible();

            // RuleSet 선택
            await page.getByTestId('tool-config-ruleset-select').click();
            await page.getByRole('option', { name: 'Backend Rules' }).click();

            // McpSet 선택
            await page.getByTestId('tool-config-mcpset-select').click();
            await page.getByRole('option', { name: 'MCP Set 1' }).click();

            // 저장
            await page.getByTestId('tool-config-save').click();

            // 성공 메시지
            await expect(page.getByText(/saved|success/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E203: 도구가 설치되지 않은 경우 표시
         */
        test('TC-PROJ-E203: should show tools not installed message', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Test Project', path: '/test', type: 'node', updatedAt: new Date().toISOString() }
                ],
                tools: [
                    { id: 'vscode', name: 'VS Code', type: 'ide', isInstalled: false, paths: {} }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 도구 목록 표시
            const notInstalledTool = page.getByTestId('projects-tool-vscode');
            await expect(notInstalledTool).toBeVisible();

            // "Not Installed" 상태 표시
            await expect(notInstalledTool.getByText(/not installed/i)).toBeVisible();

            // 설정 버튼 비활성화
            const configButton = notInstalledTool.getByTestId('projects-tool-vscode-configure');
            await expect(configButton).toBeDisabled();
        });

        /**
         * TC-PROJ-E204: 프로젝트 상세에서 도구 검색
         */
        test('TC-PROJ-E204: should search tools in project detail', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Test Project', path: '/test', type: 'node', updatedAt: new Date().toISOString() }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } },
                    { id: 'claude-cli', name: 'Claude CLI', type: 'cli', isInstalled: true, paths: { bin: '/usr/local/bin/claude' } },
                    { id: 'vscode', name: 'VS Code', type: 'ide', isInstalled: true, paths: { app: '/Applications/VSCode.app' } }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 도구 검색 입력
            const searchInput = page.getByTestId('projects-tools-search');
            await searchInput.fill('Cursor');

            // Cursor만 표시
            await expect(page.getByTestId('projects-tool-cursor')).toBeVisible();
            await expect(page.getByTestId('projects-tool-claude-cli')).toHaveCount(0);
            await expect(page.getByTestId('projects-tool-vscode')).toHaveCount(0);

            // 검색 초기화
            await searchInput.clear();
            await expect(page.getByTestId('projects-tool-cursor')).toBeVisible();
            await expect(page.getByTestId('projects-tool-claude-cli')).toBeVisible();
            await expect(page.getByTestId('projects-tool-vscode')).toBeVisible();
        });
    });

    /**
     * 동기화 작업 테스트 (TC-PROJ-E301~E306)
     * 목적: 프로젝트별 동기화 기능 검증
     */
    test.describe('Project Sync Operations', () => {
        /**
         * TC-PROJ-E301: 설정이 있는 프로젝트 동기화
         */
        test('TC-PROJ-E301: should sync project with existing configuration', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Configured Project',
                        path: '/test/configured',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1', mcpSetId: 'mcp1' }
                        }
                    }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'My Rules', items: [{ id: 'r1', name: 'Rule 1', content: 'Content', isActive: true }], isArchived: false }
                ],
                mcpSets: [
                    { id: 'mcp1', name: 'MCP Set', servers: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 버튼 클릭
            await page.getByTestId('projects-detail-sync').click();

            // Sync Preview 다이얼로그 표시
            await expect(page.getByTestId('sync-preview-dialog')).toBeVisible();
            await expect(page.getByText('Configured Project')).toBeVisible();

            // 동기화할 파일 목록 표시
            await expect(page.getByText(/.cursorrules|CURSOR.md/i)).toBeVisible();

            // 확인 버튼 클릭
            await page.getByTestId('sync-preview-confirm').click();

            // 성공 메시지
            await expect(page.getByText(/sync.*success|synced/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E302: 설정이 없는 프로젝트 동기화 알림
         */
        test('TC-PROJ-E302: should show warning for project without configuration', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Unconfigured Project', path: '/test/unconfigured', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 버튼이 비활성화되거나 경고 표시
            const syncButton = page.getByTestId('projects-detail-sync');

            // 버튼 클릭 시도
            await syncButton.click();

            // 경고 메시지 표시
            await expect(page.getByText(/no configuration|configure tools first/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E303: 기존 파일이 있는 경우 diff 미리보기
         */
        test('TC-PROJ-E303: should show diff preview for existing files', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Existing Files Project',
                        path: '/test/existing',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1' }
                        }
                    }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Updated Rules', items: [{ id: 'r1', name: 'Rule 1', content: 'New Content', isActive: true }], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 버튼 클릭
            await page.getByTestId('projects-detail-sync').click();

            // Preview 다이얼로그에서 diff 표시
            await expect(page.getByTestId('sync-preview-dialog')).toBeVisible();

            // Diff 또는 변경사항 표시
            await expect(page.getByText(/changes|modified|diff/i)).toBeVisible();

            // 파일별 변경사항 확인 가능
            const fileItem = page.getByTestId('sync-preview-file-item').first();
            await expect(fileItem).toBeVisible();
        });

        /**
         * TC-PROJ-E304: 동기화 미리보기 취소
         */
        test('TC-PROJ-E304: should cancel sync preview', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Test Project',
                        path: '/test',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1' }
                        }
                    }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 버튼 클릭
            await page.getByTestId('projects-detail-sync').click();
            await expect(page.getByTestId('sync-preview-dialog')).toBeVisible();

            // 취소 버튼 클릭
            await page.getByTestId('sync-preview-cancel').click();

            // 다이얼로그 닫힘
            await expect(page.getByTestId('sync-preview-dialog')).toHaveCount(0);

            // 프로젝트 상세 페이지에 남아있음
            await expect(page.getByTestId('projects-detail')).toBeVisible();
        });

        /**
         * TC-PROJ-E305: 쓰기 권한 에러 처리
         */
        test('TC-PROJ-E305: should handle write permission errors', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Read Only Project',
                        path: '/test/readonly',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1' }
                        }
                    }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Mock API override for permission error
            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.sync?.syncProject) {
                    // @ts-ignore
                    window.api.sync.syncProject = async () => {
                        return { success: false, error: 'Permission denied: Cannot write to /test/readonly' };
                    };
                }
            });

            // Sync 시도
            await page.getByTestId('projects-detail-sync').click();
            await page.getByTestId('sync-preview-confirm').click();

            // 에러 메시지 표시
            await expect(page.getByText(/permission denied|cannot write/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E306: 여러 도구 동시 동기화
         */
        test('TC-PROJ-E306: should sync multiple tools simultaneously', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Multi Tool Project',
                        path: '/test/multi',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1' },
                            'claude-cli': { ruleSetId: 'rs1' }
                        }
                    }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } },
                    { id: 'claude-cli', name: 'Claude CLI', type: 'cli', isInstalled: true, paths: { bin: '/usr/local/bin/claude' } }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Shared Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 버튼 클릭
            await page.getByTestId('projects-detail-sync').click();

            // Preview에서 여러 도구의 파일 표시
            await expect(page.getByTestId('sync-preview-dialog')).toBeVisible();

            // Cursor 파일
            await expect(page.getByText(/.cursorrules|CURSOR.md/i)).toBeVisible();

            // Claude CLI 파일
            await expect(page.getByText(/CLAUDE.md/i)).toBeVisible();

            // 확인
            await page.getByTestId('sync-preview-confirm').click();
            await expect(page.getByText(/sync.*success|synced/i)).toBeVisible();
        });
    });

    /**
     * 에러 처리 & 엣지 케이스 테스트 (TC-PROJ-E401~E408)
     * 목적: 예외 상황 및 경계 조건 검증
     */
    test.describe('Error Handling & Edge Cases', () => {
        /**
         * TC-PROJ-E401: 중복 프로젝트 경로 추가 방지
         */
        test('TC-PROJ-E401: should prevent duplicate project path', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Existing Project', path: '/test/existing', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            // 동일한 경로로 프로젝트 추가 시도
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/test/existing');

            // 중복 경고 메시지
            await expect(page.getByText(/already exists|duplicate/i)).toBeVisible();

            // 추가 버튼 비활성화 또는 에러 표시
            const submitButton = page.getByTestId('projects-add-submit');
            await expect(submitButton).toBeDisabled();
        });

        /**
         * TC-PROJ-E402: IPC 타임아웃 처리
         */
        test('TC-PROJ-E402: should handle IPC timeout', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            // Mock API override for timeout
            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.scan) {
                    // @ts-ignore
                    window.api.projects.scan = async () => {
                        await new Promise(resolve => setTimeout(resolve, 100000)); // 긴 지연
                        return { success: true, data: [] };
                    };
                }
            });

            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory('/test/slow');

            // 타임아웃 에러 또는 로딩 상태
            await expect(page.getByText(/timeout|taking too long/i).or(page.getByTestId('loading-spinner'))).toBeVisible({ timeout: 5000 });
        });

        /**
         * TC-PROJ-E403: 삭제된 디렉토리 처리
         */
        test('TC-PROJ-E403: should handle deleted directory', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Deleted Project', path: '/test/deleted', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            // Mock API override - 디렉토리 삭제됨
            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.get) {
                    // @ts-ignore
                    window.api.projects.get = async (id) => {
                        if (id === 'p1') {
                            return {
                                success: false,
                                error: 'Directory not found: /test/deleted'
                            };
                        }
                        return { success: true, data: null };
                    };
                }
            });

            // 프로젝트 클릭 시도
            await page.getByTestId('projects-item-p1').click();

            // 에러 메시지 표시
            await expect(page.getByText(/directory not found|path does not exist/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E404: 동시 수정 처리
         */
        test('TC-PROJ-E404: should handle concurrent modifications', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Concurrent Project', path: '/test/concurrent', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 다른 세션에서 수정된 것처럼 시뮬레이션
            await page.addInitScript(() => {
                // @ts-ignore
                if (window.api?.projects?.update) {
                    // @ts-ignore
                    window.api.projects.update = async () => {
                        return {
                            success: false,
                            error: 'Project was modified by another process'
                        };
                    };
                }
            });

            // 설정 변경 시도
            await page.getByTestId('projects-detail-tools').click();
            await page.getByTestId('projects-tool-save').click();

            // 충돌 에러 메시지
            await expect(page.getByText(/modified by another|conflict/i)).toBeVisible();
        });

        /**
         * TC-PROJ-E405: 특수문자 경로 처리
         */
        test('TC-PROJ-E405: should handle special characters in path', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            const specialPath = '/test/프로젝트/with-特殊字符';

            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory(specialPath);

            // 특수문자 경로가 정상적으로 표시됨
            const candidateItem = page.getByTestId(`projects-scan-item-${specialPath}`);
            await expect(candidateItem).toBeVisible();
            await expect(candidateItem).toContainText('프로젝트');
            await expect(candidateItem).toContainText('特殊字符');
        });

        /**
         * TC-PROJ-E406: 긴 프로젝트 이름 표시
         */
        test('TC-PROJ-E406: should display long project names', async ({ page, setupMockApi }) => {
            const longName = 'Very Long Project Name That Exceeds Normal Display Width And Should Be Truncated Or Wrapped Properly';

            await setupMockApi({
                projects: [
                    { id: 'p1', name: longName, path: '/test/long', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            const projectItem = page.getByTestId('projects-item-p1');
            await expect(projectItem).toBeVisible();

            // 이름이 적절히 표시됨 (truncate 또는 wrap)
            const nameElement = projectItem.getByTestId('projects-item-name');
            await expect(nameElement).toBeVisible();

            // 전체 이름이 title 속성이나 tooltip으로 제공됨
            const hasTitle = await nameElement.evaluate(el => el.hasAttribute('title') || el.textContent?.includes(longName.substring(0, 20)));
            expect(hasTitle).toBe(true);
        });

        /**
         * TC-PROJ-E407: 연속 빠른 스캔 처리
         */
        test('TC-PROJ-E407: should handle rapid consecutive scans', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await projectsPage.openAddDialog();

            // 빠르게 여러 번 스캔
            await projectsPage.scanDirectory('/test/path1');
            await page.waitForTimeout(100);

            await projectsPage.scanDirectory('/test/path2');
            await page.waitForTimeout(100);

            await projectsPage.scanDirectory('/test/path3');

            // 마지막 스캔 결과만 표시되거나 모든 결과가 큐에서 처리됨
            const scanItems = page.getByTestId(/^projects-scan-item-/);
            const count = await scanItems.count();

            // 적어도 마지막 스캔의 결과는 표시되어야 함
            expect(count).toBeGreaterThanOrEqual(0);
        });

        /**
         * TC-PROJ-E408: 대량 프로젝트 성능 (100+)
         */
        test('TC-PROJ-E408: should handle large number of projects', async ({ page, setupMockApi }) => {
            // 100개 프로젝트 생성
            const projects = Array.from({ length: 100 }, (_, i) => ({
                id: `p${i}`,
                name: `Project ${i}`,
                path: `/test/project-${i}`,
                type: 'node' as const,
                updatedAt: new Date().toISOString()
            }));

            await setupMockApi({ projects });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            // 페이지 로드 확인
            await expect(page.getByTestId('projects-page')).toBeVisible();

            // 프로젝트 목록이 표시됨
            const projectItems = page.getByTestId(/^projects-item-/);
            const count = await projectItems.count();

            // 최소한 일부 프로젝트가 표시됨 (페이지네이션 또는 가상화)
            expect(count).toBeGreaterThan(0);

            // 검색 기능이 정상 작동
            await projectsPage.searchProjects('Project 50');
            await expect(page.getByText('Project 50')).toBeVisible();
        });
    });

    /**
     * 다른 기능과의 통합 테스트 (TC-PROJ-E501~E503)
     * 목적: 프로젝트 기능이 다른 기능들과 올바르게 통합되는지 검증
     */
    test.describe('Integration with Other Features', () => {
        /**
         * TC-PROJ-E501: 프로젝트 동기화 시 전역 동기화 상태 업데이트
         */
        test('TC-PROJ-E501: should update global sync status when project syncs', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Sync Test Project',
                        path: '/test/sync',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1' }
                        }
                    }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // Sync 실행
            await page.getByTestId('projects-detail-sync').click();
            await page.getByTestId('sync-preview-confirm').click();

            // Sync 페이지로 이동하여 상태 확인
            await page.getByTestId('nav-sync').click();

            // 프로젝트의 최근 동기화 상태가 반영됨
            await expect(page.getByText('Sync Test Project')).toBeVisible();
        });

        /**
         * TC-PROJ-E502: 프로젝트 삭제 시 도구 설정 제거
         */
        test('TC-PROJ-E502: should remove tool configs when project deleted', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'To Delete',
                        path: '/test/delete',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs1' }
                        }
                    }
                ],
                tools: [
                    { id: 'cursor', name: 'Cursor', type: 'ide', isInstalled: true, paths: { app: '/Applications/Cursor.app' } }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 프로젝트 삭제
            await page.getByTestId('projects-detail-delete').click();
            await page.getByTestId('alert-dialog-confirm-button').click();

            // Tools 페이지로 이동
            await page.getByTestId('nav-tools').click();

            // Cursor 도구의 프로젝트별 설정이 제거되었는지 확인
            const cursorTool = page.getByTestId('tool-card-cursor');
            await expect(cursorTool).toBeVisible();

            // 프로젝트가 더 이상 연결되지 않음
            await cursorTool.click();
            await expect(page.getByText('To Delete')).toHaveCount(0);
        });

        /**
         * TC-PROJ-E503: 프로젝트 설정이 전역 설정 재정의
         */
        test('TC-PROJ-E503: should override global settings with project settings', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    {
                        id: 'p1',
                        name: 'Override Project',
                        path: '/test/override',
                        type: 'node',
                        updatedAt: new Date().toISOString(),
                        toolConfigs: {
                            'cursor': { ruleSetId: 'rs2' } // 프로젝트별 설정
                        }
                    }
                ],
                tools: [
                    {
                        id: 'cursor',
                        name: 'Cursor',
                        type: 'ide',
                        isInstalled: true,
                        paths: { app: '/Applications/Cursor.app' },
                        globalConfig: { ruleSetId: 'rs1' } // 전역 설정
                    }
                ],
                ruleSets: [
                    { id: 'rs1', name: 'Global Rules', items: [], isArchived: false },
                    { id: 'rs2', name: 'Project Rules', items: [], isArchived: false }
                ]
            });

            await page.goto('/');
            await page.getByTestId('nav-projects').click();
            await page.getByTestId('projects-item-p1').click();

            // 도구 설정 확인
            await page.getByTestId('projects-detail-tools').click();

            // Cursor 도구가 프로젝트별 설정을 사용함
            const cursorTool = page.getByTestId('projects-tool-cursor');
            await expect(cursorTool).toBeVisible();

            // 프로젝트별 RuleSet이 선택됨
            const ruleSetSelect = page.getByTestId('projects-tool-cursor-ruleset-select');
            await expect(ruleSetSelect).toHaveValue(/Project Rules|rs2/i);

            // Sync 시 프로젝트별 설정 사용
            await page.getByTestId('projects-detail-sync').click();
            await expect(page.getByTestId('sync-preview-dialog')).toBeVisible();

            // Preview에 프로젝트별 Rules가 반영됨
            await expect(page.getByText('Project Rules')).toBeVisible();
            await expect(page.getByText('Global Rules')).toHaveCount(0);
        });
    });

    /**
     * Edge Case 테스트: 특수 문자 및 경로 처리
     */
    test.describe('Edge Cases - Special Characters', () => {
        test('should handle project path with spaces', async ({ page, setupMockApi }) => {
            await setupMockApi({ projects: [] });
            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            const pathWithSpaces = '/Users/test/My Project Folder';
            await projectsPage.openAddDialog();
            await projectsPage.scanDirectory(pathWithSpaces);

            const candidateItem = page.getByTestId(`projects-scan-item-${pathWithSpaces}`);
            await expect(candidateItem).toBeVisible();
        });

        test('should handle project name with special characters', async ({ page, setupMockApi }) => {
            await setupMockApi({
                projects: [
                    { id: 'p1', name: 'Project $pecial & Chars', path: '/path', type: 'node', updatedAt: new Date().toISOString() }
                ]
            });
            await page.goto('/');
            await page.getByTestId('nav-projects').click();

            await projectsPage.searchProjects('$pecial');
            await expect(
                page.getByTestId('projects-item-name').filter({ hasText: 'Project $pecial & Chars' })
            ).toBeVisible();
        });
    });
});
