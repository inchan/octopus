import { getDb } from '../infra/database';
import { Project, CreateProjectParams, UpdateProjectParams } from '../../shared/types';
import { BaseRepository } from './BaseRepository';

export class ProjectRepository extends BaseRepository<Project> {
    protected tableName = 'projects';

    protected mapToEntity(row: unknown): Project {
        return row as Project;
    }

    // getById is inherited but return type is fine
    // getAll is inherited

    getByPath(path: string): Project | null {
        const stmt = getDb().prepare('SELECT * FROM projects WHERE path = ?');
        return (stmt.get(path) as Project) || null;
    }

    create(params: CreateProjectParams): Project {
        const now = this.now();
        const project: Project = {
            id: params.id || this.generateId(),
            name: params.name,
            path: params.path,
            type: params.type,
            createdAt: now,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            INSERT INTO projects (id, name, path, type, createdAt, updatedAt)
            VALUES (@id, @name, @path, @type, @createdAt, @updatedAt)
        `);

        stmt.run(project);
        return project;
    }

    update(params: UpdateProjectParams): Project | null {
        const now = this.now();
        const current = this.getById(params.id);
        if (!current) return null;

        const updated: Project = {
            ...current,
            ...params,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            UPDATE projects 
            SET name = @name, path = @path, type = @type, updatedAt = @updatedAt
            WHERE id = @id
        `);

        stmt.run(updated);
        return updated;
    }
}
