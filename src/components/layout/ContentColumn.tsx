import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ContentColumnProps {
    title: React.ReactNode;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    className?: string;
    testId?: string;
}

export const ContentColumn: React.FC<ContentColumnProps> = ({
    title,
    children,
    headerContent,
    className,
    testId
}) => {
    return (
        <div className={cn("flex flex-col h-full bg-zinc-950/30 min-w-0", className)} data-testid={testId}>
            {/* Header */}
            <div className="p-3 border-b border-border bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center justify-between min-h-[20px]">
                    {/* Title container - we handle both string and component titles */}
                    {typeof title === 'string' ? (
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                            {title}
                        </h3>
                    ) : (
                        title
                    )}
                </div>
                {headerContent && (
                    <div className="mt-2">
                        {headerContent}
                    </div>
                )}
            </div>

            {/* Content List */}
            <ScrollArea className="flex-1 w-full min-w-0">
                <div className="p-2 space-y-1 min-w-0 w-full overflow-hidden grid grid-cols-1">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
};
