import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="h-12 border-b border-border flex items-center px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors">Dashboard</span>
                <span className="text-zinc-600">/</span>
                <span className="text-foreground font-medium">Tools</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Actions placeholder */}
            </div>
        </header>
    );
};
