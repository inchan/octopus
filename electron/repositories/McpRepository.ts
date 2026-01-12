import { getDb } from '../infra/database';
import { McpServer, CreateMcpServerParams, UpdateMcpServerParams } from '../../shared/types';
import { BaseRepository } from './BaseRepository';

export class McpRepository extends BaseRepository<McpServer> {
    protected tableName = 'mcp_servers';

    protected mapToEntity(row: unknown): McpServer {
        const r = row as Record<string, unknown>;
        return {
            id: r.id as string,
            name: r.name as string,
            command: r.command as string,
            args: this.safeJsonParse(r.args as string, []),
            env: this.safeJsonParse(r.env as string, {}),
            url: r.url as string | undefined,
            isActive: Boolean(r.isActive),
            createdAt: r.createdAt as string,
            updatedAt: r.updatedAt as string
        };
    }

    create(params: CreateMcpServerParams): McpServer {
        const now = this.now();
        const server: McpServer = {
            id: params.id || this.generateId(),
            name: params.name,
            command: params.command,
            args: params.args || [],
            env: params.env || {},
            url: params.url,
            isActive: params.isActive ?? true,
            createdAt: now,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            INSERT INTO mcp_servers (id, name, command, args, env, url, isActive, createdAt, updatedAt)
            VALUES (@id, @name, @command, @args, @env, @url, @isActive, @createdAt, @updatedAt)
        `);

        stmt.run({
            ...server,
            args: this.safeJsonStringify(server.args),
            env: this.safeJsonStringify(server.env),
            isActive: server.isActive ? 1 : 0
        });

        return server;
    }

    update(params: UpdateMcpServerParams): McpServer | null {
        const now = this.now();
        const current = this.getById(params.id);
        if (!current) return null;

        const updated: McpServer = {
            ...current,
            ...params,
            updatedAt: now
        };

        const stmt = getDb().prepare(`
            UPDATE mcp_servers 
            SET name = @name, command = @command, args = @args, env = @env, url = @url, isActive = @isActive, updatedAt = @updatedAt
            WHERE id = @id
        `);

        stmt.run({
            ...updated,
            args: this.safeJsonStringify(updated.args),
            env: this.safeJsonStringify(updated.env),
            isActive: updated.isActive ? 1 : 0
        });

        return updated;
    }
}
