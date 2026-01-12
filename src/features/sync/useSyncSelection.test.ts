/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSyncSelection, syncSelectionStorageKeys } from './useSyncSelection';

describe('useSyncSelection', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('restores last selected ids from localStorage', () => {
        localStorage.setItem(syncSelectionStorageKeys.toolSetId, 'cli-tools');
        localStorage.setItem(syncSelectionStorageKeys.ruleSetId, 'rule-1');
        localStorage.setItem(syncSelectionStorageKeys.mcpSetId, 'mcp-1');

        const { result } = renderHook(() =>
            useSyncSelection({
                toolSetIds: ['all-tools', 'cli-tools', 'ide-tools'],
                ruleSetIds: ['none', 'rule-1'],
                mcpSetIds: ['none', 'mcp-1'],
                isRuleSetsLoading: false,
                isMcpSetsLoading: false,
            })
        );

        expect(result.current.selectedToolSetId).toBe('cli-tools');
        expect(result.current.selectedRuleSetId).toBe('rule-1');
        expect(result.current.selectedMcpSetId).toBe('mcp-1');
    });

    it('falls back to all-tools when stored toolset id is invalid', async () => {
        localStorage.setItem(syncSelectionStorageKeys.toolSetId, 'invalid-toolset');

        const { result } = renderHook(() =>
            useSyncSelection({
                toolSetIds: ['all-tools', 'cli-tools', 'ide-tools'],
                ruleSetIds: ['none'],
                mcpSetIds: ['none'],
                isRuleSetsLoading: false,
                isMcpSetsLoading: false,
            })
        );

        await waitFor(() => {
            expect(result.current.selectedToolSetId).toBe('all-tools');
        });
        expect(localStorage.getItem(syncSelectionStorageKeys.toolSetId)).toBe('all-tools');
    });

    it('falls back to none when stored ruleset id is missing after load', async () => {
        localStorage.setItem(syncSelectionStorageKeys.ruleSetId, 'missing-rule');

        const { result } = renderHook(() =>
            useSyncSelection({
                toolSetIds: ['all-tools'],
                ruleSetIds: ['none', 'rule-1'],
                mcpSetIds: ['none'],
                isRuleSetsLoading: false,
                isMcpSetsLoading: false,
            })
        );

        await waitFor(() => {
            expect(result.current.selectedRuleSetId).toBe('none');
        });
        expect(localStorage.getItem(syncSelectionStorageKeys.ruleSetId)).toBe('none');
    });

    it('falls back to none when stored mcpset id is missing after load', async () => {
        localStorage.setItem(syncSelectionStorageKeys.mcpSetId, 'missing-mcp');

        const { result } = renderHook(() =>
            useSyncSelection({
                toolSetIds: ['all-tools'],
                ruleSetIds: ['none'],
                mcpSetIds: ['none', 'mcp-1'],
                isRuleSetsLoading: false,
                isMcpSetsLoading: false,
            })
        );

        await waitFor(() => {
            expect(result.current.selectedMcpSetId).toBe('none');
        });
        expect(localStorage.getItem(syncSelectionStorageKeys.mcpSetId)).toBe('none');
    });

    it('persists changes to localStorage', async () => {
        const { result } = renderHook(() =>
            useSyncSelection({
                toolSetIds: ['all-tools', 'cli-tools'],
                ruleSetIds: ['none', 'rule-1'],
                mcpSetIds: ['none', 'mcp-1'],
                isRuleSetsLoading: false,
                isMcpSetsLoading: false,
            })
        );

        act(() => {
            result.current.setSelectedToolSetId('cli-tools');
            result.current.setSelectedRuleSetId('rule-1');
            result.current.setSelectedMcpSetId('mcp-1');
        });

        await waitFor(() => {
            expect(localStorage.getItem(syncSelectionStorageKeys.toolSetId)).toBe('cli-tools');
            expect(localStorage.getItem(syncSelectionStorageKeys.ruleSetId)).toBe('rule-1');
            expect(localStorage.getItem(syncSelectionStorageKeys.mcpSetId)).toBe('mcp-1');
        });
    });
});
