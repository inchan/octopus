export const TOOL_IDS = {
    CLAUDE: 'claude',
    CURSOR: 'cursor',
    WINDSURF: 'windsurf',
    CLINE: 'cline',
    VSCODE: 'vscode',
} as const;

export type ToolId = typeof TOOL_IDS[keyof typeof TOOL_IDS];
