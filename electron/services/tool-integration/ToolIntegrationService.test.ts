
import { describe, it, expect } from 'vitest';
import { ToolIntegrationService } from './ToolIntegrationService';
import { CursorGenerator } from './CursorGenerator';
import { Rule, McpServer } from '../../../shared/types';

describe('ToolIntegrationService', () => {
    const service = new ToolIntegrationService([
        { tool: 'Cursor', generator: new CursorGenerator() }
    ]);
    const mockRules: Rule[] = [];
    const mockMcpServers: McpServer[] = [];

    it('should delegate to correct generator', async () => {
        const result = await service.generateConfig('Cursor', 'Project', { rules: mockRules, mcpServers: mockMcpServers });
        expect(Array.isArray(result)).toBe(true);
    });
});
