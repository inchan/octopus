import { useState } from 'react';
import { Rule } from '@shared/types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import { RuleSetList } from './components/RuleSetList';
import { RuleSetDetail } from './components/RuleSetDetail';
import { RulePool } from './components/RulePool';
import { useRules, useRuleSelection } from './useRules';
import { RuleDialog } from './components/RuleDialog';
import { RuleImportDialog } from './components/RuleImportDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function RulesPage() {
    const {
        sets,
        rules,
        setsLoading,
        rulesLoading,
        createSet,
        updateSet,
        deleteSet,
        createRule,
        createRuleAsync,
        updateRule,
        deleteRule,
        isCreatingSet,
        isCreatingRule,
        isUpdatingRule
    } = useRules();

    const { selectedSetId, setSelectedSetId, handleSelectSet } = useRuleSelection(sets, setsLoading, rulesLoading);

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);

    const selectedSet = sets.find(s => s.id === selectedSetId);
    const selectedSetRules = selectedSet
        ? rules.filter(r => selectedSet.items.includes(r.id))
        : [];

    // Add/Remove rule from set
    const addRuleToSet = (ruleId: string) => {
        if (!selectedSet) return;
        if (selectedSet.items.includes(ruleId)) return;

        const newItems = [...selectedSet.items, ruleId];
        updateSet({ id: selectedSet.id, items: newItems });
    };

    const removeRuleFromSet = (ruleId: string) => {
        if (!selectedSet) return;
        const newItems = selectedSet.items.filter(id => id !== ruleId);
        updateSet({ id: selectedSet.id, items: newItems });
    };

    const handleCreateSet = (params: any) => {
        createSet(params, {
            onSuccess: (data) => {
                if (data?.success && data.data) {
                    const newId = data.data.id;
                    setSelectedSetId(newId);
                    localStorage.setItem('rules-last-selected-id', newId);
                }
            }
        });
    }

    const handleDeleteSet = () => {
        if (selectedSet) {
            deleteSet(selectedSet.id, {
                onSuccess: () => {
                    setSelectedSetId(null);
                    localStorage.removeItem('rules-last-selected-id');
                }
            });
        }
    }

    const handleImportRules = async (newRules: any[]) => {
        await Promise.all(newRules.map(rule => createRuleAsync(rule)));
    }

    const openCreateDialog = () => {
        setDialogMode('create');
        setEditingRule(undefined);
        setDialogOpen(true);
    };

    const openEditDialog = (rule: Rule) => {
        setDialogMode('edit');
        setEditingRule(rule);
        setDialogOpen(true);
    };

    return (
        <div data-testid="rules-page" className="h-[calc(100vh-80px)] flex flex-col overflow-hidden p-6">
            {/* Header */}
            <div className="flex-shrink-0 mb-4">
                <h1 className="text-xl font-bold tracking-tight">Rules</h1>
                <p className="text-sm text-muted-foreground mt-1">3-Pane 관리: Set → Set 내 규칙 → 전체 규칙 풀</p>
            </div>

            {/* 3-Pane Layout */}
            <div className="flex-1 min-h-0 border rounded-lg bg-zinc-950/20 overflow-hidden max-w-full">
                <ResizablePanelGroup direction="horizontal">
                    {/* Pane 1: Set List */}
                    <ResizablePanel defaultSize={25} minSize={20} className="min-w-0" style={{ overflow: 'hidden' }}>
                        <RuleSetList
                            sets={sets}
                            isLoading={setsLoading}
                            selectedSetId={selectedSetId}
                            onSelectSet={handleSelectSet}
                            onCreateSet={handleCreateSet}
                            isCreating={isCreatingSet}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Pane 2: Selected Set Detail */}
                    <ResizablePanel defaultSize={35} minSize={25} className="min-w-0" style={{ overflow: 'hidden' }}>
                        <RuleSetDetail
                            set={selectedSet}
                            rules={selectedSetRules}
                            onRemoveRule={removeRuleFromSet}
                            onDeleteSet={handleDeleteSet}
                            onReorderRules={(newOrder) => selectedSet && updateSet({ id: selectedSet.id, items: newOrder })}
                            onRenameSet={(newName) => selectedSet && updateSet({ id: selectedSet.id, name: newName })}
                            onEditRule={openEditDialog}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Pane 3: Rule Pool */}
                    <ResizablePanel defaultSize={40} minSize={30} className="min-w-0" style={{ overflow: 'hidden' }}>
                        <RulePool
                            rules={rules}
                            isLoading={rulesLoading}
                            selectedSet={selectedSet}
                            onAddRuleToSet={addRuleToSet}
                            onCreateRule={openCreateDialog}
                            onEditRule={openEditDialog}
                            onDeleteRule={(id) => deleteRule(id)}
                            onImportRules={() => setImportDialogOpen(true)}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            <RuleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                initialData={editingRule}
                isSubmitting={isCreatingRule || isUpdatingRule}
                onSuccess={(data) => {
                    if (dialogMode === 'create') {
                        createRule(data);
                    } else if (editingRule) {
                        updateRule({ id: editingRule.id, ...data });
                    }
                    setDialogOpen(false);
                }}
                onDelete={(id) => {
                    deleteRule(id);
                    setDialogOpen(false);
                }}
            />

            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogContent className="max-w-2xl h-[500px] flex flex-col p-0 gap-0 overflow-hidden">
                    <RuleImportDialog
                        onCancel={() => setImportDialogOpen(false)}
                        onImport={(rules) => {
                            handleImportRules(rules);
                            setImportDialogOpen(false);
                        }}
                        isImporting={isCreatingRule}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
