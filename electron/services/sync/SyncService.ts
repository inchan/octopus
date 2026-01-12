import fs from 'fs/promises';
import path from 'path';
import { McpService } from '../mcp/McpService';
import { RulesService } from '../rules/RulesService';
import { McpConnectionManager } from './McpConnectionManager';
import { SyncResult, SyncPreviewData, GeneratedFile, ToolType } from '../../../shared/types';
import { ClaudeMdGenerator } from './generators/ClaudeMdGenerator';
import { CursorRulesGenerator } from './generators/CursorRulesGenerator';
import { WindsurfRulesGenerator } from './generators/WindsurfRulesGenerator';
import { GeneratorContext, FileGenerator } from './generators/FileGenerator';
import { RuleSetService } from '../sets/RuleSetService';
import { TOOL_IDS } from '../../../shared/constants';
import { ProjectService } from '../project/ProjectService';
import { ToolConfigService } from '../tool-integration/ToolConfigService';
import { ToolIntegrationService } from '../tool-integration/ToolIntegrationService';
import { McpSetService } from '../sets/McpSetService';

export class SyncService {
    constructor(
        private mcpService: McpService,
        private connectionManager: McpConnectionManager,
        private rulesService: RulesService,
        private ruleSetService: RuleSetService,
        private projectService: ProjectService,
        private toolConfigService: ToolConfigService,
        private toolIntegrationService: ToolIntegrationService,
        private mcpSetService: McpSetService
    ) { }

    // ... existing syncAll ...

    async getProjectSyncPreview(projectId: string): Promise<GeneratedFile[]> {
        const project = (await this.projectService.getAll()).find(p => p.id === projectId);
        if (!project) throw new Error(`Project not found: ${projectId}`);

        const configs = await this.toolConfigService.getProjectConfigs(projectId);
        const results: GeneratedFile[] = [];

        for (const config of configs) {
            // Resolve Rule Set
            let rules: Awaited<ReturnType<typeof this.rulesService.getAll>> = [];
            if (config.ruleSetId) {
                const ruleSet = await this.ruleSetService.getById(config.ruleSetId);
                if (ruleSet) {
                    const allRules = await this.rulesService.getAll();
                    rules = allRules.filter(r => ruleSet.items.includes(r.id));
                }
            }

            // Resolve MCP Set
            let mcpServers: Awaited<ReturnType<typeof this.mcpService.getAll>> = [];
            if (config.mcpSetId) {
                const mcpSet = await this.mcpSetService.getById(config.mcpSetId);
                if (mcpSet) {
                    const allServers = await this.mcpService.getAll();
                    mcpServers = allServers.filter(s => mcpSet.items.includes(s.id));
                }
            }

            // Generate
            // ToolType casing might be an issue. DB uses lowercase usually, ToolIntegrationService usually TitleCase? 
            // Let's assume toolId is lowercase in config (e.g. 'cursor'), but ToolIntegrationService expects 'Cursor'.
            // wait, ToolIntegrationService types uses ToolType = 'Claude' | 'Cursor' | 'Windsurf'.
            // Config usually stores lowercase 'cursor'.
            const toolType = (config.toolId.charAt(0).toUpperCase() + config.toolId.slice(1)) as ToolType;

            try {
                const generated = await this.toolIntegrationService.generateConfig(toolType, 'Project', {
                    rules,
                    mcpServers
                });

                // Prepend Project Path to relative paths returned by generator
                const filesWithFullPath = generated.map(f => ({
                    ...f,
                    path: path.join(project.path, f.path)
                }));

                results.push(...filesWithFullPath);
            } catch (e) {
                console.warn(`Failed to generate config for ${config.toolId}:`, e);
            }
        }

        return results;
    }

    // ... existing generatePreview, applySync, importClaudeMd, readFileSafe ...

    async syncAll(): Promise<SyncResult[]> {
        const activeServers = (await this.mcpService.getAll()).filter(s => s.isActive);
        const results: SyncResult[] = [];

        for (const server of activeServers) {
            try {
                const client = await this.connectionManager.connect(server);

                // Fetch Metadata
                const tools = await client.listTools();
                const resources = await client.listResources();

                results.push({
                    serverId: server.id,
                    serverName: server.name,
                    status: 'success',
                    toolsCount: tools.tools.length,
                    resourcesCount: resources.resources.length
                });

            } catch (error) {
                console.error(`Failed to sync server ${server.name}:`, error);
                results.push({
                    serverId: server.id,
                    serverName: server.name,
                    status: 'failed',
                    toolsCount: 0,
                    resourcesCount: 0,
                    error: String(error)
                });
            }
        }

        return results;
    }

    async generatePreview(targetDirectory: string, toolId: string): Promise<SyncPreviewData> {
        const rules = await this.rulesService.getAll();
        const mcpServers = await this.mcpService.getAll();

        const context: GeneratorContext = {
            rules: rules.filter(r => r.isActive),
            mcpServers: mcpServers
        };

        const generatorMap: Record<string, { Gen: new () => FileGenerator; filename: string }> = {
            [TOOL_IDS.CLAUDE]: { Gen: ClaudeMdGenerator, filename: 'CLAUDE.md' },
            'claude-code': { Gen: ClaudeMdGenerator, filename: 'CLAUDE.md' }, // Alias
            'claude-desktop': { Gen: ClaudeMdGenerator, filename: 'CLAUDE.md' }, // Alias
            [TOOL_IDS.CURSOR]: { Gen: CursorRulesGenerator, filename: '.cursorrules' },
            [TOOL_IDS.WINDSURF]: { Gen: WindsurfRulesGenerator, filename: '.windsurfrules' },
        };

        const config = generatorMap[toolId] || generatorMap[TOOL_IDS.CLAUDE];
        const content = await new config.Gen().generate(context);
        const filename = config.filename;

        const targetPath = path.join(targetDirectory, filename);
        const oldContent = await this.readFileSafe(targetPath);

        return {
            targetPath,
            diff: {
                oldContent,
                newContent: content,
                hasChanges: oldContent !== content
            }
        };
    }

    async applySync(targetPath: string, content: string): Promise<void> {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, content, 'utf-8');
    }

    async importClaudeMd(filePath: string): Promise<{ ruleSetId: string; ruleCount: number }> {
        if (filePath.startsWith('~/')) {
            const os = await import('os');
            filePath = path.join(os.homedir(), filePath.slice(2));
        }

        const { ClaudeMdImporter } = await import('./importers/ClaudeMdImporter');
        const importer = new ClaudeMdImporter();
        const rules = await importer.parse(filePath);

        if (rules.length === 0) {
            return { ruleSetId: '', ruleCount: 0 };
        }

        // 1. Create Rules in DB
        const ruleIds: string[] = [];
        for (const r of rules) {
            try {
                const createdRule = await this.rulesService.create({
                    name: r.name,
                    content: r.content,
                    isActive: true
                });
                ruleIds.push(createdRule.id);
            } catch (error) {
                console.error('[SyncService] Failed to create rule during import:', error);
            }
        }

        // 2. Create Rule Set
        const setName = `Imported from CLAUDE.md (${new Date().toLocaleString()})`;
        const ruleSet = await this.ruleSetService.create({
            name: setName,
            items: ruleIds
        });

        return { ruleSetId: ruleSet.id, ruleCount: rules.length };
    }

    private async readFileSafe(path: string): Promise<string | null> {
        try {
            return await fs.readFile(path, 'utf-8');
        } catch {
            return null;
        }
    }
}
