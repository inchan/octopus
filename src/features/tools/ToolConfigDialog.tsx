import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Server, FolderOpen, Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RuleSet, McpSet } from '../../../shared/api';

interface ToolConfigDialogProps {
    isOpen: boolean;
    onClose: () => void;
    toolId: string;
    toolName: string;
    contextType?: 'global' | 'project';
    contextId?: string;
}

interface ToolPaths {
    rulesPath: string | null;
    mcpPath: string | null;
}

// 도구별 전역 설정 경로 매핑
const getToolGlobalPaths = (toolId: string): ToolPaths => {
    const id = toolId.toLowerCase();

    // CLI Tools
    if (id === 'claude-code' || id.includes('claude-code')) {
        return {
            rulesPath: '~/.claude/CLAUDE.md',
            mcpPath: '~/.claude.json'
        };
    }
    if (id === 'codex-cli' || id.includes('codex')) {
        return {
            rulesPath: '~/.codex/instructions.md',
            mcpPath: null
        };
    }
    if (id === 'gemini-cli' || id.includes('gemini')) {
        return {
            rulesPath: 'GEMINI.md',
            mcpPath: null
        };
    }
    if (id === 'qwen-code' || id.includes('qwen')) {
        return {
            rulesPath: null,
            mcpPath: null
        };
    }

    // IDE Tools
    if (id === 'cursor' || id.includes('cursor')) {
        return {
            rulesPath: 'Cursor Settings > General > Rules for AI',
            mcpPath: '~/.cursor/mcp.json'
        };
    }
    if (id === 'vscode' || id.includes('cline')) {
        return {
            rulesPath: 'VS Code Extension Settings',
            mcpPath: '~/.vscode/cline_mcp_settings.json'
        };
    }
    if (id === 'windsurf' || id.includes('windsurf')) {
        return {
            rulesPath: '~/.codeium/windsurf/memories/global_rules.md',
            mcpPath: '~/.codeium/windsurf/mcp_config.json'
        };
    }
    if (id === 'antigravity' || id.includes('antigravity')) {
        return {
            rulesPath: null,
            mcpPath: null
        };
    }

    // Desktop Apps
    if (id === 'claude-desktop' || id.includes('claude')) {
        return {
            rulesPath: null,
            mcpPath: '~/Library/Application Support/Claude/claude_desktop_config.json'
        };
    }

    return { rulesPath: null, mcpPath: null };
};

