import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { McpServer } from '../../../shared/types';

export class McpConnectionManager {
    private connections: Map<string, Client> = new Map();

    async connect(server: McpServer): Promise<Client> {
        if (this.connections.has(server.id)) {
            return this.connections.get(server.id)!;
        }

        const transport = new StdioClientTransport({
            command: server.command,
            args: server.args,
            env: { ...process.env, ...server.env } as Record<string, string>
        });

        const client = new Client({
            name: "align-agents-v2-client",
            version: "1.0.0"
        }, {
            capabilities: {}
        });

        await client.connect(transport);
        this.connections.set(server.id, client);
        return client;
    }

    async disconnect(serverId: string): Promise<void> {
        const client = this.connections.get(serverId);
        if (client) {
            await client.close();
            this.connections.delete(serverId);
        }
    }

    getClient(serverId: string): Client | undefined {
        return this.connections.get(serverId);
    }
}
