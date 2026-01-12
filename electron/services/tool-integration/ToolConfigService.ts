import { ToolConfigRepository } from '../../repositories/ToolConfigRepository';
import { SetToolConfigParams, ToolConfig } from '../../../shared/types';

export class ToolConfigService {
    constructor(private readonly repository: ToolConfigRepository) { }

    async getConfig(toolId: string, contextId: string = 'global'): Promise<ToolConfig | null> {
        const contextType = contextId === 'global' ? 'global' : 'project';
        return this.repository.get(toolId, contextType, contextId);
    }

    async setConfig(params: SetToolConfigParams): Promise<ToolConfig> {
        return this.repository.upsert(params);
    }

    async getProjectConfigs(projectId: string): Promise<ToolConfig[]> {
        return this.repository.getAllByContext('project', projectId);
    }

    async getGlobalConfigs(): Promise<ToolConfig[]> {
        return this.repository.getAllByContext('global', 'global');
    }
}
