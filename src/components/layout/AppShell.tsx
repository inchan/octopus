import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface AppShellProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
    layoutMode?: 'default' | 'fullscreen';
}

export const AppShell: React.FC<AppShellProps> = ({ children, activePage, onNavigate, layoutMode = 'default' }) => {
    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
            <Sidebar activePage={activePage} onNavigate={onNavigate} />
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-0">
                <Header />
                <div className={cn(
                    "flex-1 relative",
                    layoutMode === 'default' ? "overflow-auto p-6" : "overflow-hidden"
                )}>
                    {children}
                </div>
            </main>
        </div>
    );
};
