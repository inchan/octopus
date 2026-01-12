import { HistoryRepository } from '../../repositories/HistoryRepository';
import { HistoryEntry } from '../../../shared/types';

export class HistoryService {
    constructor(private historyRepository: HistoryRepository) { }

    async list(): Promise<HistoryEntry[]> {
        return this.historyRepository.getAll();
    }

    async addEntry(
        entityType: 'rule' | 'mcp',
        entityId: string,
        action: 'create' | 'update' | 'delete',
        data: Record<string, unknown>
    ): Promise<HistoryEntry> {
        return this.historyRepository.create({
            entityType,
            entityId,
            action,
            data
        });
    }

    private revertHandlers: Record<string, (action: 'create' | 'update' | 'delete', data: Record<string, unknown>) => Promise<void>> = {};

    registerRevertHandler(entityType: string, handler: (action: 'create' | 'update' | 'delete', data: Record<string, unknown>) => Promise<void>) {
        this.revertHandlers[entityType] = handler;
    }

    async revert(id: string): Promise<void> {
        const entry = await this.historyRepository.getById(id);
        if (!entry) {
            throw new Error('History entry not found');
        }

        const handler = this.revertHandlers[entry.entityType];
        if (!handler) {
            throw new Error(`No revert handler registered for entity type: ${entry.entityType}`);
        }

        await handler(entry.action, entry.data);
    }
}
