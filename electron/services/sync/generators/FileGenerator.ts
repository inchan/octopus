import { Rule, McpServer } from '../../../../shared/types';

export interface GeneratorContext {
    rules: Rule[];
    mcpServers: McpServer[];
}

export interface FileGenerator {
    generate(context: GeneratorContext): Promise<string>;
}
