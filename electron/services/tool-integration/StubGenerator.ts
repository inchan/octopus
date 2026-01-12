
import { ConfigGenerator, ConfigScope, GeneratedFile } from './types';
import { Rule, McpServer } from '../../../shared/types';

export class StubGenerator implements ConfigGenerator {
    generateRules(_scope: ConfigScope, _rules: Rule[]): GeneratedFile[] {
        return [];
    }

    generateMcpConfig(_scope: ConfigScope, _mcpServers: McpServer[]): GeneratedFile[] {
        return [];
    }

    getSupportStatus(_scope: ConfigScope): { rules: boolean; mcp: boolean } {
        return { rules: false, mcp: false };
    }
}
