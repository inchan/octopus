import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HistoryEntry } from '../../../shared/api';


export function HistoryPage() {
    const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

    const { data: history, isLoading, error } = useQuery({
        queryKey: ['history'],
        queryFn: async () => {
            const result = await window.api.history.list();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });

    const handleRevert = async (id: string) => {
        if (!confirm('Are you sure you want to revert to this state?')) return;

        // TODO: Implement revert logic in next step
        const result = await window.api.history.revert(id);
        if (!result.success) {
            alert(`Failed to revert: ${result.error}`);
        } else {
            alert('Reverted successfully');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-400">Loading history...</div>;
    if (error) return <div className="p-8 text-center text-red-400">Error loading history: {String(error)}</div>;

    return (
        <div className="flex h-full" data-testid="history-page">
            {/* History List */}
            <div className="w-1/3 border-r border-gray-800 bg-gray-900/50 overflow-y-auto" data-testid="history-list">
                <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
                    <h2 className="font-semibold text-lg text-white">Change History</h2>
                </div>
                <div className="divide-y divide-gray-800">
                    {history?.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => setSelectedEntry(entry)}
                            data-testid={`history-item-${entry.id}`}
                            className={`p-4 cursor-pointer transition-colors hover:bg-gray-800 ${selectedEntry?.id === entry.id ? 'bg-gray-800 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${entry.action === 'create' ? 'bg-green-900/50 text-green-400' :
                                    entry.action === 'update' ? 'bg-blue-900/50 text-blue-400' :
                                        'bg-red-900/50 text-red-400'
                                    }`}>
                                    {entry.action.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(entry.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="font-medium text-gray-200 truncate">
                                {entry.entityType}: {entry.entityId}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-mono truncate">
                                ID: {entry.id.substring(0, 8)}
                            </div>
                        </div>
                    ))}
                    {history?.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No history found</div>
                    )}
                </div>
            </div>

            {/* Detail View */}
            <div className="flex-1 overflow-y-auto bg-gray-950 p-6" data-testid="history-detail">
                {selectedEntry ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">History Detail</h3>
                                <div className="text-sm text-gray-400">
                                    Transaction ID: <span className="font-mono text-gray-300">{selectedEntry.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRevert(selectedEntry.id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-lg transition-colors flex items-center gap-2"
                                title="Not implemented yet"
                                data-testid="history-revert-button"
                            >
                                <span>Revert to this state</span>
                            </button>
                        </div>

                        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                            <div className="p-3 bg-gray-800 border-b border-gray-700 font-mono text-sm text-gray-300">
                                Snapshot Data
                            </div>
                            <pre className="p-4 text-sm text-gray-300 overflow-auto font-mono max-h-[500px]">
                                {JSON.stringify(selectedEntry.data, null, 2)}
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Select a history entry to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
