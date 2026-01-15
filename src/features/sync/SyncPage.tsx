import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, RotateCcw, Save } from 'lucide-react';

import { GeneratedFile } from '../../../shared/types';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useInstalledTools } from '@/hooks/useInstalledTools';
import { SyncColumn, SyncItem } from './SyncColumn';
import { SyncPreviewDialog } from './SyncPreviewDialog';
import { useSyncSelection } from './useSyncSelection';

export const SyncPage: React.FC = () => {
    // Dialog state
    const [previewFiles, setPreviewFiles] = useState<GeneratedFile[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Fetch Data (Using Cache-First Hook for Tools)
    const { installedTools, isLoading: isToolsLoading, refetch: refetchTools } = useInstalledTools();

    // Fetch Rule/MCP Sets (These are fast DB queries, cache optimization is secondary)
    const { data: ruleSetsResult, isLoading: isRuleSetsLoading } = useQuery({
        queryKey: ['rule-sets'],
        queryFn: async () => {
            if (!window.api) return { success: true, data: [] };
            return window.api.sets.rules.list();
        },
    });

    const { data: mcpSetsResult, isLoading: isMcpSetsLoading } = useQuery({
        queryKey: ['mcp-sets'],
        queryFn: async () => {
            if (!window.api) return { success: true, data: [] };
            return window.api.sets.mcp.list();
        },
    });

    const ruleSets = useMemo(() => ruleSetsResult?.success ? ruleSetsResult.data : [], [ruleSetsResult]);
    const mcpSets = useMemo(() => mcpSetsResult?.success ? mcpSetsResult.data : [], [mcpSetsResult]);

    // Virtual Tool Sets (static options for filtering)
    const virtualToolSets: SyncItem[] = useMemo(
        () => [
            { id: 'all-tools', name: 'All Tools', badge: `${installedTools.length}` },
            { id: 'cli-tools', name: 'CLI Tools', badge: `${installedTools.filter((t) => t.type === 'cli').length}` },
            { id: 'ide-tools', name: 'IDE Tools', badge: `${installedTools.filter((t) => t.type === 'ide').length}` },
        ],
        [installedTools]
    );

    const ruleSetItems: SyncItem[] = useMemo(
        () => [{ id: 'none', name: 'None' }, ...ruleSets.map((s) => ({ id: s.id, name: s.name }))],
        [ruleSets]
    );

    const mcpSetItems: SyncItem[] = useMemo(
        () => [{ id: 'none', name: 'None' }, ...mcpSets.map((s) => ({ id: s.id, name: s.name }))],
        [mcpSets]
    );

    const {
        selectedToolSetId,
        setSelectedToolSetId,
        selectedRuleSetId,
        setSelectedRuleSetId,
        selectedMcpSetId,
        setSelectedMcpSetId,
    } = useSyncSelection({
        toolSetIds: virtualToolSets.map((s) => s.id),
        ruleSetIds: ruleSetItems.map((s) => s.id),
        mcpSetIds: mcpSetItems.map((s) => s.id),
        isRuleSetsLoading,
        isMcpSetsLoading,
        defaultToolSetId: 'all-tools',
        noneId: 'none',
    });

    const generateMutation = useMutation({
        mutationFn: async () => {
            if (!window.api) return [];

            // 1. Filter tools based on selectedToolSetId
            let targetTools = installedTools;
            if (selectedToolSetId === 'cli-tools') {
                targetTools = installedTools.filter((t) => t.type === 'cli');
            } else if (selectedToolSetId === 'ide-tools') {
                targetTools = installedTools.filter((t) => t.type === 'ide');
            }

            // 2. Find selected MCP Set data
            const selectedMcpSet = mcpSets.find((s) => s.id === selectedMcpSetId);

            // 3. Generate config for each tool
            const files: GeneratedFile[] = [];
            for (const tool of targetTools) {
                if (selectedRuleSetId === 'none' && selectedMcpSetId === 'none') {
                    continue;
                }

                try {
                    const result = await window.api.toolIntegration.generateConfig(tool.name, 'Global', {
                        ruleSet: ruleSets.find((r) => r.id === selectedRuleSetId),
                        mcpSet: selectedMcpSet,
                    });

                    if (result.success && result.data) {
                        files.push(...result.data);
                    }
                } catch (error) {
                    console.error(`[SyncPage] Failed to generate config for ${tool.name}:`, error);
                }
            }

            return files;
        },
        onSuccess: (files) => {
            setPreviewFiles(files);
            setIsPreviewOpen(true);
        },
    });

    const syncMutation = useMutation({
        mutationFn: async () => {
            if (!window.api) return;
            for (const file of previewFiles) {
                await window.api.sync.apply(file.path, file.content);
            }
        },
        onSuccess: () => {
            setIsPreviewOpen(false);
            setPreviewFiles([]);
        },
    });

    const canSync = selectedRuleSetId !== 'none' || selectedMcpSetId !== 'none';
    const isGenerating = generateMutation.isPending;
    const isSyncing = syncMutation.isPending;

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden" data-testid="sync-page">
            {installedTools.length === 0 && !isToolsLoading && (
                <div className="bg-destructive/15 border border-destructive/20 text-destructive-foreground p-3 mb-4 rounded-md text-sm flex items-center gap-2">
                    <span className="font-bold">No installed tools detected.</span>
                    <span>
                        Please check if AI tools (Cursor, VS Code, Claude, etc.) are installed in /Applications or available in your PATH.
                    </span>
                    <Button variant="outline" size="sm" className="ml-auto h-7 text-xs" onClick={() => refetchTools()}>
                        Retry Detection
                    </Button>
                </div>
            )}

            <div className="flex-shrink-0 mb-4 px-2">
                <h1 className="text-xl font-bold tracking-tight">Sync Configuration</h1>
                <p className="text-sm text-muted-foreground mt-1">Configure synchronization scope strategy.</p>
            </div>

            <div className="flex-1 min-h-0 border rounded-lg bg-zinc-950/20 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={30} minSize={20}>
                        <SyncColumn
                            title="1. Target Tools"
                            items={virtualToolSets}
                            selectedId={selectedToolSetId}
                            onSelect={setSelectedToolSetId}
                            testId="sync-column-tools"
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={35} minSize={20}>
                        <SyncColumn
                            title="2. Rules"
                            items={ruleSetItems}
                            selectedId={selectedRuleSetId}
                            onSelect={setSelectedRuleSetId}
                            testId="sync-column-rules"
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={35} minSize={20}>
                        <SyncColumn
                            title="3. MCP Servers"
                            items={mcpSetItems}
                            selectedId={selectedMcpSetId}
                            onSelect={setSelectedMcpSetId}
                            testId="sync-column-mcp"
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            <Separator className="my-4" />

            <div className="flex-shrink-0 flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RotateCcw className="w-3 h-3" />
                    <span>Auto-backup active</span>
                </div>

                <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={!canSync || isGenerating}
                    className="min-w-[140px]"
                    data-testid="sync-start-button"
                >
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isGenerating ? 'Analyzing...' : 'Start Sync'}
                </Button>
            </div>

            <SyncPreviewDialog
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onConfirm={() => syncMutation.mutate()}
                files={previewFiles}
                isSyncing={isSyncing}
            />
        </div>
    );
};
