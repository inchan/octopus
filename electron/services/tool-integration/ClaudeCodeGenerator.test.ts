
import { describe, it, expect } from 'vitest';
import { ClaudeCodeGenerator } from './ClaudeCodeGenerator';
import { Rule, McpServer } from '../../../shared/types';
import path from 'path';
import os from 'os';

describe('ClaudeCodeGenerator', () => {
    const generator = new ClaudeCodeGenerator();

    describe('getSupportStatus', () => {
        it('should support Global scope for rules and mcp', () => {
            const status = generator.getSupportStatus('Global');
            expect(status).toEqual({ rules: true, mcp: true });
        });

        it('should support ProjectLocal scope for MCP only', () => {
            const status = generator.getSupportStatus('ProjectLocal');
            expect(status).toEqual({ rules: false, mcp: true });
        });
    });

    describe('generateRules', () => {
        it('should generate rules file for Global scope with absolute path', () => {
            const rules: Rule[] = [
                { id: '1', name: 'Rule 1', content: 'Content 1', isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateRules('Global', rules);

            expect(result).toHaveLength(1);
            expect(result[0].path).toBe(path.join(os.homedir(), '.claude', 'CLAUDE.md'));
            expect(result[0].content).toContain('# Claude Code Rules (Global)');
            expect(result[0].content).toContain('## Rule 1');
            expect(result[0].content).toContain('Content 1');
        });

        it('should return empty array for ProjectLocal scope', () => {
            const rules: Rule[] = [{ id: '1', name: 'Rule 1', content: 'Content 1', isActive: true, createdAt: '0', updatedAt: '0' }];
            const result = generator.generateRules('ProjectLocal', rules);
            expect(result).toHaveLength(0);
        });
    });

    describe('generateMcpConfig', () => {
        it('should generate mcp config file for Global scope with absolute path', () => {
            const mcpServers: McpServer[] = [
                { id: '1', name: 'server1', command: 'node', args: ['server.js'], env: {}, isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateMcpConfig('Global', mcpServers);

            expect(result).toHaveLength(1);
            expect(result[0].path).toBe(path.join(os.homedir(), '.claude.json'));

            const content = JSON.parse(result[0].content);
            expect(content.mcpServers).toBeDefined();
            expect(content.mcpServers['server1']).toBeDefined();
        });
    });
});
