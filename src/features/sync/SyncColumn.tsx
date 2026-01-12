import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContentColumn } from '@/components/layout/ContentColumn';

export interface SyncItem {
    id: string;
    name: string;
    description?: string;
    icon?: React.ReactNode;
    badge?: string; // e.g. "Default", "Custom"
}

interface SyncColumnProps {
    title: string;
    items: SyncItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    emptyMessage?: string;
    className?: string;
    testId?: string;
}

export const SyncColumn: React.FC<SyncColumnProps> = ({
    title,
    items,
    selectedId,
    onSelect,
    emptyMessage = "No items available",
    className = "",
    testId
}) => {
    return (
        <ContentColumn
            title={title}
            className={className}
            testId={testId}
        >
            {items.length > 0 ? (
                items.map(item => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => onSelect(item.id)}
                        data-testid={testId ? `${testId}-item-${item.id}` : undefined}
                        className={cn(
                            "w-full justify-start h-auto py-3 px-3 flex-col items-start gap-1 transition-all border border-transparent",
                            selectedId === item.id
                                ? "bg-zinc-800/80 border-zinc-700/50 text-zinc-100"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        )}
                    >
                        <div className="flex items-center justify-between w-full min-w-0">
                            <div className={cn("font-medium text-sm truncate flex-1 text-left", selectedId === item.id && "text-white")}>
                                {item.name}
                            </div>
                            {item.badge && (
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "text-[10px] h-5 px-1.5 font-normal flex-shrink-0 ml-2",
                                        selectedId === item.id
                                            ? "bg-zinc-700 text-zinc-300"
                                            : "bg-zinc-900 text-zinc-600"
                                    )}
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </div>
                        {item.description && (
                            <div className={cn("text-xs w-full text-left truncate", selectedId === item.id ? "text-zinc-400" : "text-zinc-600")}>
                                {item.description}
                            </div>
                        )}
                    </Button>
                ))
            ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                    {emptyMessage}
                </div>
            )}
        </ContentColumn>
    );
};
