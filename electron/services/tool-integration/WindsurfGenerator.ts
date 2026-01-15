import path from 'path';
import os from 'os';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class WindsurfGenerator implements ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope === 'ProjectLocal') return []; // Not supported

        let targetPath: string;
        if (scope === 'Global') {
            targetPath = path.join(os.homedir(), '.codeium', 'windsurf', 'memories', 'global_rules.md');
        } else {
            targetPath = '.windsurfrules';
        }

        const content = rules
            .map(rule => `### ${rule.name}\n${rule.content}`)
            .join('\n\n');

        return [{ path: targetPath, content }];
    }

    generateMcpConfig(_scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
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
                        finalArgs = [...finalArgs, '--context', 'ide'];
                    }
                }

                mcpServers[server.name] = {
                    command: server.command,
                    args: finalArgs,
                    env: server.env,
                };
            }
        });

        const targetPath = path.join(os.homedir(), '.codeium', 'windsurf', 'mcp_config.json');

        return [{
            path: targetPath,
            content: JSON.stringify({ mcpServers }, null, 2),
            description: 'Copy this to your Windsurf global MCP config'
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'ProjectLocal') return { rules: false, mcp: false };
        if (scope === 'Project') return { rules: true, mcp: false };
        // Global
        return { rules: true, mcp: true };
    }
}
