
import { describe, it, expect } from 'vitest';
import { CursorGenerator } from './CursorGenerator';
import { Rule, McpServer } from '../../../shared/types';

describe('CursorGenerator', () => {
    const generator = new CursorGenerator();
    const mockRules: Rule[] = [
        { id: '1', name: 'rule1', content: 'content1', isActive: true, createdAt: 'now', updatedAt: 'now' }
    ];
    const mockMcpServers: McpServer[] = [
        { id: 's1', name: 'Server1', command: 'cmd', args: [], env: {}, isActive: true, createdAt: 'now', updatedAt: 'now' }
    ];

    describe('generateRules', () => {
        it('should generate .mdc files for Project scope', () => {
            const files = generator.generateRules('Project', mockRules);
            expect(files).toHaveLength(1);
            expect(files[0].path).toBe('.cursor/rules/rule1.mdc');
        });
    });

    describe('generateMcpConfig', () => {
        it('should return mcp.json for Project scope', () => {
            const files = generator.generateMcpConfig('Project', mockMcpServers);
            expect(files).toHaveLength(1);
            expect(files[0].path).toBe('.cursor/mcp.json');
        });
    });
});
