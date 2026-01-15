import path from 'path';
import os from 'os';
import fs from 'fs';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

/**
 * Generator for Atlassian Rovo Dev CLI
 *
 * Config structure:
 * - MCP: ~/.rovodev/mcp.json (same format as Claude Code)
 * - Rules: ~/.rovodev/config.yml (additionalSystemPrompt field)
 */
export class RovoDevGenerator implements ConfigGenerator {
    private getConfigDir(): string {
        return path.join(os.homedir(), '.rovodev');
    }

    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope !== 'Global') return [];

        const agentsPath = path.join(this.getConfigDir(), 'AGENTS.md');

        // Combine rules into markdown format
        const rulesContent = rules
            .map(rule => `## ${rule.name}\n\n${rule.content}`)
            .join('\n\n');

        const content = `# Rovo Dev Global Rules\n\n${rulesContent}`;

        return [{
            path: agentsPath,
            content,
            description: 'Rules for Rovo Dev (~/.rovodev/AGENTS.md)'
        }];
    }

    generateMcpConfig(scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        if (scope !== 'Global') return [];

        const mcpServers: Record<string, any> = {};
        mcpServersList.forEach(server => {
            if (!server.isActive) return;

            if (server.url) {
                mcpServers[server.name] = {
                    type: 'http',
                    url: server.url,
                };
            } else {
                let finalArgs = server.args || [];

                // Adaptive Sync: Serena --context 보완 (사용자 args 유지)
                if (server.name.toLowerCase().includes('serena')) {
                    if (!finalArgs.includes('--context')) {
                        finalArgs = [...finalArgs, '--context', 'agent'];
                    }
                }

                mcpServers[server.name] = {
                    command: server.command,
                    args: finalArgs,
                    env: server.env,
                };
            }
        });

        const targetPath = path.join(this.getConfigDir(), 'mcp.json');

        // Read existing config to merge
        let existingConfig: any = {};
        try {
            if (fs.existsSync(targetPath)) {
                const raw = fs.readFileSync(targetPath, 'utf-8');
                existingConfig = JSON.parse(raw);
            }
        } catch (error) {
            console.warn('[RovoDevGenerator] Failed to read existing MCP config:', error);
        }

        existingConfig.mcpServers = mcpServers;

        return [{
            path: targetPath,
            content: JSON.stringify(existingConfig, null, 2),
            description: 'MCP Configuration for Rovo Dev (~/.rovodev/mcp.json)'
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global') return { rules: true, mcp: true };
        return { rules: false, mcp: false };
    }
}
