import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateMcpServerParams, CreateMcpSetParams, UpdateMcpServerParams, McpServer, McpSet } from '@shared/types';
import { useState, useEffect } from 'react';

export function useMcp() {
    const queryClient = useQueryClient();

    // Queries
    const { data: setsResult, isLoading: setsLoading } = useQuery({
        queryKey: ['mcp-sets'],
        queryFn: async () => window.api.sets.mcp.list()
    });

    const { data: serversResult, isLoading: serversLoading } = useQuery({
        queryKey: ['mcp'],
        queryFn: async () => window.api.mcp.list()
    });

    const sets = (setsResult?.success ? setsResult.data : []) as McpSet[];
    const servers = (serversResult?.success ? serversResult.data : []) as McpServer[];

    // Mutations
    const createSetMutation = useMutation({
        mutationFn: async (params: CreateMcpSetParams) => window.api.sets.mcp.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mcp-sets'] });
        }
    });

    const updateSetMutation = useMutation({
        mutationFn: async (params: { id: string; name?: string; items?: string[] }) =>
            window.api.sets.mcp.update(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mcp-sets'] });
        }
    });

    const deleteSetMutation = useMutation({
        mutationFn: async (id: string) => window.api.sets.mcp.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mcp-sets'] });
        }
    });

    const createServerMutation = useMutation({
        mutationFn: async (params: CreateMcpServerParams) => window.api.mcp.create(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mcp'] });
        }
    });

    const updateServerMutation = useMutation({
        mutationFn: async (params: UpdateMcpServerParams) => window.api.mcp.update(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mcp'] });
        }
    });

    const deleteServerMutation = useMutation({
        mutationFn: async (id: string) => window.api.mcp.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mcp'] });
        }
    });

    return {
        sets,
        servers,
        setsLoading,
        serversLoading,
        createSet: createSetMutation.mutate,
        updateSet: updateSetMutation.mutate,
        deleteSet: deleteSetMutation.mutate,
        createServer: createServerMutation.mutate,
        updateServer: updateServerMutation.mutate,
        deleteServer: deleteServerMutation.mutate,
        isCreatingSet: createSetMutation.isPending,
        isCreatingServer: createServerMutation.isPending,
        isUpdatingServer: updateServerMutation.isPending,
    };
}

export function useMcpSelection(sets: McpSet[], setsLoading: boolean) {
    const [selectedSetId, setSelectedSetId] = useState<string | null>(() => {
        return localStorage.getItem('mcp-last-selected-id');
    });

    useEffect(() => {
        if (setsLoading) return;

        if (sets.length > 0) {
            const found = sets.find(s => s.id === selectedSetId);
            if (!found) {
                const lastId = localStorage.getItem('mcp-last-selected-id');
                const lastSet = sets.find(s => s.id === lastId);
                const targetId = lastSet ? lastSet.id : sets[0].id;

                if (selectedSetId !== targetId) {
                    const timer = setTimeout(() => {
                        setSelectedSetId(targetId);
                        localStorage.setItem('mcp-last-selected-id', targetId);
                    }, 0);
                    return () => clearTimeout(timer);
                }
            }
        } else if (selectedSetId !== null) {
            const timer = setTimeout(() => {
                setSelectedSetId(null);
                localStorage.removeItem('mcp-last-selected-id');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [sets, setsLoading, selectedSetId]);

    const handleSelectSet = (id: string | null) => {
        if (id === selectedSetId) return;
        setSelectedSetId(id);
        if (id) {
            localStorage.setItem('mcp-last-selected-id', id);
        } else {
            localStorage.removeItem('mcp-last-selected-id');
        }
    };

    return {
        selectedSetId,
        handleSelectSet,
        setSelectedSetId
    };
}
