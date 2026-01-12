import { ipcMain } from 'electron';
import { ToolDetector } from '../services/tool-detection/ToolDetector';
import { safeHandler } from './wrapper';

export function registerToolDetectionHandlers(toolDetector: ToolDetector) {
    ipcMain.handle('tool-detection:detect', async () => {
        return safeHandler(async () => {
            const results = await toolDetector.detect();
            return results;
        });
    });

    ipcMain.handle('tool-detection:getCached', async () => {
        return safeHandler(async () => {
            return toolDetector.getCached();
        });
    });
}
