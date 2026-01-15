import { useState, useEffect } from 'react';
import { RuleSet, CreateRuleSetParams } from '@shared/types';
import { TESTID, testId } from '@shared/test-ids';
import { Loader2, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentColumn } from '@/components/layout/ContentColumn';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RuleSetListProps {
    sets: RuleSet[];
    isLoading: boolean;
    selectedSetId: string | null;
    onSelectSet: (id: string) => void;
    onCreateSet: (params: CreateRuleSetParams) => void;
    isCreating: boolean;
}

function SortableRuleSetItem({
    set,
    selectedSetId,
    onSelectSet
}: {
    set: RuleSet;
    selectedSetId: string | null;
    onSelectSet: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: set.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: 'relative' as const,
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                    <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className={cn("touch-none", isDragging && "z-50")}
                    >
                        <Button
                            variant="ghost"
                            data-testid={testId.rulesSetItem(set.id)}
                            onClick={() => onSelectSet(set.id)}
                            className={cn(
                                "w-full justify-start h-auto py-3 px-3 flex-col items-start gap-1 transition-all border border-transparent cursor-grab active:cursor-grabbing",
                                selectedSetId === set.id
                                    ? "bg-zinc-800/80 border-zinc-700/50 text-zinc-100"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                                isDragging && "opacity-50 bg-zinc-800/50 scale-[1.02] shadow-xl ring-1 ring-zinc-700"
                            )}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FolderOpen className={cn("h-3.5 w-3.5 flex-shrink-0", selectedSetId === set.id ? "text-zinc-100" : "text-zinc-500")} />
                                    <div data-testid={`${testId.rulesSetItem(set.id)}-name`} className={cn("text-sm font-medium truncate text-left", selectedSetId === set.id && "text-white", "select-none flex-1")}>{set.name}</div>
                                </div>
                                <Badge
                                    data-testid={`${testId.rulesSetItem(set.id)}-count`}
                                    variant="secondary"
                                    className={cn(
                                        "text-[10px] h-5 px-1.5 font-normal",
                                        selectedSetId === set.id
                                            ? "bg-zinc-700 text-zinc-300"
                                            : "bg-zinc-900 text-zinc-600"
                                    )}
                                >
                                    {set.items.length}
                                </Badge>
                            </div>
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Hold to reorder</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function RuleSetList({
    sets,
    isLoading,
    selectedSetId,
    onSelectSet,
    onCreateSet,
    isCreating
}: RuleSetListProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newSetName, setNewSetName] = useState("");
    // Local state for optimistic ordering if needed, or just rely on parent props.
    // Since backend doesn't persist order yet, we'll keep local state for the UI demo?
    // User requested functionality. If RuleSet[] comes from React Query, we should render 'items' derived from props but sortable?
    // Ideally update 'sets' locally or ask parent to update.
    // For now, let's assume we render props.sets.
    // But SortableContext needs a stable list of IDs.
    // To support reordering WITHOUT backend persistence (yet), we need local state.
    const [orderedSets, setOrderedSets] = useState<RuleSet[]>(sets);

    useEffect(() => {
        setOrderedSets(sets); // Sync with props when loaded
    }, [sets]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setOrderedSets((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            // TODO: Call API to persist new order when backend supports it
            // onReorderSets(newOrderIds);
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateSet({
            name: newSetName,
            items: []
        });
        setIsFormOpen(false);
        setNewSetName("");
    };

    return (
        <ContentColumn
            testId={TESTID.RULES.SET_LIST}
            title={
                <>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 text-left">
                        Rule Sets
                    </h3>
                    <Popover open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <PopoverTrigger asChild>
                            <Button data-testid={TESTID.RULES.SET_NEW_BUTTON} size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-800">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3" align="start" side="bottom" sideOffset={10}>
                            <form onSubmit={handleCreate}>
                                <h4 className="font-medium leading-none mb-2 text-sm">New Rule Set</h4>
                                <Input
                                    data-testid={TESTID.RULES.SET_CREATE_INPUT}
                                    value={newSetName}
                                    onChange={(e) => setNewSetName(e.target.value)}
                                    placeholder="Set Name"
                                    className="h-7 text-sm mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button data-testid={TESTID.RULES.SET_CREATE_SUBMIT} type="submit" size="sm" className="h-7 text-xs" disabled={isCreating || !newSetName.trim()}>
                                        {isCreating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </PopoverContent>
                    </Popover>
                </>
            }
        >
            {isLoading && (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}
            {!isLoading && orderedSets.length === 0 && (
                <div className="text-center p-4 text-xs text-muted-foreground">
                    No sets created yet.
                </div>
            )}
            {!isLoading && orderedSets.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={orderedSets.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {orderedSets.map((set) => (
                            <SortableRuleSetItem
                                key={set.id}
                                set={set}
                                selectedSetId={selectedSetId}
                                onSelectSet={onSelectSet}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </ContentColumn>
    );
}
