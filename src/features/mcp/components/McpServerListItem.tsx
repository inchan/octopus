import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { cn } from '@/lib/utils';
import { McpServer } from '@shared/types';

interface McpServerListItemProps {
    server: McpServer;
    isDragging?: boolean;
    dragAttributes?: DraggableAttributes;
    dragListeners?: SyntheticListenerMap;
    setNodeRef?: (node: HTMLElement | null) => void;
    style?: React.CSSProperties;
    startAction?: React.ReactNode;
    endAction?: React.ReactNode;
    onClick?: () => void;
    testIdPrefix?: string;
}

export function McpServerListItem({
    server,
    isDragging,
    dragAttributes,
    dragListeners,
    setNodeRef,
    style,
    startAction,
    endAction,
    onClick,
    testIdPrefix
}: McpServerListItemProps) {
    return (
        <div
            ref={setNodeRef}
            style={style}
            data-testid={`${testIdPrefix || 'mcp-server-item'}-${server.id}`}
            className={cn(
                "w-full group/item relative",
                isDragging && "z-50"
            )}
            {...dragAttributes}
            {...dragListeners}
            onClick={onClick}
        >
            <div
                className={cn(
                    "w-full justify-start h-auto py-2 px-2 flex items-center gap-2 transition-all border border-transparent rounded-md cursor-grab active:cursor-grabbing",
                    "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                    isDragging && "opacity-50 bg-zinc-800/50 scale-[1.02] shadow-xl ring-1 ring-zinc-700"
                )}
            >
                {/* Left: Start Action (e.g., Add Button) */}
                {startAction && (
                    <div className="flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                        {startAction}
                    </div>
                )}

                {/* Center: Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center select-none">
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Status Dot */}
                        {server.isActive ? (
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" title="Active" />
                        ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0 border border-zinc-500" title="Inactive" />
                        )}
                        <span data-testid={`${testIdPrefix || 'mcp-server-item'}-${server.id}-name`} className="text-sm font-medium truncate text-zinc-300">
                            {server.name}
                        </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate pl-3.5 opacity-70">
                        {server.command} {server.args?.join(" ")}
                    </div>
                </div>

                {/* Right: End Action (e.g., Menu or Delete Button) */}
                {endAction && (
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()}>
                        {endAction}
                    </div>
                )}
            </div>
        </div>
    );
}
