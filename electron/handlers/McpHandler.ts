import { ipcMain } from 'electron';
import { z } from 'zod';
import { McpService } from '../services/mcp/McpService';
import { CreateMcpServerParams, UpdateMcpServerParams, ImportMcpServersParams } from '../../shared/types';
import { safeHandler } from './wrapper';

// Validation Schemas
// Validation Schemas
const createMcpSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    command: z.string().optional(),
    args: z.array(z.string()).default([]),
    env: z.record(z.string(), z.string()).default({}),
    url: z.string().url().optional(),
}).refine(data => data.command || data.url, {
    message: "Either command or url is required",
    path: ["command"]
});

const updateMcpSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string(), z.string()).optional(),
    url: z.string().url().optional(),
    isActive: z.boolean().optional(),
});

const importMcpSchema = z.object({
    servers: z.array(z.object({
        name: z.string().min(1, 'Name is required'),
        command: z.string().optional(),
        args: z.array(z.string()).default([]),
        env: z.record(z.string(), z.string()).default({}),
        url: z.string().url().optional(),
        isActive: z.boolean().default(true),
    }).refine(data => data.command || data.url, {
        message: "Either command or url is required",
        path: ["command"]
    })),
    duplicateStrategy: z.enum(['skip', 'overwrite', 'rename']).optional(),
    selectedNames: z.array(z.string()).optional(),
});

export function registerMcpHandlers(mcpService: McpService) {
    console.log('[DEBUG] Starting registerMcpHandlers');

    ipcMain.handle('mcp:fetchConfigFromUrl', async (_, url: string) => {
        console.log('[DEBUG] Handler called: mcp:fetchConfigFromUrl', url);
        return safeHandler(() => mcpService.fetchConfigFromUrl(url));
    });

    ipcMain.handle('mcp:list', async () => {
        return safeHandler(() => mcpService.getAll());
    });

    ipcMain.handle('mcp:get', async (_, id: string) => {
        return safeHandler(() => mcpService.getById(id));
    });

    ipcMain.handle('mcp:create', async (_, params: CreateMcpServerParams) => {
        return safeHandler(async () => {
            const validated = createMcpSchema.parse(params);
            return mcpService.create(validated as CreateMcpServerParams);
        });
    });

    ipcMain.handle('mcp:update', async (_, params: UpdateMcpServerParams) => {
        return safeHandler(async () => {
            const validated = updateMcpSchema.parse(params);
            return mcpService.update(validated as UpdateMcpServerParams);
        });
    });

    ipcMain.handle('mcp:delete', async (_, id: string) => {
        return safeHandler(() => mcpService.delete(id));
    });

    ipcMain.handle('mcp:import', async (_, params: ImportMcpServersParams) => {
        return safeHandler(async () => {
            const validated = importMcpSchema.parse(params);
            return mcpService.importServers(validated as ImportMcpServersParams);
        });
    });

    console.log('[DEBUG] Finished registerMcpHandlers');
}
