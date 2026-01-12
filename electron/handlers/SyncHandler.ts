import { ipcMain } from 'electron';
import { z } from 'zod';
import { SyncService } from '../services/sync/SyncService';

import { safeHandler } from './wrapper';

const previewSchema = z.object({
    targetPath: z.string().min(1, 'Target path is required'),
    toolId: z.string().min(1, 'Tool ID is required'),
});

const applySchema = z.object({
    targetPath: z.string().min(1, 'Target path is required'),
    content: z.string(),
});

export function registerSyncHandlers(syncService: SyncService) {
    ipcMain.handle('sync:start', async () => {
        return safeHandler(() => syncService.syncAll());
    });

    ipcMain.handle('sync:status', async () => {
        return safeHandler(() => ({}));
    });

    ipcMain.handle('sync:preview', async (_, targetPath, toolId) => {
        return safeHandler(async () => {
            const validated = previewSchema.parse({ targetPath, toolId });
            return syncService.generatePreview(validated.targetPath, validated.toolId);
        });
    });

    ipcMain.handle('sync:apply', async (_, targetPath, content) => {
        return safeHandler(async () => {
            const validated = applySchema.parse({ targetPath, content });
            await syncService.applySync(validated.targetPath, validated.content);
        });
    });

    ipcMain.handle('sync:import', async (_, filePath) => {
        return safeHandler(() => syncService.importClaudeMd(filePath));
    });
}
