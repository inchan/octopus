import { useState } from 'react';
import { Rule, RuleSet } from '@shared/types';
import { Trash2, FileText, Package, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentColumn } from '@/components/layout/ContentColumn';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface RuleSetDetailProps {
    set: RuleSet | undefined;
    rules: Rule[];
    onRemoveRule: (ruleId: string) => void;
    onDeleteSet: () => void;
    onReorderRules: (newOrder: string[]) => void;
    onRenameSet: (newName: string) => void;
    onEditRule: (rule: Rule) => void;
}

function SortableRuleItem({ rule, onRemove, onEdit }: { rule: Rule; onRemove: () => void; onEdit: () => void }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
                className="flex flex-col w-full border border-transparent hover:border-zinc-800/50 rounded-md transition-colors overflow-hidden cursor-pointer"
                onClick={onEdit}
            >
                <div
                    className={cn(
                        "w-full justify-start h-auto py-2 px-2 flex items-center gap-2 transition-all",
                        "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                        isDragging && "opacity-50 bg-zinc-800/50 scale-[1.02] shadow-xl ring-1 ring-zinc-700",
                        isPreviewOpen && "bg-zinc-800/30"
                    )}
                    data-testid={`rules-set-rule-item-${rule.id}`}
                >
                    {/* Center Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center select-none">
                        <div className="flex items-center gap-2 min-w-0">
                            {/* Status Dot */}
                            {rule.isActive ? (
                                <div
                                    className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"
                                    title="Active"
                                    data-testid={`rules-set-rule-item-${rule.id}-status-active`}
                                />
                            ) : (
                                <div
                                    className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0 border border-zinc-500"
                                    title="Inactive"
                                    data-testid={`rules-set-rule-item-${rule.id}-status-inactive`}
                                />
                            )}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="text-sm font-medium truncate flex-1 cursor-help text-zinc-300"
                                            data-testid={`rules-set-rule-item-${rule.id}-name`}
                                        >
                                            {rule.name}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {rule.name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className={cn(
                                "h-6 w-6 text-zinc-600 hover:text-zinc-200 opacity-0 group-hover/item:opacity-100 transition-opacity",
                                isPreviewOpen && "opacity-100 text-zinc-200"
                            )}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPreviewOpen(!isPreviewOpen);
                            }}
                            title={isPreviewOpen ? "Close Preview" : "Preview Content"}
                        >
                            {isPreviewOpen ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>

                        <Button
                            data-testid={`rules-set-rule-remove-${rule.id}`}
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-zinc-600 hover:text-zinc-200 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            title="Remove from Set"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Preview Content Area */}
                {isPreviewOpen && (
                    <div className="px-3 py-2 pb-3 bg-zinc-900/50 border-t border-zinc-800/50">
                        <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                            {rule.content}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export function RuleSetDetail({ set, rules, onRemoveRule, onDeleteSet, onReorderRules, onRenameSet, onEditRule }: RuleSetDetailProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState("");

    const [localRules, setLocalRules] = useState<Rule[]>(rules);
    const [prevRules, setPrevRules] = useState<Rule[]>(rules);

    if (rules !== prevRules) {
        setLocalRules(rules);
        setPrevRules(rules);
    }

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
                const reorderedItems = arrayMove(items, oldIndex, newIndex);

                // Call parent callback with new order
                onReorderRules(reorderedItems.map(r => r.id));

                return reorderedItems;
            });
        }
    }

    if (!set) {
        return (
            <div data-testid="rules-set-detail" className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-6">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-xs text-muted-foreground">Select a rule set to view details</p>
                </div>
            </div>
        );
    }

    const handleTitleClick = () => {
        setTitleValue(set.name);
        setIsEditingTitle(true);
    };

    const handleTitleSubmit = () => {
        if (titleValue.trim() && titleValue !== set.name) {
            onRenameSet(titleValue.trim());
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleTitleSubmit();
        if (e.key === 'Escape') setIsEditingTitle(false);
    };

    return (
        <ContentColumn
            testId="rules-set-detail"
            title={
                <div className="flex items-center justify-between w-full h-7">
                    <div className="flex-1 min-w-0">
                        {isEditingTitle ? (
                            <Input
                                autoFocus
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={handleTitleSubmit}
                                onKeyDown={handleTitleKeyDown}
                                className="h-6 text-xs font-semibold uppercase tracking-wider bg-transparent border-b border-zinc-700/50 rounded-none px-0 focus-visible:ring-0"
                            />
                        ) : (
                            <div
                                onClick={handleTitleClick}
                                className="flex items-center gap-2 cursor-pointer group"
                                title="Click to edit name"
                            >
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate px-2" data-testid="rules-set-detail-title">
                                    {set.name}
                                </h3>
                                <FileText className="h-3 w-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    data-testid="rules-set-detail-delete"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-zinc-600 hover:text-destructive"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Rule Set?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the rule set "{set.name}" and remove all rule associations. The rules themselves will not be deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        data-testid="alert-dialog-confirm-button"
                                        onClick={onDeleteSet}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            }
        >
            <div className="group/list">
                {rules.length === 0 ? (
                    <div className="text-center p-4 text-xs text-muted-foreground">
                        No rules in this set.
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localRules.map(r => r.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {localRules.map((rule) => (
                                <SortableRuleItem
                                    key={rule.id}
                                    rule={rule}
                                    onRemove={() => onRemoveRule(rule.id)}
                                    onEdit={() => onEditRule(rule)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </ContentColumn>
    );
}
