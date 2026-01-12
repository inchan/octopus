
import React, { useState } from 'react';
import { Rule, McpSet, GeneratedFile } from '../../../shared/api';

interface ToolConfigDialogProps {
    isOpen: boolean;
    onClose: () => void;
    tools: { id: string; name: string; isInstalled: boolean }[];
    rules: Rule[];
    mcpSets: McpSet[]; // Passing McpSets to allow selection, though we might just take active.
}

export const ToolConfigDialog: React.FC<ToolConfigDialogProps> = ({ isOpen, onClose, tools, rules, mcpSets }) => {
    const [selectedTool, setSelectedTool] = useState(tools[0]?.id || 'cursor');
    const [scope, setScope] = useState<'Global' | 'Project' | 'ProjectLocal'>('Project');
    const [targetDir, setTargetDir] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState(0);
    const [status, setStatus] = useState<string | null>(null);

    const activeMcpSet = mcpSets[0]; // TODO: Logic to pick active set

    const handleSelectDir = async () => {
        const dir = await window.api.dialog.openDirectory();
        if (dir) setTargetDir(dir);
    };

    const handleGenerate = async () => {
        if (!activeMcpSet) {
            setStatus('No active MCP Set found.');
            return;
        }
        setIsGenerating(true);
        setStatus(null);
        try {
            const result = await window.api.toolIntegration.generateConfig(selectedTool, scope, {
                rules: rules.filter(r => r.isActive),
                mcpSet: activeMcpSet
            });
            if (result.success) {
                setGeneratedFiles(result.data);
                setSelectedFileIndex(0);
                if (result.data.length === 0) {
                    setStatus('No configuration files generated for this scope.');
                }
            } else {
                setStatus('Generation failed: ' + result.error);
            }
        } catch (e) {
            setStatus('Error: ' + String(e));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = async () => {
        if (generatedFiles.length === 0) return;

        let basePath = targetDir;
        if (scope === 'Global') {
            // For global, generateConfig likely returns absolute paths (if starting with ~).
            // But we need to handle ~ expansion? 
            // Or rely on user to copy-paste?
            // Strategy doc says: "User manual copy or known path".
            // If known path, we might try to write.
            // But browser/renderer can't expand ~.
            // Let's assume for Global we just copy to clipboard or show instructions?
            // Or if we return absolute paths, we can try writing if we have permissions.
            // For now, let's just use targetDir if provided, or fail if not absolute.
            // Wait, if Global returns ~/.cursor/..., we can't write to ~ easily from here without expansion.
            // Let's stick to requiring a directory for Project scopes.
        }

        if ((scope === 'Project' || scope === 'ProjectLocal') && !basePath) {
            setStatus('Please select a target directory.');
            return;
        }

        setIsGenerating(true);
        try {
            let appliedCount = 0;
            for (const file of generatedFiles) {
                let fullPath = file.path;
                if (!file.path.startsWith('/') && !file.path.match(/^[a-zA-Z]:/)) {
                    // Relative path
                    if (basePath) {
                        // Simple path join for frontend (might be buggy on Windows vs Mac mixing)
                        // Better to invoke a backend method to join paths?
                        // Or use basic string concat with '/' since MacOS.
                        fullPath = `${basePath}/${file.path}`;
                    }
                }

                // Call Sync API to write
                const res = await window.api.sync.apply(fullPath, file.content);
                if (!res.success) throw new Error(`Failed to write ${file.path}: ${res.error}`);
                appliedCount++;
            }
            setStatus(`Successfully applied ${appliedCount} files!`);
        } catch (e) {
            setStatus('Apply failed: ' + String(e));
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col border border-gray-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-blue-400">⚡</span> Tool Configuration
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar: Controls */}
                    <div className="w-80 bg-gray-900 p-5 border-r border-gray-800 flex flex-col gap-6 overflow-y-auto">
                        {/* Tool Select */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Tool</label>
                            <select
                                value={selectedTool}
                                onChange={e => setSelectedTool(e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {tools.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} {t.isInstalled ? '(Installed)' : ''}</option>
                                ))}
                                <option value="windsurf">Windsurf</option>
                                <option value="cline">Cline</option>
                                <option value="claude">Claude Desktop</option>
                            </select>
                        </div>

                        {/* Scope Select */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration Scope</label>
                            <div className="flex flex-col gap-2">
                                {(['Project', 'ProjectLocal', 'Global'] as const).map(s => (
                                    <label key={s} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${scope === s ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                        <input
                                            type="radio"
                                            name="scope"
                                            value={s}
                                            checked={scope === s}
                                            onChange={() => setScope(s)}
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-200">{s} Scope</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Directory Select */}
                        {(scope === 'Project' || scope === 'ProjectLocal') && (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Directory</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={targetDir || ''}
                                        readOnly
                                        placeholder="Select project root..."
                                        className="flex-1 bg-gray-950 border border-gray-700 rounded text-xs px-3 py-2 text-gray-400 truncate"
                                    />
                                    <button
                                        onClick={handleSelectDir}
                                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded border border-gray-700 text-xs font-medium transition-colors"
                                    >
                                        Browse
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Generate Action */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Configuration'}
                        </button>

                        {/* Status Message */}
                        {status && (
                            <div className={`text-xs p-3 rounded border ${status.includes('fail') || status.includes('Error') ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-green-900/20 border-green-800 text-green-200'}`}>
                                {status}
                            </div>
                        )}
                    </div>

                    {/* Main Area: Preview */}
                    <div className="flex-1 flex flex-col bg-gray-900">
                        {generatedFiles.length > 0 ? (
                            <>
                                {/* File Tabs */}
                                <div className="flex overflow-x-auto border-b border-gray-800 bg-gray-950">
                                    {generatedFiles.map((file, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedFileIndex(idx)}
                                            className={`px-4 py-3 text-xs font-medium border-r border-gray-800 flex items-center gap-2 transition-colors ${selectedFileIndex === idx ? 'bg-gray-900 text-blue-400 border-b-2 border-b-blue-500' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                                        >
                                            <span className="truncate max-w-[150px]">{file.path}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* File Content */}
                                <div className="flex-1 overflow-auto p-0 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(generatedFiles[selectedFileIndex].content)}
                                            className="bg-gray-800 text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-gray-700 shadow-sm"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <pre className="p-4 text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {generatedFiles[selectedFileIndex].content}
                                    </pre>
                                </div>

                                {/* Footer Action */}
                                <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900">
                                    <button
                                        onClick={handleApply}
                                        disabled={isGenerating || (!targetDir && scope !== 'Global')}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 disabled:grayscale"
                                    >
                                        Apply Config to Disk
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4">
                                <div className="text-6xl opacity-20">⚙️</div>
                                <div className="text-sm">Select options and click Generate to preview</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
