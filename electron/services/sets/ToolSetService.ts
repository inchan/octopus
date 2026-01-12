import { ToolSetRepository } from '../../repositories/sets/ToolSetRepository';
import { CreateToolSetParams, UpdateToolSetParams, ToolSet } from '../../../shared/types';

export class ToolSetService {
    constructor(private readonly repo: ToolSetRepository) { }

    async getAll(): Promise<ToolSet[]> {
        return this.repo.getAll();
    }

    async getById(id: string): Promise<ToolSet | null> {
        return this.repo.getById(id);
    }

    async create(params: CreateToolSetParams): Promise<ToolSet> {
        return this.repo.create(params);
    }

    async update(params: UpdateToolSetParams): Promise<ToolSet> {
        const data = this.repo.update(params);
        if (!data) throw new Error('ToolSet not found');
        return data;
    }

    async delete(id: string): Promise<void> {
        this.repo.delete(id);
    }
}
