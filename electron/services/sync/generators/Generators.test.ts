import { ClaudeMdGenerator } from './ClaudeMdGenerator';
import { Rule, McpServer } from '../../../../shared/types';
import { GeneratorContext } from './FileGenerator';
import { describe, it, expect } from 'vitest';

describe('ClaudeMdGenerator', () => {
    it('should generate correct markdown', async () => {
        const generator = new ClaudeMdGenerator();
        const context: GeneratorContext = {
            rules: [
                { id: '1', name: 'Test Rule', content: 'Use TDD', isActive: true } as Rule
            ],
            mcpServers: [
                { id: '1', name: 'Fetch', command: 'npx', args: ['-y', 'fetch-server'], isActive: true } as McpServer
            ]
        };

        const content = await generator.generate(context);
        expect(content).toContain('# Project Context');
        expect(content).toContain('## Active Rules');
        expect(content).toContain('### Test Rule...');
        expect(content).toContain('Use TDD');
        expect(content).toContain('npx -y fetch-server');
    });
});
