import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StringListProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
    addButtonLabel?: string;
}

interface SortableItemProps {
    id: string;
    value: string;
    onChange: (val: string) => void;
    onDelete: () => void;
    placeholder?: string;
}

function SortableItem({ id, value, onChange, onDelete, placeholder }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex gap-2 items-center group ${isDragging ? 'opacity-50' : ''}`}>
            <div
                {...attributes}
                {...listeners}
                className="cursor-move text-zinc-600 hover:text-zinc-400"
            >
                <GripVertical className="h-4 w-4" />
            </div>
            <Input
                className="flex-1 h-8 text-xs font-mono"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity"
                onClick={onDelete}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function StringList({
    value = [],
    onChange,
    placeholder = "Argument",
    label = "Arguments",
    addButtonLabel = "Add Argument"
}: StringListProps) {
    // We need stable IDs for DnD
    const [items, setItems] = React.useState<Array<{ id: string, val: string }>>(() =>
        (value || []).map((v) => ({ id: Math.random().toString(36).substr(2, 9), val: v }))
    );

    // Sync if props change drastically (e.g. reset form)
    React.useEffect(() => {
        // If external value length differs or content differs significantly, reset.
        // This is a naive check to support form resets.
        const currentVals = items.map(i => i.val);
        if (JSON.stringify(currentVals) !== JSON.stringify(value)) {
            // careful: this might cause loops if onChange triggers parent re-render which triggers this.
            // Only do this if we suspect a reset (value is probably empty or different ref).
            // For now, let's omit this auto-sync and rely on initial state, unless we really need it.
        }
    }, [value]);

    const updateParent = (newItems: typeof items) => {
        onChange(newItems.map(i => i.val));
    };

    const handleAdd = () => {
        const newItems = [...items, { id: Math.random().toString(36).substr(2, 9), val: "" }];
        setItems(newItems);
        updateParent(newItems);
    };

    const handleChange = (id: string, newVal: string) => {
        const newItems = items.map(i => i.id === id ? { ...i, val: newVal } : i);
        setItems(newItems);
        updateParent(newItems);
    };

    const handleDelete = (id: string) => {
        const newItems = items.filter(i => i.id !== id);
        setItems(newItems);
        updateParent(newItems);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);

                // Manual array move
                const newItems = [...items];
                const [moved] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, moved);

                updateParent(newItems);
                return newItems;
            });
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleAdd}
                >
                    <Plus className="h-3 w-3 mr-1" />
                    {addButtonLabel}
                </Button>
            </div>

            <div className="border rounded-md bg-zinc-950/20">
                <ScrollArea className="h-[200px]">
                    <div className="p-2 space-y-2">
                        {items.length === 0 && (
                            <div className="text-center py-8 text-xs text-muted-foreground">
                                No arguments configured.
                            </div>
                        )}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((item) => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        value={item.val}
                                        onChange={(val) => handleChange(item.id, val)}
                                        onDelete={() => handleDelete(item.id)}
                                        placeholder={placeholder}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
