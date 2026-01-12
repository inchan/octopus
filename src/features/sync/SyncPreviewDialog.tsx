import React from 'react';
import { GeneratedFile } from '../../../shared/types';
import { File, AlertTriangle, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SyncPreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    files: GeneratedFile[];
    isSyncing: boolean;
}

export const SyncPreviewDialog: React.FC<SyncPreviewDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    files,
    isSyncing
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-zinc-950 border-zinc-800" data-testid="sync-preview-dialog">
                <DialogHeader className="p-6 border-b border-zinc-800 bg-zinc-900/50">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <span className="text-blue-500">⚡</span>
                        Sync Preview
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Review the configuration files that will be generated.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-md border border-blue-500/20 text-blue-200 text-sm">
                        <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            About to write <span className="font-bold text-blue-100">{files.length} configuration files</span>.
                            Existing configs will be overwritten based on your selected strategy.
                        </div>
                    </div>

                    <div className="flex-1 border rounded-md border-zinc-800 bg-zinc-900/30 overflow-y-auto min-h-0">
                        <div className="divide-y divide-zinc-800/50">
                            {files.length > 0 ? (
                                files.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 hover:bg-zinc-800/50 transition-colors group" data-testid={`sync-preview-file-${idx}`}>
                                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                                            <File className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-zinc-200 truncate font-mono">{file.path.split('/').pop()}</div>
                                            <div className="text-xs text-zinc-500 truncate">{file.path}</div>
                                        </div>
                                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 border-zinc-700">
                                            {file.content.length}b
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="h-32 flex items-center justify-center text-zinc-500 text-sm">
                                    No changes detected.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t border-zinc-800 bg-zinc-900/50">
                    <Button variant="ghost" onClick={onClose} disabled={isSyncing} className="text-zinc-400 hover:text-zinc-100" data-testid="sync-preview-cancel-button">
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isSyncing || files.length === 0}
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 min-w-[140px]"
                        data-testid="sync-preview-confirm-button"
                    >
                        {isSyncing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            'Confirm & Sync'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
