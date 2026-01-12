import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // Removed unused import
import { Loader2, Search, FolderPlus, Check } from 'lucide-react';
import { Project } from '../../../shared/types';
import { cn } from '@/lib/utils'; // Assuming utils exist

interface AddProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (path: string, name: string, type: Project['type']) => Promise<void>;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ isOpen, onClose, onAdd }) => {
    const [mode, setMode] = useState<'manual' | 'scan'>('scan');
    const [scanPath, setScanPath] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [candidates, setCandidates] = useState<Project[]>([]);
    const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

    const handleScan = async () => {
        if (!scanPath) return;
        setIsScanning(true);
        try {
            const result = await window.api.projects.scan(scanPath);
            if (result.success) {
                setCandidates(result.data);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsScanning(false);
        }
    };

    const toggleCandidate = (path: string) => {
        const next = new Set(selectedCandidates);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        setSelectedCandidates(next);
    };

    const handleAddSelected = async () => {
        for (const candidate of candidates) {
            if (selectedCandidates.has(candidate.path)) {
                await onAdd(candidate.path, candidate.name, candidate.type);
            }
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="sm:max-w-[600px] border-white/10 bg-zinc-900/95 backdrop-blur-xl"
                data-testid="projects-add-dialog"
            >
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex gap-2 mb-4">
                        <Button
                            variant={mode === 'scan' ? 'default' : 'ghost'}
                            onClick={() => setMode('scan')}
                            className="flex-1"
                        >
                            <Search size={16} className="mr-2" /> Scan Directory
                        </Button>
                        <Button
                            variant={mode === 'manual' ? 'default' : 'ghost'}
                            onClick={() => setMode('manual')}
                            className="flex-1"
                        >
                            <FolderPlus size={16} className="mr-2" /> Manual Add
                        </Button>
                    </div>

                    {mode === 'scan' && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="/Users/username/workspace"
                                    value={scanPath}
                                    onChange={(e) => setScanPath(e.target.value)}
                                    className="bg-black/20 border-white/10"
                                    data-testid="projects-add-path-input"
                                />
                                <Button 
                                    onClick={handleScan} 
                                    disabled={isScanning || !scanPath}
                                    data-testid="projects-scan-submit"
                                >
                                    {isScanning ? <Loader2 className="animate-spin" /> : 'Scan'}
                                </Button>
                            </div>

                            {candidates.length > 0 && (
                                <div className="max-h-[300px] overflow-y-auto space-y-2 border border-white/5 rounded-md p-2">
                                    {candidates.map((c) => (
                                        <div
                                            key={c.path}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded cursor-pointer transition-colors",
                                                selectedCandidates.has(c.path) ? "bg-primary/20 border border-primary/30" : "bg-black/20 hover:bg-black/40"
                                            )}
                                            onClick={() => toggleCandidate(c.path)}
                                            data-testid={`projects-scan-item-${c.path}`}
                                        >
                                            <div>
                                                <div className="font-medium text-sm text-zinc-200">{c.name}</div>
                                                <div className="text-xs text-zinc-500">{c.path}</div>
                                            </div>
                                            {selectedCandidates.has(c.path) && <Check size={16} className="text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Manual mode implementation skipped for brevity, focused on Scan as per plan */}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} data-testid="projects-add-cancel">Cancel</Button>
                    <Button 
                        onClick={handleAddSelected} 
                        disabled={selectedCandidates.size === 0}
                        data-testid="projects-add-submit"
                    >
                        Add Selected ({selectedCandidates.size})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
