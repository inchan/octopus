
import { getDb } from '../../infra/database';
import { RuleSet, CreateRuleSetParams, UpdateRuleSetParams } from '../../../shared/types';
import { BaseRepository } from '../BaseRepository';

export class RuleSetRepository extends BaseRepository<RuleSet> {
    protected tableName = 'rule_sets';

    protected mapToEntity(row: unknown): RuleSet {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            name: r.name as string,
            items: this.safeJsonParse(r.items as string, []),
            createdAt: r.createdAt as string,
            updatedAt: r.updatedAt as string
        };
    }

    create(params: CreateRuleSetParams): RuleSet {
        const now = this.now();
        const set: RuleSet = {
            id: this.generateId(),
            name: params.name,
            items: params.items || [],
            createdAt: now,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            INSERT INTO rule_sets (id, name, items, createdAt, updatedAt)
            VALUES (@id, @name, @items, @createdAt, @updatedAt)
        `);

        stmt.run({
            ...set,
            items: this.safeJsonStringify(set.items)
        });

        return set;
    }

    update(params: UpdateRuleSetParams): RuleSet | null {
        const now = this.now();
        const current = this.getById(params.id);
        if (!current) return null;

        const updated: RuleSet = {
            ...current,
            ...params,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            UPDATE rule_sets 
            SET name = @name, items = @items, updatedAt = @updatedAt
            WHERE id = @id
        `);

        stmt.run({
            ...updated,
            items: this.safeJsonStringify(updated.items)
        });

        return updated;
    }
}
