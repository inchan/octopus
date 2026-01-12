
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class ClaudeGenerator implements ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope === 'Global' || scope === 'ProjectLocal') return [];

        // Manual QA prompt file
        const content = rules
            .map(rule => `## ${rule.name}\n${rule.content}`)
            .join('\n\n');

        return [{
            path: 'QA_PROMPT.md',
            content: `# System Prompts\n\n${content}`,
            description: 'Manual reference for Claude Desktop Project Knowledge'
        }];
    }

    generateMcpConfig(scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        if (scope === 'Global') {
            // Global config path varies by OS
            const mcpServers: Record<string, any> = {};
            mcpServersList.forEach((server) => {
                if (!server.isActive) return;

                if (server.url) {
                    mcpServers[server.name] = {
                        type: 'http',
                        url: server.url,
                    };
                    return;
                }

                let finalArgs = server.args || [];
                // Adaptive Sync: Serena Optimization for Claude Desktop
                if (server.name.toLowerCase().includes('serena')) {
                    // Force Desktop-optimized arguments
                    finalArgs = [
                        '--from',
                        'git+https://github.com/oraios/serena',
                        'serena',
                        'start-mcp-server',
                        '--context',
                        'desktop-app'
                    ];
                }

                mcpServers[server.name] = {
                    command: server.command,
                    args: finalArgs,
                    env: server.env,
                };
            });

            return [{
                path: 'claude_desktop_config.json',
                content: JSON.stringify({ mcpServers }, null, 2),
                description: 'Copy to your OS-specific configuration path'
            }];
        }

        // Project or ProjectLocal
        const path = '.mcp.json'; // Project Local would also use this but likely ignored
        const mcpServers: Record<string, any> = {};
        mcpServersList.forEach((server) => {
            if (!server.isActive) return;

            if (server.url) {
                mcpServers[server.name] = {
                    type: 'http',
                    url: server.url,
                };
                return;
            }

            mcpServers[server.name] = {
                command: server.command,
                args: server.args || [],
                env: server.env,
            };
        });

        return [{
            path,
            content: JSON.stringify({ mcpServers }, null, 2)
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'ProjectLocal') return { rules: false, mcp: true };
        return { rules: true, mcp: true };
    }
}
