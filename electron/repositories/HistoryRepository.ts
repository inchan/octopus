import { getDb } from '../infra/database';
import { HistoryEntry } from '../../shared/types';
import { BaseRepository } from './BaseRepository';

export class HistoryRepository extends BaseRepository<HistoryEntry> {
    protected tableName = 'history';

    protected mapToEntity(row: unknown): HistoryEntry {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            entityType: r.entityType as 'rule' | 'mcp',
            entityId: r.entityId as string,
            action: r.action as 'create' | 'update' | 'delete',
            data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
            createdAt: r.createdAt as string
        };
    }

    create(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
        const now = this.now();
        const fullEntry: HistoryEntry = {
            id: this.generateId(),
            createdAt: now,
            ...entry
        };

        const stmt = getDb().prepare(`
            INSERT INTO history (id, entityType, entityId, action, data, createdAt)
            VALUES (@id, @entityType, @entityId, @action, @data, @createdAt)
        `);

        stmt.run({
            ...fullEntry,
            data: typeof fullEntry.data === 'string' ? fullEntry.data : JSON.stringify(fullEntry.data)
        });

        return fullEntry;
    }
}
