import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, RefreshCw, Settings, History, Box, FolderOpen, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    testId?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick, testId }) => {
    return (
        <Button
            data-testid={testId}
            variant="ghost"
            className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-auto transition-all duration-200 ease-out border border-transparent",
                "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 hover:border-white/5",
                isActive && "bg-primary/10 text-primary-foreground border-primary/20 shadow-[0_0_15px_-3px_rgba(124,58,237,0.15)]"
            )}
            onClick={onClick}
        >
            <Icon size={18} className={cn("transition-colors", isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300")} />
            <span className="text-sm font-medium tracking-tight">{label}</span>
        </Button>
    );
};

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
    return (
        <aside className="w-[260px] border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col p-4 gap-2 z-20 relative">
            <div className="flex items-center px-2 py-4 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 mr-3 flex items-center justify-center shadow-lg shadow-primary/20">
                    <div className="w-3 h-3 bg-white/90 rounded-full"></div>
                </div>
                <div>
                    <span className="font-bold text-base text-zinc-100 block leading-tight">Align Agents</span>
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">v2.0 Beta</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Platform</div>
                <SidebarItem
                    testId="nav-tools"
                    icon={LayoutGrid}
                    label="Tools"
                    isActive={activePage === 'tools'}
                    onClick={() => onNavigate('tools')}
                />
                <SidebarItem
                    testId="nav-sync"
                    icon={RefreshCw}
                    label="Sync"
                    isActive={activePage === 'sync'}
                    onClick={() => onNavigate('sync')}
                />
                <SidebarItem
                    testId="nav-rules"
                    icon={Box}
                    label="Rule Sets"
                    isActive={activePage === 'rules'}
                    onClick={() => onNavigate('rules')}
                />
                <SidebarItem
                    testId="nav-mcp"
                    icon={Box}
                    label="MCP Sets"
                    isActive={activePage === 'mcp'}
                    onClick={() => onNavigate('mcp')}
                />
            </div>

            <div className="mt-6 space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</div>
                <SidebarItem
                    testId="nav-projects"
                    icon={FolderOpen}
                    label="Projects"
                    isActive={activePage === 'projects'}
                    onClick={() => onNavigate('projects')}
                />
                <SidebarItem
                    testId="nav-history"
                    icon={History}
                    label="History"
                    isActive={activePage === 'history'}
                    onClick={() => onNavigate('history')}
                />
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                <SidebarItem
                    testId="nav-settings"
                    icon={Settings}
                    label="Settings"
                    isActive={activePage === 'settings'}
                    onClick={() => onNavigate('settings')}
                />
            </div>
        </aside>
    );
};
