import { contextBridge, ipcRenderer } from 'electron'
import {
    CreateRuleParams, UpdateRuleParams,
    CreateMcpServerParams, UpdateMcpServerParams,
    ImportMcpServersParams,
    CreateMcpSetParams, UpdateMcpSetParams,
    CreateRuleSetParams, UpdateRuleSetParams,
    CreateToolSetParams, UpdateToolSetParams,
    CreateProjectParams, UpdateProjectParams,
    SetToolConfigParams,
    McpSet, SettingsSchema, RuleSet
} from '../shared/types'
import { IElectronAPI } from '../shared/api'

const api: IElectronAPI = {
    ping: () => ipcRenderer.invoke('ping'),
    rules: {
        list: () => ipcRenderer.invoke('rules:list'),
        get: (id: string) => ipcRenderer.invoke('rules:get', id),
        create: (params: CreateRuleParams) => ipcRenderer.invoke('rules:create', params),
        update: (params: UpdateRuleParams) => ipcRenderer.invoke('rules:update', params),
        delete: (id: string) => ipcRenderer.invoke('rules:delete', id),
    },
    mcp: {
        list: () => ipcRenderer.invoke('mcp:list'),
        get: (id: string) => ipcRenderer.invoke('mcp:get', id),
        create: (params: CreateMcpServerParams) => ipcRenderer.invoke('mcp:create', params),
        update: (params: UpdateMcpServerParams) => ipcRenderer.invoke('mcp:update', params),
        delete: (id: string) => ipcRenderer.invoke('mcp:delete', id),
        fetchConfigFromUrl: (url: string) => ipcRenderer.invoke('mcp:fetchConfigFromUrl', url),
        import: (params: ImportMcpServersParams) => ipcRenderer.invoke('mcp:import', params),
    },
    sync: {
        start: () => ipcRenderer.invoke('sync:start'),
        preview: (targetPath: string, type: 'claude' | 'cursor' | 'vscode') => ipcRenderer.invoke('sync:preview', targetPath, type),
        apply: (targetPath: string, content: string) => ipcRenderer.invoke('sync:apply', targetPath, content),
        import: (filePath: string) => ipcRenderer.invoke('sync:import', filePath),
        previewProject: (projectId: string) => ipcRenderer.invoke('sync:previewProject', projectId),
    },
    toolIntegration: {
        generateConfig: (tool: string, scope: string, data: { ruleSet?: RuleSet, mcpSet?: McpSet }) => ipcRenderer.invoke('tool-integration:generate-config', tool, scope, data),
    },
    settings: {
        get: (key: keyof SettingsSchema) => ipcRenderer.invoke('settings:get', key),
        getAll: () => ipcRenderer.invoke('settings:getAll'),
        set: (key: keyof SettingsSchema, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
    },
    toolDetection: {
        detect: () => ipcRenderer.invoke('tool-detection:detect'),
        getCached: () => ipcRenderer.invoke('tool-detection:getCached'),
    },
    dialog: {
        openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    },
    history: {
        list: () => ipcRenderer.invoke('history:list'),
        revert: (id: string) => ipcRenderer.invoke('history:revert', id),
    },
    sets: {
        mcp: {
            list: () => ipcRenderer.invoke('sets:mcp:list'),
            create: (params: CreateMcpSetParams) => ipcRenderer.invoke('sets:mcp:create', params),
            update: (params: UpdateMcpSetParams) => ipcRenderer.invoke('sets:mcp:update', params),
            delete: (id: string) => ipcRenderer.invoke('sets:mcp:delete', id),
        },
        rules: {
            list: () => ipcRenderer.invoke('sets:rules:list'),
            create: (params: CreateRuleSetParams) => ipcRenderer.invoke('sets:rules:create', params),
            update: (params: UpdateRuleSetParams) => ipcRenderer.invoke('sets:rules:update', params),
            delete: (id: string) => ipcRenderer.invoke('sets:rules:delete', id),
        },
        tools: {
            list: () => ipcRenderer.invoke('sets:tools:list'),
            create: (params: CreateToolSetParams) => ipcRenderer.invoke('sets:tools:create', params),
            update: (params: UpdateToolSetParams) => ipcRenderer.invoke('sets:tools:update', params),
            delete: (id: string) => ipcRenderer.invoke('sets:tools:delete', id),
        }
    },
    projects: {
        list: () => ipcRenderer.invoke('projects:list'),
        create: (params: CreateProjectParams) => ipcRenderer.invoke('projects:create', params),
        update: (params: UpdateProjectParams) => ipcRenderer.invoke('projects:update', params),
        delete: (id: string) => ipcRenderer.invoke('projects:delete', id),
        scan: (targetPath: string) => ipcRenderer.invoke('projects:scan', targetPath),
    },
    toolConfig: {
        get: (toolId: string, contextId?: string) => ipcRenderer.invoke('tool-config:get', { toolId, contextId }),
        set: (params: SetToolConfigParams) => ipcRenderer.invoke('tool-config:set', params),
        listProject: (projectId: string) => ipcRenderer.invoke('tool-config:list-project', projectId),
    }
};

contextBridge.exposeInMainWorld('api', api);
