import { ipcMain } from 'electron';
import { ToolIntegrationService } from '../services/tool-integration/ToolIntegrationService';
import { ConfigScope, ToolType } from '../services/tool-integration/types';
import { Rule, McpSet, McpServer, RuleSet } from '../../shared/types';
import { McpSetService } from '../services/sets/McpSetService';
import { RulesService } from '../services/rules/RulesService';
import { safeHandler } from './wrapper';

export class ToolIntegrationHandler {
    constructor(
        private service: ToolIntegrationService,
        private mcpSetService: McpSetService,
        private rulesService: RulesService
    ) { }

    register() {
        ipcMain.handle('tool-integration:generate-config', async (_, tool: string, scope: ConfigScope, data: { ruleSet?: RuleSet, mcpSet?: McpSet }) => {
            return safeHandler(async () => {
                console.log('[ToolIntegrationHandler] Received request:', {
                    tool,
                    scope,
                    ruleSet: data.ruleSet?.name,
                    mcpSet: data.mcpSet?.name
                });

                let mcpServers: McpServer[] = [];
                if (data.mcpSet) {
                    if (data.mcpSet.items && data.mcpSet.items.length > 0) {
                        mcpServers = await this.mcpSetService.resolveServers(data.mcpSet.items);
                    } else {
                        mcpServers = await this.mcpSetService.getResolvedServers(data.mcpSet.id);
                    }
                }

                let rules: Rule[] = [];
                if (data.ruleSet) {
                    const ruleIds = data.ruleSet.items || [];
                    for (const id of ruleIds) {
                        const rule = await this.rulesService.getById(id);
                        if (rule) {
                            rules.push(rule);
                        }
                    }
                }

                const result = await this.service.generateConfig(tool, scope, {
                    rules: rules,
                    mcpServers: mcpServers
                });

                return result;
            });
        });
    }
}
