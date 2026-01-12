import { CreateRuleParams } from '@shared/types';
import { relaxJson } from '@/utils/json-utils';

export interface ParseResult {
    success: boolean;
    data?: CreateRuleParams[];
    error?: string;
}

export function parseRuleInput(input: string): ParseResult {
    try {
        let cleanedInput = relaxJson(input).trim();
        if (cleanedInput.endsWith(',')) {
            cleanedInput = cleanedInput.slice(0, -1).trim();
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(cleanedInput);
        } catch {
            return { success: false, error: 'Invalid JSON format' };
        }

        if (!parsed || typeof parsed !== 'object') {
            return { success: false, error: 'Parsed input is not an object' };
        }

        const rules: CreateRuleParams[] = [];
        const parsedData = parsed as Record<string, unknown>;
        let ruleMap: Record<string, unknown> | null = null;
        let ruleList: unknown[] | null = null;

        if (Array.isArray(parsed)) {
            // Case: List of rules [ { name, content }, ... ]
            ruleList = parsed;
        } else if (parsedData.rules && typeof parsedData.rules === 'object') {
            if (Array.isArray(parsedData.rules)) {
                ruleList = parsedData.rules;
            } else {
                ruleMap = parsedData.rules as Record<string, unknown>; // Map inside "rules" prop
            }
        } else {
            // Case: Root object
            // Is it a single rule?
            if (typeof parsedData.content === 'string') {
                // Single rule
                rules.push({
                    name: (parsedData.name as string) || 'Imported Rule',
                    content: parsedData.content,
                    isActive: (parsedData.isActive as boolean) ?? true
                });
                return { success: true, data: rules };
            }

            // Assume it's a map { "Rule Name": { ... } }
            ruleMap = parsedData;
        }

        if (ruleList) {
            for (const item of ruleList) {
                if (item && typeof item === 'object') {
                    const i = item as Record<string, unknown>;
                    if (typeof i.content === 'string') {
                        rules.push({
                            name: (i.name as string) || 'Untitled Rule',
                            content: i.content,
                            isActive: (i.isActive as boolean) ?? true
                        });
                    }
                }
            }
        } else if (ruleMap) {
            for (const [key, config] of Object.entries(ruleMap)) {
                if (config && typeof config === 'object') {
                    const c = config as Record<string, unknown>;
                    // If content is present, it's a rule
                    if (typeof c.content === 'string') {
                        rules.push({
                            name: (c.name as string) || key, // Prefer explicit name, fallback to key
                            content: c.content,
                            isActive: (c.isActive as boolean) ?? true
                        });
                    }
                } else if (typeof config === 'string') {
                    // Simple key-value map: "Rule Name": "Content string"
                    rules.push({
                        name: key,
                        content: config,
                        isActive: true
                    });
                }
            }
        }

        if (rules.length === 0) {
            return { success: false, error: 'No valid rule configurations found' };
        }

        return { success: true, data: rules };

    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown parsing error' };
    }
}
