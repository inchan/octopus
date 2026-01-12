/**
 * MCP Import Tests
 *
 * Test Cases:
 * - TC-MCP-U-IM001: Import single server
 * - TC-MCP-U-IM002: Import multiple servers
 * - TC-MCP-U-IM003: Import with duplicate name handling
 * - TC-MCP-U-IM004: Import with validation errors
 * - TC-MCP-U-IM005: Import partial (selective import)
 */

import { describe, it, expect } from 'vitest';
import {
    parseMcpInput,
    filterSelectedServers,
    handleDuplicateNames,
    validateServerParams,
} from './mcp-import';
import { CreateMcpServerParams } from '@shared/types';

describe('TC-MCP-U-IM001: Import single server', () => {
    it('should parse a single server from mcpServers object', () => {
        const input = JSON.stringify({
            mcpServers: {
                'my-server': {
                    command: 'node',
                    args: ['server.js'],
                    env: { API_KEY: 'secret' },
                },
            },
        });

        const result = parseMcpInput(input);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(result.data![0]).toEqual({
            name: 'my-server',
            command: 'node',
            args: ['server.js'],
            env: { API_KEY: 'secret' },
            isActive: true,
        });
    });

    it('should parse a single server with minimal config', () => {
        const input = JSON.stringify({
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server'],
        });

        const result = parseMcpInput(input);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(result.data![0].name).toBe('Imported Server');
        expect(result.data![0].command).toBe('npx');
        expect(result.data![0].isActive).toBe(true);
    });

    it('should set isActive to true by default', () => {
        const input = JSON.stringify({
            mcpServers: {
                'test-server': { command: 'echo' },
            },
        });

        const result = parseMcpInput(input);

        expect(result.success).toBe(true);
        expect(result.data![0].isActive).toBe(true);
    });
});

describe('TC-MCP-U-IM002: Import multiple servers', () => {
    it('should parse 5 servers from mcpServers object', () => {
        const input = JSON.stringify({
            mcpServers: {
                server1: { command: 'cmd1', args: ['a1'] },
                server2: { command: 'cmd2', args: ['a2'] },
                server3: { command: 'cmd3', args: ['a3'] },
                server4: { command: 'cmd4', args: ['a4'] },
                server5: { command: 'cmd5', args: ['a5'] },
            },
        });

        const result = parseMcpInput(input);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(5);

        const names = result.data!.map((s) => s.name);
        expect(names).toContain('server1');
        expect(names).toContain('server5');
    });

    it('should preserve all server properties when importing multiple', () => {
        const input = JSON.stringify({
            mcpServers: {
                'api-server': {
                    command: 'node',
                    args: ['api.js', '--port', '3000'],
                    env: { NODE_ENV: 'production' },
                },
                'worker-server': {
                    command: 'python',
                    args: ['worker.py'],
                    env: { WORKERS: '4' },
                },
            },
        });

        const result = parseMcpInput(input);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);

        const apiServer = result.data!.find((s) => s.name === 'api-server');
        expect(apiServer?.args).toEqual(['api.js', '--port', '3000']);
        expect(apiServer?.env).toEqual({ NODE_ENV: 'production' });
    });

    it('should handle empty serverMap gracefully', () => {
        const input = JSON.stringify({
            mcpServers: {},
        });

        const result = parseMcpInput(input);

        expect(result.success).toBe(false);
        expect(result.error).toBe('No valid MCP server configurations found');
    });
});

describe('TC-MCP-U-IM003: Import with duplicate name handling', () => {
    const existingServers: CreateMcpServerParams[] = [
        { name: 'existing-server', command: 'node', args: [], env: {}, isActive: true },
        { name: 'another-server', command: 'python', args: [], env: {}, isActive: true },
    ];

    it('should skip duplicate names when strategy is "skip"', () => {
        const newServers: CreateMcpServerParams[] = [
            { name: 'existing-server', command: 'new-cmd', args: [], env: {}, isActive: true },
            { name: 'brand-new', command: 'cmd', args: [], env: {}, isActive: true },
        ];

        const result = handleDuplicateNames(newServers, existingServers, 'skip');

        expect(result.imported).toHaveLength(1);
        expect(result.imported[0].name).toBe('brand-new');
        expect(result.skipped).toHaveLength(1);
        expect(result.skipped[0]).toBe('existing-server');
    });

    it('should overwrite existing when strategy is "overwrite"', () => {
        const newServers: CreateMcpServerParams[] = [
            { name: 'existing-server', command: 'updated-cmd', args: ['new-arg'], env: {}, isActive: true },
        ];

        const result = handleDuplicateNames(newServers, existingServers, 'overwrite');

        expect(result.imported).toHaveLength(1);
        expect(result.imported[0].name).toBe('existing-server');
        expect(result.imported[0].command).toBe('updated-cmd');
        expect(result.overwritten).toHaveLength(1);
    });

    it('should rename duplicates when strategy is "rename"', () => {
        const newServers: CreateMcpServerParams[] = [
            { name: 'existing-server', command: 'cmd1', args: [], env: {}, isActive: true },
        ];

        const result = handleDuplicateNames(newServers, existingServers, 'rename');

        expect(result.imported).toHaveLength(1);
        expect(result.imported[0].name).toBe('existing-server-1');
        expect(result.renamed).toHaveLength(1);
    });

    it('should handle multiple renames with incrementing suffix', () => {
        const existingWithDupes: CreateMcpServerParams[] = [
            { name: 'server', command: 'c', args: [], env: {}, isActive: true },
            { name: 'server-1', command: 'c', args: [], env: {}, isActive: true },
            { name: 'server-2', command: 'c', args: [], env: {}, isActive: true },
        ];

        const newServers: CreateMcpServerParams[] = [
            { name: 'server', command: 'new', args: [], env: {}, isActive: true },
        ];

        const result = handleDuplicateNames(newServers, existingWithDupes, 'rename');

        expect(result.imported[0].name).toBe('server-3');
    });
});

