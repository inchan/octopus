import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit2, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RuleEditor } from './RuleEditor';
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

interface RuleDetailProps {
    id: string;
    onClose: () => void;
}

export function RuleDetail({ id, onClose }: RuleDetailProps) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { data: result } = useQuery({
        queryKey: ['rules', id],
        queryFn: () => window.api.rules.get(id)
    });

    const rule = result?.success ? result.data : null;

    const updateMutation = useMutation({
        mutationFn: async (params: { id: string; content?: string; isActive?: boolean; name?: string }) =>
            window.api.rules.update(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
            setIsEditing(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async () => window.api.rules.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
            onClose();
        }
    });

    if (!rule) return null;

    if (isEditing) {
        return (
            <RuleEditor
                mode="edit"
                initialData={rule}
                onCancel={() => setIsEditing(false)}
                onSubmit={(data) => updateMutation.mutate({ id: rule.id, ...data })}
                isSubmitting={updateMutation.isPending}
            />
        );
    }

    return (
        <ScrollArea className="max-h-64">
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'} className={cn("text-[10px] h-5", rule.isActive && "bg-green-600")}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) => updateMutation.mutate({ id: rule.id, isActive: checked })}
                        />
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsEditing(true)} aria-label="Edit Rule">
                            <Edit2 className="h-3 w-3" />
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    aria-label="Delete Rule"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the rule "{rule.name}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose} aria-label="Close Detail">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <pre className="font-mono text-xs bg-card p-3 rounded border border-border whitespace-pre-wrap max-h-32 overflow-auto">
                    {rule.content}
                </pre>
            </div>
        </ScrollArea>
    );
}
