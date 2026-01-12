import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateRuleParams, CreateRuleSetParams, UpdateRuleParams, Rule, RuleSet } from '@shared/types';
import { useState, useEffect } from 'react';

export function useRules() {
    const queryClient = useQueryClient();

    // Queries
    const { data: setsResult, isLoading: setsLoading } = useQuery({
        queryKey: ['rule-sets'],
        queryFn: async () => window.api.sets.rules.list()
    });

    const { data: rulesResult, isLoading: rulesLoading } = useQuery({
        queryKey: ['rules'],
        queryFn: async () => window.api.rules.list()
    });

    const sets = (setsResult?.success ? setsResult.data : []) as RuleSet[];
    const rules = (rulesResult?.success ? rulesResult.data : []) as Rule[];

    // Mutations
    const createSetMutation = useMutation({
        mutationFn: async (params: CreateRuleSetParams) => window.api.sets.rules.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rule-sets'] });
        }
    });

    const updateSetMutation = useMutation({
        mutationFn: async (params: { id: string; name?: string; items?: string[] }) =>
            window.api.sets.rules.update(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rule-sets'] });
        }
    });

    const deleteSetMutation = useMutation({
        mutationFn: async (id: string) => window.api.sets.rules.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rule-sets'] });
        }
    });

    const createRuleMutation = useMutation({
        mutationFn: async (params: CreateRuleParams) => window.api.rules.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        }
    });

    const updateRuleMutation = useMutation({
        mutationFn: async (params: UpdateRuleParams) =>
            window.api.rules.update(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        }
    });

    const deleteRuleMutation = useMutation({
        mutationFn: async (id: string) => window.api.rules.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        }
    });

    return {
        sets,
        rules,
        setsLoading,
        rulesLoading,
        createSet: createSetMutation.mutate,
        updateSet: updateSetMutation.mutate,
        deleteSet: deleteSetMutation.mutate,
        createRule: createRuleMutation.mutate,
        createRuleAsync: createRuleMutation.mutateAsync,
        updateRule: updateRuleMutation.mutate,
        deleteRule: deleteRuleMutation.mutate,
        isCreatingSet: createSetMutation.isPending,
        isCreatingRule: createRuleMutation.isPending,
        isUpdatingRule: updateRuleMutation.isPending,
    };
}

export function useRuleSelection(sets: RuleSet[], setsLoading: boolean, rulesLoading: boolean) {
    const [selectedSetId, setSelectedSetId] = useState<string | null>(() => {
        const id = localStorage.getItem('rules-last-selected-id');
        console.log('[useRuleSelection] Initial selectedSetId from localStorage:', id);
        return id;
    });

    useEffect(() => {
        console.log('[useRuleSelection] Effect running:', {
            setsCount: sets.length,
            setsLoading,
            rulesLoading,
            selectedSetId,
            localStorageId: localStorage.getItem('rules-last-selected-id')
        });

        if (rulesLoading || setsLoading) return;

        if (sets.length > 0) {
            const found = sets.find(s => s.id === selectedSetId);
            console.log('[useRuleSelection] Set search result:', { found: !!found, selectedSetId });

            if (!found) {
                const lastId = localStorage.getItem('rules-last-selected-id');
                const lastSet = sets.find(s => s.id === lastId);
                const targetId = lastSet ? lastSet.id : sets[0].id;

                console.log('[useRuleSelection] Found is false, targetId determined:', { targetId, isFromLastId: !!lastSet });

                if (selectedSetId !== targetId) {
                    console.log('[useRuleSelection] Setting new targetId:', targetId);
                    const timer = setTimeout(() => {
                        setSelectedSetId(targetId);
                        if (lastSet) {
                            localStorage.setItem('rules-last-selected-id', targetId);
                        }
                    }, 0);
                    return () => clearTimeout(timer);
                }
            }
        } else if (selectedSetId !== null) {
            console.log('[useRuleSelection] Sets empty, resetting selectedSetId to null');
            const timer = setTimeout(() => {
                setSelectedSetId(null);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [sets, setsLoading, rulesLoading, selectedSetId]);

    const handleSelectSet = (id: string | null) => {
        if (id === selectedSetId) return;
        setSelectedSetId(id);
        if (id) {
            localStorage.setItem('rules-last-selected-id', id);
        } else {
            localStorage.removeItem('rules-last-selected-id');
        }
    };

    return {
        selectedSetId,
        setSelectedSetId,
        handleSelectSet
    };
}
