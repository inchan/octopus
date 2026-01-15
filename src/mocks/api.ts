import {
    IElectronAPI, IRulesAPI, IMcpAPI, ISyncAPI, ISettingsAPI,
    IToolDetectionAPI, IDialogAPI, IHistoryAPI, IToolIntegrationAPI,
    ISetAPI, IToolConfigAPI, IProjectsAPI, IUpdaterAPI, Rule, HistoryEntry, McpServer,
    SettingsSchema, CreateRuleParams, UpdateRuleParams,
    CreateMcpServerParams, UpdateMcpServerParams, CreateMcpSetParams,
    UpdateMcpSetParams, CreateRuleSetParams, UpdateRuleSetParams,
    CreateToolSetParams, UpdateToolSetParams, CreateProjectParams,
    UpdateProjectParams, SetToolConfigParams, RuleSet, McpSet, ToolSet,
    Project
} from "../../shared/api";

// Simple UUID generator
const uuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Helper to persist data in localStorage
const getStorage = <T>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(`mock_api_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
};

const setStorage = <T>(key: string, value: T) => {
    localStorage.setItem(`mock_api_${key}`, JSON.stringify(value));
};

class MockApi implements IElectronAPI {
    platform = 'darwin';

    private get _rules(): Rule[] { return getStorage('rules', []); }
    private set _rules(v: Rule[]) { setStorage('rules', v); }

    private get _history(): HistoryEntry[] { return getStorage('history', []); }
    private set _history(v: HistoryEntry[]) { setStorage('history', v); }

    private get _mcpServers(): McpServer[] { return getStorage('mcp_servers', []); }
    private set _mcpServers(v: McpServer[]) { setStorage('mcp_servers', v); }

    private get _ruleSets(): RuleSet[] { return getStorage('rule_sets', []); }
    private set _ruleSets(v: RuleSet[]) { setStorage('rule_sets', v); }

    private get _mcpSets(): McpSet[] { return getStorage('mcp_sets', []); }
    private set _mcpSets(v: McpSet[]) { setStorage('mcp_sets', v); }

    private get _toolSets(): ToolSet[] { return getStorage('tool_sets', []); }
    private set _toolSets(v: ToolSet[]) { setStorage('tool_sets', v); }

    private get _projects(): Project[] { return getStorage('projects', []); }
    private set _projects(v: Project[]) { setStorage('projects', v); }

    private get _toolConfigs(): any[] { return getStorage('tool_configs', []); }
    private set _toolConfigs(v: any[]) { setStorage('tool_configs', v); }

    ping = async () => 'pong';

    updater: IUpdaterAPI = {
        checkForUpdates: async () => { console.log('Mock: Checking for updates...'); },
        installUpdate: async () => { console.log('Mock: Installing update...'); },
        openDownloadPage: async () => { console.log('Mock: Opening download page...'); },
        onUpdateAvailable: (_cb) => { console.log('Mock: Registered update-available listener'); },
        onUpdateProgress: (_cb) => { console.log('Mock: Registered update-progress listener'); },
        onUpdateDownloaded: (_cb) => { console.log('Mock: Registered update-downloaded listener'); },
        onUpdateError: (_cb) => { console.log('Mock: Registered update-error listener'); },
        removeListeners: () => { console.log('Mock: Removed update listeners'); }
    };

    rules: IRulesAPI = {
        list: async () => ({ success: true, data: this._rules }),
        get: async (id) => ({ success: true, data: this._rules.find(r => r.id === id) || null }),
        create: async (params: CreateRuleParams) => {
            const rule: Rule = {
                id: params.id || uuid(),
                name: params.name,
                content: params.content,
                isActive: params.isActive ?? true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const list = this._rules;
            list.push(rule);
            this._rules = list;
            this.logHistory('rule', rule.id, 'create', rule);
            return { success: true, data: rule };
        },
        update: async (params: UpdateRuleParams) => {
            const list = this._rules;
            const index = list.findIndex(r => r.id === params.id);
            if (index === -1) return { success: false, error: 'Rule not found' };
            const updated = { ...list[index], ...params, updatedAt: new Date().toISOString() };
            list[index] = updated;
            this._rules = list;
            this.logHistory('rule', updated.id, 'update', updated);
            return { success: true, data: updated };
        },
        delete: async (id) => {
            const list = this._rules;
            const index = list.findIndex(r => r.id === id);
            if (index === -1) return { success: false, error: 'Rule not found' };
            const deleted = list[index];
            list.splice(index, 1);
            this._rules = list;
            this.logHistory('rule', id, 'delete', deleted);
            return { success: true, data: undefined };
        }
    };

    mcp: IMcpAPI = {
        list: async () => ({ success: true, data: this._mcpServers }),
        get: async (id) => ({ success: true, data: this._mcpServers.find(s => s.id === id) || null }),
        create: async (params: CreateMcpServerParams) => {
            const newServer: McpServer = {
                ...params,
                id: params.id || uuid(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const list = this._mcpServers;
            list.push(newServer);
            this._mcpServers = list;
            this.logHistory('mcp', newServer.id, 'create', newServer);
            return { success: true, data: newServer };
        },
        update: async (params: UpdateMcpServerParams) => {
            const list = this._mcpServers;
            const idx = list.findIndex(s => s.id === params.id);
            if (idx === -1) return { success: false, error: 'Server not found' };
            const current = list[idx];
            list[idx] = { ...current, ...params, updatedAt: new Date().toISOString() };
            this._mcpServers = list;
            this.logHistory('mcp', params.id, 'update', list[idx]);
            return { success: true, data: list[idx] };
        },
        delete: async (id) => {
            const list = this._mcpServers;
            const idx = list.findIndex(s => s.id === id);
            if (idx === -1) return { success: false, error: 'Server not found' };
            const current = list[idx];
            list.splice(idx, 1);
            this._mcpServers = list;
            this.logHistory('mcp', id, 'delete', current);
            return { success: true, data: undefined };
        },
        fetchConfigFromUrl: async () => ({ success: true, data: '{}' }),
        import: async () => ({ success: true, data: { success: 0, failed: 0, skipped: 0, overwritten: 0, renamed: [], errors: [], imported: [] } })
    };

    sync: ISyncAPI = {
        start: async () => ({ success: true, data: [] }),
        preview: async () => ({
            success: true,
            data: {
                diff: {
                    hasChanges: true,
                    newContent: '# Mock New Content\nRule 1: New',
                    oldContent: '# Mock Old Content\nRule 1: Old'
                },
                targetPath: '/mock/cursor/.cursorrules'
            }
        }),
        apply: async () => ({ success: true, data: undefined }),
        import: async () => ({ success: true, data: { ruleSetId: 'mock-imported-set', ruleCount: 5 } }),
        previewProject: async () => ({ success: true, data: [] })
    };

    settings: ISettingsAPI = {
        get: async (key: keyof SettingsSchema) => {
            const s = getStorage('settings', { theme: 'dark', language: 'ko', autoSync: false });
            return (s as any)[key] || null;
        },
        getAll: async () => getStorage('settings', { theme: 'dark', language: 'ko', autoSync: false }),
        set: async (key, value) => {
            const s = getStorage('settings', { theme: 'dark', language: 'ko', autoSync: false });
            (s as any)[key] = value;
            setStorage('settings', s);
        }
    };

    toolIntegration: IToolIntegrationAPI = {
        generateConfig: async (tool, scope) => {
            let path = 'config.json';
            if (tool === 'Cursor') path = '.cursorrules';
            if (tool === 'Windsurf') path = '.windsurfrules';
            if (tool === 'Claude Code') path = 'rules.md';

            return {
                success: true,
                data: [
                    { path, content: `Test content for ${tool} in ${scope}` }
                ]
            };
        }
    };

    toolDetection: IToolDetectionAPI = {
        detect: async () => ({
            success: true,
            data: [
                {
                    id: 'cursor',
                    name: 'Cursor',
                    version: '1.0.0',
                    path: '/mock/bin/cursor',
                    type: 'ide',
                    isInstalled: true,
                    isRunning: false,
                    paths: { bin: '/mock/bin/cursor' }
                },
                {
                    id: 'claude-code',
                    name: 'Claude Code',
                    version: '1.0.0',
                    path: '/mock/bin/claude',
                    type: 'cli',
                    isInstalled: true,
                    isRunning: false,
                    paths: { bin: '/mock/bin/claude' }
                },
                {
                    id: 'windsurf',
                    name: 'Windsurf',
                    version: '1.0.0',
                    path: '/mock/bin/windsurf',
                    type: 'ide',
                    isInstalled: true,
                    isRunning: false,
                    paths: { bin: '/mock/bin/windsurf' }
                }
            ]
        }),
        getCached: async () => ({ success: true, data: null })
    };

    toolConfig: IToolConfigAPI = {
        get: async (toolId, contextId) => {
            const config = this._toolConfigs.find(c => c.toolId === toolId && c.contextId === contextId);
            return { success: true, data: config || null };
        },
        set: async (params: SetToolConfigParams) => {
            const list = this._toolConfigs;
            const idx = list.findIndex(c => c.toolId === params.toolId && c.contextId === params.contextId);
            const config = { ...params, id: idx !== -1 ? list[idx].id : uuid(), updatedAt: new Date().toISOString() };
            if (idx !== -1) list[idx] = config;
            else list.push(config);
            this._toolConfigs = list;
            return { success: true, data: config };
        },
        listProject: async () => ({ success: true, data: [] })
    };

    projects: IProjectsAPI = {
        list: async () => ({ success: true, data: this._projects }),
        create: async (params: CreateProjectParams) => {
            const project: Project = { ...params, id: uuid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            const list = this._projects;
            list.push(project);
            this._projects = list;
            return { success: true, data: project };
        },
        update: async (params: UpdateProjectParams) => {
            const list = this._projects;
            const idx = list.findIndex(p => p.id === params.id);
            if (idx === -1) return { success: false, error: 'Project not found' };
            list[idx] = { ...list[idx], ...params, updatedAt: new Date().toISOString() };
            this._projects = list;
            return { success: true, data: list[idx] };
        },
        delete: async (id: string) => {
            const list = this._projects;
            const idx = list.findIndex(p => p.id === id);
            if (idx !== -1) {
                list.splice(idx, 1);
                this._projects = list;
            }
            return { success: true, data: undefined };
        },
        scan: async () => ({ success: true, data: [] })
    };

    dialog: IDialogAPI = {
        openDirectory: async () => '/mock/project/path'
    };

    history: IHistoryAPI = {
        list: async () => ({ success: true, data: [...this._history].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }),
        revert: async (id) => {
            const historyList = this._history;
            const entry = historyList.find(h => h.id === id);
            if (!entry) return { success: false, error: 'Entry not found' };

            if (entry.entityType === 'rule') {
                const data = entry.data as Rule;
                const rulesList = this._rules;
                if (entry.action === 'create') {
                    const idx = rulesList.findIndex(r => r.id === entry.entityId);
                    if (idx !== -1) rulesList.splice(idx, 1);
                } else if (entry.action === 'delete') {
                    rulesList.push(data);
                } else if (entry.action === 'update') {
                    const idx = rulesList.findIndex(r => r.id === entry.entityId);
                    if (idx !== -1) rulesList[idx] = data;
                }
                this._rules = rulesList;
            }
            return { success: true, data: undefined };
        }
    };

    sets: ISetAPI = {
        mcp: {
            list: async () => ({ success: true, data: this._mcpSets }),
            create: async (params: CreateMcpSetParams) => {
                const set: McpSet = { ...params, id: uuid(), isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                const list = this._mcpSets;
                list.push(set);
                this._mcpSets = list;
                return { success: true, data: set };
            },
            update: async (params: UpdateMcpSetParams) => {
                const list = this._mcpSets;
                const idx = list.findIndex(s => s.id === params.id);
                if (idx === -1) return { success: false, error: 'Set not found' };
                list[idx] = { ...list[idx], ...params, updatedAt: new Date().toISOString() };
                this._mcpSets = list;
                return { success: true, data: list[idx] };
            },
            delete: async (id) => {
                const list = this._mcpSets;
                const idx = list.findIndex(s => s.id === id);
                if (idx !== -1) {
                    list.splice(idx, 1);
                    this._mcpSets = list;
                }
                return { success: true, data: undefined };
            }
        },
        rules: {
            list: async () => ({ success: true, data: this._ruleSets }),
            create: async (params: CreateRuleSetParams) => {
                const set: RuleSet = { ...params, items: params.items || [], id: uuid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                const list = this._ruleSets;
                list.push(set);
                this._ruleSets = list;
                return { success: true, data: set };
            },
            update: async (params: UpdateRuleSetParams) => {
                const list = this._ruleSets;
                const idx = list.findIndex(s => s.id === params.id);
                if (idx === -1) return { success: false, error: 'Set not found' };
                list[idx] = { ...list[idx], ...params, updatedAt: new Date().toISOString() };
                this._ruleSets = list;
                return { success: true, data: list[idx] };
            },
            delete: async (id) => {
                const list = this._ruleSets;
                const idx = list.findIndex(s => s.id === id);
                if (idx !== -1) {
                    list.splice(idx, 1);
                    this._ruleSets = list;
                }
                return { success: true, data: undefined };
            }
        },
        tools: {
            list: async () => ({ success: true, data: this._toolSets }),
            create: async (params: CreateToolSetParams) => {
                const set: ToolSet = { ...params, id: uuid(), isDefault: !!params.isDefault, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                const list = this._toolSets;
                list.push(set);
                this._toolSets = list;
                return { success: true, data: set };
            },
            update: async (params: UpdateToolSetParams) => {
                const list = this._toolSets;
                const idx = list.findIndex(s => s.id === params.id);
                if (idx === -1) return { success: false, error: 'Set not found' };
                list[idx] = { ...list[idx], ...params, updatedAt: new Date().toISOString() };
                this._toolSets = list;
                return { success: true, data: list[idx] };
            },
            delete: async (id) => {
                const list = this._toolSets;
                const idx = list.findIndex(s => s.id === id);
                if (idx !== -1) {
                    list.splice(idx, 1);
                    this._toolSets = list;
                }
                return { success: true, data: undefined };
            }
        }
    };

    private logHistory(type: 'rule' | 'mcp', id: string, action: 'create' | 'update' | 'delete', data: any) {
        const historyList = this._history;
        historyList.push({
            id: uuid(),
            entityType: type,
            entityId: id,
            action,
            data: data,
            createdAt: new Date().toISOString()
        });
        this._history = historyList;
    }
}

export function setupMockApi() {
    if (!window.api || !window.api.ping) {
        console.warn('Running in Browser Mode with Mock API (Forced)');
        window.api = new MockApi();
    }
}