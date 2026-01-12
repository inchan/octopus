import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectCard } from './ProjectCard';
import { DebugInfoBlock } from '@/components/ui/DebugInfoBlock';
import { AddProjectDialog } from './AddProjectDialog';
import { ProjectDetailPage } from './ProjectDetailPage';
import { Project } from '../../../shared/api';

export const ProjectsPage = () => {
    const [search, setSearch] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const queryClient = useQueryClient();

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            if (!window.api) return { projects: [], debugInfo: { error: 'No API available' } };
            try {
                // IPC handler returns { success: boolean, data: Project[], error?: string, debugInfo?: any }
                const result = await window.api.projects.list();
                // @ts-ignore
                if (result.success) {
                    // @ts-ignore
                    const validProjects = Array.isArray(result.data) ? result.data : [];
                    return {
                        projects: validProjects,
                        // @ts-ignore
                        debugInfo: result.debugInfo
                    };
                }
                // @ts-ignore
                throw new Error(result.error);
            } catch (err) {
                console.error('Failed to load projects:', err);
                return { projects: [], debugInfo: { error: String(err) } };
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });

    const addMutation = useMutation({
        mutationFn: async (vars: { name: string, path: string, type: any }) => {
            return window.api.projects.create(vars);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const filteredProjects = (Array.isArray(projects?.projects) ? projects.projects : [])?.filter((p: Project) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.path.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedProject) {
        return (
            <div className="h-full w-full">
                <ProjectDetailPage
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                />
            </div>
        );
    }

    return (
        <div data-testid="projects-page" className="h-full flex flex-col space-y-6 max-w-7xl mx-auto w-full p-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Projects</h1>
                    <p className="text-zinc-400 text-sm">Manage and configure your local workspaces</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <Input
                            placeholder="Search projects..."
                            className="pl-9 bg-black/20 border-white/5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            data-testid="projects-search-input"
                        />
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} data-testid="projects-add-button">
                        <Plus className="mr-2" size={16} /> Add Project
                    </Button>
                </div>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center h-64" data-testid="projects-loading">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="projects-list">
                    {filteredProjects?.map((project: Project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                    {filteredProjects?.length === 0 && (
                        <div
                            className="col-span-full flex flex-col items-center justify-center py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-lg gap-4"
                            data-testid="projects-empty-state"
                        >
                            <p>No projects found. Try adding one by scanning a directory.</p>
                            {/* @ts-ignore */}
                            <DebugInfoBlock info={projects?.debugInfo} className="w-full max-w-2xl px-4" />
                        </div>
                    )}
                </div>
            )}

            <AddProjectDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAdd={async (path, name, type) => {
                    await addMutation.mutateAsync({ path, name, type });
                }}
            />
        </div>
    );
};
