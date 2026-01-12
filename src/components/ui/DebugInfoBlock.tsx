import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, Terminal } from 'lucide-react';
import { Button } from './button';

interface DebugInfoBlockProps {
    info?: unknown;
    error?: string;
    className?: string;
    title?: string;
}

export const DebugInfoBlock: React.FC<DebugInfoBlockProps> = ({
    info,
    error,
    className = '',
    title = 'Debug Information'
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Only render if there is info or an error
    if (!info && !error) return null;

    return (
        <div className={`border border-destructive/30 bg-destructive/5 rounded-lg overflow-hidden ${className}`}>
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-destructive/10 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span>{title} {error ? '(Error Detected)' : ''}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
            </div>

            {isExpanded && (
                <div className="p-4 border-t border-destructive/20 bg-zinc-950/50">
                    {error && (
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-destructive mb-1 uppercase tracking-wider">Error Message</h4>
                            <div className="p-2 bg-red-950/30 text-red-200 text-xs rounded border border-red-900/50 font-mono break-all">
                                {error}
                            </div>
                        </div>
                    )}

                    {info !== undefined && info !== null && (
                        <div>
                            <h4 className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                Context Data
                            </h4>
                            <pre className="p-2 bg-zinc-900 text-zinc-400 text-xs rounded border border-zinc-800 font-mono overflow-auto max-h-[300px] whitespace-pre-wrap break-all">
                                {typeof info === 'string' ? info : JSON.stringify(info, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
