import { Rule, McpServer, ToolType, ConfigScope } from '../../../shared/types';
export type { ToolType, ConfigScope };

export interface GeneratedFile {
    path: string; // Relative path suggested (e.g., ".cursor/rules/my-rule.mdc") or absolute if Global
    content: string;
    description?: string; // For UI guide
}

export interface ConfigGenerator {
    generateRules(scope: ConfigScope, rules: Rule[]): GeneratedFile[];
    generateMcpConfig(scope: ConfigScope, mcpServers: McpServer[]): GeneratedFile[];
    getSupportStatus(scope: ConfigScope): { rules: boolean; mcp: boolean };
}
