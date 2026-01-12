
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class CursorGenerator implements ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope === 'Global') return [];

        const baseDir =
            scope === 'Project' ? '.cursor/rules' : '.cursor/rules/.local';

        return rules.map((rule) => {
            const safeName = this.sanitizeFilename(this.getRuleName(rule));
            const filename = `${baseDir}/${safeName}.mdc`;

            const content = `---
description: ${rule.content.slice(0, 50)}
globs: ${rule.name}
---

# ${this.getRuleName(rule)}

${rule.content}
`;
            return { path: filename, content };
        });
    }

    generateMcpConfig(scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        const filename =
            scope === 'Global'
                ? '~/.cursor/mcp.json' // Not used for auto-gen, but for guide
                : scope === 'Project'
                    ? '.cursor/mcp.json'
                    : '.cursor/mcp.local.json';

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

            // stdio
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

        return [
            {
                path: filename,
                content: JSON.stringify({ mcpServers }, null, 2),
                description: scope === 'Global' ? 'Copy this content to your global settings' : undefined
            },
        ];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global') {
            return { rules: false, mcp: true };
        }
        // Project & ProjectLocal
        return { rules: true, mcp: true };
    }

    private sanitizeFilename(name: string): string {
        return name.replace(/[^a-zA-Z0-9\-_]/g, '_');
    }

    private getRuleName(rule: Rule): string {
        if (rule.name) return rule.name;

        const snippet = rule.content.split('\n')[0].slice(0, 30).trim();
        return snippet || rule.id;
    }
}
