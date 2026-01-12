import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryService } from '../history/HistoryService';
import { RulesService } from '../rules/RulesService';
import { Rule, HistoryEntry, CreateRuleParams, UpdateRuleParams } from '../../../shared/types';
import { randomUUID } from 'crypto';

// Mock Repositories
class MockRulesRepository {
    private items: Map<string, Rule> = new Map();

    create(params: CreateRuleParams): Rule {
        const id = params.id || randomUUID();
        const rule: Rule = {
            id,
            name: params.name,
            content: params.content,
            isActive: params.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.items.set(id, rule);
        return rule;
    }

    update(params: UpdateRuleParams): Rule | null {
        const current = this.items.get(params.id);
        if (!current) return null;
        const updated = { ...current, ...params, updatedAt: new Date().toISOString() };
        this.items.set(params.id, updated);
        return updated;
    }

    delete(id: string): void {
        this.items.delete(id);
    }

    getById(id: string): Rule | null {
        return this.items.get(id) || null;
    }

    getAll(): Rule[] {
        return Array.from(this.items.values());
    }
}

class MockHistoryRepository {
    private items: Map<string, HistoryEntry> = new Map();
    private counter = 0;

    async create(params: any): Promise<HistoryEntry> {
        const id = randomUUID();
        this.counter++;
        const entry: HistoryEntry = {
            id,
            ...params,
            createdAt: new Date(Date.now() + this.counter).toISOString(),
            data: params.data // Store as object directly
        };
        this.items.set(id, entry);
        return entry;
    }

    async getAll(): Promise<HistoryEntry[]> {
        return Array.from(this.items.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    async getById(id: string): Promise<HistoryEntry | null> {
        return this.items.get(id) || null;
    }
}



describe('History & Rollback Integration (Mocked)', () => {
    let historyRepo: any;
    let rulesRepo: any;

    let historyService: HistoryService;
    let rulesService: RulesService;


    beforeEach(() => {
        historyRepo = new MockHistoryRepository();
        rulesRepo = new MockRulesRepository();

        // Cast to any to bypass strict type check against actual Repository classes
        historyService = new HistoryService(historyRepo as any);
        rulesService = new RulesService(rulesRepo as any, historyService);

        // Register Revert Handlers (Logic strictly copied from main.ts)
        historyService.registerRevertHandler('rule', async (action, data) => {
            switch (action) {
                case 'create':
                    await rulesService.delete(data.id, { skipLog: true });
                    break;
                case 'delete':
                    await rulesService.create(data, { skipLog: true });
                    break;
                case 'update':
                    await rulesService.update(data, { skipLog: true });
                    break;
            }
        });
    });

    it('should rollback Rule creation (Create -> Undo -> Delete)', async () => {
        // 1. Create Rule
        const created = await rulesService.create({ name: 'Test Rule', content: 'content', isActive: true });
        const getRule = await rulesService.getById(created.id);
        expect(getRule).toBeDefined();

        // 2. Check History
        const history = await historyService.list();

        expect(history).toHaveLength(1);
        expect(history[0].action).toBe('create');
        expect(history[0].entityId).toBe(created.id);

        // 3. Revert (Undo Create)
        await historyService.revert(history[0].id);

        // 4. Verify Rule is deleted
        const getRuleAfter = await rulesService.getById(created.id);
        expect(getRuleAfter).toBeNull();
    });

    it('should rollback Rule modification (Update -> Undo -> Revert Update)', async () => {
        // 1. Setup
        const rule = await rulesService.create({ name: 'Original', content: 'v1', isActive: true });

        // 2. Update
        await rulesService.update({ id: rule.id, name: 'Modified', content: 'v2', isActive: true });

        const current = await rulesService.getById(rule.id);
        expect(current?.name).toBe('Modified');

        // 3. Check History (Create + Update)
        const history = await historyService.list();

        expect(history).toHaveLength(2); // [Update, Create] (descending)
        const updateEntry = history[0];
        expect(updateEntry.action).toBe('update');

        // 4. Revert (Undo Update)
        await historyService.revert(updateEntry.id);

        // 5. Verify Rule is back to Original
        const restored = await rulesService.getById(rule.id);
        expect(restored?.name).toBe('Original');
        expect(restored?.content).toBe('v1');
    });

    it('should rollback Rule deletion (Delete -> Undo -> Restore)', async () => {
        // 1. Setup
        const rule = await rulesService.create({ name: 'To Delete', content: 'content', isActive: true });
        const id = rule.id;

        // 2. Delete
        await rulesService.delete(id);
        const getRule = await rulesService.getById(id);
        expect(getRule).toBeNull();

        // 3. Check History
        const history = await historyService.list();

        const deleteEntry = history[0];
        expect(deleteEntry.action).toBe('delete');

        // 4. Revert (Undo Delete)
        await historyService.revert(deleteEntry.id);

        // 5. Verify Rule is restored with SAME ID
        const restored = await rulesService.getById(id);

        expect(restored).toBeDefined();
        expect(restored?.id).toBe(id);
        expect(restored?.name).toBe('To Delete');
    });
});
