import { describe, it, expect, beforeEach, vi } from 'vitest';
import { McpSetService } from './McpSetService';
import { McpSetRepository } from '../../repositories/sets/McpSetRepository';
import { McpServer } from '../../../shared/types';
import { IMcpAPI } from '../../../shared/api';

const mockRepo = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
};

const mockMcpApi = {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
};

describe('McpSetService', () => {
    let service: McpSetService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new McpSetService(
            mockRepo as unknown as McpSetRepository,
            mockMcpApi as unknown as IMcpAPI
        );
    });

    it('should resolve servers from a set', async () => {
        const mockSet = {
            id: 'set-1', name: 'Dev Set', items: ['server-1'],
            isArchived: false, createdAt: '', updatedAt: ''
        };
        const mockServers: McpServer[] = [
            { id: 'server-1', name: 'Server 1', command: 'cmd', args: [], env: {}, isActive: true, createdAt: '', updatedAt: '' },
            { id: 'server-2', name: 'Server 2', command: 'cmd', args: [], env: {}, isActive: true, createdAt: '', updatedAt: '' }
        ];

        mockRepo.getById.mockReturnValue(mockSet); // Sync mock
        mockMcpApi.list.mockResolvedValue({ success: true, data: mockServers }); // Async API mock

        const result = await service.getResolvedServers('set-1');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('server-1');
    });

    it('should create an archived mcp set', async () => {
        const params = { name: 'Archive 1', items: [] };
        const created = { ...params, id: 'arch-1', isArchived: false, createdAt: '', updatedAt: '' };
        mockRepo.create.mockReturnValue(created);

        const result = await service.create(params);
        expect(result).toEqual(created);
    });
});
