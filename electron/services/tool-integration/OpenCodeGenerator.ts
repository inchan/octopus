import path from 'path';
import os from 'os';
import fs from 'fs';
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

interface OpenCodeMcpServerConfig {
    type?: 'remote' | 'local';
    url?: string;
    command?: string[];
    env?: Record<string, string>;
    enabled: boolean;
}

interface OpenCodeConfig {
    mcp?: Record<string, OpenCodeMcpServerConfig>;
    mcpServers?: unknown;
    [key: string]: unknown;
}

/**
 * OpenCode CLI Generator
 *
 * OpenCode는 SST에서 만든 오픈소스 AI 코딩 에이전트입니다.
 *
 * 설정 파일 경로:
 * - Global Rules: ~/.config/opencode/AGENTS.md
 * - Global MCP: ~/.config/opencode/opencode.json
 * - Project Rules: ./AGENTS.md
 * - Project MCP: ./opencode.json
 *
 * MCP 구조 (다른 도구들과 다름):
 * - OpenCode: { mcp: { "name": { type, url/command, enabled } } }
 * - 다른 도구: { mcpServers: { "name": { command, args, env } } }
 */
export class OpenCodeGenerator implements ConfigGenerator {
    private getGlobalConfigDir(): string {
        return path.join(os.homedir(), '.config', 'opencode');
    }

    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[] {
        if (scope === 'ProjectLocal') return [];

        const content = rules
            .map(rule => `## ${rule.name}\n${rule.content}`)
            .join('\n\n');

        const scopeLabel = scope === 'Global' ? 'Global' : 'Project';
        const header = `# OpenCode Rules (${scopeLabel})\n\n`;

        if (scope === 'Global') {
            return [{
                path: path.join(this.getGlobalConfigDir(), 'AGENTS.md'),
                content: header + content,
                description: 'Global Rules for OpenCode (AGENTS.md)'
            }];
        }

        // Project scope
        return [{
            path: 'AGENTS.md',
            content: header + content,
            description: 'Project Rules for OpenCode (AGENTS.md)'
        }];
    }

    generateMcpConfig(scope: ConfigScope, mcpServersList: McpServer[]): GeneratedFile[] {
        if (scope === 'ProjectLocal') return [];

        // Build OpenCode mcp format
        const mcp: Record<string, OpenCodeMcpServerConfig> = {};

        mcpServersList.forEach(server => {
            if (!server.isActive) return;

            if (server.url) {
                // Remote/HTTP server
                mcp[server.name] = {
                    type: 'remote',
                    url: server.url,
                    enabled: true
                };
            } else {
                // Command-based server
                let fullCommand = [server.command, ...(server.args || [])];

                // Adaptive Sync: Serena --context 보완 (사용자 args 유지)
                if (server.name.toLowerCase().includes('serena')) {
                    if (!fullCommand.includes('--context')) {
                        fullCommand = [...fullCommand, '--context', 'agent'];
                    }
                }

                mcp[server.name] = {
                    type: 'local',
                    command: fullCommand,
                    ...(server.env && Object.keys(server.env).length > 0 && { env: server.env }),
                    enabled: true
                };
            }
        });

        const targetPath = scope === 'Global'
            ? path.join(this.getGlobalConfigDir(), 'opencode.json')
            : 'opencode.json';

        // Try to read existing config to merge
        let existingConfig: OpenCodeConfig = {};
        if (scope === 'Global') {
            try {
                if (fs.existsSync(targetPath)) {
                    const raw = fs.readFileSync(targetPath, 'utf-8');
                    existingConfig = JSON.parse(raw);
                }
            } catch (error) {
                console.warn('[OpenCodeGenerator] Failed to read existing config:', error);
            }
        }

        // Merge mcp servers (OpenCode uses "mcp" key, not "mcpServers")
        existingConfig.mcp = mcp;

        // Remove mcpServers if it exists from previous wrong format
        if (existingConfig.mcpServers) {
            delete existingConfig.mcpServers;
        }

        return [{
            path: targetPath,
            content: JSON.stringify(existingConfig, null, 2),
            description: `MCP Configuration for OpenCode (${scope})`
        }];
    }

    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean } {
        if (scope === 'Global' || scope === 'Project') {
            return { rules: true, mcp: true };
        }
        return { rules: false, mcp: false };
    }
}
