import path from 'path';
import os from 'os';
import fs from 'fs';
import toml from '@iarna/toml';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class GenericCLIGenerator implements ConfigGenerator {
    constructor(
        private toolName: string,
        private ruleFilename: string = 'rules.md',
        private configFilename: string = 'config.json'
    ) { }

    private getToolDir(): string {
        // e.g., ~/.codex, ~/.gemini
        return path.join(os.homedir(), `.${this.toolName.toLowerCase().replace(/\s+/g, '_')}`);
    }

    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope !== 'Global') return [];

        const content = rules
            .map(rule => `## ${rule.name}\n${rule.content}`)
            .join('\n\n');

        const targetPath = path.join(this.getToolDir(), this.ruleFilename);

        return [{
            path: targetPath,
            content: `# ${this.toolName} Rules (Global)\n\n${content}`,
            description: `Global Rules for ${this.toolName}`
        }];
    }

    generateMcpConfig(scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        if (scope !== 'Global') return [];

        const mcpServers: Record<string, any> = {};
        mcpServersList.forEach(server => {
            if (!server.isActive) return;

            if (server.url) {
                // For Gemini CLI, use httpUrl instead of url in the configuration
                if (this.toolName.toLowerCase().includes('gemini')) {
                    mcpServers[server.name] = {
                        httpUrl: server.url,
                    };
                } else {
                    mcpServers[server.name] = {
                        type: 'http',
                        url: server.url,
                    };
                }
            } else {
                let finalArgs = server.args || [];

                // Adaptive Sync: Serena Optimization based on tool
                if (server.name.toLowerCase().includes('serena')) {
                    let contextValue = 'desktop-app'; // default

                    if (this.toolName.toLowerCase().includes('codex')) {
                        contextValue = 'codex';
                    } else if (this.toolName.toLowerCase().includes('gemini')) {
                        contextValue = 'agent';
                    } else if (this.toolName.toLowerCase().includes('qwen')) {
                        contextValue = 'agent';
                    }

                    finalArgs = [
                        '--from',
                        'git+https://github.com/oraios/serena',
                        'serena',
                        'start-mcp-server',
                        '--context',
                        contextValue
                    ];
                }

                mcpServers[server.name] = {
                    command: server.command,
                    args: finalArgs,
                    env: server.env,
                };
            }
        });

        const targetPath = path.join(this.getToolDir(), this.configFilename);
        let content: string;
        let existingConfig: any = {};

        // 1. Try to read existing file to merge
        try {
            if (fs.existsSync(targetPath)) {
                const raw = fs.readFileSync(targetPath, 'utf-8');
                if (this.configFilename.endsWith('.toml')) {
                    existingConfig = toml.parse(raw);
                } else {
                    existingConfig = JSON.parse(raw);
                }
            }
        } catch (error) {
            console.warn(`[GenericCLIGenerator] Failed to read existing config for ${this.toolName}:`, error);
            // Fallback to empty object if parsing fails, but avoid overwriting if it's a critical error?
            // For now, we assume if it fails, we start fresh or it was empty.
        }

        // 2. Merge mcpServers
        // Update the 'mcpServers' key (or 'mcp_servers' for TOML by convention if used)
        if (this.configFilename.endsWith('.toml')) {
            // Helper to ensure structure
            // Note: @iarna/toml stringify might need a clean object structure.
            existingConfig.mcp_servers = existingConfig.mcp_servers || {};

            // We replace the managed servers, but keep others if they exist?
            // Usually Sync means "Current State of Align Agents" -> "Target State".
            // If we want to strictly manage, we overwrite the mcp_servers block.
            // But we must preserve other keys in existingConfig.

            // Map our format to TOML config structure 
            // Codex expects [mcp_servers.name]
            const mcpConfig: Record<string, any> = {};
            for (const [name, config] of Object.entries(mcpServers)) {
                mcpConfig[name] = config;
            }
            existingConfig.mcp_servers = mcpConfig;

            content = toml.stringify(existingConfig);
        } else {
            // JSON - Standard MCP format: mcpServers as Record<string, MCPServerConfig>
            // Gemini CLI expects: { "mcpServers": { "server-name": { command, args, env } } }
            // NOT an array format
            existingConfig.mcpServers = mcpServers;
            // Remove old `servers` array if it existed from previous wrong versions
            if (existingConfig.servers) delete existingConfig.servers;

            content = JSON.stringify(existingConfig, null, 2);
        }

        return [{
            path: targetPath,
            content: content,
            description: `MCP Configuration for ${this.toolName} (Merged with existing)`
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global') return { rules: true, mcp: true };
        return { rules: false, mcp: false };
    }
}
