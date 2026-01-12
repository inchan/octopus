
import React, { useState } from 'react';
import { Loader2, X, Archive, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JsonEditor } from '@/components/JsonEditor';
import { CreateMcpServerParams, UpdateMcpServerParams, McpServer } from '@shared/types';
import { cn } from '@/lib/utils';

interface McpServerEditorProps {
    mode: 'create' | 'edit';
    initialData?: McpServer;
    onCancel: () => void;
    onSubmit: (data: CreateMcpServerParams | UpdateMcpServerParams) => void;
    isSubmitting: boolean;
}

export function McpServerEditor({ mode, initialData, onCancel, onSubmit, isSubmitting }: McpServerEditorProps) {
    const [env, setEnv] = useState<Record<string, string>>(initialData?.env || {});
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const argsStr = formData.get('args') as string;
        const args = argsStr ? argsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

        const data = {
            name: formData.get('name') as string,
            command: formData.get('command') as string,
            args,
            env,
            isActive
        };

        if (mode === 'edit' && initialData) {
            onSubmit({ ...data, id: initialData.id });
        } else {
            onSubmit(data);
        }
    };

    return (
        <ScrollArea className="max-h-80">
            <div data-testid="mcp-server-editor" className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        {mode === 'create' ? 'New Server' : 'Edit Server'}
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
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        name="name"
                        required
                        placeholder="Server Name"
                        defaultValue={initialData?.name}
                        className="h-8 text-sm"
                        autoFocus={mode === 'create'}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            name="command"
                            required
                            placeholder="Command (npx, docker...)"
                            defaultValue={initialData?.command}
                            className="h-8 text-sm font-mono"
                        />
                        <Input
                            name="args"
                            placeholder="Args (comma separated)"
                            defaultValue={initialData?.args.join(', ')}
                            className="h-8 text-sm font-mono"
                        />
                    </div>
                    <JsonEditor label="Env Variables" value={env} onChange={setEnv} />

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
                            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                            <Button type="submit" size="sm" disabled={isSubmitting}>
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
