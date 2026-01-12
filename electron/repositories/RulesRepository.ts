import { getDb } from '../infra/database';
import { Rule, CreateRuleParams, UpdateRuleParams } from '../../shared/types';
import { randomUUID } from 'crypto';
import { BaseRepository } from './BaseRepository';

export class RulesRepository extends BaseRepository<Rule> {
    protected tableName = 'rules';

    protected mapToEntity(row: unknown): Rule {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            name: r.name as string,
            content: r.content as string,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt as string,
            updatedAt: r.updatedAt as string
        };
    }

    // getAll and getById are now inherited
    // But getAll in BaseRepository uses createdAt DESC by default, RulesRepo used updatedAt DESC.
    // I should override or pass params.
    
    getAll(): Rule[] {
        return super.getAll('updatedAt DESC');
    }

    create(params: CreateRuleParams): Rule {
        const now = new Date().toISOString();
        const rule: Rule = {
            id: params.id || randomUUID(),
            name: params.name,
            content: params.content,
            isActive: params.isActive ?? true,
            createdAt: now,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            INSERT INTO rules (id, name, content, isActive, createdAt, updatedAt)
            VALUES (@id, @name, @content, @isActive, @createdAt, @updatedAt)
        `);

        stmt.run({
            ...rule,
            isActive: rule.isActive ? 1 : 0
        });

        return rule;
    }

    update(params: UpdateRuleParams): Rule | null {
        const now = new Date().toISOString();
        const current = this.getById(params.id);
        if (!current) return null;

        const updated: Rule = {
            ...current,
            ...params,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            UPDATE rules 
            SET name = @name, content = @content, isActive = @isActive, updatedAt = @updatedAt
            WHERE id = @id
        `);

        stmt.run({
            ...updated,
            isActive: updated.isActive ? 1 : 0
        });

        return {
            ...updated,
            isActive: !!updated.isActive
        };
    }
}
