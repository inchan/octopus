import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SyncService } from './SyncService';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { Rule } from '../../../shared/types';

// Mock Dependencies
vi.mock('../mcp/McpService');
vi.mock('../rules/RulesService');
vi.mock('./McpConnectionManager');
vi.mock('../sets/RuleSetService');

describe('SyncService Scenarios', () => {
    let syncService: SyncService;
    let mockMcpService: any;
    let mockRulesService: any;
    let mockRuleSetService: any;
    let mockConnectionManager: any;
    let tempDir: string;

    // Mocks for Phase 4
    let mockProjectService: any;
    let mockToolConfigService: any;
    let mockToolIntegrationService: any;
    let mockMcpSetService: any;

    beforeEach(() => {
        // Create a real temp directory for file operations
        tempDir = path.join(os.tmpdir(), `sync-scenarios-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });

        // Setup Mocks
        mockMcpService = {
            getAll: vi.fn().mockResolvedValue([])
        };
        mockRulesService = {
            getAll: vi.fn().mockResolvedValue([]),
            create: vi.fn(),
        };
        mockRuleSetService = {
            create: vi.fn().mockResolvedValue({ id: 'new-set-id' }),
            getById: vi.fn().mockResolvedValue(null)
        };
        mockConnectionManager = {
            connect: vi.fn()
        };
        mockProjectService = {
            getAll: vi.fn().mockResolvedValue([])
        };
        mockToolConfigService = {
            getProjectConfigs: vi.fn().mockResolvedValue([])
        };
        mockToolIntegrationService = {
            generateConfig: vi.fn().mockResolvedValue([])
        };
        mockMcpSetService = {
            getById: vi.fn().mockResolvedValue(null)
        };

        syncService = new SyncService(
            mockMcpService,
            mockConnectionManager,
            mockRulesService,
            mockRuleSetService,
            mockProjectService,
            mockToolConfigService,
            mockToolIntegrationService,
            mockMcpSetService
        );
    });

    afterEach(() => {
        // Cleanup temp directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    // ... Phase 1, 2, 3 ...
    // Phase 1: Generator Fidelity (Data Integrity)
    describe('Phase 1: Generator Fidelity', () => {
        it('should generate CLAUDE.md ensuring all rule content is preserved', async () => {
            // Arrange
            const rules: Rule[] = [
                { id: '1', name: 'Identity', content: 'You are a coding expert.', isActive: true, createdAt: '', updatedAt: '' },
                { id: '2', name: 'Style', content: '- Use TypeScript\n- Use TDD', isActive: true, createdAt: '', updatedAt: '' }
            ];
            mockRulesService.getAll.mockResolvedValue(rules);

            // Act
            const preview = await syncService.generatePreview(tempDir, 'claude');

            // Assert
            expect(preview.targetPath).toMatch(/CLAUDE\.md$/);
            // Check content structure
            expect(preview.diff.newContent).toContain('You are a coding expert.');
            expect(preview.diff.newContent).toContain('- Use TypeScript');
            expect(preview.diff.newContent).toContain('- Use TDD');
            // Check that it doesn't contain undefined or [object Object]
            expect(preview.diff.newContent).not.toMatch(/undefined|\[object Object\]/);
        });

        it('should output correct filename for different tool IDs', async () => {
            mockRulesService.getAll.mockResolvedValue([]);

            const cursorResult = await syncService.generatePreview(tempDir, 'cursor');
            expect(cursorResult.targetPath).toMatch(/\.cursorrules$/);

            const windsurfResult = await syncService.generatePreview(tempDir, 'windsurf');
            expect(windsurfResult.targetPath).toMatch(/\.windsurfrules$/);
        });
    });

    // Phase 2: Import Robustness
    describe('Phase 2: Import Robustness', () => {
        it('should successfully import valid CLAUDE.md and create rules', async () => {
            // Arrange
            const claudeMdPath = path.join(tempDir, 'CLAUDE.md');
            const fileContent = `
# Project Rules

## Active Rules

### Coding Style
Use consistent indentation.
Avoid global variables.

### Testing
Always write unit tests.
            `.trim();
            fs.writeFileSync(claudeMdPath, fileContent, 'utf-8');

            // Mock rule creation to return a dummy rule
            mockRulesService.create.mockImplementation((params: any) => Promise.resolve({ ...params, id: 'rule-' + Math.random() }));

            // Act
            const result = await syncService.importClaudeMd(claudeMdPath);

            // Assert
            expect(result.ruleCount).toBeGreaterThan(0);
            expect(mockRulesService.create).toHaveBeenCalled();
            expect(mockRuleSetService.create).toHaveBeenCalled();

            // Verify specific rule extraction (approximate, depending on parser logic)
            // The default importer might split by headers
            expect(mockRulesService.create).toHaveBeenCalledWith(expect.objectContaining({
                name: expect.stringMatching(/Coding Style/),
                content: expect.stringContaining('Use consistent indentation'),
            }));
        });

        it('should handle empty files gracefully', async () => {
            const emptyPath = path.join(tempDir, 'EMPTY.md');
            fs.writeFileSync(emptyPath, '', 'utf-8');

            const result = await syncService.importClaudeMd(emptyPath);

            expect(result.ruleCount).toBe(0);
            expect(mockRulesService.create).not.toHaveBeenCalled();
        });
    });

    // Phase 3: Error Handling
    describe('Phase 3: Error Handling', () => {
        it('should fail cleanly if target directory is not writable during apply', async () => {
            const readOnlyDir = path.join(tempDir, 'readonly');
            fs.mkdirSync(readOnlyDir, { mode: 0o444 }); // Read-only

            const targetPath = path.join(readOnlyDir, 'test.md');

            // Expect applySync to throw standard FS error
            await expect(syncService.applySync(targetPath, 'content'))
                .rejects
                .toThrow(/EACCES|permission denied/i);
        });
    });

    // Phase 4: Project Sync
    describe('Phase 4: Project Sync', () => {
        it('should generate config files for configured tools in a project', async () => {
            const projectId = 'test-project-1';
            const projectPath = path.join(tempDir, 'my-project');
            const project = { id: projectId, name: 'My Project', path: projectPath };

            mockProjectService.getAll.mockResolvedValue([project]);

            // Config: Project has Cursor configured
            mockToolConfigService.getProjectConfigs.mockResolvedValue([
                { id: 'cfg1', toolId: 'cursor', projectId, ruleSetId: 'rs1', mcpSetId: null }
            ]);

            // Rule Set Mock
            mockRuleSetService.getById.mockResolvedValue({ id: 'rs1', name: 'My Rules', items: ['r1'] });
            mockRulesService.getAll.mockResolvedValue([{ id: 'r1', name: 'Rule 1', content: 'Do not panic' }]);

            // Integration Service Mock
            // Should return a relative path file
            mockToolIntegrationService.generateConfig.mockResolvedValue([
                { path: '.cursorrules', content: 'Do not panic' }
            ]);

            // Act
            const results = await syncService.getProjectSyncPreview(projectId);

            // Assert
            expect(results).toHaveLength(1);
            expect(results[0].path).toBe(path.join(projectPath, '.cursorrules'));
            expect(results[0].content).toContain('Do not panic');
            expect(mockToolIntegrationService.generateConfig).toHaveBeenCalledWith(
                'Cursor',
                'Project',
                expect.objectContaining({ rules: expect.arrayContaining([expect.objectContaining({ id: 'r1' })]) })
            );
        });
    });
});
