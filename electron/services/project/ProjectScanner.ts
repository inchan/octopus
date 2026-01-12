import fs from 'fs/promises';
import path from 'path';
import { Project } from '../../../shared/types';
// import { randomUUID } from 'crypto'; // Removed unused import

type ProjectType = Project['type'];

const MARKERS: Record<string, ProjectType> = {
    'package.json': 'node',
    'go.mod': 'go',
    'requirements.txt': 'python',
    'pyproject.toml': 'python',
    'Cargo.toml': 'rust',
    '.git': 'unknown'
};

export class ProjectScanner {

    /**
     * Scans a directory for projects based on markers.
     * Does not traverse into node_modules, .git, or other hidden folders (except .git itself as marker).
     * @param rootPath Root directory to start scan
     * @param maxDepth Maximum recursion depth (default 3)
     */
    async scan(rootPath: string, maxDepth: number = 3): Promise<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[]> {
        const projects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] = [];

        try {
            await this.traverse(rootPath, 0, maxDepth, projects);
        } catch (error) {
            console.error(`Error scanning ${rootPath}:`, error);
        }

        return projects;
    }

    private async traverse(
        currentPath: string,
        depth: number,
        maxDepth: number,
        results: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[]
    ) {
        if (depth > maxDepth) return;

        let entries;
        try {
            entries = await fs.readdir(currentPath, { withFileTypes: true });
        } catch {
            return; // Access denied or not a dir
        }

        if (!entries) return;

        const type = this.detectType(entries.map(e => e.name));

        if (type) {
            // Found a project! Add it and STOP recursion for this branch?
            // Usually if I find a project at /foo, I don't look inside /foo/bar for another project
            // unless it's a monorepo. For now, let's stop recursion to stay fast.
            results.push({
                name: path.basename(currentPath),
                path: currentPath,
                type: type
            });
            // Stop recursion here? Or continue?
            // If we stop, we miss monorepos. If we continue, we might get noise.
            // Let's CONTINUE for now but limit depth strictly.
            // Actually, for Phase 2 spec "CLI tool detection", usually top-level is what we want.
            // But let's assume we want to find all.
        }

        // Recurse
        for (const entry of entries) {
            if (entry.isDirectory()) {
                if (depth + 1 <= maxDepth && !this.shouldIgnore(entry.name)) {
                    await this.traverse(path.join(currentPath, entry.name), depth + 1, maxDepth, results);
                }
            }
        }
    }

    private detectType(filenames: string[]): ProjectType | null {
        for (const [marker, type] of Object.entries(MARKERS)) {
            if (filenames.includes(marker)) {
                return type;
            }
        }
        return null;
    }

    private shouldIgnore(dirname: string): boolean {
        const ignores = ['node_modules', '.git', 'dist', 'build', 'out', '.idea', '.vscode', 'coverage'];
        return ignores.includes(dirname) || dirname.startsWith('.');
    }
}
