
import fs from 'fs/promises';

export interface ParsedRule {
    name: string;
    content: string;
}

export class ClaudeMdImporter {
    async parse(filePath: string): Promise<ParsedRule[]> {
        const content = await fs.readFile(filePath, 'utf-8');
        return this.parseContent(content);
    }

    parseContent(content: string): ParsedRule[] {
        const lines = content.split('\n');
        const rules: ParsedRule[] = [];
        let currentRule: Partial<ParsedRule> | null = null;
        let buffer: string[] = [];

        for (const line of lines) {
            if (line.startsWith('### ')) {
                // Save previous rule if exists
                if (currentRule && buffer.length > 0) {
                    rules.push({
                        name: currentRule.name!,
                        content: buffer.join('\n').trim()
                    });
                }

                // Start new rule
                currentRule = {
                    name: line.substring(4).trim()
                };
                buffer = [];
            } else if (line.startsWith('## Active Rules')) {
                // Start of rules section, clear buffer/current
                currentRule = null;
                buffer = [];
            } else if (line.startsWith('## ') && line !== '## Active Rules') {
                // Other section start (e.g. Active MCP Servers)
                // Save last rule if exists
                if (currentRule && buffer.length > 0) {
                    rules.push({
                        name: currentRule.name!,
                        content: buffer.join('\n').trim()
                    });
                }
                currentRule = null;
                buffer = [];
            } else {
                if (currentRule) {
                    buffer.push(line);
                }
            }
        }

        // Push last rule
        if (currentRule && buffer.length > 0) {
            rules.push({
                name: currentRule.name!,
                content: buffer.join('\n').trim()
            });
        }

        return rules;
    }
}
