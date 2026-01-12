export interface Rule {
    id: string;
    name: string;
    content: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateRuleParams = Pick<Rule, 'name' | 'content' | 'isActive'> & { id?: string };
export type UpdateRuleParams = Partial<CreateRuleParams> & { id: string };

export interface McpServer {
    id: string;
    name: string;
    command: string;
    args: string[];
    env: Record<string, string>;
    url?: string; // New field for SSE support
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateMcpServerParams = Pick<McpServer, 'name' | 'command' | 'args' | 'env' | 'isActive'> & { id?: string; url?: string };
export type UpdateMcpServerParams = Partial<CreateMcpServerParams> & { id: string };

// MCP Import Types
export type DuplicateStrategy = 'skip' | 'overwrite' | 'rename';

export interface ImportMcpServersParams {
    servers: CreateMcpServerParams[];
    duplicateStrategy?: DuplicateStrategy;
    selectedNames?: string[];
}

export interface ImportMcpServersResult {
    success: number;
    failed: number;
    skipped: number;
    overwritten: number;
    renamed: Array<{ original: string; renamed: string }>;
    errors: Array<{ name: string; reason: string }>;
    imported: McpServer[];
}

export interface HistoryEntry {
    id: string;
    entityType: 'rule' | 'mcp';
    entityId: string;
    action: 'create' | 'update' | 'delete';
    data: Record<string, any>;
    createdAt: string;
}

export interface McpSet {
    id: string;
    name: string;
    items: string[]; // IDs of McpServers
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateMcpSetParams = Pick<McpSet, 'name' | 'items'>;
export type UpdateMcpSetParams = Partial<CreateMcpSetParams> & { id: string; isArchived?: boolean };

export interface RuleSet {
    id: string;
    name: string;
    items: string[]; // IDs of Rules
    createdAt: string;
    updatedAt: string;
}

export type CreateRuleSetParams = Pick<RuleSet, 'name' | 'items'>;
export type UpdateRuleSetParams = Partial<CreateRuleSetParams> & { id: string };

export interface ToolSet {
    id: string;
    name: string;
    isDefault: boolean;
    items: string[]; // IDs of ToolDefinitions or Tools
    createdAt: string;
    updatedAt: string;
}

export type CreateToolSetParams = Pick<ToolSet, 'name' | 'items'> & { isDefault?: boolean };
export type UpdateToolSetParams = Partial<CreateToolSetParams> & { id: string };

export type ToolType = 'Cursor' | 'Windsurf' | 'Cline' | 'Claude Desktop' | 'Claude Code';
export type ConfigScope = 'Global' | 'Project' | 'ProjectLocal';

export interface GeneratedFile {
    path: string;
    content: string;
    description?: string;
}

export interface ToolDetectionResult {
    id: string;
    name: string;
    type: 'cli' | 'ide' | 'desktop';
    isInstalled: boolean;
    version?: string;
    paths: {
        app?: string;
        config?: string;
        bin?: string;
    };
}

export interface Project {
    id: string;
    name: string;
    path: string;
    type: 'node' | 'python' | 'go' | 'rust' | 'unknown';
    createdAt: string;
    updatedAt: string;
}

export type CreateProjectParams = Pick<Project, 'name' | 'path' | 'type'> & { id?: string };
export type UpdateProjectParams = Partial<CreateProjectParams> & { id: string };

export interface ToolConfig {
    id: string;
    toolId: string;
    contextType: 'global' | 'project';
    contextId: string;
    ruleSetId?: string;
    mcpSetId?: string;
    updatedAt: string;
}

export type SetToolConfigParams = Omit<ToolConfig, 'id' | 'updatedAt'>;

export interface SyncResult {
    serverId: string;
    serverName: string;
    status: 'success' | 'failed';
    toolsCount: number;
    resourcesCount: number;
    error?: string;
}

export interface DiffResult {
    oldContent: string | null;
    newContent: string;
    hasChanges: boolean;
}

export interface SyncPreviewData {
    diff: DiffResult;
    targetPath: string;
}

export interface SettingsSchema {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'ko';
    autoSync: boolean;
    openAIKey?: string;
    anthropicKey?: string;
}

