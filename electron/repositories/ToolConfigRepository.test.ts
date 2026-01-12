import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ToolConfigRepository } from './ToolConfigRepository';
import { initDb, db } from '../infra/database';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('ToolConfigRepository Integration', () => {
    let repository: ToolConfigRepository;
    let tempDbPath: string;

    beforeEach(() => {
        tempDbPath = path.join(os.tmpdir(), `test-tool-config-${Date.now()}.db`);
        initDb(tempDbPath);
        repository = new ToolConfigRepository();
    });

    afterEach(() => {
        db.close();
        if (fs.existsSync(tempDbPath)) {
            fs.unlinkSync(tempDbPath);
        }
    });

    it('should create and retrieve a tool config', () => {
        const params = {
            toolId: 'cursor',
            contextType: 'global' as const,
            contextId: 'global',
            ruleSetId: 'rule-set-1',
            mcpSetId: 'mcp-set-1'
        };

        const created = repository.upsert(params);
        expect(created.id).toBeDefined();
        expect(created.toolId).toBe('cursor');
        expect(created.ruleSetId).toBe('rule-set-1');

        const fetched = repository.get('cursor', 'global', 'global');
        expect(fetched).toEqual(created);
    });

    it('should update existing config on upsert', () => {
        const params = {
            toolId: 'cursor',
            contextType: 'global' as const,
            contextId: 'global',
            ruleSetId: 'rule-set-1'
        };

        const first = repository.upsert(params);
        expect(first.ruleSetId).toBe('rule-set-1');

        const updatedParams = {
            ...params,
            ruleSetId: 'rule-set-2'
        };
        const second = repository.upsert(updatedParams);

        expect(second.id).toBe(first.id); // Should keep same ID
        expect(second.ruleSetId).toBe('rule-set-2');

        const fetched = repository.get('cursor', 'global', 'global');
        expect(fetched?.ruleSetId).toBe('rule-set-2');
    });

    it('should return null for non-existent config', () => {
        const fetched = repository.get('non-existent', 'global', 'global');
        expect(fetched).toBeNull();
    });

    it('should handle optional fields', () => {
        const params = {
            toolId: 'vscode',
            contextType: 'global' as const,
            contextId: 'global'
        };

        const created = repository.upsert(params);
        expect(created.ruleSetId).toBeUndefined();
        expect(created.mcpSetId).toBeUndefined();

        const fetched = repository.get('vscode', 'global', 'global');
        expect(fetched?.ruleSetId).toBeUndefined();
    });
});
