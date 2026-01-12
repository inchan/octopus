import { ipcMain } from 'electron';
import { ToolSetService } from '../services/sets/ToolSetService';
import { RuleSetService } from '../services/sets/RuleSetService';
import { McpSetService } from '../services/sets/McpSetService';
import { CreateMcpSetParams, UpdateMcpSetParams, CreateRuleSetParams, UpdateRuleSetParams, CreateToolSetParams, UpdateToolSetParams } from '../../shared/types';
import { safeHandler } from './wrapper';

export class SetsHandler {
    constructor(
        private toolSetService: ToolSetService,
        private ruleSetService: RuleSetService,
        private mcpSetService: McpSetService
    ) { }

    register() {
        // --- Mcp Sets ---
        ipcMain.handle('sets:mcp:list', async () => {
            return safeHandler(() => this.mcpSetService.getAll());
        });

        ipcMain.handle('sets:mcp:create', async (_, params: CreateMcpSetParams) => {
            return safeHandler(() => this.mcpSetService.create(params));
        });

        ipcMain.handle('sets:mcp:update', async (_, params: UpdateMcpSetParams) => {
            return safeHandler(() => this.mcpSetService.update(params));
        });

        ipcMain.handle('sets:mcp:delete', async (_, id: string) => {
            return safeHandler(() => this.mcpSetService.delete(id));
        });

        // --- Rule Sets ---
        ipcMain.handle('sets:rules:list', async () => {
            return safeHandler(() => this.ruleSetService.getAll());
        });

        ipcMain.handle('sets:rules:create', async (_, params: CreateRuleSetParams) => {
            return safeHandler(() => this.ruleSetService.create(params));
        });

        ipcMain.handle('sets:rules:update', async (_, params: UpdateRuleSetParams) => {
            return safeHandler(() => this.ruleSetService.update(params));
        });

        ipcMain.handle('sets:rules:delete', async (_, id: string) => {
            return safeHandler(() => this.ruleSetService.delete(id));
        });

        // --- Tool Sets ---
        ipcMain.handle('sets:tools:list', async () => {
            return safeHandler(() => this.toolSetService.getAll());
        });

        ipcMain.handle('sets:tools:create', async (_, params: CreateToolSetParams) => {
            return safeHandler(() => this.toolSetService.create(params));
        });

        ipcMain.handle('sets:tools:update', async (_, params: UpdateToolSetParams) => {
            return safeHandler(() => this.toolSetService.update(params));
        });

        ipcMain.handle('sets:tools:delete', async (_, id: string) => {
            return safeHandler(() => this.toolSetService.delete(id));
        });
    }
}
