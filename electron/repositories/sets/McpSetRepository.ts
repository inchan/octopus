
import { getDb } from '../../infra/database';
import { McpSet, CreateMcpSetParams, UpdateMcpSetParams } from '../../../shared/types';
import { BaseRepository } from '../BaseRepository';

export class McpSetRepository extends BaseRepository<McpSet> {
    protected tableName = 'mcp_sets';

    protected mapToEntity(row: unknown): McpSet {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            name: r.name as string,
            items: this.safeJsonParse(r.items as string, []),
            isArchived: Boolean(r.isArchived),
            createdAt: r.createdAt as string,
            updatedAt: r.updatedAt as string
        };
    }

    create(params: CreateMcpSetParams): McpSet {
        const now = this.now();
        const set: McpSet = {
            id: this.generateId(),
            name: params.name,
            items: params.items || [],
            isArchived: false,
            createdAt: now,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            INSERT INTO mcp_sets (id, name, items, isArchived, createdAt, updatedAt)
            VALUES (@id, @name, @items, @isArchived, @createdAt, @updatedAt)
        `);

        stmt.run({
            ...set,
            items: this.safeJsonStringify(set.items),
            isArchived: set.isArchived ? 1 : 0
        });

        return set;
    }

    update(params: UpdateMcpSetParams): McpSet | null {
        const now = this.now();
        const current = this.getById(params.id);
        if (!current) return null;

        const updated: McpSet = {
            ...current,
            ...params,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            UPDATE mcp_sets 
            SET name = @name, items = @items, isArchived = @isArchived, updatedAt = @updatedAt
            WHERE id = @id
        `);

        stmt.run({
            ...updated,
            items: this.safeJsonStringify(updated.items),
            isArchived: updated.isArchived ? 1 : 0
        });

        return updated;
    }
}
