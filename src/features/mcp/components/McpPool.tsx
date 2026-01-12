import { useState } from 'react';
import { McpServer, McpSet } from '@shared/types';
import {
    Loader2,
    Plus,
    Search,
    Edit2,
    Filter,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentColumn } from '@/components/layout/ContentColumn';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Removed unused UI imports

// Removed McpServerEditor import as we now use parent provided handlers

interface McpPoolProps {
    servers: McpServer[];
    isLoading: boolean;
    selectedSet: McpSet | undefined;
    onAddServerToSet: (serverId: string) => void;
    // Updated props for Dialog invocation
    onCreateServer: () => void; // Opens dialog
    onEditServer: (server: McpServer) => void;
    onDeleteServer: (id: string) => void;
    onUpdateServer: (params: any) => void;
    onImportServers: (servers: any[]) => void;
    isCreating: boolean;
    isUpdating: boolean;
    isImporting?: boolean;
}

import { McpServerListItem } from './McpServerListItem';

function ControlledSortableMcpPoolItem({
    server,
    isInSelectedSet,
    onAddToSet,
    onEditServer,
    onDeleteServer,
}: {
    server: McpServer;
    isInSelectedSet: boolean;
    onAddToSet?: () => void;
    onEditServer: (server: McpServer) => void;
    onDeleteServer: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: server.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 0,
        position: 'relative' as const,
        touchAction: 'none' as const,
    };

    const startAction = onAddToSet && !isInSelectedSet ? (
        <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-sm"
            onClick={(e) => {
                e.preventDefault(); // Prevent drag start if accidentally attached
                e.stopPropagation();
                onAddToSet();
            }}
        >
            <Plus className="h-4 w-4" />
        </Button>
    ) : null;

    const endAction = (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    data-testid="mcp-server-menu-button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-200"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
                <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 justify-start px-2 text-xs font-normal relative"
                        onClick={() => onEditServer(server)}
                    >
                        <Edit2 className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        Edit
                    </Button>
                    <div className="h-px bg-border my-0.5" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 justify-start px-2 text-xs font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteServer(server.id)}
                    >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );

    return (
        <McpServerListItem
            server={server}
            isDragging={isDragging}
            dragAttributes={attributes}
            dragListeners={listeners}
            setNodeRef={setNodeRef}
            style={style}
            startAction={startAction}
            endAction={endAction}
            testIdPrefix="mcp-server-item"
        />
    );
}

export function McpPool({
    servers,
    isLoading,
    selectedSet,
    onAddServerToSet,
    onCreateServer,
    onEditServer,
    onDeleteServer
}: McpPoolProps) {
    const [search, setSearch] = useState('');

    const [localServers, setLocalServers] = useState<McpServer[]>(servers);
    const [prevServers, setPrevServers] = useState<McpServer[]>(servers);

    // Sync from props if they change (e.g. backend update or parent refresh)
    if (servers !== prevServers) {
        setLocalServers(servers);
        setPrevServers(servers);
    }

    const filteredServers = localServers.filter(s =>
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.command.toLowerCase().includes(search.toLowerCase())) &&
        // Filter out servers already in the selected set
        (!selectedSet || !selectedSet.items.includes(s.id))
    );

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setLocalServers((items) => {
                const oldIndex = items.findIndex((s) => s.id === active.id);
                const newIndex = items.findIndex((s) => s.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <ContentColumn
            testId="mcp-pool"
            title={
                <div className="flex items-center justify-between w-full h-7">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Server Pool <span className="ml-1 opacity-70">({filteredServers.length})</span>
                    </h3>

                    <div className="flex items-center gap-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-zinc-800">
                                    <Filter className="h-3.5 w-3.5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-2" align="end">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search servers..."
                                        className="pl-8 h-8 text-sm"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        data-testid="mcp-server-new-button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0 hover:bg-zinc-800"
                                        onClick={onCreateServer}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>New Server</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            }
        >
            {isLoading && (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}
            {
                !isLoading && filteredServers.length === 0 && (
                    <div className="text-center p-4 text-xs text-muted-foreground">
                        No servers found.
                    </div>
                )
            }

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredServers.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {filteredServers.map((server) => (
                        <ControlledSortableMcpPoolItem
                            key={server.id}
                            server={server}
                            isInSelectedSet={selectedSet?.items.includes(server.id) ?? false}
                            onAddToSet={() => onAddServerToSet(server.id)}
                            onEditServer={onEditServer}
                            onDeleteServer={onDeleteServer}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </ContentColumn >
    );
}