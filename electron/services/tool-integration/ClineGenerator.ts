import path from 'path';
import os from 'os';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class ClineGenerator implements ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope === 'Global') {
            // Official Global Rules Path for Cline
            const rulesDir = path.join(os.homedir(), 'Documents', 'Cline', 'Rules');
            const targetPath = path.join(rulesDir, 'Global Rules.md');

            const content = rules
                .map(rule => `## ${rule.name}\n${rule.content}`)
                .join('\n\n');

            return [{
                path: targetPath,
                content: `# Global Rules\n\n${content}`,
                description: 'Official Global Rules for Cline'
            }];
        }

        const relativeConfigFile = scope === 'Project' ? '.clinerules' : '.clinerules.local';

        // Cline uses a single markdown file with instructions
        const content = rules
            .map(rule => `## Rules for ${rule.name}\n${rule.content}`)
            .join('\n\n');

        return [{ path: relativeConfigFile, content }];
    }

    generateMcpConfig(scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        if (scope !== 'Global') return [];

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

            // Adaptive Sync: Serena Optimization for IDE
            if (server.name.toLowerCase().includes('serena')) {
                finalArgs = [
                    '--from',
                    'git+https://github.com/oraios/serena',
                    'serena',
                    'start-mcp-server',
                    '--context',
                    'ide'
                ];
            }

            mcpServers[server.name] = {
                command: server.command,
                args: finalArgs,
                env: server.env,
            };
        });

        // specific global storage path for Cline extension (saoudrizwan.claude-dev)
        // Note: This path is for macOS. Windows/Linux differ, but we focus on Mac per user OS.
        const targetPath = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');

        return [{
            path: targetPath, // Global hidden path
            content: JSON.stringify({ mcpServers }, null, 2),
            description: 'Official Cline MCP Settings'
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global') return { rules: false, mcp: true };
        return { rules: true, mcp: false }; // Local/Project Only Rules
    }
}
