import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SyncService } from './SyncService';
// Unused imports removed
// import { McpService } from '../mcp/McpService';
// import { RulesService } from '../rules/RulesService';
// import { McpConnectionManager } from './McpConnectionManager';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Mock Dependencies
vi.mock('../mcp/McpService');
vi.mock('../rules/RulesService');
vi.mock('./McpConnectionManager');

describe('SyncService Integration', () => {
    let syncService: SyncService;
    let mockMcpService: any;
    let mockRulesService: any;
    let mockRuleSetService: any; // Added
    let mockConnectionManager: any;
    let tempDir: string;

    beforeEach(() => {
        tempDir = path.join(os.tmpdir(), `test-sync-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });

        mockMcpService = {
            getAll: vi.fn().mockResolvedValue([])
        };
        mockRulesService = {
            getAll: vi.fn().mockResolvedValue([
                { id: '1', name: 'Rule 1', content: 'Use TDD', isActive: true },
                { id: '2', name: 'Rule 2', content: 'Clean Code', isActive: true }
            ])
        };
        mockRuleSetService = { create: vi.fn() }; // Added
        mockConnectionManager = {
            connect: vi.fn()
        };

        syncService = new SyncService(
            mockMcpService,
            mockConnectionManager,
            mockRulesService,
            mockRuleSetService
        );
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('should generate preview for Windsurf', async () => {
        const preview = await syncService.generatePreview(tempDir, 'windsurf');

        expect(preview.targetPath).toContain('.windsurfrules');
        expect(preview.diff.newContent).toContain('### Rule 1');
        expect(preview.diff.newContent).toContain('Use TDD');
        expect(preview.diff.newContent).toContain('### Rule 2');
    });

    it('should generate preview for Cursor', async () => {
        const preview = await syncService.generatePreview(tempDir, 'cursor');

        expect(preview.targetPath).toContain('.cursorrules');
        expect(preview.diff.newContent).toContain('Use TDD');
    });

    it('should apply sync by writing file', async () => {
        const filePath = path.join(tempDir, 'test-file.md');
        const content = '# Hello World';

        await syncService.applySync(filePath, content);

        expect(fs.existsSync(filePath)).toBe(true);
        const written = fs.readFileSync(filePath, 'utf-8');
        expect(written).toBe(content);
    });
});
