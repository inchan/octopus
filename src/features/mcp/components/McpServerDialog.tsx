import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateMcpServerParams, UpdateMcpServerParams, McpServer } from '@shared/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, PlayCircle, Archive, Trash2, Github, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractServersFromText } from '../utils/config-parser';
import { SERENA_PRESETS } from '../constants/serena_presets';
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

// Import our new smart inputs
import { KeyValueList } from './KeyValueList';
import { parseSingleServerConfig } from '../utils/config-parser';

interface McpServerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    initialData?: McpServer;
    onSuccess?: (server: McpServer) => void;
    onDelete?: (serverId: string) => void;
}

export function McpServerDialog({
    open,
    onOpenChange,
    mode,
    initialData,
    onSuccess,
    onDelete
}: McpServerDialogProps) {
    const queryClient = useQueryClient();
    const [connectionType, setConnectionType] = useState<'stdio' | 'sse'>('stdio');
    const [name, setName] = useState('');
    const [command, setCommand] = useState('');
    const [args, setArgs] = useState<string[]>([]);
    const [env, setEnv] = useState<Record<string, string>>({});
    const [url, setUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isJsonFocused, setIsJsonFocused] = useState(false);


    const [activeTab, setActiveTab] = useState("general");

    // GitHub Import State
    const [githubUrl, setGithubUrl] = useState('');
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [extractedServers, setExtractedServers] = useState<CreateMcpServerParams[]>([]);

    // Reset form when opening or changing data
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setName(initialData.name);
                if (initialData.url) {
                    setConnectionType('sse');
                    setUrl(initialData.url);
                    setCommand('');
                    setArgs([]);
                    setEnv({});
                } else {
                    setConnectionType('stdio');
                    setCommand(initialData.command);
                    setArgs(initialData.args || []);
                    setEnv(initialData.env || {});
                    setUrl('');
                }
                setIsActive(initialData.isActive ?? true);
                setActiveTab("general");
            } else {
                setConnectionType('stdio');
                setName('');
                setCommand('');
                setArgs([]);
                setEnv({});
                setUrl('');
                setIsActive(true);
                setActiveTab("general"); // Default to general
                setGithubUrl('');
                setExtractedServers([]);
                setFetchError(null);

                // Smart Paste from Clipboard
                if (navigator.clipboard) {
                    navigator.clipboard.readText().then(text => {
                        const trimmed = text.trim();
                        // Lightweight check if it looks like JSON and has MCP keywords
                        // Relaxed check: Allow starting with " (for unwrapped properties) or { or [
                        if (trimmed && (trimmed.includes('mcpServers') || trimmed.includes('command') || trimmed.includes('url'))) {

                            // Try parsing to verify it's valid MCP config
                            const result = parseSingleServerConfig(trimmed);
                            // Ensure we actually extracted useful data (at least a command or name)
                            if (result.success && result.data && (result.data.command || result.data.name || result.data.url)) {
                                // It is valid! Pre-fill and switch tab
                                setJsonText(trimmed);
                                // We don't auto-fill form fields here because the user might want to edit the JSON first.
                                // Or we could. But switching to JSON tab with content is the request: 
                                // "json으로 이동하고 붙여넣기 한 상태로 시작해주세요"
                                setActiveTab("json");
                                // Also populate form state immediately so "General" tab is also ready if they switch back
                                handleJsonChange(trimmed);
                            }
                        }
                    }).catch(err => {
                        // Ignore clipboard read errors (permission denied, etc)
                        console.debug('Failed to read clipboard for smart paste', err);
                    });
                }
            }
        }
    }, [open, mode, initialData]);

    // Sync Form -> JSON
    useEffect(() => {
        if (!isJsonFocused) {
            const currentConfig: any = {
                name,
            };

            if (connectionType === 'stdio') {
                currentConfig.command = command;
                currentConfig.args = args;
                currentConfig.env = env;
            } else {
                currentConfig.url = url;
            }

            setJsonText(JSON.stringify(currentConfig, null, 2));
            setJsonError(null);
        }
    }, [name, command, args, env, url, connectionType, isJsonFocused]);

    const handleJsonChange = (text: string) => {
        setJsonText(text);

        if (!text.trim()) {
            setJsonError(null);
            return;
        }

        const result = parseSingleServerConfig(text);

        if (result.success && result.data) {
            const target = result.data;
            if (target.name) setName(target.name);

            if (target.url) {
                setConnectionType('sse');
                setUrl(target.url);
                setCommand('');
                setArgs([]);
                setEnv({});
            } else {
                setConnectionType('stdio');
                if (target.command) setCommand(target.command);
                if (Array.isArray(target.args)) setArgs(target.args);
                if (target.env) setEnv(target.env);
                setUrl('');
            }
            setJsonError(null);
        } else {
            setJsonError(result.error || 'Invalid JSON');
        }
    };

    const handlePresetSelect = (presetId: string) => {
        const preset = SERENA_PRESETS.find(p => p.id === presetId);
        if (!preset) return;

        setConnectionType('stdio');
        setName(preset.name);
        setCommand(preset.command);
        setArgs(preset.args);
        setEnv({});
        setUrl('');
    };

    const handleGithubFetch = async () => {
        if (!githubUrl) return;
        setIsFetchingUrl(true);
        setFetchError(null);
        setExtractedServers([]);

        try {
            const result = await window.api.mcp.fetchConfigFromUrl(githubUrl);
            if (result.success) {
                const servers = extractServersFromText(result.data);
                if (servers.length === 0) {
                    setFetchError('No MCP servers found in this URL.');
                } else {
                    setExtractedServers(servers);
                    // Always select the first one by default, even if multiple
                    if (servers.length > 0) {
                        handleSelectExtracted(servers[0]);
                    }
                }
            } else {
                setFetchError(result.error);
            }
        } catch (err) {
            setFetchError((err as Error).message);
        } finally {
            setIsFetchingUrl(false);
        }
    };

    const handleSelectExtracted = (server: CreateMcpServerParams) => {
        setName(server.name || '');

        if (server.url) {
            setConnectionType('sse');
            setUrl(server.url);
            setCommand('');
            setArgs([]);
            setEnv({});
        } else {
            setConnectionType('stdio');
            setCommand(server.command);
            setArgs(server.args || []);
            setEnv(server.env || {});
            setUrl('');
        }

        // Also update JSON view
        setJsonText(JSON.stringify(server, null, 2));

        // Ensure we don't clear extracted servers so user can pick another if they want, 
        // strictly updating state.

        // If we want to switch to general tab to review? User didn't specify, but "load" implies filling the JSON.
        // We'll leave them on the current tab (JSON) so they see it filled.
    };

    const createMutation = useMutation({
        mutationFn: async (params: CreateMcpServerParams) => {
            const result = await window.api.mcp.create(params);
            return result;
        },
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['mcp'] });
                onSuccess?.(data.data as McpServer);
                onOpenChange(false);
            }
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (params: UpdateMcpServerParams) => window.api.mcp.update(params),
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['mcp'] });
                onSuccess?.(initialData! /* stale but id matches */);
                onOpenChange(false);
            }
        }
    });

    const handleSubmit = () => {
        if (mode === 'create') {
            createMutation.mutate({
                name,
                command: connectionType === 'stdio' ? command : '',
                args: connectionType === 'stdio' ? args : [],
                env: connectionType === 'stdio' ? env : {},
                url: connectionType === 'sse' ? url : undefined,
                isActive
            });
        } else if (initialData) {
            updateMutation.mutate({
                id: initialData.id,
                name,
                command: connectionType === 'stdio' ? command : '',
                args: connectionType === 'stdio' ? args : [],
                env: connectionType === 'stdio' ? env : {},
                url: connectionType === 'sse' ? url : undefined,
                isActive
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Helper for Args Input
    const handleArgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) {
            setArgs([]);
            return;
        }
        // Split by comma, respect quotes? User said "simple comma separated".
        // Let's just do split(',') for now as per requirement "Single line ... comma-separated".
        setArgs(val.split(',').map(s => s.trim()));
    };

    const argsString = args.join(', ');

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
                                title={isActive ? "Active" : "Archived"}
                            />
                        )}
                        {mode === 'create' ? 'Connect New MCP Server' : 'Edit MCP Server'}
                    </DialogTitle>

                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                    <div className="px-6 border-b">
                        <TabsList className="h-9 w-full justify-start rounded-none bg-transparent p-0">
                            <TabsTrigger
                                value="general"
                                className="relative rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                General
                            </TabsTrigger>
                            <TabsTrigger
                                value="json"
                                className="relative rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                JSON
                            </TabsTrigger>

                        </TabsList>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto bg-zinc-50/5 dark:bg-zinc-900/50">
                        <TabsContent value="general" className="p-6 m-0 space-y-6">
                            {/* General Settings */}
                            <div className="grid gap-4">
                                {/* Preset Selector */}
                                <div className="p-3 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/50 rounded-lg space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                        <Wand2 className="w-3 h-3" />
                                        Quick Setup
                                    </Label>
                                    <Select onValueChange={handlePresetSelect}>
                                        <SelectTrigger className="w-full bg-background/50">
                                            <SelectValue placeholder="Load configuration from preset..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SERENA_PRESETS.map((preset) => (
                                                <SelectItem key={preset.id} value={preset.id} className="py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-medium text-sm">{preset.name}</span>
                                                        <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="type" className="text-xs font-semibold uppercase text-muted-foreground">Connection Type</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={connectionType === 'stdio' ? 'secondary' : 'outline'}
                                            size="sm"
                                            onClick={() => setConnectionType('stdio')}
                                            className="flex-1"
                                        >
                                            Stdio (Command)
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={connectionType === 'sse' ? 'secondary' : 'outline'}
                                            size="sm"
                                            onClick={() => setConnectionType('sse')}
                                            className="flex-1"
                                        >
                                            SSE (URL)
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Display Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. My Brave Search"
                                        className="max-w-md"
                                        autoFocus
                                    />
                                </div>

                                {connectionType === 'stdio' ? (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="command" className="text-xs font-semibold uppercase text-muted-foreground">Command</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="command"
                                                    value={command}
                                                    onChange={(e) => setCommand(e.target.value)}
                                                    placeholder="npx"
                                                    className="font-mono max-w-[120px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="args" className="text-xs font-semibold uppercase text-muted-foreground">Arguments</Label>
                                            <Input
                                                id="args"
                                                value={argsString}
                                                onChange={handleArgsChange}
                                                placeholder="-y, @modelcontextprotocol/server-brave-search"
                                                className="font-mono"
                                            />
                                            <p className="text-[10px] text-muted-foreground">
                                                Comma-separated arguments (e.g. arg1, arg2).
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <KeyValueList
                                                value={env}
                                                onChange={setEnv}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid gap-2">
                                        <Label htmlFor="url" className="text-xs font-semibold uppercase text-muted-foreground">Server URL</Label>
                                        <Input
                                            id="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://mcp.grep.app"
                                            className="font-mono"
                                        />
                                        <p className="text-[10px] text-muted-foreground">
                                            Enter the full URL of the SSE-enabled MCP server.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="json" className="p-6 m-0 flex-1 flex flex-col h-full min-h-0">
                            <div className="flex-1 flex flex-col gap-4 min-h-0">
                                {mode === 'create' && (
                                    <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-md border border-dashed">
                                        <div className="flex items-center gap-2">
                                            <Github className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Import from GitHub</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://github.com/user/repo"
                                                value={githubUrl}
                                                onChange={e => setGithubUrl(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleGithubFetch()}
                                                className="flex-1 h-8 text-sm"
                                            />
                                            <Button onClick={handleGithubFetch} disabled={isFetchingUrl || !githubUrl} size="sm" variant="secondary">
                                                {isFetchingUrl ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Load'}
                                            </Button>
                                        </div>
                                        {fetchError && (
                                            <p className="text-[10px] text-destructive">{fetchError}</p>
                                        )}

                                        {/* Tags for multiple servers */}
                                        {extractedServers.length > 1 && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {extractedServers.map((server, idx) => {
                                                    const isSelected = server.name === name && server.command === command;
                                                    return (
                                                        <Button
                                                            key={idx}
                                                            variant={isSelected ? "default" : "outline"}
                                                            size="sm"
                                                            className="h-6 text-xs gap-1 rounded-full"
                                                            onClick={() => handleSelectExtracted(server)}
                                                            title={server.command + ' ' + (server.args || []).join(' ')}
                                                        >
                                                            {server.name}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col gap-2 min-h-0">
                                    <Label htmlFor="json-config" className="text-xs font-semibold uppercase text-muted-foreground">JSON Configuration</Label>
                                    <textarea
                                        id="json-config"
                                        value={jsonText}
                                        onChange={(e) => handleJsonChange(e.target.value)}
                                        onFocus={() => setIsJsonFocused(true)}
                                        onBlur={() => setIsJsonFocused(false)}
                                        className="flex-1 resize-none w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                        placeholder='{ "name": "...", "command": "..." }'
                                    />
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground">
                                            Paste a full server configuration (JSON) here to import.
                                        </p>
                                        {jsonError && (
                                            <p className="text-[10px] text-destructive">{jsonError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>



                    </div>
                </Tabs>

                <DialogFooter className="p-6 pt-4 border-t bg-background z-10 flex flex-row items-center justify-between sm:justify-between">
                    {mode === 'edit' ? (
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsActive(!isActive)}
                                title={isActive ? "Archive Server" : "Activate Server"}
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
                                            <AlertDialogTitle>Delete Server?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete "{initialData.name}".
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
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || !name || (connectionType === 'stdio' ? !command : !url)}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'create' ? 'Connect Server' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}
