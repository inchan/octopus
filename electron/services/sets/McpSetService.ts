import { McpSetRepository } from '../../repositories/sets/McpSetRepository';

import { CreateMcpSetParams, UpdateMcpSetParams, McpSet, McpServer } from '../../../shared/types';
import { IMcpAPI } from '../../../shared/api';

export class McpSetService {
    constructor(
        private readonly repo: McpSetRepository,
        private readonly mcpApi: IMcpAPI
    ) { }

    async getAll(): Promise<McpSet[]> {
        return this.repo.getAll();
    }

    async getById(id: string): Promise<McpSet | null> {
        return this.repo.getById(id);
    }

    async create(params: CreateMcpSetParams): Promise<McpSet> {
        return this.repo.create(params);
    }

    async update(params: UpdateMcpSetParams): Promise<McpSet> {
        const data = this.repo.update(params);
        if (!data) throw new Error('McpSet not found');
        return data;
    }

    async delete(id: string): Promise<void> {
        this.repo.delete(id);
    }

    // Helper for ToolIntegration
    // Note: Internal helper, doesn't need Result wrapper typically, but let's keep it safe.
    async resolveServers(serverIds: string[]): Promise<McpServer[]> {
        if (!serverIds || !Array.isArray(serverIds)) return [];

        // Use mcpApi to list all and filter (or get individually if API supports batch)
        // For efficiency in this minimal setup, list all is okay, or we assume repo access.
        // The service constructor takes `IMcpAPI`.
        const allServersRes = await this.mcpApi.list();
        if (!allServersRes.success) return [];

        return allServersRes.data.filter(server => serverIds.includes(server.id));
    }

    async getResolvedServers(setId: string): Promise<McpServer[]> {
        const set = this.repo.getById(setId);
        if (!set) throw new Error('Set not found');
        return this.resolveServers(set.items);
    }
}
