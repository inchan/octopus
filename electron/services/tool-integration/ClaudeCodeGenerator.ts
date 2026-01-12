import path from 'path';
import os from 'os';
import fs from 'fs';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class ClaudeCodeGenerator implements ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        // Global mode support
        if (scope === 'Global') {
            const homeDir = os.homedir();
            // Assuming default location or user preferred location for CLI tools
            // Since Claude Code likely uses project-local CONFIG, Global rules might be simulated
            // by a central file or we output to a known location for manual use.
            // For now, output to a global rules file.
            const targetPath = path.join(homeDir, '.claude', 'CLAUDE.md');

            const content = rules
                .map(rule => `## ${rule.name}\n${rule.content}`)
                .join('\n\n');

            return [{
                path: targetPath,
                content: `# Claude Code Rules (Global)\n\n${content}`,
                description: 'Global Rules for Claude Code (~/.claude/CLAUDE.md)'
            }];
        }

        // ProjectLocal is not supported yet for 'generateRules' in this context unless we know the project path.
        if (scope === 'ProjectLocal') return [];

        // Fallback for non-Global if any
        return [];
    }

    generateMcpConfig(_scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        // Generate for Global scope primarily
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
                // Adaptive Sync: Serena Optimization for Claude Code CLI
                if (server.name.toLowerCase().includes('serena')) {
                    // Force CLI-optimized arguments
                    finalArgs = [
                        '--from',
                        'git+https://github.com/oraios/serena',
                        'serena',
                        'start-mcp-server',
                        '--context',
                        'claude-code',
                        '--project',
                        '$(pwd)'
                    ];
                }

                mcpServers[server.name] = {
                    command: server.command,
                    args: finalArgs,
                    env: server.env,
                };
            }
        });

        // Use absolute path for Global config: ~/.claude.json
        const homeDir = os.homedir();
        const targetPath = path.join(homeDir, '.claude.json');

        let existingConfig: any = {};
        try {
            if (fs.existsSync(targetPath)) {
                const raw = fs.readFileSync(targetPath, 'utf-8');
                existingConfig = JSON.parse(raw);
            }
        } catch (error) {
            console.warn('[ClaudeCodeGenerator] Failed to read existing config:', error);
        }

        // Merge only mcpServers key
        existingConfig.mcpServers = mcpServers;

        return [{
            path: targetPath,
            content: JSON.stringify(existingConfig, null, 2),
            description: 'MCP Configuration for Claude Code (~/.claude.json, mcpServers only)'
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global') return { rules: true, mcp: true };
        return { rules: false, mcp: true };
    }
}
