import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

// Configure logger
log.transports.file.level = 'info';
autoUpdater.logger = log;

function setupAutoUpdater(win: BrowserWindow) {
    if (process.platform === 'darwin') {
        autoUpdater.autoDownload = false;
    }

    autoUpdater.on('checking-for-update', () => {
        log.info('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('Update available.', info);
        win.webContents.send('update-available', info);
    });

    autoUpdater.on('update-not-available', (info) => {
        log.info('Update not available.', info);
    });

    autoUpdater.on('error', (err) => {
        log.error('Error in auto-updater. ' + err);
        win.webContents.send('update-error', err.message);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        win.webContents.send('update-progress', progressObj);
    });

    autoUpdater.on('update-downloaded', (info) => {
        log.info('Update downloaded');
        win.webContents.send('update-downloaded', info);
    });

    // Initial check
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 3000);
}

// IPC handlers for updates
ipcMain.handle('check-for-updates', () => {
    return autoUpdater.checkForUpdates();
});

ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall();
});

ipcMain.handle('open-download-page', () => {
    shell.openExternal('https://github.com/inchan/octopus/releases/latest');
});

// Services
import { RulesService } from './services/rules/RulesService';
import { McpService } from './services/mcp/McpService';
import { HistoryService } from './services/history/HistoryService';
import { SyncService } from './services/sync/SyncService';
import { SettingsService } from './services/settings/SettingsService';
import { ProjectService } from './services/project/ProjectService';
import { ProjectScanner } from './services/project/ProjectScanner';
import { ToolDetector } from './services/tool-detection/ToolDetector';
import { ToolIntegrationService } from './services/tool-integration/ToolIntegrationService';
import { ToolSetService } from './services/sets/ToolSetService';
import { RuleSetService } from './services/sets/RuleSetService';
import { McpSetService } from './services/sets/McpSetService';
import { McpConnectionManager } from './services/sync/McpConnectionManager';
import { ToolConfigService } from './services/tool-integration/ToolConfigService';
import { RulesRepository } from './repositories/RulesRepository';
import { McpRepository } from './repositories/McpRepository';
import { HistoryRepository } from './repositories/HistoryRepository';
import { ProjectRepository } from './repositories/ProjectRepository';
import { ToolSetRepository } from './repositories/sets/ToolSetRepository';
import { RuleSetRepository } from './repositories/sets/RuleSetRepository';
import { McpSetRepository } from './repositories/sets/McpSetRepository';
import { ToolConfigRepository } from './repositories/ToolConfigRepository';

// Handlers
import { registerRulesHandlers } from './handlers/RulesHandler';
import { registerMcpHandlers } from './handlers/McpHandler';
import { registerSyncHandlers } from './handlers/SyncHandler';
import { registerSettingsHandlers } from './handlers/SettingsHandler';
import { registerToolDetectionHandlers } from './handlers/ToolDetectionHandler';
import { registerHistoryHandlers } from './handlers/HistoryHandler';
import { registerProjectHandlers } from './handlers/ProjectHandler';
import { ToolIntegrationHandler } from './handlers/ToolIntegrationHandler';
import { SetsHandler } from './handlers/SetsHandler';
import { DialogHandler } from './handlers/DialogHandler';
import { registerToolConfigHandlers } from './handlers/ToolConfigHandler';

// Generators
import { CursorGenerator } from './services/tool-integration/CursorGenerator';
import { WindsurfGenerator } from './services/tool-integration/WindsurfGenerator';
import { ClineGenerator } from './services/tool-integration/ClineGenerator';
import { ClaudeGenerator } from './services/tool-integration/ClaudeGenerator';
import { ClaudeCodeGenerator } from './services/tool-integration/ClaudeCodeGenerator';
import { StubGenerator } from './services/tool-integration/StubGenerator';
import { GenericCLIGenerator } from './services/tool-integration/GenericCLIGenerator';
import { VSCodeGenerator } from './services/tool-integration/VSCodeGenerator';
import { OpenCodeGenerator } from './services/tool-integration/OpenCodeGenerator';
import { RovoDevGenerator } from './services/tool-integration/RovoDevGenerator';

// Shared
import { IMcpAPI } from '../shared/api';
import { CreateMcpServerParams, UpdateMcpServerParams, CreateRuleParams, UpdateRuleParams, Rule, McpServer } from '../shared/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null = null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    })

    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    setupAutoUpdater(win);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// Services & Managers Initialization
const rulesRepository = new RulesRepository();
const mcpRepository = new McpRepository();
const historyRepository = new HistoryRepository();
const projectRepository = new ProjectRepository();
const toolSetRepository = new ToolSetRepository();
const ruleSetRepository = new RuleSetRepository();
const mcpSetRepository = new McpSetRepository();

