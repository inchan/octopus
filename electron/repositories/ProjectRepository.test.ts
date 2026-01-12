import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectRepository } from './ProjectRepository';
import { initDb, db } from '../infra/database';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('ProjectRepository Integration', () => {
    let repository: ProjectRepository;
    let tempDbPath: string;

    beforeEach(() => {
        tempDbPath = path.join(os.tmpdir(), `test-projects-${Date.now()}.db`);
        initDb(tempDbPath);
        repository = new ProjectRepository();
    });

    afterEach(() => {
        db.close();
        if (fs.existsSync(tempDbPath)) {
            fs.unlinkSync(tempDbPath);
        }
    });

    it('should create and retrieve a project', () => {
        const params = {
            name: 'Test Project',
            path: '/tmp/test',
            type: 'node' as const
        };

        const created = repository.create(params);
        expect(created.id).toBeDefined();
        expect(created.path).toBe(params.path);

        const fetched = repository.getById(created.id);
        expect(fetched).toEqual(created);
    });

    it('should retrieve by path', () => {
        const params = { name: 'P1', path: '/path/1', type: 'node' as const };
        repository.create(params);

        const fetched = repository.getByPath('/path/1');
        expect(fetched).not.toBeNull();
        expect(fetched?.name).toBe('P1');
    });

    it('should list all projects', () => {
        repository.create({ name: 'P1', path: '/p1', type: 'node' });
        repository.create({ name: 'P2', path: '/p2', type: 'python' });

        const all = repository.getAll();
        expect(all).toHaveLength(2);
    });
});
