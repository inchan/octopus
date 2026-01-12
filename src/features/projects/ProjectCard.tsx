import React from 'react';
import { Project } from '../../../shared/types';
import { Card } from '@/components/ui/card';
import { Folder, Code2, Box, Terminal } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'node': return <Code2 className="text-green-500" size={20} />;
        case 'python': return <Code2 className="text-yellow-500" size={20} />;
        case 'rust': return <Box className="text-orange-500" size={20} />;
        case 'go': return <Terminal className="text-cyan-500" size={20} />;
        default: return <Folder className="text-gray-500" size={20} />;
    }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <Card
            className="p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors border-white/5"
            onClick={onClick}
            data-testid={`projects-item-${project.id}`}
        >
            <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-900 rounded-lg border border-white/10">
                    <TypeIcon type={project.type} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-100 truncate" data-testid="projects-item-name">{project.name}</h3>
                    <p className="text-xs text-zinc-500 truncate mt-1 font-mono" data-testid="projects-item-path">{project.path}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5 uppercase tracking-wide">
                            {project.type}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
