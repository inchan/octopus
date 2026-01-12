import path from 'path';
import os from 'os';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class VSCodeGenerator implements ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope !== 'Global') return [];

        const content = rules
            .map(rule => `## ${rule.name}\n${rule.content}`)
            .join('\n\n');

        // Global storage for VS Code rules (Used manually or by extensions like 'Claude Dev')
        // We output to a standard location that users can reference or symlink.
        // ~/.vscode/rules.md is a safer "User Global" convention than internal extension storage.
        const targetPath = path.join(os.homedir(), '.vscode', 'rules.md');

        return [{
            path: targetPath,
            content: `# VS Code Rules (Global)\n\n${content}`,
            description: 'Global Rules for VS Code (Convention: ~/.vscode/rules.md)'
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

                // Adaptive Sync: Serena Optimization for IDE
                if (server.name.toLowerCase().includes('serena')) {
                    // Force IDE-optimized arguments
                    finalArgs = [
                        '--from',
                        'git+https://github.com/oraios/serena',
                        'serena',
                        'start-mcp-server',
                        '--context',
                        'ide',
                        '--project',
                        '${workspaceFolder}'
                    ];
                }

                mcpServers[server.name] = {
                    command: server.command,
                    args: finalArgs,
                    env: server.env,
                };
            }
        });

        // VS Code 1.96+ uses .vscode/mcp.json
        const targetPath = path.join(os.homedir(), '.vscode', 'mcp.json');

        return [{
            path: targetPath,
            content: JSON.stringify({ mcpServers }, null, 2),
            description: 'MCP Configuration for VS Code (Standard: ~/.vscode/mcp.json)'
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global') return { rules: true, mcp: true };
        return { rules: false, mcp: false };
    }
}