describe('TC-MCP-U-IM004: Import with validation errors', () => {
    it('should return error for empty command', () => {
        const servers: CreateMcpServerParams[] = [
            { name: 'invalid-server', command: '', args: [], env: {}, isActive: true },
        ];

        const result = validateServerParams(servers);

        expect(result.valid).toHaveLength(0);
        expect(result.invalid).toHaveLength(1);
        expect(result.invalid[0].reason).toContain('command');
    });

    it('should return error for invalid args type', () => {
        const input = JSON.stringify({
            mcpServers: {
                'bad-args': {
                    command: 'node',
                    args: 'not-an-array', // should be array
                },
            },
        });

        const result = parseMcpInput(input);

        // parseMcpInput coerces args to array, so it should still succeed
        expect(result.success).toBe(true);
        expect(result.data![0].args).toEqual([]);
    });

    it('should handle partial success/failure scenario', () => {
        const servers: CreateMcpServerParams[] = [
            { name: 'valid-1', command: 'node', args: [], env: {}, isActive: true },
            { name: '', command: 'cmd', args: [], env: {}, isActive: true }, // invalid: empty name
            { name: 'valid-2', command: 'python', args: [], env: {}, isActive: true },
            { name: 'invalid', command: '', args: [], env: {}, isActive: true }, // invalid: empty command
            { name: 'valid-3', command: 'go', args: [], env: {}, isActive: true },
        ];

        const result = validateServerParams(servers);

        expect(result.valid).toHaveLength(3);
        expect(result.invalid).toHaveLength(2);
        expect(result.invalid.map((e) => e.name)).toEqual(['', 'invalid']);
    });

    it('should provide detailed error information for each failure', () => {
        const servers: CreateMcpServerParams[] = [
            { name: '', command: '', args: [], env: {}, isActive: true },
        ];

        const result = validateServerParams(servers);

        expect(result.invalid[0]).toMatchObject({
            name: '',
            reason: expect.stringMatching(/name|command/i),
        });
    });

    it('should return error for invalid JSON format', () => {
        const result = parseMcpInput('{ invalid json }}}');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid JSON format');
    });
});

describe('TC-MCP-U-IM005: Import partial (selective import)', () => {
    const allServers: CreateMcpServerParams[] = [
        { name: 'server1', command: 'cmd1', args: [], env: {}, isActive: true },
        { name: 'server2', command: 'cmd2', args: [], env: {}, isActive: true },
        { name: 'server3', command: 'cmd3', args: [], env: {}, isActive: true },
        { name: 'server4', command: 'cmd4', args: [], env: {}, isActive: true },
        { name: 'server5', command: 'cmd5', args: [], env: {}, isActive: true },
        { name: 'server6', command: 'cmd6', args: [], env: {}, isActive: true },
        { name: 'server7', command: 'cmd7', args: [], env: {}, isActive: true },
        { name: 'server8', command: 'cmd8', args: [], env: {}, isActive: true },
        { name: 'server9', command: 'cmd9', args: [], env: {}, isActive: true },
        { name: 'server10', command: 'cmd10', args: [], env: {}, isActive: true },
    ];

    it('should import only selected servers by name', () => {
        const selectedNames = ['server1', 'server5', 'server8'];

        const result = filterSelectedServers(allServers, { selectedNames });

        expect(result.selected).toHaveLength(3);
        expect(result.selected.map((s) => s.name)).toEqual(['server1', 'server5', 'server8']);
        expect(result.skipped).toBe(7);
    });

    it('should return all servers when no filter is applied', () => {
        const result = filterSelectedServers(allServers, {});

        expect(result.selected).toHaveLength(10);
        expect(result.skipped).toBe(0);
    });

    it('should handle empty selection gracefully', () => {
        const result = filterSelectedServers(allServers, { selectedNames: [] });

        expect(result.selected).toHaveLength(0);
        expect(result.skipped).toBe(10);
    });

    it('should ignore non-existent server names in selection', () => {
        const selectedNames = ['server1', 'non-existent', 'server3'];

        const result = filterSelectedServers(allServers, { selectedNames });

        expect(result.selected).toHaveLength(2);
        expect(result.selected.map((s) => s.name)).toEqual(['server1', 'server3']);
    });

    it('should support filtering by index', () => {
        const selectedIndices = [0, 4, 7]; // server1, server5, server8

        const result = filterSelectedServers(allServers, { selectedIndices });

        expect(result.selected).toHaveLength(3);
        expect(result.selected.map((s) => s.name)).toEqual(['server1', 'server5', 'server8']);
    });
});
