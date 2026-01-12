
import { describe, it, expect } from 'vitest';
import { ClineGenerator } from './ClineGenerator';
import { Rule, McpServer } from '../../../shared/types';

describe('ClineGenerator', () => {
    const generator = new ClineGenerator();
    const mockRules: Rule[] = [
        { id: '1', name: '*.ts', content: 'Use TypeScript', isActive: true, createdAt: '2025', updatedAt: '2025' }
    ];
    const mockMcpServers: McpServer[] = [{
        id: 's1', name: 'S1', command: 'node', args: ['s1.js'], env: {}, isActive: true, createdAt: '2025', updatedAt: '2025'
    }];

    describe('generateRules', () => {
        it('should generate .clinerules for Project scope', () => {
            const files = generator.generateRules('Project', mockRules);
            expect(files[0].path).toBe('.clinerules');
            expect(files[0].content).toContain('## Rules for *.ts');
        });

        it('should generate .clinerules.local for ProjectLocal scope', () => {
            const files = generator.generateRules('ProjectLocal', mockRules);
            expect(files[0].path).toBe('.clinerules.local');
        });
    });

    describe('generateMcpConfig', () => {
        it('should generate config for Global scope only', () => {
            const files = generator.generateMcpConfig('Global', mockMcpServers);
            expect(files).toHaveLength(1);
            expect(files[0].path).toContain('cline_mcp_settings.json');
        });

        it('should return empty for Project scope', () => {
            const files = generator.generateMcpConfig('Project', mockMcpServers);
            expect(files).toHaveLength(0);
        });
    });
});
