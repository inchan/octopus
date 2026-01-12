import { useState, useEffect } from 'react';
import { CreateRuleParams, Rule } from '@shared/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Archive, PlayCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    initialData?: Rule;
    onSuccess?: (data: CreateRuleParams) => void;
    onDelete?: (id: string) => void;
    isSubmitting?: boolean;
}

export function RuleDialog({
    open,
    onOpenChange,
    mode,
    initialData,
    onSuccess,
    onDelete,
    isSubmitting
}: RuleDialogProps) {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setName(initialData.name);
                setContent(initialData.content);
                setIsActive(initialData.isActive);
            } else {
                setName('');
                setContent('');
                setIsActive(true);
            }
        }
    }, [open, mode, initialData]);

    const handleSubmit = () => {
        onSuccess?.({
            name,
            content,
            isActive
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        {mode === 'edit' && (
                            <div
                                className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    isActive ? "bg-green-500" : "bg-zinc-500"
                                )}
                                title={isActive ? "Active" : "Inactive"}
                            />
                        )}
                        {mode === 'create' ? 'Create New Rule' : 'Edit Rule'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="rule-name">Name</Label>
                        <Input
                            data-testid="rules-editor-name-input"
                            id="rule-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Rule Name"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2 h-full flex flex-col">
                        <Label htmlFor="rule-content">Content (Markdown)</Label>
                        <textarea
                            data-testid="rules-editor-content-textarea"
                            id="rule-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 w-full min-h-[300px] bg-zinc-950/50 border border-input rounded-md p-3 resize-none font-mono text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="# Rule Content..."
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t bg-background z-10 flex flex-row items-center justify-between sm:justify-between">
                    {mode === 'edit' ? (
                        <div className="flex gap-2">
                            <Button
                                data-testid="rules-editor-toggle-active-button"
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsActive(!isActive)}
                                title={isActive ? "Archive Rule" : "Activate Rule"}
                            >
                                {isActive ? (
                                    <Archive className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <PlayCircle className="h-4 w-4 text-green-500" />
                                )}
                            </Button>
                            {onDelete && initialData && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the rule "{initialData.name}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => {
                                                    onDelete(initialData.id);
                                                    onOpenChange(false);
                                                }}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    ) : <div></div>}
                    <div className="flex gap-2">
                        <Button data-testid="rules-editor-cancel-button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button data-testid="rules-editor-save-button" onClick={handleSubmit} disabled={isSubmitting || !name || !content}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'create' ? 'Create Rule' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
