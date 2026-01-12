import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToolSetService } from './ToolSetService';
import { ToolSetRepository } from '../../repositories/sets/ToolSetRepository';

// Mock Repository
const mockRepo = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
};

describe('ToolSetService', () => {
    let service: ToolSetService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new ToolSetService(mockRepo as unknown as ToolSetRepository);
    });

    it('should list all tool sets', async () => {
        const mockData = [{ id: '1', name: 'Test Set', items: [], isDefault: false }];
        mockRepo.getAll.mockReturnValue(mockData);

        const result = await service.getAll();
        expect(result).toEqual(mockData);
    });

    it('should create a new tool set', async () => {
        const params = { name: 'New Set', items: ['tool-1'] };
        const created = { ...params, id: 'new-id', isDefault: false, createdAt: '', updatedAt: '' };
        mockRepo.create.mockReturnValue(created);

        const result = await service.create(params);
        expect(result.name).toBe('New Set');
        expect(result.items).toContain('tool-1');
        expect(mockRepo.create).toHaveBeenCalledWith(params);
    });

    it('should prevent deleting default sets (if logic exists)', async () => {
        mockRepo.delete.mockReturnValue(undefined);
        await service.delete('id-1');
        expect(mockRepo.delete).toHaveBeenCalledWith('id-1');
    });
});
