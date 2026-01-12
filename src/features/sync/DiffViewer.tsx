import React from 'react';

interface DiffViewerProps {
    oldContent: string | null;
    newContent: string;
    onConfirm: () => void;
    onCancel: () => void;
    targetPath: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ oldContent, newContent, onConfirm, onCancel, targetPath }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col border border-gray-700 shadow-2xl">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-lg">
                    <h3 className="text-xl font-bold text-white">Sync Preview: {targetPath}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col border-r border-gray-700">
                        <div className="p-2 bg-gray-800 text-xs font-mono text-gray-400 uppercase tracking-wider text-center">Current File</div>
                        <div className="flex-1 overflow-auto p-4 bg-gray-950 font-mono text-sm text-red-300 whitespace-pre-wrap">
                            {oldContent || <span className="text-gray-600 italic">File does not exist (New File)</span>}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="p-2 bg-gray-800 text-xs font-mono text-gray-400 uppercase tracking-wider text-center">Proposed Changes</div>
                        <div className="flex-1 overflow-auto p-4 bg-gray-950 font-mono text-sm text-green-300 whitespace-pre-wrap">
                            {newContent}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700 flex justify-end gap-3 bg-gray-800 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-bold transition-colors shadow-lg shadow-green-900/20"
                    >
                        Confirm & Write
                    </button>
                </div>
            </div>
        </div>
    );
};
