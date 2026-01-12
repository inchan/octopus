import { ipcMain } from 'electron';
import { SettingsService } from '../services/settings/SettingsService';
import { z } from 'zod';
import { SettingsSchema } from '../../shared/types';
import { safeHandler } from './wrapper';

const settingsValueSchemas: Record<keyof SettingsSchema, z.ZodTypeAny> = {
    theme: z.enum(['light', 'dark', 'system']),
    language: z.enum(['en', 'ko']),
    autoSync: z.boolean(),
    openAIKey: z.string().optional(),
    anthropicKey: z.string().optional()
};

export function registerSettingsHandlers(settingsService: SettingsService) {
    ipcMain.handle('settings:get', async (_, key: unknown) => {
        return safeHandler(() => {
            if (typeof key !== 'string' || !Object.keys(settingsValueSchemas).includes(key)) {
                throw new Error(`Invalid setting key: ${key}`);
            }
            return settingsService.get(key as keyof SettingsSchema);
        });
    });

    ipcMain.handle('settings:getAll', async () => {
        return safeHandler(() => settingsService.getAll());
    });

    ipcMain.handle('settings:set', async (_, key: unknown, value: unknown) => {
        return safeHandler(() => {
            if (typeof key !== 'string' || !Object.keys(settingsValueSchemas).includes(key)) {
                throw new Error(`Invalid setting key: ${key}`);
            }
            
            const schema = settingsValueSchemas[key as keyof SettingsSchema];
            const validatedValue = schema.parse(value);
            
            const typedKey = key as keyof SettingsSchema;
            settingsService.set(typedKey, validatedValue as never);
        });
    });
}
