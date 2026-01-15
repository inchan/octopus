import { relaxJson } from '@/utils/json-utils';
import { CreateMcpServerParams } from '@shared/types';

export interface ParseSingleResult {
    success: boolean;
    data?: Partial<CreateMcpServerParams>;
    error?: string;
}

interface McpServerConfig {
    name?: string;
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    url?: string;
}

interface McpServersConfig {
    mcpServers?: Record<string, McpServerConfig>;
    [key: string]: unknown;
}

export function parseSingleServerConfig(input: string): ParseSingleResult {
    if (!input.trim()) {
        return { success: true, data: undefined };
    }

    let cleaned = relaxJson(input).trim();

    // Strip trailing comma if present (common when pasting from list)
    if (cleaned.endsWith(',')) {
        cleaned = cleaned.slice(0, -1).trim();
    }

    // Heuristic: If it looks like "mcpServers": { ... }, wrap it.
    // We check for "mcpServers" at the start (with or without quotes)
    if (cleaned.startsWith('"mcpServers"') || cleaned.startsWith('mcpServers')) {
        // If it doesn't start with {, it's likely a property.
        if (!cleaned.startsWith('{')) {
            cleaned = `{${cleaned}}`;
        }
    }

    // Heuristic: If it looks like "some-key": { ... }, and not wrapped in {}, wrap it.
    try {
        let parsed: unknown;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            // First parse failed. Try wrapping if it looks like a property list
            // e.g. "key": { ... }, "key2": { ... } or just "key": { ... }
            // A simple heuristic is check if it contains ':' 
            if (cleaned.includes(':') && !cleaned.startsWith('{')) {
                try {
                    const wrapped = `{${cleaned}}`;
                    parsed = JSON.parse(wrapped);
                } catch {
                    throw e;
                }
            } else {
                throw e;
            }
        }

        if (typeof parsed !== 'object' || !parsed) {
            throw new Error('Root must be an object');
        }

        let target: McpServerConfig | undefined;
        const typedParsed = parsed as McpServersConfig;

        // Logic to extract the "best" server config from the object
        // 1. If it has mcpServers key, look inside.
        if (typedParsed.mcpServers && typeof typedParsed.mcpServers === 'object') {
            const mcpServers = typedParsed.mcpServers;
            const keys = Object.keys(mcpServers);
            if (keys.length > 0) {
                target = mcpServers[keys[0]];
                if (target && !target.name) {
                    target.name = keys[0];
                }
            } else {
                // Empty mcpServers object - return success with no data
                return { success: true, data: undefined };
            }
        }
        // 2. If it is NOT a direct command object (no 'command' key), but has keys that are objects?
        else if (!(typedParsed as McpServerConfig).command && !(typedParsed as McpServerConfig).name && Object.keys(typedParsed).length > 0) {
            const keys = Object.keys(typedParsed);
            const firstVal = (typedParsed as Record<string, unknown>)[keys[0]];
            if (firstVal && typeof firstVal === 'object' && !Array.isArray(firstVal)) {
                target = firstVal as McpServerConfig;
                if (!target.name) target.name = keys[0];
            }
        } else {
            // Assume it's a direct config
            target = typedParsed as McpServerConfig;
        }

        if (!target) {
             throw new Error('Could not identify server configuration');
        }

        return {
            success: true,
            data: {
                name: target.name,
                command: target.command,
                args: target.args,
                env: target.env
            }
        };

    } catch (e) {
        return { success: false, error: (e as Error).message };
    }
}


