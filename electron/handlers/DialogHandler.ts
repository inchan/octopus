import { ipcMain, dialog } from 'electron';

export class DialogHandler {
    constructor() {
        this.registerHandlers();
    }

    private registerHandlers() {
        ipcMain.handle('dialog:openDirectory', async () => {
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory']
            });

            if (result.canceled) {
                return null;
            }
            return result.filePaths[0];
        });
    }
}
