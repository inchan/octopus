import { CreateMcpServerParams } from '@shared/types';
import { relaxJson } from '@/utils/json-utils';

export interface ParseResult {
    success: boolean;
    data?: CreateMcpServerParams[];
    error?: string;
}

export interface ImportResult {
    success: number;
    failed: number;
    skipped: number;
    errors: Array<{ name: string; reason: string }>;
}

export interface DuplicateHandleResult {
    imported: CreateMcpServerParams[];
    skipped: string[];
    overwritten: string[];
    renamed: Array<{ original: string; renamed: string }>;
}

export interface ValidationResult {
    valid: CreateMcpServerParams[];
    invalid: Array<{ name: string; reason: string }>;
}

export interface FilterResult {
    selected: CreateMcpServerParams[];
    skipped: number;
}

export interface FilterOptions {
    selectedNames?: string[];
    selectedIndices?: number[];
}

export type DuplicateStrategy = 'skip' | 'overwrite' | 'rename';

export function parseMcpInput(input: string): ParseResult {
    try {
        // 1. Relax the input (remove comments, trailing commas)
        // Note: relaxJson handles the "last comma" issue user mentioned
        let cleanedInput = relaxJson(input).trim();

        // Remove literal trailing comma at the very end of the string if it exists (e.g. from copy paste of a list item)
        // "key": { ... }, -> we want "key": { ... }
        if (cleanedInput.endsWith(',')) {
            cleanedInput = cleanedInput.slice(0, -1).trim();
        }
        // If it starts with "mcpServers": and ends with something that looks like it belongs to a bigger object but is cut off?
        // No, user examples are:
        // 1. Full object { "mcpServers": ... }
        // 2. Just the property "mcpServers": { ... } (needs wrapping)
        // 3. Just the content of mcpServers { "server": { ... } } (looks like a map)

        // Heuristic 1: If it starts with "mcpServers", wrap it in braces to make it valid JSON
        if (cleanedInput.startsWith('"mcpServers"')) {
            cleanedInput = `{${cleanedInput}}`;
        } else if (cleanedInput.startsWith('mcpServers')) {
            // Handle unquoted key if possible? JSON.parse won't like it.
            // We'll assume the user pastes valid JSON snippets mostly.
            // But if they paste from a JS file... `mcpServers: {`
            // Let's stick to valid JSON handling first.
            // If they pasted `mcpServers: { ... }` (no quotes), we might need a looser parser or regex.
            // For now assume keys are quoted as per user examples. 
            // Example 2 starts with `"mcpServers": {`
        }

        // Try to relax JSON parsing if strict fails? 
        // For now standard JSON.parse.
        let parsed: unknown;
        try {
            parsed = JSON.parse(cleanedInput);
        } catch {
            // Attempt simple strict parsing failed.
            return { success: false, error: 'Invalid JSON format' };
        }

        if (!parsed || typeof parsed !== 'object') {
            return { success: false, error: 'Parsed input is not an object' };
        }

        const servers: CreateMcpServerParams[] = [];
        const parsedObj = parsed as Record<string, unknown>;

        // Strategy to find the map of servers
        let serverMap: Record<string, unknown> | null = null;

        if (parsedObj.mcpServers && typeof parsedObj.mcpServers === 'object') {
            // Case 1 & 2: Root has mcpServers
            serverMap = parsedObj.mcpServers as Record<string, unknown>;
        } else {
            // Case 3: Root IS the map
            // BUT we need to distinguish between "Root is Map" and "Root is Single Config"
            // Single config usually has "command" and "args" keys.
            if (typeof parsedObj.command === 'string') {
                servers.push({
                    name: 'Imported Server',
                    command: parsedObj.command,
                    args: Array.isArray(parsedObj.args) ? parsedObj.args : [],
                    env: (parsedObj.env && typeof parsedObj.env === 'object') ? parsedObj.env as Record<string, string> : {},
                    isActive: true
                });
                return { success: true, data: servers };
            } else {
                // Iterate keys to see if they look like servers
                // Example 3: { "context7": { "command": ... }, ... }
                serverMap = parsedObj;
            }
        }

        if (serverMap) {
            for (const [key, config] of Object.entries(serverMap)) {
                if (config && typeof config === 'object') {
                    const c = config as Record<string, unknown>;
                    if (typeof c.command === 'string') {
                        servers.push({
                            name: key,
                            command: c.command,
                            args: Array.isArray(c.args) ? c.args : [],
                            env: (c.env && typeof c.env === 'object') ? c.env as Record<string, string> : {},
                            isActive: true
                        });
                    }
                }
            }
        }

        if (servers.length === 0) {
            return { success: false, error: 'No valid MCP server configurations found' };
        }

        return { success: true, data: servers };

    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown parsing error' };
    }
}

/**
 * Validate server parameters
 * Returns valid servers and invalid entries with reasons
 */
export function validateServerParams(servers: CreateMcpServerParams[]): ValidationResult {
    const valid: CreateMcpServerParams[] = [];
    const invalid: Array<{ name: string; reason: string }> = [];

    for (const server of servers) {
        const errors: string[] = [];

        if (!server.name || server.name.trim() === '') {
            errors.push('name is required');
        }

        if (!server.command || server.command.trim() === '') {
            errors.push('command is required');
        }

        if (errors.length > 0) {
            invalid.push({ name: server.name || '', reason: errors.join(', ') });
        } else {
            valid.push(server);
        }
    }

    return { valid, invalid };
}

/**
 * Handle duplicate server names based on strategy
 */
export function handleDuplicateNames(
    newServers: CreateMcpServerParams[],
    existingServers: CreateMcpServerParams[],
    strategy: DuplicateStrategy
): DuplicateHandleResult {
    const existingNames = new Set(existingServers.map((s) => s.name));
    const imported: CreateMcpServerParams[] = [];
    const skipped: string[] = [];
    const overwritten: string[] = [];
    const renamed: Array<{ original: string; renamed: string }> = [];

    for (const server of newServers) {
        if (!existingNames.has(server.name)) {
            imported.push(server);
            continue;
        }

        switch (strategy) {
            case 'skip':
                skipped.push(server.name);
                break;

            case 'overwrite':
                imported.push(server);
                overwritten.push(server.name);
                break;

            case 'rename': {
                const newName = generateUniqueName(server.name, existingNames);
                imported.push({ ...server, name: newName });
                renamed.push({ original: server.name, renamed: newName });
                existingNames.add(newName);
                break;
            }
        }
    }

    return { imported, skipped, overwritten, renamed };
}

/**
 * Generate a unique name by appending incrementing suffix
 */
function generateUniqueName(baseName: string, existingNames: Set<string>): string {
    let counter = 1;
    let newName = `${baseName}-${counter}`;

    while (existingNames.has(newName)) {
        counter++;
        newName = `${baseName}-${counter}`;
    }

    return newName;
}

/**
 * Filter servers by selection criteria
 */
export function filterSelectedServers(
    servers: CreateMcpServerParams[],
    options: FilterOptions
): FilterResult {
    const { selectedNames, selectedIndices } = options;

    // No filter applied - return all
    if (!selectedNames && !selectedIndices) {
        return { selected: servers, skipped: 0 };
    }

    let selected: CreateMcpServerParams[] = [];

    if (selectedNames) {
        const nameSet = new Set(selectedNames);
        selected = servers.filter((s) => nameSet.has(s.name));
    } else if (selectedIndices) {
        const indexSet = new Set(selectedIndices);
        selected = servers.filter((_, index) => indexSet.has(index));
    }

    return {
        selected,
        skipped: servers.length - selected.length,
    };
}
