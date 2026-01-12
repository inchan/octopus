import { RuleSetRepository } from '../../repositories/sets/RuleSetRepository';
import { CreateRuleSetParams, UpdateRuleSetParams, RuleSet } from '../../../shared/types';

export class RuleSetService {
    constructor(private readonly repo: RuleSetRepository) { }

    async getAll(): Promise<RuleSet[]> {
        return this.repo.getAll();
    }

    async getById(id: string): Promise<RuleSet | null> {
        return this.repo.getById(id);
    }

    async create(params: CreateRuleSetParams): Promise<RuleSet> {
        return this.repo.create(params);
    }

    async update(params: UpdateRuleSetParams): Promise<RuleSet> {
        const data = this.repo.update(params);
        if (!data) throw new Error('RuleSet not found');
        return data;
    }

    async delete(id: string): Promise<void> {
        this.repo.delete(id);
    }
}
