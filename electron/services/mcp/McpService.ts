import { McpRepository } from '../../repositories/McpRepository';
import { HistoryService } from '../history/HistoryService';
import {
    McpServer,
    CreateMcpServerParams,
    UpdateMcpServerParams,
    ImportMcpServersParams,
    ImportMcpServersResult,
    DuplicateStrategy
} from '../../../shared/types';

export class McpService {
    constructor(
        private repository: McpRepository,
        private historyService: HistoryService
    ) { }

    async getAll(): Promise<McpServer[]> {
        return this.repository.getAll();
    }

    async getById(id: string): Promise<McpServer | null> {
        return this.repository.getById(id);
    }

    async create(params: CreateMcpServerParams, options?: { skipLog?: boolean }): Promise<McpServer> {
        const server = this.repository.create(params);
        if (!options?.skipLog) {
            await this.historyService.addEntry('mcp', server.id, 'create', server as unknown as Record<string, unknown>);
        }
        return server;
    }

    async update(params: UpdateMcpServerParams, options?: { skipLog?: boolean }): Promise<McpServer> {
        const current = this.repository.getById(params.id);
        const updated = this.repository.update(params);
        if (!updated || !current) {
            throw new Error('MCP Server not found');
        }
        if (!options?.skipLog) {
            await this.historyService.addEntry('mcp', updated.id, 'update', current as unknown as Record<string, unknown>);
        }
        return updated;
    }

    async delete(id: string, options?: { skipLog?: boolean }): Promise<void> {
        const current = this.repository.getById(id);
        if (current && !options?.skipLog) {
            await this.historyService.addEntry('mcp', id, 'delete', current as unknown as Record<string, unknown>);
        }
        this.repository.delete(id);
    }

    async fetchConfigFromUrl(url: string): Promise<string> {
        let targetUrl = url.trim();

        // Support "owner/repo" shorthand
        if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(targetUrl)) {
            targetUrl = `https://github.com/${targetUrl}`;
        }

        // GitHub URL filtering
        if (targetUrl.includes('github.com')) {
            // Transform github.com/user/repo -> raw.githubusercontent.com/user/repo/HEAD/README.md
            // Transform github.com/user/repo/blob/branch/file -> raw.githubusercontent.com/user/repo/branch/file

            // Simple heuristic for main repo page
            const repoMatch = targetUrl.match(/github\.com\/([^/]+)\/([^/]+)$/);
            if (repoMatch) {
                targetUrl = `https://raw.githubusercontent.com/${repoMatch[1]}/${repoMatch[2]}/HEAD/README.md`;
            } else if (targetUrl.includes('/blob/')) {
                targetUrl = targetUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
            }
        }

        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${targetUrl}: ${response.statusText}`);
        }
        return await response.text();
    }

    /**
     * Import multiple MCP servers with duplicate handling
     */
    async importServers(params: ImportMcpServersParams): Promise<ImportMcpServersResult> {
        const { servers, duplicateStrategy = 'skip', selectedNames } = params;

        const result: ImportMcpServersResult = {
            success: 0,
            failed: 0,
            skipped: 0,
            overwritten: 0,
            renamed: [],
            errors: [],
            imported: []
        };

        // Filter by selected names if provided
        let serversToImport = servers;
        if (selectedNames && selectedNames.length > 0) {
            const nameSet = new Set(selectedNames);
            serversToImport = servers.filter(s => nameSet.has(s.name));
            result.skipped = servers.length - serversToImport.length;
        }

        // Validate servers
        const validationResult = this.validateServers(serversToImport);
        result.failed = validationResult.invalid.length;
        result.errors = validationResult.invalid;

        // Get existing servers for duplicate check
        const existingServers = await this.getAll();
        const existingNames = new Set(existingServers.map(s => s.name));

        // Process valid servers
        for (const serverParams of validationResult.valid) {
            try {
                const processedParams = this.handleDuplicate(
                    serverParams,
                    existingServers,
                    existingNames,
                    duplicateStrategy,
                    result
                );

                if (processedParams) {
                    const created = await this.create(processedParams, { skipLog: false });
                    result.imported.push(created);
                    result.success++;
                    existingNames.add(created.name);
                }
            } catch (error) {
                result.failed++;
                result.errors.push({
                    name: serverParams.name,
                    reason: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return result;
    }

    /**
     * Validate server parameters
     */
    private validateServers(servers: CreateMcpServerParams[]): {
        valid: CreateMcpServerParams[];
        invalid: Array<{ name: string; reason: string }>;
    } {
        const valid: CreateMcpServerParams[] = [];
        const invalid: Array<{ name: string; reason: string }> = [];

        for (const server of servers) {
            const errors: string[] = [];

            if (!server.name || server.name.trim() === '') {
                errors.push('name is required');
            }

            if ((!server.command || server.command.trim() === '') && (!server.url || server.url.trim() === '')) {
                errors.push('Either command or url is required');
            }

            if (errors.length > 0) {
                invalid.push({ name: server.name || '', reason: errors.join(', ') });
            } else {
                valid.push(server);
            }
        }

        return { valid, invalid };
    }

    /**
     * Handle duplicate server names based on strategy
     */
    private handleDuplicate(
        serverParams: CreateMcpServerParams,
        existingServers: McpServer[],
        existingNames: Set<string>,
        strategy: DuplicateStrategy,
        result: ImportMcpServersResult
    ): CreateMcpServerParams | null {
        if (!existingNames.has(serverParams.name)) {
            return serverParams;
        }

        switch (strategy) {
            case 'skip':
                result.skipped++;
                return null;

            case 'overwrite': {
                // Find and delete the existing server first
                const existing = existingServers.find(s => s.name === serverParams.name);
                if (existing) {
                    this.repository.delete(existing.id);
                    result.overwritten++;
                }
                return serverParams;
            }

            case 'rename': {
                const newName = this.generateUniqueName(serverParams.name, existingNames);
                result.renamed.push({ original: serverParams.name, renamed: newName });
                return { ...serverParams, name: newName };
            }

            default:
                return serverParams;
        }
    }

    /**
     * Generate a unique name by appending incrementing suffix
     */
    private generateUniqueName(baseName: string, existingNames: Set<string>): string {
        let counter = 1;
        let newName = `${baseName}-${counter}`;

        while (existingNames.has(newName)) {
            counter++;
            newName = `${baseName}-${counter}`;
        }

        return newName;
    }
}
