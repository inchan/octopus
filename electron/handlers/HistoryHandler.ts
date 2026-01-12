import { ipcMain } from 'electron';
import { HistoryService } from '../services/history/HistoryService';
import { safeHandler } from './wrapper';

export function registerHistoryHandlers(historyService: HistoryService) {
    ipcMain.handle('history:list', async () => {
        return safeHandler(() => historyService.list());
    });

    ipcMain.handle('history:revert', async (_, id) => {
        return safeHandler(() => historyService.revert(id));
    });
}
