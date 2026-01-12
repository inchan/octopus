import { describe, it, expect } from 'vitest';
import { OpenCodeGenerator } from './OpenCodeGenerator';
import { Rule, McpServer } from '../../../shared/types';
import path from 'path';
import os from 'os';

describe('OpenCodeGenerator', () => {
    const generator = new OpenCodeGenerator();

    // Test fixtures
    const mockRules: Rule[] = [
        { id: '1', name: 'Coding Standards', content: 'Always use TypeScript', isActive: true, createdAt: '0', updatedAt: '0' },
        { id: '2', name: 'Testing', content: 'Write tests first (TDD)', isActive: true, createdAt: '0', updatedAt: '0' }
    ];

    const mockMcpServers: McpServer[] = [
        { id: '1', name: 'filesystem', command: 'npx', args: ['-y', '@anthropic/mcp-server-filesystem'], env: {}, isActive: true, createdAt: '0', updatedAt: '0' },
        { id: '2', name: 'remote-api', url: 'https://api.example.com/mcp', command: '', args: [], env: {}, isActive: true, createdAt: '0', updatedAt: '0' },
        { id: '3', name: 'inactive-server', command: 'npx', args: ['inactive'], env: {}, isActive: false, createdAt: '0', updatedAt: '0' }
    ];

    describe('getSupportStatus', () => {
        it('should support Global scope for rules and mcp', () => {
            const status = generator.getSupportStatus('Global');
            expect(status).toEqual({ rules: true, mcp: true });
        });

        it('should support Project scope for rules and mcp', () => {
            const status = generator.getSupportStatus('Project');
            expect(status).toEqual({ rules: true, mcp: true });
        });

        it('should not support ProjectLocal scope', () => {
            const status = generator.getSupportStatus('ProjectLocal');
            expect(status).toEqual({ rules: false, mcp: false });
        });
    });

    describe('generateRules', () => {
        describe('Global scope', () => {
            it('should generate AGENTS.md file at ~/.config/opencode/', () => {
                const result = generator.generateRules('Global', mockRules);

                expect(result).toHaveLength(1);
                expect(result[0].path).toBe(path.join(os.homedir(), '.config', 'opencode', 'AGENTS.md'));
            });

            it('should format rules with header and sections', () => {
                const result = generator.generateRules('Global', mockRules);

                expect(result[0].content).toContain('# OpenCode Rules (Global)');
                expect(result[0].content).toContain('## Coding Standards');
                expect(result[0].content).toContain('Always use TypeScript');
                expect(result[0].content).toContain('## Testing');
                expect(result[0].content).toContain('Write tests first (TDD)');
            });

            it('should include description for UI', () => {
                const result = generator.generateRules('Global', mockRules);
                expect(result[0].description).toBeDefined();
            });
        });

        describe('Project scope', () => {
            it('should generate AGENTS.md at project root (relative path)', () => {
                const result = generator.generateRules('Project', mockRules);

                expect(result).toHaveLength(1);
                expect(result[0].path).toBe('AGENTS.md');
            });

            it('should format rules with project header', () => {
                const result = generator.generateRules('Project', mockRules);

                expect(result[0].content).toContain('# OpenCode Rules (Project)');
            });
        });

        describe('ProjectLocal scope', () => {
            it('should return empty array (not supported)', () => {
                const result = generator.generateRules('ProjectLocal', mockRules);
                expect(result).toHaveLength(0);
            });
        });
    });

    describe('generateMcpConfig', () => {
        describe('Global scope', () => {
            it('should generate opencode.json at ~/.config/opencode/', () => {
                const result = generator.generateMcpConfig('Global', mockMcpServers);

                expect(result).toHaveLength(1);
                expect(result[0].path).toBe(path.join(os.homedir(), '.config', 'opencode', 'opencode.json'));
            });

            it('should use OpenCode mcp format (not mcpServers)', () => {
                const result = generator.generateMcpConfig('Global', mockMcpServers);
                const content = JSON.parse(result[0].content);

                // OpenCode uses "mcp" key, not "mcpServers"
                expect(content.mcp).toBeDefined();
                expect(content.mcpServers).toBeUndefined();
            });

            it('should include command-based servers with correct structure', () => {
                const result = generator.generateMcpConfig('Global', mockMcpServers);
                const content = JSON.parse(result[0].content);

                expect(content.mcp['filesystem']).toBeDefined();
                expect(content.mcp['filesystem'].type).toBe('local');
                // OpenCode expects command to be an array including args
                expect(content.mcp['filesystem'].command).toEqual(['npx', '-y', '@anthropic/mcp-server-filesystem']);
                expect(content.mcp['filesystem'].args).toBeUndefined();
                expect(content.mcp['filesystem'].enabled).toBe(true);
            });

            it('should include URL-based servers with remote type', () => {
                const result = generator.generateMcpConfig('Global', mockMcpServers);
                const content = JSON.parse(result[0].content);

                expect(content.mcp['remote-api']).toBeDefined();
                expect(content.mcp['remote-api'].type).toBe('remote');
                expect(content.mcp['remote-api'].url).toBe('https://api.example.com/mcp');
                expect(content.mcp['remote-api'].enabled).toBe(true);
            });

            it('should exclude inactive servers', () => {
                const result = generator.generateMcpConfig('Global', mockMcpServers);
                const content = JSON.parse(result[0].content);

                expect(content.mcp['inactive-server']).toBeUndefined();
            });
        });

        describe('Project scope', () => {
            it('should generate opencode.json at project root (relative path)', () => {
                const result = generator.generateMcpConfig('Project', mockMcpServers);

                expect(result).toHaveLength(1);
                expect(result[0].path).toBe('opencode.json');
            });

            it('should use same mcp format as Global', () => {
                const result = generator.generateMcpConfig('Project', mockMcpServers);
                const content = JSON.parse(result[0].content);

                expect(content.mcp).toBeDefined();
                expect(content.mcp['filesystem']).toBeDefined();
            });
        });

        describe('ProjectLocal scope', () => {
            it('should return empty array (not supported)', () => {
                const result = generator.generateMcpConfig('ProjectLocal', mockMcpServers);
                expect(result).toHaveLength(0);
            });
        });
    });
});
