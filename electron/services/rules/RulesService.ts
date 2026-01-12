import { RulesRepository } from '../../repositories/RulesRepository';
import { HistoryService } from '../history/HistoryService';
import { Rule, CreateRuleParams, UpdateRuleParams } from '../../../shared/types';

export class RulesService {
    constructor(
        private repository: RulesRepository,
        private historyService: HistoryService
    ) { }

    async getAll(): Promise<Rule[]> {
        return this.repository.getAll();
    }

    async getById(id: string): Promise<Rule | null> {
        return this.repository.getById(id);
    }

    async create(params: CreateRuleParams, options?: { skipLog?: boolean }): Promise<Rule> {
        const rule = this.repository.create(params);
        if (!options?.skipLog) {
            await this.historyService.addEntry('rule', rule.id, 'create', rule as unknown as Record<string, unknown>);
        }
        return rule;
    }

    async update(params: UpdateRuleParams, options?: { skipLog?: boolean }): Promise<Rule> {
        const current = this.repository.getById(params.id);
        const updated = this.repository.update(params);
        if (!updated || !current) {
            throw new Error('Rule not found');
        }
        if (!options?.skipLog) {
            await this.historyService.addEntry('rule', updated.id, 'update', current as unknown as Record<string, unknown>);
        }
        return updated;
    }

    async delete(id: string, options?: { skipLog?: boolean }): Promise<void> {
        const current = this.repository.getById(id);
        if (current && !options?.skipLog) {
            await this.historyService.addEntry('rule', id, 'delete', current as unknown as Record<string, unknown>);
        }
        this.repository.delete(id);
    }
}
