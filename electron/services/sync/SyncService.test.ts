
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncService } from './SyncService';
import path from 'path';
import fs from 'fs/promises';

// Mock dependencies
const mockRulesService = {
    getAll: vi.fn(),
} as any;

const mockMcpService = {
    getAll: vi.fn(),
} as any;

vi.mock('fs/promises');

describe('SyncService', () => {
    let service: SyncService;

    beforeEach(() => {
        service = new SyncService(
            mockMcpService,
            {} as any, // ConnectionManager - mocked inline below if needed or use variable
            mockRulesService,
            {} as any, // RuleSetService
            {} as any, // ProjectService
            {} as any, // ToolConfigService
            {} as any, // ToolIntegrationService
            {} as any  // McpSetService
        );
        vi.resetAllMocks();
    });

    describe('applySync', () => {
        it('should write content to absolute path', async () => {
            const targetPath = '/absolute/path/to/config.json';
            const content = '{"test": true}';

            await service.applySync(targetPath, content);

            expect(fs.writeFile).toHaveBeenCalledWith(targetPath, content, 'utf-8');
            expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(targetPath), { recursive: true });
        });

        // This test documents current behavior - likely fails if logic is missing
        // or passes if fs handles it (fs doesn't handle ~).
        // Since we decided to handle ~ in Generator, this test confirms that Service expects absolute path.
        it('should attempt to write to path as provided', async () => {
            const targetPath = '~/.claude/rules.md';
            const content = '# Rules';

            await service.applySync(targetPath, content);

            // It should try to write literally to '~/.claude/rules.md' relative to CWD if not absolute, 
            // or fail. But here we just check it calls writeFile.
            expect(fs.writeFile).toHaveBeenCalledWith(targetPath, content, 'utf-8');
        });
    });
});
