

interface JsonEditorProps {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
    label: string;
}

export function JsonEditor({ value, onChange, label }: JsonEditorProps) {
    // Flatten check: ensure shallow object for this version
    const entries = Object.entries(value);

    const updateEntry = (idx: number, key: string, val: string) => {
        const newEntries = [...entries];
        newEntries[idx] = [key, val];
        onChange(Object.fromEntries(newEntries));
    };

    const addEntry = () => {
        onChange({ ...value, '': '' });
    };

    const removeEntry = (idx: number) => {
        const newEntries = entries.filter((_, i) => i !== idx);
        onChange(Object.fromEntries(newEntries));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{label}</label>
                <button
                    type="button"
                    onClick={addEntry}
                    className="text-xs text-blue-400 hover:text-blue-300"
                >
                    + Add Field
                </button>
            </div>
            <div className="space-y-2">
                {entries.map(([k, v], idx) => (
                    <div key={idx} className="flex gap-2">
                        <input
                            value={k}
                            onChange={(e) => updateEntry(idx, e.target.value, v)}
                            placeholder="Key"
                            className="bg-gray-800 border-gray-700 rounded p-1 text-sm flex-1 outline-none focus:border-blue-500"
                        />
                        <input
                            value={v}
                            onChange={(e) => updateEntry(idx, k, e.target.value)}
                            placeholder="Value"
                            className="bg-gray-800 border-gray-700 rounded p-1 text-sm flex-1 outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => removeEntry(idx)}
                            className="text-gray-500 hover:text-red-400 px-1"
                        >
                            ×
                        </button>
                    </div>
                ))}
                {entries.length === 0 && (
                    <div className="text-xs text-gray-500 italic">No environment variables defined.</div>
                )}
            </div>
        </div>
    );
}
