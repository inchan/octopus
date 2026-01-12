import { ipcMain } from 'electron';
import { ProjectService } from '../services/project/ProjectService';
import { safeHandler } from './wrapper';

import { SyncService } from '../services/sync/SyncService';

export function registerProjectHandlers(projectService: ProjectService, syncService: SyncService) {

    ipcMain.handle('projects:list', async () => {
        return safeHandler(async () => {
            const data = await projectService.getAll();
            return data;
        });
    });

    // ... create, update, delete ...

    ipcMain.handle('projects:scan', async (_, rootPath: string) => {
        return safeHandler(async () => {
            if (!rootPath) throw new Error('Root path is required');
            return projectService.scan(rootPath);
        });
    });

    ipcMain.handle('projects:previewSync', async (_, projectId: string) => {
        return safeHandler(() => syncService.getProjectSyncPreview(projectId));
    });
}
