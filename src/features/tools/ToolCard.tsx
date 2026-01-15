import React from 'react';
import { ToolDetectionResult } from '../../../shared/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Monitor, Code2, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ToolCardProps {
    tool: ToolDetectionResult;
    onConfigure: (toolId: string) => void;
}

const ToolIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
        case 'cli': return <Terminal className="w-4 h-4" />;
        case 'ide': return <Code2 className="w-4 h-4" />;
        default: return <Monitor className="w-4 h-4" />;
    }
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onConfigure }) => {
    return (
        <Card 
            className="group relative overflow-hidden bg-zinc-900/40 border-white/5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)] hover:-translate-y-1"
            data-testid={`tools-item-${tool.id}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <div className="flex items-center gap-2.5">
                    {/* 설치 상태 동그라미 */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "h-2.5 w-2.5 rounded-full shrink-0 transition-all duration-300",
                                        tool.isInstalled
                                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                            : "bg-zinc-500 border border-zinc-400"
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>{tool.isInstalled ? 'Installed' : 'Not Detected'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <CardTitle className="text-base font-bold text-zinc-100 tracking-tight group-hover:text-primary transition-colors duration-300">
                        {tool.name}
                    </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider bg-white/5">
                        {tool.type}
                    </Badge>
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <ToolIcon type={tool.type} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 relative z-10">
                <div className="text-xs text-muted-foreground space-y-1.5 bg-black/40 p-3 rounded-lg border border-white/5 font-mono">
                    {tool.paths.app && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="min-w-0 truncate flex items-center cursor-help">
                                        <span className="text-zinc-600 mr-2 w-10 inline-block select-none">PATH</span>
                                        <span className="text-zinc-300 truncate">{tool.paths.app.split('/').pop()}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-sm">
                                    <p className="font-mono text-xs break-all">{tool.paths.app}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {tool.paths.config && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="min-w-0 truncate flex items-center cursor-help">
                                        <span className="text-zinc-600 mr-2 w-10 inline-block select-none">CFG</span>
                                        <span className="text-zinc-300 truncate">{tool.paths.config.split('/').pop()}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-sm">
                                    <p className="font-mono text-xs break-all">{tool.paths.config}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {tool.version && (
                        <div className="flex items-center">
                            <span className="text-zinc-600 mr-2 w-10 inline-block select-none">VER</span>
                            <span className="text-zinc-300">{tool.version}</span>
                        </div>
                    )}
                    {!tool.paths.app && !tool.paths.config && !tool.version && (
                        <div className="text-zinc-500 italic">No details available</div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="relative z-10">
                <Button
                    variant="outline"
                    className={cn(
                        "w-full border-white/10 bg-white/5 transition-all duration-300",
                        tool.isInstalled
                            ? "hover:bg-white/10 hover:text-white hover:border-white/20 group-hover:border-primary/30"
                            : "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => onConfigure(tool.id)}
                    disabled={!tool.isInstalled}
                >
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                </Button>
            </CardFooter>
        </Card>
    );
};
