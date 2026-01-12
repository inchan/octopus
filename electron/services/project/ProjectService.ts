
import { ProjectRepository } from '../../repositories/ProjectRepository';
import { ProjectScanner } from './ProjectScanner';
import { Project, CreateProjectParams, UpdateProjectParams } from '../../../shared/types';
import { randomUUID } from 'crypto';

export class ProjectService {
    private cachedProjects: Project[] | null = null;

    constructor(
        private repository: ProjectRepository,
        private scanner: ProjectScanner,
    ) { }

    async getAll(): Promise<Project[]> {
        if (this.cachedProjects) {
            return this.cachedProjects;
        }
        const projects = this.repository.getAll();
        this.cachedProjects = projects;
        return projects;
    }

    async create(params: CreateProjectParams): Promise<Project> {
        const project = this.repository.create(params);
        this.cachedProjects = null; // Invalidate cache
        return project;
    }

    async update(params: UpdateProjectParams): Promise<Project> {
        const updated = this.repository.update(params);
        if (!updated) {
            throw new Error('Project not found');
        }
        this.cachedProjects = null; // Invalidate cache
        return updated;
    }

    async delete(id: string): Promise<void> {
        this.repository.delete(id);
        this.cachedProjects = null; // Invalidate cache
    }

    async scan(rootPath: string): Promise<Project[]> {
        const candidates = await this.scanner.scan(rootPath);
        return candidates.map(c => ({
            ...c,
            id: 'temp-' + randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));
    }

    // Injected via property or method to avoid circular dependency in constructor if possible
    // But clean architecture prefers constructor. Circular: SyncService needs ProjectService, ProjectService needs SyncService?
    // SyncService needs ProjectService (to get path). ProjectService needs SyncService (to gen config)?
    // Actually, ProjectHandler can call SyncService directly if we register it?
    // Or we keep `projects:previewSync` in `ProjectHandler` but call `syncService`.
    // BUT `ProjectHandler` only has access to `ProjectService`.
    // Let's modify `ProjectHandler` to accept `SyncService` too? Or move the handler to `SyncHandler`?
    // Spec says 'projects:previewSync'. It feels like a project operation.
    // Let's add it to `SyncHandler` instead as `sync:project`.
}
