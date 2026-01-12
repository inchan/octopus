import { ConfigGenerator, ConfigScope, GeneratedFile, ToolType } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class ToolIntegrationService {
    private generators: Map<string, ConfigGenerator> = new Map();

    constructor(initialGenerators?: { tool: string, generator: ConfigGenerator }[]) {
        if (initialGenerators) {
            initialGenerators.forEach(ig => this.registerGenerator(ig.tool, ig.generator));
        }
    }

    registerGenerator(tool: string, generator: ConfigGenerator) {
        this.generators.set(tool, generator);
    }

    async generateConfig(
        tool: string,
        scope: ConfigScope,
        data: { rules?: Rule[]; mcpServers?: McpServer[] }
    ): Promise<GeneratedFile[]> {
        console.log(`[ToolIntegrationService] generating config for ${tool} (scope: ${scope})`);

        const generator = this.generators.get(tool);
        if (!generator) {
            console.warn(`[ToolIntegrationService] Generator not found for tool: ${tool}`);
            // Instead of throwing, return empty array to prevent breaking the loop in SyncPage
            // This handles the case for tools like 'Codex CLI' that don't have generators yet.
            return [];
        }

        const results: GeneratedFile[] = [];

        try {
            const support = generator.getSupportStatus(scope);
            console.log(`[ToolIntegrationService] ${tool} support status:`, support);

            if (data.rules) {
                if (support.rules) {
                    const rules = generator.generateRules(scope, data.rules);
                    console.log(`[ToolIntegrationService] Generated ${rules.length} rule files for ${tool}`);
                    results.push(...rules);
                } else {
                    console.log(`[ToolIntegrationService] Rules not supported for ${tool} in ${scope} scope`);
                }
            }

            if (data.mcpServers) {
                if (support.mcp) {
                    const mcpConfigs = generator.generateMcpConfig(scope, data.mcpServers);
                    console.log(`[ToolIntegrationService] Generated ${mcpConfigs.length} MCP config files for ${tool}`);
                    results.push(...mcpConfigs);
                } else {
                    console.log(`[ToolIntegrationService] MCP not supported for ${tool} in ${scope} scope`);
                }
            }
        } catch (error) {
            console.error(`[ToolIntegrationService] Error generating config for ${tool}:`, error);
            // Return what we have so far or empty
        }

        return results;
    }
}
