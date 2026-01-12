import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { parseMcpInput, ParseResult } from '../utils/mcp-import';
import { CreateMcpServerParams } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface McpImportDialogProps {
    onCancel: () => void;
    onImport: (servers: CreateMcpServerParams[]) => void;
    isImporting: boolean;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function McpImportDialog({ onCancel, onImport, isImporting, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: McpImportDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Use controlled state if provided, otherwise internal
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

    const [input, setInput] = useState('');
    const [preview, setPreview] = useState<ParseResult | null>(null);

    useEffect(() => {
        if (open) {
            // Reset input on open if needed, or keep?
            // Usually nice to reset. But let's keep simple.
        } else {
            // Reset on close?
            // setInput(''); 
            // setPreview(null);
        }
    }, [open]);

    useEffect(() => {
        if (!input.trim()) {
            const timer = setTimeout(() => {
                setPreview(null);
            }, 0);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            const result = parseMcpInput(input);
            setPreview(result);
        }, 500);

        return () => clearTimeout(timer);
    }, [input]);

    const handleImport = () => {
        if (preview?.success && preview.data) {
            onImport(preview.data);
            setOpen(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
        onCancel();
    }

    const content = (
        <div className="flex flex-col h-[400px] gap-4">
            {/* ... keeping content same ... */}
            <div className="flex-1 min-h-0">
                <textarea
                    placeholder={`Paste JSON here...
Example:
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"]
    }
  }
}`}
                    className="flex h-full w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                />
            </div>

            {preview && (
                <div className="flex-shrink-0">
                    {preview.success && preview.data ? (
                        <div className="rounded-md border bg-muted/20 p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-500 flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    Valid JSON
                                </span>
                                <Badge variant="secondary">{preview.data.length} servers found</Badge>
                            </div>
                            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                                {preview.data.map((server, i) => (
                                    <div key={i} className="text-xs flex items-center justify-between p-1 rounded bg-background/50 border">
                                        <span className="font-medium truncate max-w-[120px]" title={server.name}>{server.name}</span>
                                        <code className="text-[10px] text-muted-foreground truncate max-w-[150px]">{server.command} {server.args.join(' ')}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-destructive/50 px-4 py-3 text-destructive bg-destructive/5">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="h-4 w-4" />
                                <h5 className="font-medium leading-none tracking-tight text-xs">Parse Error</h5>
                            </div>
                            <div className="text-xs [&_p]:leading-relaxed">
                                {preview.error}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end pt-2 border-t flex-shrink-0 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isImporting}
                >
                    Cancel
                </Button>
                <Button
                    data-testid="mcp-import-submit"
                    size="sm"
                    onClick={handleImport}
                    disabled={!preview?.success || isImporting}
                    className="flex-1"
                >
                    {isImporting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                    Import {preview?.success && preview.data ? `(${preview.data.length})` : ''}
                </Button>
            </div>
        </div>
    );

    if (trigger) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Import MCP Servers</DialogTitle>
                        <DialogDescription>
                            Paste your MCP configuration JSON below. Compatible with Claude Desktop config.
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        );
    }

    // If not triggered, render Dialog controlled by open prop? 
    // Or just content? 
    // If controlledOpen is provided, we MUST render the Dialog wrapper even without trigger?
    // Because parent expects a modal.
    // If trigger is NOT provided, but open is managed, we render Dialog without DialogTrigger.

    if (isControlled) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Import MCP Servers</DialogTitle>
                        <DialogDescription>
                            Paste your MCP configuration JSON below. Compatible with Claude Desktop config.
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        );
    }

    return content;
}
