import React, { useState, useMemo } from 'react';
import { ToolCard } from './ToolCard';
import { ToolConfigDialog } from './ToolConfigDialog';
import { ToolDetectionResult } from '../../../shared/api';
import { Loader2, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DebugInfoBlock } from '@/components/ui/DebugInfoBlock';
import { Input } from '@/components/ui/input';
import { useInstalledTools } from '@/hooks/useInstalledTools';

export const ToolsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [configTool, setConfigTool] = useState<{ id: string; name: string } | null>(null);

    // Use custom hook for tools data (Cache-First pattern)
    const { tools: displayTools, isLoading, error, debugInfo } = useInstalledTools();

    const handleConfigure = (toolId: string) => {
        const tool = displayTools.find((t: ToolDetectionResult) => t.id === toolId);
        if (tool) {
            setConfigTool({ id: tool.id, name: tool.name });
        }
    };

    // 정렬 및 필터링 (useMemo로 최적화)
    const filteredTools = useMemo(() => {
        const typeOrder: Record<string, number> = { cli: 1, ide: 2, desktop: 3 };
        const sorted = [...displayTools].sort((a, b) => {
            // 먼저 설치 상태로 정렬 (설치됨이 앞으로)
            if (a.isInstalled !== b.isInstalled) {
                return a.isInstalled ? -1 : 1;
            }
            // 그 다음 타입으로 정렬
            const aOrder = typeOrder[a.type.toLowerCase()] ?? 99;
            const bOrder = typeOrder[b.type.toLowerCase()] ?? 99;
            if (aOrder !== bOrder) {
                return aOrder - bOrder;
            }
            // 마지막으로 이름으로 정렬
            return a.name.localeCompare(b.name);
        });

        // 검색 필터 적용
        return sorted.filter((t: ToolDetectionResult) =>
            t.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [displayTools, search]);

    if (isLoading && displayTools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Detecting installed tools...</span>
            </div>
        );
    }

    if (error && displayTools.length === 0) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-destructive">
                Error loading tools: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6" data-testid="tools-page">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-white">AI Tools</h1>
                    <p className="text-muted-foreground">
                        Manage configuration and sync status for your local AI development tools.
                    </p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search tools..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-[#1E1E1E] border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>
            </div>

            <Separator className="my-6 bg-white/10" />

            {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="tools-list">
                    {filteredTools.map((tool: ToolDetectionResult) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            onConfigure={handleConfigure}
                        />
                    ))}
                </div>
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg border-white/10 text-muted-foreground gap-4">
                    <p>No tools match your search.</p>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <DebugInfoBlock info={debugInfo} className="w-full max-w-2xl" />
                </div>
            )}

            {configTool && (
                <ToolConfigDialog
                    isOpen={!!configTool}
                    onClose={() => setConfigTool(null)}
                    toolId={configTool.id}
                    toolName={configTool.name}
                />
            )}
        </div>
    );
};
