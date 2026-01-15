import { useState, useEffect } from 'react';
import { Rule, RuleSet } from '@shared/types';
import { TESTID, testId } from '@shared/test-ids';
import { Search, Plus, Loader2, Filter, MoreHorizontal, Edit2, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentColumn } from '@/components/layout/ContentColumn';
import { cn } from '@/lib/utils';

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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface RulePoolProps {
    rules: Rule[];
    isLoading: boolean;
    selectedSet: RuleSet | undefined;
    onAddRuleToSet: (ruleId: string) => void;
    onCreateRule: () => void;
    onEditRule: (rule: Rule) => void;
    onDeleteRule: (id: string) => void;
    onImportRules?: () => void;
}

function SortableRulePoolItem({
    rule,
    isInSelectedSet,
    selectedSet,
    onAddRuleToSet,
    onEditRule,
    onDeleteRule,
}: {
    rule: Rule;
    isInSelectedSet: boolean;
    selectedSet: RuleSet | undefined;
    onAddRuleToSet: (id: string) => void;
    onEditRule: (rule: Rule) => void;
    onDeleteRule: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: rule.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 0,
        position: 'relative' as const,
        touchAction: 'none' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "w-full group/item relative",
                isDragging && "z-50"
            )}
            {...attributes}
            {...listeners}
        >
            <div
                className={cn(
                    "w-full justify-start h-auto py-2 px-2 flex items-center gap-2 transition-all border border-transparent rounded-md cursor-grab active:cursor-grabbing",
                    "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                    isDragging && "opacity-50 bg-zinc-800/50 scale-[1.02] shadow-xl ring-1 ring-zinc-700"
                )}
                data-testid={testId.rulesPoolItem(rule.id)}
                onClick={() => onEditRule(rule)}
            >
                {/* Left: Add Action */}
                {selectedSet && !isInSelectedSet && (
                    <div className="flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-sm"
                            data-testid={`rules-pool-add-to-set-${rule.id}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddRuleToSet(rule.id);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Center: Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center select-none">
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Status Dot */}
                        {rule.isActive ? (
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"
                                title="Active"
                                data-testid={testId.rulesPoolItemStatusActive(rule.id)}
                            />
                        ) : (
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0 border border-zinc-500"
                                title="Inactive"
                                data-testid={testId.rulesPoolItemStatusInactive(rule.id)}
                            />
                        )}
                        <div data-testid={`${testId.rulesPoolItem(rule.id)}-name`} className="text-sm font-medium truncate text-zinc-300">
                            {rule.name}
                        </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate pl-3.5 opacity-70">
                        {new Date(rule.updatedAt).toLocaleDateString()}
                    </div>
                </div>

                {/* Right: Actions Menu */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-zinc-500 hover:text-zinc-200"
                                onClick={(e) => e.stopPropagation()}
                                data-testid={testId.rulesPoolItemMore(rule.id)}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1" align="end">
                            <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 justify-start px-2 text-xs font-normal relative"
                                    onClick={() => onEditRule(rule)}
                                    data-testid={testId.rulesPoolItemEdit(rule.id)}
                                >
                                    <Edit2 className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                                    Edit
                                </Button>
                                <div className="h-px bg-border my-0.5" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 justify-start px-2 text-xs font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => onDeleteRule(rule.id)}
                                    data-testid={testId.rulesPoolItemDelete(rule.id)}
                                >
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                    Delete
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}

export function RulePool({
    rules,
    isLoading,
    selectedSet,
    onAddRuleToSet,
    onCreateRule,
    onEditRule,
    onDeleteRule,
    onImportRules,
}: RulePoolProps) {
    const [search, setSearch] = useState('');
    const [localRules, setLocalRules] = useState<Rule[]>(rules);

    useEffect(() => {
        setLocalRules(rules);
    }, [rules]);

    const filteredRules = localRules.filter(r => {
        // 이미 선택된 셋에 포함된 룰은 제외
        if (selectedSet?.items.includes(r.id)) return false;

        return r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.content.toLowerCase().includes(search.toLowerCase());
    });

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

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setLocalRules((items) => {
                const oldIndex = items.findIndex((r) => r.id === active.id);
                const newIndex = items.findIndex((r) => r.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <ContentColumn
            testId={TESTID.RULES.POOL}
            title={
                <div className="flex items-center justify-between w-full h-7">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Rule Pool <span data-testid={TESTID.RULES.POOL_COUNT} className="ml-1 opacity-70">({filteredRules.length})</span>
                    </h3>

                    <div className="flex items-center gap-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-800">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-2" align="end" side="bottom">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        autoFocus
                                        placeholder="Search rules..."
                                        className="pl-8 h-8 text-sm bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        data-testid={TESTID.RULES.POOL_IMPORT_BUTTON}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0 hover:bg-zinc-800"
                                        onClick={onImportRules}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Import Rules</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        data-testid={TESTID.RULES.POOL_NEW_BUTTON}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0 hover:bg-zinc-800"
                                        onClick={onCreateRule}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>New Rule</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            }
        >
            {isLoading && (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}
            {!isLoading && filteredRules.length === 0 && (
                <div className="text-center p-4 text-xs text-muted-foreground">
                    No rules found.
                </div>
            )}
            {!isLoading && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredRules.map(r => r.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {filteredRules.map((rule) => (
                            <SortableRulePoolItem
                                key={rule.id}
                                rule={rule}
                                isInSelectedSet={selectedSet?.items.includes(rule.id) || false}
                                selectedSet={selectedSet}
                                onAddRuleToSet={onAddRuleToSet}
                                onEditRule={onEditRule}
                                onDeleteRule={onDeleteRule}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </ContentColumn>
    );
}
