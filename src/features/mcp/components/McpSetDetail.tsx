
import { useState } from 'react';
import { McpServer, McpSet } from '@shared/types';
import { Trash2, FileText, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentColumn } from '@/components/layout/ContentColumn';
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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface McpSetDetailProps {
    set: McpSet | undefined;
    servers: McpServer[];
    onRemoveServer: (serverId: string) => void;
    onDeleteSet: () => void;
    onReorderServers: (newOrder: string[]) => void;
    onRenameSet: (newName: string) => void;

    // New props for flow integration
    onCreateServer: () => void;
    onEditServer: (server: McpServer) => void;
}

import { McpServerListItem } from './McpServerListItem';

function SortableMcpItem({ server, onRemove, onEdit }: { server: McpServer; onRemove: () => void; onEdit: () => void; }) {
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

    const endAction = (
        <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-zinc-600 hover:text-destructive flex-shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();
                onRemove();
            }}
        >
            <X className="h-3.5 w-3.5" />
        </Button>
    );

    return (
        <McpServerListItem
            server={server}
            isDragging={isDragging}
            dragAttributes={attributes}
            dragListeners={listeners}
            setNodeRef={setNodeRef}
            style={style}
            onClick={onEdit}
            endAction={endAction}
            testIdPrefix="mcp-set-server-item"
        />
    );
}

export function McpSetDetail({ set, servers, onRemoveServer, onDeleteSet, onReorderServers, onRenameSet, onCreateServer, onEditServer }: McpSetDetailProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = servers.findIndex((s) => s.id === active.id);
            const newIndex = servers.findIndex((s) => s.id === over?.id);
            const newOrder = arrayMove(servers, oldIndex, newIndex).map(s => s.id);
            onReorderServers(newOrder);
        }
    }

    if (!set) {
        return (
            <div data-testid="mcp-set-detail" className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-6">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-xs text-muted-foreground">Select an MCP set to view details</p>
                </div>
            </div>
        );
    }

    const handleTitleClick = () => {
        setTitleValue(set.name);
        setIsEditingTitle(true);
    };

    const handleTitleSubmit = () => {
        if (titleValue.trim() && titleValue !== set.name) {
            onRenameSet(titleValue.trim());
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleTitleSubmit();
        if (e.key === 'Escape') setIsEditingTitle(false);
    };

    return (
        <ContentColumn
            testId="mcp-set-detail"
            title={
                <div className="flex items-center justify-between w-full h-7">
                    <div className="flex-1 min-w-0">
                        {isEditingTitle ? (
                            <Input
                                autoFocus
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={handleTitleSubmit}
                                onKeyDown={handleTitleKeyDown}
                                className="h-6 text-xs font-semibold uppercase tracking-wider bg-transparent border-b border-zinc-700/50 rounded-none px-0 focus-visible:ring-0"
                            />
                        ) : (
                            <div
                                onClick={handleTitleClick}
                                className="flex items-center gap-2 cursor-pointer group"
                                title="Click to edit name"
                            >
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate px-2" data-testid="mcp-set-detail-title">
                                    {set.name}
                                </h3>
                                <FileText className="h-3 w-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                data-testid="mcp-set-detail-delete"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-zinc-600 hover:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete MCP Set?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the MCP set "{set.name}". The servers themselves will not be deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    data-testid="alert-dialog-confirm-button"
                                    onClick={onDeleteSet}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
        >
            <div className="group/list">
                {servers.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-zinc-900 rounded-lg bg-zinc-950/20">
                        <p className="text-xs text-muted-foreground mb-4">No servers in this set.</p>
                        <Button variant="secondary" size="sm" onClick={onCreateServer}>
                            Create New Server
                        </Button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={servers.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {servers.map((server) => (
                                <SortableMcpItem
                                    key={server.id}
                                    server={server}
                                    onRemove={() => onRemoveServer(server.id)}
                                    onEdit={() => onEditServer(server)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </ContentColumn>
    );
}
