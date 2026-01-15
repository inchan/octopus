import {
    Rule, CreateRuleParams, UpdateRuleParams,
    McpServer, CreateMcpServerParams, UpdateMcpServerParams,
    ImportMcpServersParams, ImportMcpServersResult,
    HistoryEntry,
    McpSet, CreateMcpSetParams, UpdateMcpSetParams,
    RuleSet, CreateRuleSetParams, UpdateRuleSetParams,
    ToolSet, CreateToolSetParams, UpdateToolSetParams,
    ToolDetectionResult, GeneratedFile,
    Project, CreateProjectParams, UpdateProjectParams,
    ToolConfig, SetToolConfigParams,
    SyncResult, SyncPreviewData, DiffResult,
    SettingsSchema, UpdateInfo, ProgressInfo
} from './types';

export type {
    Rule, McpServer, HistoryEntry,
    McpSet, RuleSet, ToolSet,
    ToolDetectionResult, GeneratedFile,
    Project, ToolConfig,
    SyncResult, SyncPreviewData, DiffResult,
    SettingsSchema,
    UpdateInfo, ProgressInfo,
    // Params types for mocks/api.ts
    CreateRuleParams, UpdateRuleParams,
    CreateMcpServerParams, UpdateMcpServerParams,
    ImportMcpServersParams, ImportMcpServersResult,
    CreateMcpSetParams, UpdateMcpSetParams,
    CreateRuleSetParams, UpdateRuleSetParams,
    CreateToolSetParams, UpdateToolSetParams,
    CreateProjectParams, UpdateProjectParams,
    SetToolConfigParams
};

export type Result<T> =
    | { success: true; data: T; debugInfo?: unknown }
    | { success: false; error: string; debugInfo?: unknown };

export interface IRulesAPI {
    list(): Promise<Result<Rule[]>>;
    get(id: string): Promise<Result<Rule | null>>;
    create(params: CreateRuleParams): Promise<Result<Rule>>;
    update(params: UpdateRuleParams): Promise<Result<Rule>>;
    delete(id: string): Promise<Result<void>>;
}

export interface IMcpAPI {
    list(): Promise<Result<McpServer[]>>;
    get(id: string): Promise<Result<McpServer | null>>;
    create(params: CreateMcpServerParams): Promise<Result<McpServer>>;
    update(params: UpdateMcpServerParams): Promise<Result<McpServer>>;
    delete(id: string): Promise<Result<void>>;
    fetchConfigFromUrl(url: string): Promise<Result<string>>;
    import(params: ImportMcpServersParams): Promise<Result<ImportMcpServersResult>>;
}

export interface IToolDetectionAPI {
    detect(): Promise<Result<ToolDetectionResult[]>>;
    getCached(): Promise<Result<ToolDetectionResult[] | null>>;
}

export interface ISyncAPI {
    start(): Promise<Result<SyncResult[]>>;
    preview(targetPath: string, type: 'claude' | 'cursor' | 'vscode'): Promise<Result<SyncPreviewData>>;
    apply(targetPath: string, content: string): Promise<Result<void>>;
    import(filePath: string): Promise<Result<{ ruleSetId: string; ruleCount: number }>>;
    previewProject(projectId: string): Promise<Result<GeneratedFile[]>>;
}

export interface IDialogAPI {
    openDirectory(): Promise<string | null>;
}

export interface ISettingsAPI {
    get(key: keyof SettingsSchema): Promise<unknown>;
    getAll(): Promise<SettingsSchema>;
    set(key: keyof SettingsSchema, value: unknown): Promise<void>;
}

export interface IToolIntegrationAPI {
    generateConfig(tool: string, scope: string, data: { ruleSet?: RuleSet, mcpSet?: McpSet }): Promise<Result<GeneratedFile[]>>;
}

export interface IProjectsAPI {
    list(): Promise<Result<Project[]>>;
    create(params: CreateProjectParams): Promise<Result<Project>>;
    update(params: UpdateProjectParams): Promise<Result<Project>>;
    delete(id: string): Promise<Result<void>>;
    scan(rootPath: string): Promise<Result<Project[]>>;
}

export interface IToolConfigAPI {
    get(toolId: string, contextId?: string): Promise<Result<ToolConfig | null>>;
    set(params: SetToolConfigParams): Promise<Result<ToolConfig>>;
    listProject(projectId: string): Promise<Result<ToolConfig[]>>;
}

export interface IHistoryAPI {
    list(): Promise<Result<HistoryEntry[]>>;
    revert(id: string): Promise<Result<void>>;
}

export interface ISetAPI {
    mcp: {
        list(): Promise<Result<McpSet[]>>;
        create(params: CreateMcpSetParams): Promise<Result<McpSet>>;
        update(params: UpdateMcpSetParams): Promise<Result<McpSet>>;
        delete(id: string): Promise<Result<void>>;
    };
    rules: {
        list(): Promise<Result<RuleSet[]>>;
        create(params: CreateRuleSetParams): Promise<Result<RuleSet>>;
        update(params: UpdateRuleSetParams): Promise<Result<RuleSet>>;
        delete(id: string): Promise<Result<void>>;
    };
    tools: {
        list(): Promise<Result<ToolSet[]>>;
        create(params: CreateToolSetParams): Promise<Result<ToolSet>>;
        update(params: UpdateToolSetParams): Promise<Result<ToolSet>>;
        delete(id: string): Promise<Result<void>>;
    };
}

export interface IUpdaterAPI {
    checkForUpdates(): Promise<void>;
    installUpdate(): Promise<void>;
    openDownloadPage(): Promise<void>;
    onUpdateAvailable(callback: (info: UpdateInfo) => void): void;
    onUpdateProgress(callback: (progress: ProgressInfo) => void): void;
    onUpdateDownloaded(callback: (info: UpdateInfo) => void): void;
    onUpdateError(callback: (error: string) => void): void;
    removeListeners(): void;
}

export interface IElectronAPI {
    ping(): Promise<string>;
    rules: IRulesAPI;
    settings: ISettingsAPI;
    mcp: IMcpAPI;
    sync: ISyncAPI;
    toolIntegration: IToolIntegrationAPI;
    toolDetection: IToolDetectionAPI;
    toolConfig: IToolConfigAPI;
    projects: IProjectsAPI;
    dialog: IDialogAPI;
    history: IHistoryAPI;
    sets: ISetAPI;
    updater: IUpdaterAPI;
}