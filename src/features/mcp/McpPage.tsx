import { useState } from 'react';
import { McpServer } from '@shared/types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { McpSetList } from './components/McpSetList';
import { McpSetDetail } from './components/McpSetDetail';
import { McpPool } from './components/McpPool';
import { McpServerDialog } from './components/McpServerDialog';
import { useMcp, useMcpSelection } from './useMcp';

export function McpPage() {
    const {
        sets,
        servers,
        setsLoading,
        serversLoading,
        createSet,
        updateSet,
        deleteSet,
        createServer,
        updateServer,
        deleteServer,
        isCreatingSet,
        isCreatingServer,
        isUpdatingServer
    } = useMcp();

    const { selectedSetId, handleSelectSet, setSelectedSetId } = useMcpSelection(sets, setsLoading);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [dialogData, setDialogData] = useState<McpServer | undefined>(undefined);
    const [dialogTargetSetId, setDialogTargetSetId] = useState<string | undefined>(undefined);

    const openCreateDialog = (targetSetId?: string) => {
        setDialogMode('create');
        setDialogData(undefined);
        setDialogTargetSetId(targetSetId);
        setDialogOpen(true);
    };

    const openEditDialog = (server: McpServer) => {
        setDialogMode('edit');
        setDialogData(server);
        setDialogTargetSetId(undefined);
        setDialogOpen(true);
    };

    const selectedSet = sets.find(s => s.id === selectedSetId);

    // Sort servers in set based on the order in set.items
    const selectedSetServers = selectedSet
        ? selectedSet.items
            .map(id => servers.find(s => s.id === id))
            .filter((s): s is McpServer => !!s)
        : [];

    // Add/Remove server from set
    const addServerToSet = (serverId: string) => {
        if (!selectedSet) return;
        if (selectedSet.items.includes(serverId)) return;
        const newItems = [...selectedSet.items, serverId];
        updateSet({ id: selectedSet.id, items: newItems });
    };

    const removeServerFromSet = (serverId: string) => {
        if (!selectedSet) return;
        const newItems = selectedSet.items.filter(id => id !== serverId);
        updateSet({ id: selectedSet.id, items: newItems });
    };

    const reorderSetServers = (newOrder: string[]) => {
        if (!selectedSet) return;
        updateSet({ id: selectedSet.id, items: newOrder });
    };

    const handleCreateSet = (params: any) => {
        createSet(params, {
            onSuccess: (data) => {
                if (data?.success && data.data) {
                    const newId = data.data.id;
                    setSelectedSetId(newId);
                    localStorage.setItem('mcp-last-selected-id', newId);
                }
            }
        });
    };

    const handleDeleteSet = () => {
        if (selectedSet) {
            deleteSet(selectedSet.id, {
                onSuccess: () => {
                    setSelectedSetId(null);
                    localStorage.removeItem('mcp-last-selected-id');
                }
            });
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden p-6" data-testid="mcp-page">
            {/* Header */}
            <div className="flex-shrink-0 mb-4">
                <h1 className="text-xl font-bold tracking-tight">MCP Servers</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage Tool Context and Server Configurations</p>
            </div>

            {/* 3-Pane Layout */}
            <div className="flex-1 min-h-0 border rounded-lg bg-zinc-950/20 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    {/* Pane 1: Set List */}
                    <ResizablePanel defaultSize={25} minSize={20} className="min-w-0" style={{ overflow: 'hidden' }}>
                        <McpSetList
                            sets={sets}
                            isLoading={setsLoading}
                            selectedSetId={selectedSetId}
                            onSelectSet={handleSelectSet}
                            onCreateSet={handleCreateSet}
                            isCreating={isCreatingSet}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Pane 2: Set Detail */}
                    <ResizablePanel defaultSize={35} minSize={25} className="min-w-0" style={{ overflow: 'hidden' }}>
                        <McpSetDetail
                            set={selectedSet}
                            servers={selectedSetServers}
                            onRemoveServer={removeServerFromSet}
                            onDeleteSet={handleDeleteSet}
                            onReorderServers={reorderSetServers}
                            onRenameSet={(name) => selectedSet && updateSet({ id: selectedSet.id, name })}
                            onCreateServer={() => openCreateDialog(selectedSet?.id)}
                            onEditServer={openEditDialog}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Pane 3: Server Pool */}
                    <ResizablePanel defaultSize={40} minSize={30} className="min-w-0" style={{ overflow: 'hidden' }}>
                        <McpPool
                            servers={servers}
                            isLoading={serversLoading}
                            selectedSet={selectedSet}
                            onAddServerToSet={addServerToSet}
                            onCreateServer={() => openCreateDialog()}
                            onEditServer={openEditDialog}
                            onUpdateServer={(data) => updateServer(data)}
                            onDeleteServer={(id) => deleteServer(id)}
                            isCreating={isCreatingServer}
                            isUpdating={isUpdatingServer}
                            isImporting={isCreatingServer || isUpdatingServer}
                            onImportServers={(importedServers) => {
                                importedServers.forEach(importData => {
                                    const existing = servers.find(s => s.name === importData.name);
                                    if (existing) {
                                        updateServer({ ...importData, id: existing.id });
                                    } else {
                                        createServer(importData);
                                    }
                                });
                            }}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            <McpServerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                initialData={dialogData}
                onSuccess={(server) => {
                    if (dialogTargetSetId) {
                        const set = sets.find(s => s.id === dialogTargetSetId);
                        if (set && !set.items.includes(server.id)) {
                            const newItems = [...set.items, server.id];
                            updateSet({ id: dialogTargetSetId, items: newItems });
                        }
                    }
                }}
                onDelete={(id) => deleteServer(id)}
            />
        </div>
    );
}
