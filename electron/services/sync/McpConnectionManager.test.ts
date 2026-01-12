import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { McpConnectionManager } from './McpConnectionManager';
import { McpServer } from '../../../shared/types';

// Mock client instance
const mockClientInstance = {
    connect: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
};

// Mock transport instance
const mockTransportInstance = {};

// Mock MCP SDK with class constructors
vi.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
    Client: class MockClient {
        connect = mockClientInstance.connect;
        close = mockClientInstance.close;
    },
}));

vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => {
    const transportConstructorSpy = vi.fn();
    return {
        StdioClientTransport: class MockStdioClientTransport {
            constructor(config: unknown) {
                transportConstructorSpy(config);
                Object.assign(this, mockTransportInstance);
            }
            static _constructorSpy = transportConstructorSpy;
        },
    };
});

// Helper to get transport constructor spy
const getTransportSpy = async () => {
    const mod = await import('@modelcontextprotocol/sdk/client/stdio.js');
    return (mod.StdioClientTransport as unknown as { _constructorSpy: ReturnType<typeof vi.fn> })._constructorSpy;
};

describe('McpConnectionManager', () => {
    let manager: McpConnectionManager;

    // 테스트용 서버 설정
    const createMockServer = (id: string, command = 'node'): McpServer => ({
        id,
        name: `Test Server ${id}`,
        command,
        args: ['server.js'],
        env: { TEST_ENV: 'value' },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    beforeEach(() => {
        manager = new McpConnectionManager();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // =========================================================================
    // TC-MCP-S-CM001: Connect to MCP server
    // =========================================================================
    describe('TC-MCP-S-CM001: Connect to MCP server', () => {
        it('should establish connection successfully with valid server config', async () => {
            // Arrange
            const server = createMockServer('server-1');

            // Act
            const client = await manager.connect(server);

            // Assert
            expect(client).toBeDefined();
            expect(client.connect).toHaveBeenCalled();
        });

        it('should return existing client if already connected', async () => {
            // Arrange
            const server = createMockServer('server-1');

            // Act
            const client1 = await manager.connect(server);
            const client2 = await manager.connect(server);

            // Assert: 동일한 클라이언트 반환 (connect는 1번만 호출)
            expect(client1).toBe(client2);
            expect(client1.connect).toHaveBeenCalledTimes(1);
        });

        it('should create StdioClientTransport with correct config', async () => {
            // Arrange
            const server = createMockServer('server-1');
            const transportSpy = await getTransportSpy();

            // Act
            await manager.connect(server);

            // Assert
            expect(transportSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    command: server.command,
                    args: server.args,
                })
            );
        });

        it('should merge server env with process.env', async () => {
            // Arrange
            const server = createMockServer('server-1');
            server.env = { API_KEY: 'secret123' };
            const transportSpy = await getTransportSpy();

            // Act
            await manager.connect(server);

            // Assert
            expect(transportSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    env: expect.objectContaining({ API_KEY: 'secret123' }),
                })
            );
        });

        it('should store connected client in connections map', async () => {
            // Arrange
            const server = createMockServer('server-1');

            // Act
            await manager.connect(server);

            // Assert
            const storedClient = manager.getClient('server-1');
            expect(storedClient).toBeDefined();
        });
    });

    // =========================================================================
    // TC-MCP-S-CM002: Disconnect from MCP server
    // =========================================================================
    describe('TC-MCP-S-CM002: Disconnect from MCP server', () => {
        it('should disconnect and remove client from connections', async () => {
            // Arrange
            const server = createMockServer('server-1');
            const client = await manager.connect(server);

            // Act
            await manager.disconnect('server-1');

            // Assert
            expect(client.close).toHaveBeenCalled();
            expect(manager.getClient('server-1')).toBeUndefined();
        });

        it('should handle disconnect for non-existent connection gracefully', async () => {
            // Act & Assert: 에러 없이 완료되어야 함
            await expect(manager.disconnect('non-existent')).resolves.toBeUndefined();
        });

        it('should only disconnect specified server', async () => {
            // Arrange
            const server1 = createMockServer('server-1');
            const server2 = createMockServer('server-2');
            await manager.connect(server1);
            await manager.connect(server2);

            // Act
            await manager.disconnect('server-1');

            // Assert
            expect(manager.getClient('server-1')).toBeUndefined();
            expect(manager.getClient('server-2')).toBeDefined();
        });
    });

    // =========================================================================
    // TC-MCP-S-CM003: Handle connection failure
    // =========================================================================
    describe('TC-MCP-S-CM003: Handle connection failure', () => {
        it('should throw error when connection fails', async () => {
            // Arrange
            const server = createMockServer('failing-server', 'nonexistent-command');
            mockClientInstance.connect.mockRejectedValueOnce(
                new Error('Connection failed: command not found')
            );

            // Act & Assert
            await expect(manager.connect(server)).rejects.toThrow('Connection failed');
        });

        it('should not store client when connection fails', async () => {
            // Arrange
            const server = createMockServer('failing-server');
            mockClientInstance.connect.mockRejectedValueOnce(
                new Error('Connection timeout')
            );

            // Act
            try {
                await manager.connect(server);
            } catch {
                // 에러 무시
            }

            // Assert: 실패 시 connections에 저장되지 않아야 하지만,
            // 현재 구현은 connect 전에 Map에 저장하지 않으므로 undefined
            expect(manager.getClient('failing-server')).toBeUndefined();
        });

        it('should include error details in thrown error', async () => {
            // Arrange
            const server = createMockServer('failing-server');
            const errorMessage = 'ENOENT: spawn nonexistent ENOENT';
            mockClientInstance.connect.mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(manager.connect(server)).rejects.toThrow(errorMessage);
        });
    });

    // =========================================================================
    // TC-MCP-S-CM004: Manage multiple connections
    // =========================================================================
    describe('TC-MCP-S-CM004: Manage multiple connections', () => {
        it('should manage multiple independent connections', async () => {
            // Arrange
            const servers = [
                createMockServer('server-1'),
                createMockServer('server-2'),
                createMockServer('server-3'),
            ];

            // Act
            const clients = await Promise.all(servers.map(s => manager.connect(s)));

            // Assert
            expect(clients).toHaveLength(3);
            clients.forEach((client, i) => {
                expect(manager.getClient(`server-${i + 1}`)).toBe(client);
            });
        });

        it('should disconnect specific server without affecting others', async () => {
            // Arrange
            const server1 = createMockServer('server-1');
            const server2 = createMockServer('server-2');
            const server3 = createMockServer('server-3');

            await manager.connect(server1);
            await manager.connect(server2);
            await manager.connect(server3);

            // Act: 중간 서버만 disconnect
            await manager.disconnect('server-2');

            // Assert
            expect(manager.getClient('server-1')).toBeDefined();
            expect(manager.getClient('server-2')).toBeUndefined();
            expect(manager.getClient('server-3')).toBeDefined();
        });

        it('should handle one connection failure without affecting others', async () => {
            // Arrange
            const server1 = createMockServer('server-1');
            const failingServer = createMockServer('failing-server');
            const server3 = createMockServer('server-3');

            // Act: 첫 번째 성공
            await manager.connect(server1);

            // 두 번째는 실패하도록 설정
            mockClientInstance.connect.mockRejectedValueOnce(
                new Error('Connection failed')
            );
            try {
                await manager.connect(failingServer);
            } catch {
                // 에러 무시
            }

            // 세 번째 성공
            await manager.connect(server3);

            // Assert: 실패한 연결을 제외하고 나머지는 정상
            expect(manager.getClient('server-1')).toBeDefined();
            expect(manager.getClient('failing-server')).toBeUndefined();
            expect(manager.getClient('server-3')).toBeDefined();
        });

        it('should disconnect all connections when called sequentially', async () => {
            // Arrange
            const servers = [
                createMockServer('server-1'),
                createMockServer('server-2'),
                createMockServer('server-3'),
            ];
            await Promise.all(servers.map(s => manager.connect(s)));

            // Act
            await manager.disconnect('server-1');
            await manager.disconnect('server-2');
            await manager.disconnect('server-3');

            // Assert
            expect(manager.getClient('server-1')).toBeUndefined();
            expect(manager.getClient('server-2')).toBeUndefined();
            expect(manager.getClient('server-3')).toBeUndefined();
        });
    });
});
