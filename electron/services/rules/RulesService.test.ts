import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RulesService } from './RulesService';

// Mock Repository
vi.mock('../../repositories/RulesRepository');

describe('RulesService', () => {
    let service: RulesService;
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
        service = new RulesService(mockRepository, mockHistoryService);
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return rules from repository', async () => {
            const rules = [{ id: '1', name: 'Rule 1', content: 'test', isActive: true, createdAt: 'now', updatedAt: 'now' }];
            mockRepository.getAll.mockReturnValue(rules);

            const result = await service.getAll();

            expect(mockRepository.getAll).toHaveBeenCalled();
            expect(result).toEqual(rules);
        });
    });

    describe('create', () => {
        it('should call repository create', async () => {
            const params = { name: 'New Rule', content: 'content', isActive: true };
            const createdRule = { ...params, id: 'test-uuid', isActive: true, createdAt: 'now', updatedAt: 'now' };
            mockRepository.create.mockReturnValue(createdRule);

            const result = await service.create(params);

            expect(mockRepository.create).toHaveBeenCalledWith(params);
            expect(mockHistoryService.addEntry).toHaveBeenCalled();
            expect(result).toEqual(createdRule);
        });
    });

    describe('update', () => {
        it('should call repository update', async () => {
            const params = { id: '1', name: 'Updated Rule' };
            const updatedRule = { id: '1', name: 'Updated Rule', content: 'content', isActive: true, createdAt: 'now', updatedAt: 'now' };
            mockRepository.update.mockReturnValue(updatedRule);
            mockRepository.getById.mockReturnValue({ ...updatedRule, name: 'Old' }); // Return old state for history log

            const result = await service.update(params);

            expect(mockRepository.update).toHaveBeenCalledWith(params);
            expect(result).toEqual(updatedRule);
        });

        it('should throw error if rule not found', async () => {
            mockRepository.update.mockReturnValue(null);
            await expect(service.update({ id: 'bad' })).rejects.toThrow('Rule not found');
        });
    });
});
