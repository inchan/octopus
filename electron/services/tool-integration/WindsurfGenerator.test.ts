
import { describe, it, expect } from 'vitest';
import { WindsurfGenerator } from './WindsurfGenerator';
import { Rule, McpServer } from '../../../shared/types';

import path from 'path';
import os from 'os';

describe('WindsurfGenerator', () => {
    const generator = new WindsurfGenerator();
    const mockRules: Rule[] = [
        { id: '1', name: 'test', content: 'rule content', isActive: true, createdAt: 'now', updatedAt: 'now' }
    ];
    const mockMcpServers: McpServer[] = [{
        id: 's1', name: 'S1', command: 'cmd', args: [], env: {}, isActive: true, createdAt: 'now', updatedAt: 'now'
    }];

    describe('generateRules', () => {
        it('should generate .windsurfrules for Global and Project scope', () => {
            const files = generator.generateRules('Project', mockRules);
            expect(files[0].path).toBe('.windsurfrules');
            expect(files[0].content).toContain('rule content');
        });
    });

    describe('generateMcpConfig', () => {
        it('should return mcp_config.json for Global scope', () => {
            const files = generator.generateMcpConfig('Global', mockMcpServers);
            expect(files).toHaveLength(1);
            expect(files[0].path).toBe(path.join(os.homedir(), '.codeium', 'windsurf', 'mcp_config.json'));
            expect(files[0].content).toContain('"S1"');
        });
    });
});
