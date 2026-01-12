import React, { useState } from 'react';
import { ToolDetectionResult, Rule, McpSet } from '../../../shared/api';
import { ToolConfigDialog } from './ToolConfigDialog';

export const SyncButton: React.FC = () => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectedTools, setDetectedTools] = useState<ToolDetectionResult[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [rules, setRules] = useState<Rule[]>([]);
    const [mcpSets, setMcpSets] = useState<McpSet[]>([]);

    const handleAutoDetect = async () => {
        setIsDetecting(true);
        try {
            const result = await window.api.toolDetection.detect();
            if (result.success) {
                setDetectedTools(result.data);
            }
        } catch (error) {
            console.error('Detection error:', error);
        } finally {
            setIsDetecting(false);
        }
    };

    const handleOpenSync = async () => {
        setIsLoadingData(true);
        try {
            // Fetch Rules
            const rulesRes = await window.api.rules.list();
            // Fetch Mcp (waiting for backend McpSet support in list? No, check specific API)
            // Existing McpPage uses window.api.mcp.list() but that returns McpServer[].
            // We need McpSet.
            // Wait, does window.api.mcp have support for Sets?
            // The McpRepository supports sets, but McpService/Handler exposes mcpServers directly mostly?
            // Actually, in previous steps, I added McpSet to shared/types. 
            // But does the API expose listSets?
            // Checking SyncService.ts (backend), it uses McpService.getAll().
            // McpService.getAll() returns McpServer[].
            // WE NEED McpSet support in Frontend API if we want to select sets.
            // If the Backend API (McpHandler) doesn't expose Sets, we are blocked on "Select Mcp Set".
            // However, for V1 Tool Integration, maybe we just use "All Active Servers" wrapped in a dummy Set?
            // The ToolIntegrationService expects McpSet content.
            // Let's create a synthetic McpSet from active servers for now.
            const serversRes = await window.api.mcp.list();

            if (rulesRes.success && serversRes.success) {
                setRules(rulesRes.data);
                const activeServers = serversRes.data.filter(s => s.isActive);
                const defaultSet: McpSet = {
                    id: 'active-default',
                    name: 'Active Servers',
                    items: activeServers.map(s => s.id),
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setMcpSets([defaultSet]);
                setIsDialogOpen(true);
            } else {
                console.error('Failed to load data', rulesRes, serversRes);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingData(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex bg-gray-800 rounded p-1 gap-1">
                <button
                    onClick={handleAutoDetect}
                    disabled={isDetecting}
                    className={`px-3 py-1 text-xs rounded hover:bg-gray-700 transition-colors ${isDetecting ? 'opacity-50' : ''}`}
                    title="Detect installed editors"
                >
                    {isDetecting ? 'Detecting...' : 'Auto Detect'}
                </button>
                {detectedTools.length > 0 && (
                    <span className="text-xs text-green-400 self-center px-1">
                        ✓ {detectedTools.map(t => t.name).join(', ')}
                    </span>
                )}
            </div>

            <button
                onClick={handleOpenSync}
                disabled={isLoadingData}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-medium transition-colors"
            >
                {isLoadingData ? 'Loading...' : 'Tool Config'}
            </button>

            <ToolConfigDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                tools={detectedTools.length ? detectedTools : [{ id: 'cursor', name: 'Cursor', isInstalled: true }]}
                rules={rules}
                mcpSets={mcpSets}
            />
        </div>
    );
};