const historyService = new HistoryService(historyRepository);
const rulesService = new RulesService(rulesRepository, historyService);
const mcpService = new McpService(mcpRepository, historyService);
const connectionManager = new McpConnectionManager();

const settingsService = new SettingsService();
const toolDetector = new ToolDetector();
const projectScanner = new ProjectScanner();
const projectService = new ProjectService(projectRepository, projectScanner);

const toolSetService = new ToolSetService(toolSetRepository);
const ruleSetService = new RuleSetService(ruleSetRepository);

const toolConfigRepository = new ToolConfigRepository();
const toolConfigService = new ToolConfigService(toolConfigRepository);

const toolIntegrationService = new ToolIntegrationService([
    { tool: 'Cursor', generator: new CursorGenerator() },
    { tool: 'Windsurf', generator: new WindsurfGenerator() },
    { tool: 'Cline', generator: new ClineGenerator() },
    { tool: 'Claude Desktop', generator: new ClaudeGenerator() },
    { tool: 'Claude Code', generator: new ClaudeCodeGenerator() },

    // CLIs using GenericCLIGenerator
    { tool: 'Codex CLI', generator: new GenericCLIGenerator('codex', 'AGENTS.md', 'config.toml') },
    { tool: 'Gemini CLI', generator: new GenericCLIGenerator('gemini', 'GEMINI.md', 'settings.json') },
    { tool: 'Qwen Code', generator: new GenericCLIGenerator('qwen', 'QWEN.md', 'settings.json') },

    // OpenCode - 전용 Generator (MCP 형식이 다름)
    { tool: 'OpenCode', generator: new OpenCodeGenerator() },

    // Rovo Dev - 전용 Generator (YAML Rules + JSON MCP)
    { tool: 'Rovo Dev', generator: new RovoDevGenerator() },

    // VS Code support
    { tool: 'VS Code', generator: new VSCodeGenerator() },

    // Stubs for currently unsupported tools to prevent errors
    { tool: 'Antigravity', generator: new StubGenerator() }
]);

// Adapter for IMcpAPI
const mcpApiAdapter: IMcpAPI = {
    list: async () => ({ success: true, data: await mcpService.getAll() }),
    get: async (id: string) => {
        const data = await mcpService.getById(id);
        return data ? { success: true, data } : { success: false, error: 'Not found' };
    },
    create: async (params: CreateMcpServerParams) => ({ success: true, data: await mcpService.create(params) }),
    update: async (params: UpdateMcpServerParams) => ({ success: true, data: await mcpService.update(params) }),
    delete: async (id: string) => {
        await mcpService.delete(id);
        return { success: true, data: undefined };
    },
    fetchConfigFromUrl: async (url: string) => ({ success: true, data: await mcpService.fetchConfigFromUrl(url) }),
    import: async (params) => ({ success: true, data: await mcpService.importServers(params) })
};

const mcpSetService = new McpSetService(mcpSetRepository, mcpApiAdapter);

const syncService = new SyncService(
    mcpService,
    connectionManager,
    rulesService,
    ruleSetService,
    projectService,
    toolConfigService,
    toolIntegrationService,
    mcpSetService
);

// Register Revert Handlers to avoid circular dependency
historyService.registerRevertHandler('rule', async (action, data) => {
    const ruleData = data as unknown as Rule;
    switch (action) {
        case 'create':
            await rulesService.delete(ruleData.id, { skipLog: true });
            break;
        case 'delete':
            await rulesService.create(ruleData as CreateRuleParams, { skipLog: true });
            break;
        case 'update':
            await rulesService.update(ruleData as UpdateRuleParams, { skipLog: true });
            break;
    }
});

historyService.registerRevertHandler('mcp', async (action, data) => {
    const mcpData = data as unknown as McpServer;
    switch (action) {
        case 'create':
            await mcpService.delete(mcpData.id, { skipLog: true });
            break;
        case 'delete':
            await mcpService.create(mcpData as CreateMcpServerParams, { skipLog: true });
            break;
        case 'update':
            await mcpService.update(mcpData as UpdateMcpServerParams, { skipLog: true });
            break;
    }
});

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')

    registerRulesHandlers(rulesService);
    registerMcpHandlers(mcpService);
    registerSyncHandlers(syncService);
    registerSettingsHandlers(settingsService);
    registerToolDetectionHandlers(toolDetector);
    registerHistoryHandlers(historyService);
    registerProjectHandlers(projectService, syncService);
    new ToolIntegrationHandler(toolIntegrationService, mcpSetService, rulesService).register();
    new SetsHandler(toolSetService, ruleSetService, mcpSetService).register();
    registerToolConfigHandlers(toolConfigService);
    new DialogHandler();

    createWindow()
})

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
