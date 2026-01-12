import { getDb } from '../infra/database';
import { ToolConfig, SetToolConfigParams } from '../../shared/types';
import { BaseRepository } from './BaseRepository';

export class ToolConfigRepository extends BaseRepository<ToolConfig> {
    protected tableName = 'tool_configs';

    protected mapToEntity(row: unknown): ToolConfig {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            toolId: r.toolId as string,
            contextType: r.contextType as 'global' | 'project',
            contextId: r.contextId as string,
            ruleSetId: (r.ruleSetId as string) || undefined,
            mcpSetId: (r.mcpSetId as string) || undefined,
            updatedAt: r.updatedAt as string
        };
    }

    get(toolId: string, contextType: 'global' | 'project', contextId: string): ToolConfig | null {
        console.log(`[ToolConfigRepo] get params: toolId=${toolId}, contextType=${contextType}, contextId=${contextId}`);
        const stmt = getDb().prepare(`
            SELECT * FROM tool_configs 
            WHERE toolId = @toolId AND contextType = @contextType AND contextId = @contextId
        `);
        const row = stmt.get({ toolId, contextType, contextId });
        console.log(`[ToolConfigRepo] get result:`, row);
        return row ? this.mapToEntity(row) : null;
    }

    upsert(params: SetToolConfigParams): ToolConfig {
        console.log(`[ToolConfigRepo] upsert params:`, params);
        const now = this.now();
        const existing = this.get(params.toolId, params.contextType, params.contextId);

        const id = existing?.id || this.generateId();
        console.log(`[ToolConfigRepo] upsert using ID: ${id} (existing: ${!!existing})`);

        const stmt = getDb().prepare(`
            INSERT INTO tool_configs (id, toolId, contextType, contextId, ruleSetId, mcpSetId, updatedAt)
            VALUES (@id, @toolId, @contextType, @contextId, @ruleSetId, @mcpSetId, @updatedAt)
            ON CONFLICT(toolId, contextType, contextId) 
            DO UPDATE SET 
                ruleSetId = @ruleSetId,
                mcpSetId = @mcpSetId,
                updatedAt = @updatedAt
        `);

        stmt.run({
            id,
            toolId: params.toolId,
            contextType: params.contextType,
            contextId: params.contextId,
            ruleSetId: params.ruleSetId || null,
            mcpSetId: params.mcpSetId || null,
            updatedAt: now
        });

        return {
            id,
            ...params,
            updatedAt: now
        };
    }

    getAllByContext(contextType: 'global' | 'project', contextId: string): ToolConfig[] {
        const stmt = getDb().prepare(`
            SELECT * FROM tool_configs 
            WHERE contextType = @contextType AND contextId = @contextId
        `);
        const rows = stmt.all({ contextType, contextId });
        return rows.map(this.mapToEntity);
    }
}
