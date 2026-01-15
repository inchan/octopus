import { getDb } from '../infra/database';
import { randomUUID } from 'crypto';

export abstract class BaseRepository<T> {
    protected abstract tableName: string;

    protected abstract mapToEntity(row: unknown): T;

    getAll(orderBy: string = 'createdAt DESC'): T[] {
        const stmt = getDb().prepare(`SELECT * FROM ${this.tableName} ORDER BY ${orderBy}`);
        const rows = stmt.all();
        return rows.map((row: unknown) => this.mapToEntity(row));
    }

    getById(id: string): T | null {
        const stmt = getDb().prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
        const row = stmt.get(id);
        if (!row) return null;
        return this.mapToEntity(row);
    }

    delete(id: string): void {
        const stmt = getDb().prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
        stmt.run(id);
    }

    // --- Helper Methods ---

    protected generateId(): string {
        return randomUUID();
    }

    protected now(): string {
        return new Date().toISOString();
    }

    protected safeJsonParse<R>(json: string | null | undefined, fallback: R): R {
        if (!json) return fallback;
        try {
            return JSON.parse(json);
        } catch {
            return fallback;
        }
    }

    protected safeJsonStringify(data: unknown): string {
        return JSON.stringify(data);
    }
}
