import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpService } from './McpService';

// Mock Repository
vi.mock('../../repositories/McpRepository');

describe('McpService', () => {
    let service: McpService;
    let mockRepository: any;
    let mockHistoryService: any;

    beforeEach(() => {
        mockRepository = {
            getAll: vi.fn(),
            getById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        mockHistoryService = {
            addEntry: vi.fn(),
        };
        // Mock the constructor or just pass the mock
        service = new McpService(mockRepository, mockHistoryService);
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return parsed MCP servers from repository', async () => {
            const servers = [
                {
                    id: '1',
                    name: 'Server 1',
                    command: 'cmd',
                    args: ['-a'],
                    env: { KEY: 'VAL' },
                    isActive: true,
                    createdAt: 'date',
                    updatedAt: 'date',
                },
            ];
            mockRepository.getAll.mockReturnValue(servers);

            const result = await service.getAll();

            expect(mockRepository.getAll).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(servers[0]);
        });
    });

    describe('create', () => {
        it('should call repository create', async () => {
            const params = {
                name: 'New Server',
                command: 'npx',
                args: ['arg1'],
                env: { API_KEY: 'secret' },
                isActive: true,
            };
            const createdServer = { ...params, id: 'test-uuid', isActive: true, createdAt: 'now', updatedAt: 'now' };

            mockRepository.create.mockReturnValue(createdServer);

            const result = await service.create(params);

            expect(mockRepository.create).toHaveBeenCalledWith(params);
            expect(mockHistoryService.addEntry).toHaveBeenCalled();
            expect(result).toEqual(createdServer);
        });
    });

    describe('importServers', () => {
        const createMockServer = (name: string, id?: string) => ({
            id: id || `uuid-${name}`,
            name,
            command: 'node',
            args: ['server.js'],
            env: {},
            isActive: true,
            createdAt: 'now',
            updatedAt: 'now',
        });

        beforeEach(() => {
            mockRepository.getAll.mockReturnValue([]);
            mockRepository.create.mockImplementation((params: any) =>
                createMockServer(params.name, params.id || `uuid-${params.name}`)
            );
        });

        describe('TC-MCP-U-IM001: Import single server', () => {
            it('should import a single server successfully', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'my-server', command: 'node', args: ['app.js'], env: {}, isActive: true },
                    ],
                });

                expect(result.success).toBe(1);
                expect(result.failed).toBe(0);
                expect(result.imported).toHaveLength(1);
                expect(result.imported[0].name).toBe('my-server');
                expect(mockRepository.create).toHaveBeenCalledTimes(1);
            });

            it('should set isActive to true by default', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'server', command: 'cmd', args: [], env: {}, isActive: true },
                    ],
                });

                expect(result.imported[0].isActive).toBe(true);
            });
        });

        describe('TC-MCP-U-IM002: Import multiple servers', () => {
            it('should import 5 servers successfully', async () => {
                const servers = Array.from({ length: 5 }, (_, i) => ({
                    name: `server-${i + 1}`,
                    command: `cmd${i + 1}`,
                    args: [],
                    env: {},
                    isActive: true,
                }));

                const result = await service.importServers({ servers });

                expect(result.success).toBe(5);
                expect(result.failed).toBe(0);
                expect(result.imported).toHaveLength(5);
                expect(mockRepository.create).toHaveBeenCalledTimes(5);
            });
        });

        describe('TC-MCP-U-IM003: Import with duplicate name handling', () => {
            beforeEach(() => {
                mockRepository.getAll.mockReturnValue([
                    createMockServer('existing-server', 'existing-id'),
                ]);
            });

            it('should skip duplicates when strategy is "skip"', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'existing-server', command: 'new-cmd', args: [], env: {}, isActive: true },
                        { name: 'new-server', command: 'cmd', args: [], env: {}, isActive: true },
                    ],
                    duplicateStrategy: 'skip',
                });

                expect(result.success).toBe(1);
                expect(result.skipped).toBe(1);
                expect(result.imported[0].name).toBe('new-server');
            });

            it('should overwrite existing when strategy is "overwrite"', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'existing-server', command: 'updated-cmd', args: [], env: {}, isActive: true },
                    ],
                    duplicateStrategy: 'overwrite',
                });

                expect(result.success).toBe(1);
                expect(result.overwritten).toBe(1);
                expect(mockRepository.delete).toHaveBeenCalledWith('existing-id');
            });

            it('should rename duplicates when strategy is "rename"', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'existing-server', command: 'cmd', args: [], env: {}, isActive: true },
                    ],
                    duplicateStrategy: 'rename',
                });

                expect(result.success).toBe(1);
                expect(result.renamed).toHaveLength(1);
                expect(result.renamed[0]).toEqual({
                    original: 'existing-server',
                    renamed: 'existing-server-1',
                });
            });
        });

        describe('TC-MCP-U-IM004: Import with validation errors', () => {
            it('should return error for empty command', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'invalid', command: '', args: [], env: {}, isActive: true },
                    ],
                });

                expect(result.success).toBe(0);
                expect(result.failed).toBe(1);
                expect(result.errors[0].reason).toContain('command');
            });

            it('should handle partial success/failure', async () => {
                const result = await service.importServers({
                    servers: [
                        { name: 'valid-1', command: 'cmd', args: [], env: {}, isActive: true },
                        { name: '', command: 'cmd', args: [], env: {}, isActive: true }, // invalid
                        { name: 'valid-2', command: 'cmd', args: [], env: {}, isActive: true },
                    ],
                });

                expect(result.success).toBe(2);
                expect(result.failed).toBe(1);
                expect(result.errors).toHaveLength(1);
            });
        });

        describe('TC-MCP-U-IM005: Import partial (selective import)', () => {
            it('should import only selected servers', async () => {
                const servers = Array.from({ length: 10 }, (_, i) => ({
                    name: `server${i + 1}`,
                    command: `cmd${i + 1}`,
                    args: [],
                    env: {},
                    isActive: true,
                }));

                const result = await service.importServers({
                    servers,
                    selectedNames: ['server1', 'server5', 'server8'],
                });

                expect(result.success).toBe(3);
                expect(result.skipped).toBe(7);
                expect(result.imported.map((s: any) => s.name)).toEqual(['server1', 'server5', 'server8']);
            });

            it('should return all servers when no filter applied', async () => {
                const servers = [
                    { name: 's1', command: 'c1', args: [], env: {}, isActive: true },
                    { name: 's2', command: 'c2', args: [], env: {}, isActive: true },
                ];

                const result = await service.importServers({ servers });

                expect(result.success).toBe(2);
                expect(result.skipped).toBe(0);
            });
        });
    });
});