export function ToolConfigDialog({
    isOpen,
    onClose,
    toolId,
    toolName,
    contextType = 'global',
    contextId = 'global'
}: ToolConfigDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState<'rules' | 'mcp' | null>(null);

    const [ruleSets, setRuleSets] = useState<RuleSet[]>([]);
    const [mcpSets, setMcpSets] = useState<McpSet[]>([]);

    const [selectedRuleSet, setSelectedRuleSet] = useState<string>('none');
    const [selectedMcpSet, setSelectedMcpSet] = useState<string>('none');

    // 도구별 경로 가져오기
    const toolPaths = getToolGlobalPaths(toolId);

    useEffect(() => {
        if (isOpen && toolId) {
            loadData();
        }
    }, [isOpen, toolId, contextType, contextId]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Load available sets with logging
            const api = window.api as any;
            const [rulesRes, mcpRes] = await Promise.all([
                api.sets.rules.list(),
                api.sets.mcp.list()
            ]);

            console.log('[ToolConfigDialog] Available Rule Sets:', rulesRes);
            console.log('[ToolConfigDialog] Available MCP Sets:', mcpRes);

            // Ensure we have arrays
            let availableRuleSets: RuleSet[] = rulesRes.success ? (rulesRes.data || []) : [];
            let availableMcpSets: McpSet[] = mcpRes.success ? (mcpRes.data || []) : [];

            // Load current config
            console.log(`[ToolConfigDialog] Loading config for tool: ${toolId} (context: ${contextId})`);
            const configRes = await api.toolConfig.get(toolId, contextId);
            console.log('[ToolConfigDialog] Config Response:', configRes);

            if (configRes && configRes.success && configRes.data) {
                const config = configRes.data;
                console.log('[ToolConfigDialog] Current Config:', config);

                // Only set if value exists, otherwise default to 'none'
                const ruleSetId = config.ruleSetId || 'none';
                const mcpSetId = config.mcpSetId || 'none';

                // Check for orphan Rule Set
                const ruleSetExists = ruleSetId === 'none' || availableRuleSets.some((r) => r.id === ruleSetId);
                if (!ruleSetExists && ruleSetId !== 'none') {
                    console.warn(`[ToolConfigDialog] Configured Rule Set ID "${ruleSetId}" not found in available sets! Adding placeholder.`);
                    // Create a fake RuleSet entry for display
                    const placeholderRuleSet: RuleSet = {
                        id: ruleSetId,
                        name: `(Missing) ID: ${ruleSetId.substring(0, 8)}...`,
                        items: [],
                        createdAt: '',
                        updatedAt: ''
                    };
                    availableRuleSets = [...availableRuleSets, placeholderRuleSet];
                }

                // Check for orphan MCP Set
                const mcpSetExists = mcpSetId === 'none' || availableMcpSets.some((m) => m.id === mcpSetId);
                if (!mcpSetExists && mcpSetId !== 'none') {
                    console.warn(`[ToolConfigDialog] Configured MCP Set ID "${mcpSetId}" not found in available sets! Adding placeholder.`);
                    // Create a fake McpSet entry for display
                    const placeholderMcpSet: McpSet = {
                        id: mcpSetId,
                        name: `(Missing) ID: ${mcpSetId.substring(0, 8)}...`,
                        items: [],
                        isArchived: false,
                        createdAt: '',
                        updatedAt: ''
                    };
                    availableMcpSets = [...availableMcpSets, placeholderMcpSet];
                }

                setRuleSets(availableRuleSets);
                setMcpSets(availableMcpSets);
                setSelectedRuleSet(ruleSetId);
                setSelectedMcpSet(mcpSetId);
            } else {
                console.log('[ToolConfigDialog] No existing config found, defaulting to none.');
                setRuleSets(availableRuleSets);
                setMcpSets(availableMcpSets);
                setSelectedRuleSet('none');
                setSelectedMcpSet('none');

                // 자동 Import: 사용 가능한 룰셋이 없으면 CLAUDE.md에서 import 시도
                if (availableRuleSets.length === 0) {
                    console.log('[ToolConfigDialog] No rule sets available, triggering auto-import...');
                    setTimeout(() => handleImport(true), 500);
                }
            }
        } catch (error) {
            console.error('Failed to load tool config:', error);
        } finally {
            setIsLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const params = {
                toolId,
                contextType,
                contextId,
                ruleSetId: selectedRuleSet === 'none' ? undefined : selectedRuleSet,
                mcpSetId: selectedMcpSet === 'none' ? undefined : selectedMcpSet
            };

            const api = window.api as any;
            await api.toolConfig.set(params);
            onClose();
        } catch (error) {
            console.error('Failed to save tool config:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImport = async (skipConfirm = false) => {
        if (!skipConfirm && !confirm('Import rules from ~/.claude/CLAUDE.md? This will create a new Rule Set.')) return;

        setIsLoading(true);
        try {
            const api = window.api as any;
            const res = await api.sync.import('~/.claude/CLAUDE.md');

            if (res.success) {
                // Refresh data to show the new set
                await loadData();
                // Select the new rule set
                if (res.data.ruleSetId) {
                    setSelectedRuleSet(res.data.ruleSetId);
                }
                if (!skipConfirm) {
                    alert(`Imported ${res.data.ruleCount} rules successfully.`);
                }
            } else {
                if (!skipConfirm) {
                    alert('Import failed: ' + res.error);
                }
                console.error('Import failed:', res.error);
            }
        } catch (e) {
            console.error(e);
            if (!skipConfirm) {
                alert('Import failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const selectedRuleSetData = ruleSets.find(r => r.id === selectedRuleSet);
    const selectedMcpSetData = mcpSets.find(m => m.id === selectedMcpSet);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto bg-[#1E1E1E] text-white border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        Configure {toolName}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-5 py-4">
                        {/* Rule Set Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4 text-blue-400" />
                                    Rule Set
                                </Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleImport()}
                                    className="h-6 text-[10px] text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                >
                                    Import from CLAUDE.md
                                </Button>
                            </div>
                            <Select value={selectedRuleSet} onValueChange={setSelectedRuleSet}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select a rule set" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1E1E1E] border-white/10 text-white">
                                    <SelectItem value="none">None</SelectItem>
                                    {ruleSets.map(set => (
                                        <SelectItem key={set.id} value={set.id}>
                                            {set.name}
                                            <span className="ml-2 text-zinc-500 text-xs">
                                                ({set.items.length} rules)
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Rules Global Path */}
                            {toolPaths.rulesPath && (
                                <div className="flex items-center justify-between bg-black/30 rounded-md px-3 py-2 border border-white/5">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FolderOpen className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                        <code className="text-[11px] font-mono text-zinc-400 truncate">{toolPaths.rulesPath}</code>
                                    </div>
                                    {toolPaths.rulesPath.startsWith('~') && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-zinc-500 hover:text-white"
                                                        onClick={async () => {
                                                            await navigator.clipboard.writeText(toolPaths.rulesPath!);
                                                            setCopied('rules');
                                                            setTimeout(() => setCopied(null), 2000);
                                                        }}
                                                    >
                                                        {copied === 'rules' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>Copy path</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MCP Set Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Server className="h-4 w-4 text-purple-400" />
                                    MCP Set
                                </Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        // TODO: Implement MCP import from config file
                                        alert('MCP import from config files is not yet implemented.');
                                    }}
                                    className="h-6 text-[10px] text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                                >
                                    Import from mcp.json
                                </Button>
                            </div>
                            <Select value={selectedMcpSet} onValueChange={setSelectedMcpSet}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select an MCP set" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1E1E1E] border-white/10 text-white">
                                    <SelectItem value="none">None</SelectItem>
                                    {mcpSets.map(set => (
                                        <SelectItem key={set.id} value={set.id}>
                                            {set.name}
                                            <span className="ml-2 text-zinc-500 text-xs">
                                                ({set.items.length} servers)
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* MCP Global Path */}
                            {toolPaths.mcpPath && (
                                <div className="flex items-center justify-between bg-black/30 rounded-md px-3 py-2 border border-white/5">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FolderOpen className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                        <code className="text-[11px] font-mono text-zinc-400 truncate">{toolPaths.mcpPath}</code>
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-zinc-500 hover:text-white"
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(toolPaths.mcpPath!);
                                                        setCopied('mcp');
                                                        setTimeout(() => setCopied(null), 2000);
                                                    }}
                                                >
                                                    {copied === 'mcp' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="left">
                                                <p>Copy path</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            )}
                        </div>

                        {/* Summary Info */}
                        {(selectedRuleSet !== 'none' || selectedMcpSet !== 'none') && (
                            <div className="bg-primary/5 border border-primary/10 rounded-md p-3 space-y-1.5">
                                <p className="text-xs text-primary/80 font-medium">Configuration Summary</p>
                                {selectedRuleSetData && (
                                    <p className="text-[11px] text-zinc-400">
                                        <span className="text-zinc-500">Rules:</span> {selectedRuleSetData.name} ({selectedRuleSetData.items.length} items)
                                    </p>
                                )}
                                {selectedMcpSetData && (
                                    <p className="text-[11px] text-zinc-400">
                                        <span className="text-zinc-500">MCP:</span> {selectedMcpSetData.name} ({selectedMcpSetData.items.length} servers)
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving} className="border-white/10 hover:bg-white/5 hover:text-white">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

