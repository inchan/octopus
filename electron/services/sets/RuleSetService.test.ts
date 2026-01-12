import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RuleSetService } from './RuleSetService';
import { RuleSetRepository } from '../../repositories/sets/RuleSetRepository';

const mockRepo = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
};

describe('RuleSetService', () => {
    let service: RuleSetService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new RuleSetService(mockRepo as unknown as RuleSetRepository);
    });

    it('should create a rule set', async () => {
        const params = { name: 'My Rules', items: ['rule-1', 'rule-2'] };
        const created = { ...params, id: 'rule-set-1', createdAt: '', updatedAt: '' };
        mockRepo.create.mockReturnValue(created); // Sync mock

        const result = await service.create(params);
        expect(result.items).toHaveLength(2);
    });

    it('should update a rule set', async () => {
        const params = { id: 'rule-set-1', name: 'Updated Name' };
        const updated = { id: 'rule-set-1', name: 'Updated Name', items: [], createdAt: '', updatedAt: '' };
        mockRepo.update.mockReturnValue(updated); // Sync mock

        const result = await service.update(params);
        expect(result.name).toBe('Updated Name');
    });
});
