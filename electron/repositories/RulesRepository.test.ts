import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RulesRepository } from './RulesRepository';
import { initDb, db } from '../infra/database';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('RulesRepository Integration', () => {
    let repository: RulesRepository;
    let tempDbPath: string;

    beforeEach(() => {
        // Create a temp file for DB to ensure clean state
        tempDbPath = path.join(os.tmpdir(), `test-rules-${Date.now()}.db`);
        initDb(tempDbPath);
        repository = new RulesRepository();
    });

    afterEach(() => {
        db.close();
        if (fs.existsSync(tempDbPath)) {
            fs.unlinkSync(tempDbPath);
        }
    });

    it('should create and retrieve a rule', () => {
        const params = {
            name: 'Integration Rule',
            content: '# Content',
            isActive: true
        };

        const created = repository.create(params);
        expect(created.id).toBeDefined();
        expect(created.name).toBe(params.name);

        const fetched = repository.getById(created.id);
        expect(fetched).toEqual(created);
    });

    it('should list all rules', async () => {
        repository.create({ name: 'Rule 1', content: '1', isActive: true });
        await new Promise(r => setTimeout(r, 10)); // Ensure timestamp diff
        repository.create({ name: 'Rule 2', content: '2', isActive: true });

        const all = repository.getAll();
        expect(all).toHaveLength(2);
        // Ordering check (DESC by updatedAt)
        expect(all[0].name).toBe('Rule 2');
    });

    it('should update a rule', () => {
        const created = repository.create({ name: 'Original', content: 'Old', isActive: true });

        const updated = repository.update({
            id: created.id,
            name: 'Updated',
            content: 'New'
        });

        expect(updated).not.toBeNull();
        expect(updated?.name).toBe('Updated');
        expect(updated?.content).toBe('New');

        const fetched = repository.getById(created.id);
        expect(fetched?.name).toBe('Updated');
    });

    it('should delete a rule', () => {
        const created = repository.create({ name: 'Delete Me', content: 'Bye', isActive: true });
        repository.delete(created.id);

        const fetched = repository.getById(created.id);
        expect(fetched).toBeNull();
    });
});
