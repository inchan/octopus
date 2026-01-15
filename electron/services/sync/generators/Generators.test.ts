import { ClaudeMdGenerator } from './ClaudeMdGenerator';
import { CursorRulesGenerator } from './CursorRulesGenerator';
import { CursorConfigGenerator } from './CursorConfigGenerator';
import { WindsurfRulesGenerator } from './WindsurfRulesGenerator';
import { Rule, McpServer } from '../../../../shared/types';
import { GeneratorContext } from './FileGenerator';
import { describe, it, expect } from 'vitest';

describe('ClaudeMdGenerator', () => {
    it('should generate correct markdown', async () => {
        const generator = new ClaudeMdGenerator();
        const context: GeneratorContext = {
            rules: [
                { id: '1', name: 'Test Rule', content: 'Use TDD', isActive: true } as Rule
            ],
            mcpServers: [
                { id: '1', name: 'Fetch', command: 'npx', args: ['-y', 'fetch-server'], isActive: true } as McpServer
            ]
        };

        const content = await generator.generate(context);
        expect(content).toContain('# Project Context');
        expect(content).toContain('## Active Rules');
        expect(content).toContain('### Test Rule...');
        expect(content).toContain('Use TDD');
        expect(content).toContain('npx -y fetch-server');
    });

    it('should handle empty rules and mcpServers', async () => {
        const generator = new ClaudeMdGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: []
        };

        const content = await generator.generate(context);
        expect(content).toContain('# Project Context');
        expect(content).not.toContain('## Active Rules');
        expect(content).not.toContain('## Active MCP Servers');
    });

    it('should skip inactive MCP servers', async () => {
        const generator = new ClaudeMdGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: [
                { id: '1', name: 'Active', command: 'node', args: ['server.js'], isActive: true } as McpServer,
                { id: '2', name: 'Inactive', command: 'python', args: ['server.py'], isActive: false } as McpServer
            ]
        };

        const content = await generator.generate(context);
        expect(content).toContain('Active');
        expect(content).not.toContain('Inactive');
    });
});

describe('CursorRulesGenerator', () => {
    it('should generate plain text rules', async () => {
        const generator = new CursorRulesGenerator();
        const context: GeneratorContext = {
            rules: [
                { id: '1', name: 'Rule 1', content: 'Use TDD approach', isActive: true } as Rule,
                { id: '2', name: 'Rule 2', content: 'Write clean code', isActive: true } as Rule
            ],
            mcpServers: []
        };

        const content = await generator.generate(context);
        expect(content).toContain('Use TDD approach');
        expect(content).toContain('Write clean code');
        expect(content).not.toContain('#');
        expect(content).not.toContain('##');
    });

    it('should handle empty rules', async () => {
        const generator = new CursorRulesGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: []
        };

        const content = await generator.generate(context);
        expect(content).toBe('');
    });
});

describe('CursorConfigGenerator', () => {
    it('should generate JSON config with MCP servers', async () => {
        const generator = new CursorConfigGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: [
                { id: '1', name: 'fetch', command: 'npx', args: ['-y', 'fetch-server'], isActive: true } as McpServer,
                { id: '2', name: 'puppeteer', command: 'node', args: ['puppeteer.js'], isActive: true } as McpServer
            ]
        };

        const content = await generator.generate(context);
        const parsed = JSON.parse(content);
        expect(parsed.mcpServers).toBeDefined();
        expect(parsed.mcpServers.fetch).toEqual({ command: 'npx', args: ['-y', 'fetch-server'] });
        expect(parsed.mcpServers.puppeteer).toEqual({ command: 'node', args: ['puppeteer.js'] });
    });

    it('should skip inactive MCP servers', async () => {
        const generator = new CursorConfigGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: [
                { id: '1', name: 'active', command: 'node', args: ['server.js'], isActive: true } as McpServer,
                { id: '2', name: 'inactive', command: 'python', args: ['server.py'], isActive: false } as McpServer
            ]
        };

        const content = await generator.generate(context);
        const parsed = JSON.parse(content);
        expect(parsed.mcpServers.active).toBeDefined();
        expect(parsed.mcpServers.inactive).toBeUndefined();
    });

    it('should generate empty config when no active servers', async () => {
        const generator = new CursorConfigGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: [
                { id: '1', name: 'inactive', command: 'node', args: ['server.js'], isActive: false } as McpServer
            ]
        };

        const content = await generator.generate(context);
        const parsed = JSON.parse(content);
        expect(parsed.mcpServers).toEqual({});
    });
});

describe('WindsurfRulesGenerator', () => {
    it('should generate markdown rules with headers', async () => {
        const generator = new WindsurfRulesGenerator();
        const context: GeneratorContext = {
            rules: [
                { id: '1', name: 'Test Rule', content: 'Content here', isActive: true } as Rule
            ],
            mcpServers: []
        };

        const content = await generator.generate(context);
        expect(content).toContain('### Test Rule');
        expect(content).toContain('Content here');
    });

    it('should join multiple rules with double newlines', async () => {
        const generator = new WindsurfRulesGenerator();
        const context: GeneratorContext = {
            rules: [
                { id: '1', name: 'Rule 1', content: 'First content', isActive: true } as Rule,
                { id: '2', name: 'Rule 2', content: 'Second content', isActive: true } as Rule
            ],
            mcpServers: []
        };

        const content = await generator.generate(context);
        expect(content).toContain('### Rule 1');
        expect(content).toContain('### Rule 2');
        expect(content).toContain('\n\n');
    });

    it('should return empty string for no rules', async () => {
        const generator = new WindsurfRulesGenerator();
        const context: GeneratorContext = {
            rules: [],
            mcpServers: []
        };

        const content = await generator.generate(context);
        expect(content).toBe('');
    });
});
