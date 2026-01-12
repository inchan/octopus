import { ipcMain } from 'electron';
import { z } from 'zod';
import { RulesService } from '../services/rules/RulesService';
import { CreateRuleParams, UpdateRuleParams } from '../../shared/types';
import { safeHandler } from './wrapper';

const createRuleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    content: z.string().min(1, 'Content is required'),
    isActive: z.boolean().optional().default(true),
});

const updateRuleSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
});

export function registerRulesHandlers(rulesService: RulesService) {
    ipcMain.handle('rules:list', async () => {
        return safeHandler(() => rulesService.getAll());
    });

    ipcMain.handle('rules:get', async (_, id: string) => {
        return safeHandler(() => rulesService.getById(id));
    });

    ipcMain.handle('rules:create', async (_, params: CreateRuleParams) => {
        return safeHandler(async () => {
            const validated = createRuleSchema.parse(params);
            return rulesService.create(validated);
        });
    });

    ipcMain.handle('rules:update', async (_, params: UpdateRuleParams) => {
        return safeHandler(async () => {
            const validated = updateRuleSchema.parse(params);
            return rulesService.update(validated);
        });
    });

    ipcMain.handle('rules:delete', async (_, id: string) => {
        return safeHandler(() => rulesService.delete(id));
    });
}
