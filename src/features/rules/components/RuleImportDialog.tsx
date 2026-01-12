
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { parseRuleInput, ParseResult } from '../utils/rule-import';
import { CreateRuleParams } from '@shared/types';
import { Badge } from '@/components/ui/badge';

interface RuleImportDialogProps {
    onCancel: () => void;
    onImport: (rules: CreateRuleParams[]) => void;
    isImporting: boolean;
}

export function RuleImportDialog({ onCancel, onImport, isImporting }: RuleImportDialogProps) {
    const [input, setInput] = useState('');
    const [preview, setPreview] = useState<ParseResult | null>(null);

    useEffect(() => {
        if (!input.trim()) {
            const timer = setTimeout(() => {
                setPreview(null);
            }, 0);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            const result = parseRuleInput(input);
            setPreview(result);
        }, 500);

        return () => clearTimeout(timer);
    }, [input]);

    const handleImport = () => {
        if (preview?.success && preview.data) {
            onImport(preview.data);
        }
    };

    return (
        <div className="p-4 flex flex-col h-full max-h-[500px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="font-semibold flex items-center gap-2">
                    Import Rules JSON
                </h3>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-4">
                <div className="flex-1 min-h-0">
                    <textarea
                        placeholder={`Paste JSON here...
Example:
[
  {
    "name": "My Rule",
    "content": "Rule content..."
  }
]`}
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
                                    <Badge variant="secondary">{preview.data.length} rules found</Badge>
                                </div>
                                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                                    {preview.data.map((rule, i) => (
                                        <div key={i} className="text-xs flex items-center justify-between p-1 rounded bg-background/50 border">
                                            <span className="font-medium truncate max-w-[150px]" title={rule.name}>{rule.name}</span>
                                            <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{rule.content.substring(0, 50)}</span>
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
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                <Button
                    size="sm"
                    onClick={handleImport}
                    disabled={!preview?.success || isImporting}
                >
                    {isImporting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                    Import {preview?.success && preview.data ? `(${preview.data.length})` : ''}
                </Button>
            </div>
        </div>
    );
}
