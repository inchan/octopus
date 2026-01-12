import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { McpRepository } from './McpRepository';
import { initDb, db } from '../infra/database';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('McpRepository Integration', () => {
    let repository: McpRepository;
    let tempDbPath: string;

    beforeEach(() => {
        tempDbPath = path.join(os.tmpdir(), `test-mcp-${Date.now()}.db`);
        initDb(tempDbPath);
        repository = new McpRepository();
    });

    afterEach(() => {
        db.close();
        if (fs.existsSync(tempDbPath)) {
            fs.unlinkSync(tempDbPath);
        }
    });

    it('should create and retrieve an MCP server', () => {
        const params = {
            name: 'Test Server',
            command: 'node',
            args: ['index.js'],
            env: { PORT: '3000' },
            isActive: true
        };

        const created = repository.create(params);
        expect(created.id).toBeDefined();
        expect(created.name).toBe(params.name);
        expect(created.args).toEqual(['index.js']);
        expect(created.env).toEqual({ PORT: '3000' });
        expect(created.isActive).toBe(true);

        const fetched = repository.getById(created.id);
        expect(fetched).toEqual(created);
    });

    it('should list all servers', async () => {
        repository.create({ name: 'S1', command: 'cmd', args: [], env: {}, isActive: true });
        await new Promise(r => setTimeout(r, 10)); // Ensure timestamp diff for sorting
        repository.create({ name: 'S2', command: 'cmd', args: [], env: {}, isActive: false });

        const all = repository.getAll();
        expect(all).toHaveLength(2);
        expect(all[0].name).toBe('S2');
        expect(all[0].isActive).toBe(false); // Check boolean conversion
    });

    it('should update a server', () => {
        const created = repository.create({ name: 'Old', command: 'old', args: ['old'], env: {}, isActive: true });

        const updated = repository.update({
            id: created.id,
            name: 'New',
            args: ['new'],
            isActive: false
        });

        expect(updated).not.toBeNull();
        expect(updated?.name).toBe('New');
        expect(updated?.args).toEqual(['new']);
        expect(updated?.isActive).toBe(false);

        const fetched = repository.getById(created.id);
        expect(fetched?.name).toBe('New');
        expect(fetched?.isActive).toBe(false);
    });

    it('should delete a server', () => {
        const created = repository.create({ name: 'Del', command: 'cmd', args: [], env: {}, isActive: true });
        repository.delete(created.id);

        const fetched = repository.getById(created.id);
        expect(fetched).toBeNull();
    });
});
