import React, { useState } from 'react';
import { Loader2, X, Archive, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRuleParams } from '@shared/types';
import { cn } from '@/lib/utils';

interface RuleEditorProps {
    mode: 'create' | 'edit';
    initialData?: {
        id?: string;
        name: string;
        content: string;
        isActive: boolean;
    };
    onCancel: () => void;
    onSubmit: (data: CreateRuleParams) => void;
    isSubmitting: boolean;
}

export function RuleEditor({ mode, initialData, onCancel, onSubmit, isSubmitting }: RuleEditorProps) {
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit({
            name: formData.get('name') as string,
            content: formData.get('content') as string,
            isActive: isActive,
        });
    };

    return (
        <ScrollArea className="max-h-80">
            <div data-testid="rules-editor" className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        {mode === 'create' ? 'New Rule' : 'Edit Rule'}
                        {mode === 'edit' && (
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full border",
                                isActive
                                    ? "border-green-500/30 bg-green-500/10 text-green-500"
                                    : "border-zinc-500/30 bg-zinc-500/10 text-muted-foreground"
                            )}>
                                {isActive ? "Active" : "Archived"}
                            </span>
                        )}
                    </h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        data-testid="rules-editor-name-input"
                        name="name"
                        required
                        placeholder="Rule Name"
                        defaultValue={initialData?.name}
                        className="h-8 text-sm"
                        autoFocus={mode === 'create'}
                    />
                    <textarea
                        data-testid="rules-editor-content-textarea"
                        name="content"
                        required
                        defaultValue={initialData?.content}
                        className="w-full h-24 bg-card border border-input rounded-md p-2 resize-none font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="# Rule content in Markdown..."
                    />

                    <div className="flex justify-between items-center pt-2">
                        {mode === 'edit' ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-7 text-xs gap-1.5",
                                    isActive ? "hover:text-amber-500 hover:border-amber-500/50" : "hover:text-green-500 hover:border-green-500/50"
                                )}
                                onClick={() => setIsActive(!isActive)}
                            >
                                {isActive ? (
                                    <>
                                        <Archive className="h-3.5 w-3.5" />
                                        Archive
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="h-3.5 w-3.5" />
                                        Activate
                                    </>
                                )}
                            </Button>
                        ) : <div></div>}

                        <div className="flex gap-2">
                            <Button data-testid="rules-editor-cancel-button" type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                            <Button data-testid="rules-editor-save-button" type="submit" size="sm" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                {mode === 'create' ? 'Create' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </ScrollArea>
    );
}
