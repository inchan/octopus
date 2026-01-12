import { ipcMain } from 'electron';
import { ToolConfigService } from '../services/tool-integration/ToolConfigService';
import { z } from 'zod';
import { TOOL_IDS } from '../../shared/constants';
import { safeHandler } from './wrapper';

const toolIdSchema = z.enum([
    TOOL_IDS.CLAUDE,
    TOOL_IDS.CURSOR,
    TOOL_IDS.WINDSURF,
    TOOL_IDS.CLINE,
    TOOL_IDS.VSCODE
]);

const setConfigSchema = z.object({
    toolId: toolIdSchema,
    contextType: z.enum(['global', 'project']),
    contextId: z.string().min(1),
    ruleSetId: z.string().optional(),
    mcpSetId: z.string().optional()
});

export function registerToolConfigHandlers(service: ToolConfigService) {
    ipcMain.handle('tool-config:get', async (_, params: { toolId: string, contextId: string }) => {
        return safeHandler(() => {
            if (!params.toolId) throw new Error('Tool ID is required');
            return service.getConfig(params.toolId, params.contextId || 'global');
        });
    });

    ipcMain.handle('tool-config:set', async (_, params: unknown) => {
        return safeHandler(async () => {
            const validated = setConfigSchema.parse(params);
            return service.setConfig(validated);
        });
    });

    ipcMain.handle('tool-config:list-project', async (_, projectId: string) => {
        return safeHandler(() => service.getProjectConfigs(projectId));
    });
}
