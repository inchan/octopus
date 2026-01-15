export interface McpPreset {
  id: string;
  name: string;
  description: string;
  command: string;
  args: string[];
}

export const SERENA_PRESETS: McpPreset[] = [
  {
    id: 'ide',
    name: 'Serena (IDE)',
    description: 'Optimized for VSCode, Cursor, Cline (Minimal capabilities)',
    command: 'uvx',
    args: [
      '--from',
      'git+https://github.com/oraios/serena',
      'serena',
      'start-mcp-server',
      '--context',
      'ide',
      '--project',
      '${workspaceFolder}'
    ]
  },
  {
    id: 'claude-code',
    name: 'Serena (Claude Code)',
    description: 'Optimized for Claude Code CLI (No redundant tools)',
    command: 'uvx',
    args: [
      '--from',
      'git+https://github.com/oraios/serena',
      'serena',
      'start-mcp-server',
      '--context',
      'claude-code'
    ]
  },
  {
    id: 'codex',
    name: 'Serena (Codex)',
    description: 'Optimized for OpenAI Codex environment',
    command: 'uvx',
    args: [
      '--from',
      'git+https://github.com/oraios/serena',
      'serena',
      'start-mcp-server',
      '--context',
      'codex'
    ]
  },
  {
    id: 'agent',
    name: 'Serena (General Agent)',
    description: 'Full capabilities for Desktop Apps, Agents (Agno, etc.)',
    command: 'uvx',
    args: [
      '--from',
      'git+https://github.com/oraios/serena',
      'serena',
      'start-mcp-server',
      '--context',
      'agent'
    ]
  }
];
