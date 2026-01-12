
import { describe, it, expect } from 'vitest';
import { ClaudeGenerator } from './ClaudeGenerator';
import { McpServer } from '../../../shared/types';

describe('ClaudeGenerator', () => {
    const generator = new ClaudeGenerator();
    const mockMcpServers: McpServer[] = [{
        id: 's1', name: 'Server1', command: 'cmd', args: [], env: {}, isActive: true, createdAt: 'now', updatedAt: 'now'
    }];

    describe('generateMcpConfig', () => {
        it('should generate claude_desktop_config.json for Global', () => {
            const files = generator.generateMcpConfig('Global', mockMcpServers);
            expect(files[0].path).toContain('claude_desktop_config.json');
        });
    });
});
