import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Project, ToolDetectionResult, GeneratedFile } from '../../../shared/api';
import { ToolCard } from '../tools/ToolCard';
import { ToolConfigDialog } from '../tools/ToolConfigDialog';
import { SyncPreviewDialog } from '../sync/SyncPreviewDialog';
import { Loader2, ArrowLeft, Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailPageProps {
    project: Project;
    onBack: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
    const [search, setSearch] = useState('');
    const [configTool, setConfigTool] = useState<{ id: string; name: string } | null>(null);
    const [previewFiles, setPreviewFiles] = useState<GeneratedFile[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const { data: toolsData, isLoading, error } = useQuery({
        // ... existing useQuery ...
        queryKey: ['tools-detection-project', project.id],
        queryFn: async () => {
            // We use the same detection logic, as tools are installed globally on the system
            // But in the future we might want to know which tools are "active" for a project. 
            // For now, we list all detected tools so user can configure them for this project.
            if (!window.api) return { tools: [] };
            try {
                const result = await window.api.toolDetection.detect();
                if (result.success) {
                    let validTools: ToolDetectionResult[] = [];
                    if (Array.isArray(result.data)) {
                        validTools = result.data;
                    } else if (result.data && typeof result.data === 'object') {
                        validTools = Object.values(result.data as Record<string, ToolDetectionResult>);
                    }
                    return { tools: validTools };
                }
                throw new Error(result.error);
            } catch (err) {
                console.error('Tool detection failed:', err);
                return { tools: [], error: String(err) };
            }
        }
    });

    const handleConfigure = (toolId: string) => {
        const allTools = Array.isArray(toolsData?.tools) ? toolsData.tools : [];
        const tool = allTools.find((t: ToolDetectionResult) => t.id === toolId);
        if (tool) {
            setConfigTool({ id: tool.id, name: tool.name });
        }
    };

    const handleSyncProject = async () => {
        setIsSyncing(true);
        try {
            // @ts-ignore - projects API extended
            const res = await window.api.projects.previewSync(project.id);
            if (res.success) {
                if (res.data.length === 0) {
                    alert('No configurations found for this project. Please configure tools first.');
                    return;
                }
                setPreviewFiles(res.data);
                setIsPreviewOpen(true);
            } else {
                alert('Failed to generate sync preview: ' + res.error);
            }
        } catch (error) {
            console.error('Failed to sync project:', error);
            alert('Failed to sync project');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleConfirmSync = async () => {
        setIsSyncing(true);
        try {
            for (const file of previewFiles) {
                const res = await window.api.sync.apply(file.path, file.content);
                if (!res.success) console.error(`Failed to write ${file.path}:`, res.error);
            }
            setIsPreviewOpen(false);
            alert('Project synced successfully!');
        } catch (error) {
            console.error('Sync failed:', error);
            alert('Sync failed execution.');
        } finally {
            setIsSyncing(false);
        }
    };

    const filteredTools = (toolsData?.tools || []).filter((t: ToolDetectionResult) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Loading project tools...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-destructive gap-4">
                <p>Error loading tools</p>
                <Button variant="outline" onClick={onBack}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto w-full p-6" data-testid="projects-detail">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <Button 
                        variant="ghost" 
                        className="w-fit p-0 hover:bg-transparent text-zinc-400 hover:text-white" 
                        onClick={onBack}
                        data-testid="projects-detail-back"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                    </Button>
                    <Button
                        onClick={handleSyncProject}
                        disabled={isSyncing}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid="projects-detail-sync"
                    >
                        {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
                        Sync Project
                    </Button>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1" data-testid="projects-detail-name">{project.name}</h1>
                        <p className="text-zinc-400 text-sm font-mono" data-testid="projects-detail-path">{project.path}</p>
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
            </div>

            <Separator className="bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.length > 0 ? filteredTools.map((tool: ToolDetectionResult) => (
                    <ToolCard
                        key={tool.id}
                        tool={tool}
                        onConfigure={handleConfigure}
                    />
                )) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-lg">
                        No tools found matching your search.
                    </div>
                )}
            </div>

            {configTool && (
                <ToolConfigDialog
                    isOpen={!!configTool}
                    onClose={() => setConfigTool(null)}
                    toolId={configTool.id}
                    toolName={configTool.name}
                    contextType="project"
                    contextId={project.id}
                />
            )}

            <SyncPreviewDialog
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onConfirm={handleConfirmSync}
                files={previewFiles}
                isSyncing={isSyncing}
            />
        </div>
    );
};
