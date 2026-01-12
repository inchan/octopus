
import { getDb } from '../../infra/database';
import { ToolSet, CreateToolSetParams, UpdateToolSetParams } from '../../../shared/types';
import { BaseRepository } from '../BaseRepository';

export class ToolSetRepository extends BaseRepository<ToolSet> {
    protected tableName = 'tool_sets';

    protected mapToEntity(row: unknown): ToolSet {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            name: r.name as string,
            isDefault: Boolean(r.isDefault),
            items: this.safeJsonParse(r.items as string, []),
            createdAt: r.createdAt as string,
            updatedAt: r.updatedAt as string
        };
    }

    create(params: CreateToolSetParams): ToolSet {
        const now = this.now();
        const set: ToolSet = {
            id: this.generateId(),
            name: params.name,
            items: params.items || [],
            isDefault: params.isDefault || false,
            createdAt: now,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            INSERT INTO tool_sets (id, name, isDefault, items, createdAt, updatedAt)
            VALUES (@id, @name, @isDefault, @items, @createdAt, @updatedAt)
        `);

        stmt.run({
            ...set,
            items: this.safeJsonStringify(set.items),
            isDefault: set.isDefault ? 1 : 0
        });

        return set;
    }

    update(params: UpdateToolSetParams): ToolSet | null {
        const now = this.now();
        const current = this.getById(params.id);
        if (!current) return null;

        const updated: ToolSet = {
            ...current,
            ...params,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            UPDATE tool_sets 
            SET name = @name, isDefault = @isDefault, items = @items, updatedAt = @updatedAt
            WHERE id = @id
        `);

        stmt.run({
            ...updated,
            items: this.safeJsonStringify(updated.items),
            isDefault: updated.isDefault ? 1 : 0
        });

        return updated;
    }
}
