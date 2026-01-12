import { describe, it, expect } from 'vitest';
import { RovoDevGenerator } from './RovoDevGenerator';
import { Rule, McpServer } from '../../../shared/types';
import path from 'path';
import os from 'os';

describe('RovoDevGenerator', () => {
    const generator = new RovoDevGenerator();

    describe('getSupportStatus', () => {
        it('should support Global scope for rules and mcp', () => {
            const status = generator.getSupportStatus('Global');
            expect(status).toEqual({ rules: true, mcp: true });
        });

        it('should not support ProjectLocal scope', () => {
            const status = generator.getSupportStatus('ProjectLocal');
            expect(status).toEqual({ rules: false, mcp: false });
        });

        it('should not support Project scope', () => {
            const status = generator.getSupportStatus('Project');
            expect(status).toEqual({ rules: false, mcp: false });
        });
    });

    describe('generateRules', () => {
        it('should generate AGENTS.md for Global scope', () => {
            const rules: Rule[] = [
                { id: '1', name: 'Rule 1', content: 'Content 1', isActive: true, createdAt: '0', updatedAt: '0' },
                { id: '2', name: 'Rule 2', content: 'Content 2', isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateRules('Global', rules);

            expect(result).toHaveLength(1);
            expect(result[0].path).toBe(path.join(os.homedir(), '.rovodev', 'AGENTS.md'));
            expect(result[0].content).toContain('# Rovo Dev Global Rules');
            expect(result[0].content).toContain('## Rule 1');
            expect(result[0].content).toContain('Content 1');
            expect(result[0].content).toContain('## Rule 2');
            expect(result[0].content).toContain('Content 2');
        });

        it('should return empty array for non-Global scope', () => {
            const rules: Rule[] = [{ id: '1', name: 'Rule 1', content: 'Content 1', isActive: true, createdAt: '0', updatedAt: '0' }];

            expect(generator.generateRules('ProjectLocal', rules)).toHaveLength(0);
            expect(generator.generateRules('Project', rules)).toHaveLength(0);
        });

        it('should generate header only for empty rules', () => {
            const result = generator.generateRules('Global', []);

            expect(result).toHaveLength(1);
            expect(result[0].content).toBe('# Rovo Dev Global Rules\n\n');
        });
    });

    describe('generateMcpConfig', () => {
        it('should generate JSON mcp config for Global scope', () => {
            const mcpServers: McpServer[] = [
                { id: '1', name: 'server1', command: 'node', args: ['server.js'], env: { KEY: 'value' }, isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateMcpConfig('Global', mcpServers);

            expect(result).toHaveLength(1);
            expect(result[0].path).toBe(path.join(os.homedir(), '.rovodev', 'mcp.json'));

            const content = JSON.parse(result[0].content);
            expect(content.mcpServers).toBeDefined();
            expect(content.mcpServers['server1']).toEqual({
                command: 'node',
                args: ['server.js'],
                env: { KEY: 'value' }
            });
        });

        it('should handle HTTP type MCP servers', () => {
            const mcpServers: McpServer[] = [
                { id: '1', name: 'http-server', command: '', args: [], env: {}, url: 'http://localhost:3000', isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateMcpConfig('Global', mcpServers);
            const content = JSON.parse(result[0].content);

            expect(content.mcpServers['http-server']).toEqual({
                type: 'http',
                url: 'http://localhost:3000'
            });
        });

        it('should skip inactive servers', () => {
            const mcpServers: McpServer[] = [
                { id: '1', name: 'active', command: 'node', args: [], env: {}, isActive: true, createdAt: '0', updatedAt: '0' },
                { id: '2', name: 'inactive', command: 'node', args: [], env: {}, isActive: false, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateMcpConfig('Global', mcpServers);
            const content = JSON.parse(result[0].content);

            expect(Object.keys(content.mcpServers)).toHaveLength(1);
            expect(content.mcpServers['active']).toBeDefined();
            expect(content.mcpServers['inactive']).toBeUndefined();
        });

        it('should apply Serena optimization', () => {
            const mcpServers: McpServer[] = [
                { id: '1', name: 'serena', command: 'npx', args: ['original', 'args'], env: {}, isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            const result = generator.generateMcpConfig('Global', mcpServers);
            const content = JSON.parse(result[0].content);

            expect(content.mcpServers['serena'].args).toContain('--context');
            expect(content.mcpServers['serena'].args).toContain('agent');
        });

        it('should return empty array for non-Global scope', () => {
            const mcpServers: McpServer[] = [
                { id: '1', name: 'server1', command: 'node', args: [], env: {}, isActive: true, createdAt: '0', updatedAt: '0' }
            ];

            expect(generator.generateMcpConfig('ProjectLocal', mcpServers)).toHaveLength(0);
            expect(generator.generateMcpConfig('Project', mcpServers)).toHaveLength(0);
        });
    });
});
