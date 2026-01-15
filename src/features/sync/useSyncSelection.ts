import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
    toolSetId: 'sync-last-selected-toolset-id',
    ruleSetId: 'sync-last-selected-ruleset-id',
    mcpSetId: 'sync-last-selected-mcpset-id',
} as const;

function readStored(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStored(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // noop
    }
}

export interface UseSyncSelectionParams {
    toolSetIds: string[];
    ruleSetIds: string[];
    mcpSetIds: string[];
    isRuleSetsLoading: boolean;
    isMcpSetsLoading: boolean;
    defaultToolSetId?: string;
    noneId?: string;
}

export function useSyncSelection({
    toolSetIds,
    ruleSetIds,
    mcpSetIds,
    isRuleSetsLoading,
    isMcpSetsLoading,
    defaultToolSetId = 'all-tools',
    noneId = 'none',
}: UseSyncSelectionParams) {
    const validToolSetIds = useMemo(() => new Set(toolSetIds), [toolSetIds]);
    const validRuleSetIds = useMemo(() => new Set(ruleSetIds), [ruleSetIds]);
    const validMcpSetIds = useMemo(() => new Set(mcpSetIds), [mcpSetIds]);

    const [selectedToolSetId, setSelectedToolSetId] = useState<string>(() => {
        const stored = readStored(STORAGE_KEYS.toolSetId);
        return stored ?? defaultToolSetId;
    });

    const [selectedRuleSetId, setSelectedRuleSetId] = useState<string>(() => {
        const stored = readStored(STORAGE_KEYS.ruleSetId);
        return stored ?? noneId;
    });

    const [selectedMcpSetId, setSelectedMcpSetId] = useState<string>(() => {
        const stored = readStored(STORAGE_KEYS.mcpSetId);
        return stored ?? noneId;
    });

    // Persist on change
    useEffect(() => {
        writeStored(STORAGE_KEYS.toolSetId, selectedToolSetId);
    }, [selectedToolSetId]);

    useEffect(() => {
        writeStored(STORAGE_KEYS.ruleSetId, selectedRuleSetId);
    }, [selectedRuleSetId]);

    useEffect(() => {
        writeStored(STORAGE_KEYS.mcpSetId, selectedMcpSetId);
    }, [selectedMcpSetId]);

    // Validate tool selection whenever available set changes
    useEffect(() => {
        if (validToolSetIds.size === 0) return;
        if (!validToolSetIds.has(selectedToolSetId)) {
            setSelectedToolSetId(prev => prev !== defaultToolSetId ? defaultToolSetId : prev);
        }
    }, [defaultToolSetId, selectedToolSetId, validToolSetIds]);

    // Validate rule/mcp selections only after lists are loaded
    useEffect(() => {
        if (isRuleSetsLoading) return;
        if (validRuleSetIds.size === 0) {
            setSelectedRuleSetId(prev => prev !== noneId ? noneId : prev);
            return;
        }

        if (!validRuleSetIds.has(selectedRuleSetId)) {
            setSelectedRuleSetId(prev => prev !== noneId ? noneId : prev);
        }
    }, [isRuleSetsLoading, noneId, selectedRuleSetId, validRuleSetIds]);

    useEffect(() => {
        if (isMcpSetsLoading) return;
        if (validMcpSetIds.size === 0) {
            setSelectedMcpSetId(prev => prev !== noneId ? noneId : prev);
            return;
        }

        if (!validMcpSetIds.has(selectedMcpSetId)) {
            setSelectedMcpSetId(prev => prev !== noneId ? noneId : prev);
        }
    }, [isMcpSetsLoading, noneId, selectedMcpSetId, validMcpSetIds]);

    return {
        selectedToolSetId,
        setSelectedToolSetId,
        selectedRuleSetId,
        setSelectedRuleSetId,
        selectedMcpSetId,
        setSelectedMcpSetId,
    };
}

export const syncSelectionStorageKeys = STORAGE_KEYS;