export function extractServersFromText(text: string): CreateMcpServerParams[] {
    const results: CreateMcpServerParams[] = [];
    const seen = new Set<string>(); // To deduplicate by name+command

    // Strategy 1: Look for "mcpServers" blocks
    // We regex for mcpServers and try to match the brace block
    const mcpServersRegex = /"?mcpServers"?\s*:\s*(\{)/g;
    let match;
    while ((match = mcpServersRegex.exec(text)) !== null) {
        const start = match.index;
        // Find matching brace
        const block = extractBalancedBraceBlock(text, start + match[0].length - 1); // include the opening brace
        if (block) {
            // It might be just the inner object or the whole "mcpServers": { ... }
            // Let's try to parse "{ "mcpServers": ... }" logic or just existing parse logic
            // Actually, the block we found is the value of mcpServers. i.e. { "server1": { ... }, "server2": { ... } }
            try {
                // We wrap it to be valid json if keys are quoted.
                // But relaxJson handles comments and loose quotes.
                const relaxed = relaxJson(block);
                const parsed = JSON.parse(relaxed) as Record<string, McpServerConfig>;

                Object.entries(parsed).forEach(([key, val]) => {
                    if (val && typeof val === 'object' && val.command) {
                        const server: CreateMcpServerParams = {
                            name: val.name || key,
                            command: val.command,
                            args: val.args || [],
                            env: val.env || {},
                            isActive: true
                        };
                        const id = `${server.name}|${server.command}`;
                        if (!seen.has(id)) {
                            seen.add(id);
                            results.push(server);
                        }
                    }
                });
            } catch {
                // ignore
            }
        }
    }

    // Strategy 2: Look for individual server config blocks that have "command" and "args"
    // This catches single server configs that might not be under mcpServers, or if mcpServers parsing failed.
    // We look for objects that contain "command"
    // Heuristic: "command"\s*:\s*"..."
    const commandRegex = /"?command"?\s*:\s*"([^"]+)"/g;
    while (commandRegex.exec(text) !== null) {
        // Found a command. Let's try to find the surrounding object.
        // This is hard without a parser.
        // Let's rely on `relaxJson` on reasonably sized chunks around the match? 
        // Or just searching for { ... } blocks in the whole text and parsing them?
    }

    // Alternative Strategy 2: regex specific common patterns like smithery or glama
    // But honestly, Strategy 1 covers 90% of READMEs.
    // Let's add a "Scan all JSON blocks" strategy.

    // Simpler: Find code blocks ```json ... ``` or ```js ... ```
    const codeBlockRegex = /```(?:json|js|javascript)?\s*([\s\S]*?)```/g;
    let codeMatch;
    while ((codeMatch = codeBlockRegex.exec(text)) !== null) {
        const code = codeMatch[1];
        // Try parsing this code block
        const parseResult = parseSingleServerConfig(code);
        if (parseResult.success && parseResult.data && parseResult.data.command) {
            const s = parseResult.data;
            const server = {
                name: s.name || 'Server',
                command: s.command!,
                args: s.args || [],
                env: s.env || {},
                isActive: true
            };
            const id = `${server.name}|${server.command}`;
            if (!seen.has(id)) {
                seen.add(id);
                results.push(server);
            }
        } else {
            // Maybe it contains mcpServers key?
            try {
                const relaxed = relaxJson(code);
                const parsed = JSON.parse(relaxed) as McpServersConfig;
                if (parsed.mcpServers) {
                    Object.entries(parsed.mcpServers).forEach(([key, val]) => {
                        if (val && typeof val === 'object' && val.command) {
                            const server: CreateMcpServerParams = {
                                name: val.name || key,
                                command: val.command,
                                args: val.args || [],
                                env: val.env || {},
                                isActive: true
                            };
                            const id = `${server.name}|${server.command}`;
                            if (!seen.has(id)) {
                                seen.add(id);
                                results.push(server);
                            }
                        }
                    });
                }
            } catch {
                // Ignore parsing errors for individual blocks
            }
        }
    }

    return results;
}

function extractBalancedBraceBlock(text: string, startIndex: number): string | null {
    let balance = 0;
    let started = false;
    let inString = false;
    let escape = false;

    for (let i = startIndex; i < text.length; i++) {
        const char = text[i];

        if (inString) {
            if (escape) {
                escape = false;
            } else if (char === '\\') {
                escape = true;
            } else if (char === '"') {
                inString = false;
            }
        } else {
            if (char === '"') {
                inString = true;
            } else if (char === '{') {
                balance++;
                started = true;
            } else if (char === '}') {
                balance--;
            }
        }

        if (started && balance === 0) {
            return text.substring(startIndex, i + 1);
        }
    }
    return null;
}
