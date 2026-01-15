import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KeyValueListProps {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
    placeholderKey?: string;
    placeholderValue?: string;
}

/**
 * Robust KeyValueList component for editing environment variables.
 * Uses internal array state to allow stable editing of keys without focus loss.
 */
export function KeyValueList({
    value,
    onChange
}: KeyValueListProps) {
    // Convert object to array of entries for stable editing
    const [items, setItems] = React.useState<Array<{ id: string, key: string, val: string }>>(() =>
        Object.entries(value).map(([k, v]) => ({ id: Math.random().toString(36).substr(2, 9), key: k, val: v }))
    );

    // Sync from props when external value changes
    React.useEffect(() => {
        const currentKeys = items.map(i => i.key).sort().join(',');
        const propsKeys = Object.keys(value).sort().join(',');
        if (currentKeys !== propsKeys) {
            setItems(Object.entries(value).map(([k, v]) => ({
                id: Math.random().toString(36).substr(2, 9), key: k, val: v
            })));
        }
    }, [value]);

    const updateParent = (newItems: typeof items) => {
        const record: Record<string, string> = {};
        newItems.forEach(item => {
            if (item.key.trim()) {
                record[item.key.trim()] = item.val;
            }
        });
        onChange(record);
    };

    const addItem = () => {
        const newItems = [...items, { id: Math.random().toString(36).substr(2, 9), key: "", val: "" }];
        setItems(newItems);
    };

    const updateItem = (id: string, field: 'key' | 'val', newValue: string) => {
        const newItems = items.map(item =>
            item.id === id ? { ...item, [field]: newValue } : item
        );
        setItems(newItems);
        updateParent(newItems);
    };

    const deleteItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        updateParent(newItems);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Environment Variables</label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={addItem}
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Variable
                </Button>
            </div>

            <div className="border rounded-md bg-zinc-950/20">
                <div className="p-2 space-y-2">
                    {items.length === 0 && (
                        <div className="text-center py-2 text-xs text-muted-foreground">
                            No environment variables. Click + to add.
                        </div>
                    )}
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-2 items-center">
                            <Input
                                className="flex-1 h-8 text-xs font-mono"
                                placeholder="KEY"
                                value={item.key}
                                onChange={(e) => updateItem(item.id, 'key', e.target.value)}
                            />
                            <span className="text-zinc-500">=</span>
                            <Input
                                className="flex-[1.5] h-8 text-xs font-mono"
                                placeholder="VALUE"
                                value={item.val}
                                onChange={(e) => updateItem(item.id, 'val', e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                                onClick={() => deleteItem(item.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
