export type ToolType = 'cli' | 'ide' | 'desktop';

export interface ToolDefinition {
    id: string;
    name: string;
    type: ToolType;
    detection: {
        macAppPath?: string[]; // Possible locations for .app
        cliCommand?: string;   // Command to check (e.g. 'claude')
        configDirSuffix?: string; // Path relative to ~/Library/Application Support/
    };
}

export const SUPPORTED_TOOLS: ToolDefinition[] = [
    // --- CLIs ---
    {
        id: 'claude-code',
        name: 'Claude Code',
        type: 'cli',
        detection: {
            cliCommand: 'claude'
        }
    },
    {
        id: 'codex-cli',
        name: 'Codex CLI',
        type: 'cli',
        detection: {
            cliCommand: 'codex'
        }
    },
    {
        id: 'gemini-cli',
        name: 'Gemini CLI',
        type: 'cli',
        detection: {
            cliCommand: 'gemini'
        }
    },
    {
        id: 'qwen-code',
        name: 'Qwen Code',
        type: 'cli',
        detection: {
            cliCommand: 'qwen'
        }
    },
    {
        id: 'opencode',
        name: 'OpenCode',
        type: 'cli',
        detection: {
            cliCommand: 'opencode'
        }
    },

    // --- IDEs ---
    {
        id: 'cursor',
        name: 'Cursor',
        type: 'ide',
        detection: {
            macAppPath: ['/Applications/Cursor.app', '~/Applications/Cursor.app'],
            configDirSuffix: 'Cursor'
        }
    },
    {
        id: 'vscode',
        name: 'VS Code',
        type: 'ide',
        detection: {
            macAppPath: ['/Applications/Visual Studio Code.app', '~/Applications/Visual Studio Code.app'],
            configDirSuffix: 'Code'
        }
    },
    {
        id: 'cline',
        name: 'Cline',
        type: 'ide',
        detection: {
            // Cannot easily detect extension without scanning. 
            // For now, assume if VS Code is present, Cline might be relevant, 
            // or just rely on user manual selection if we implement that.
            // But since ToolDetector only returns isInstalled=true if detected...
            // We can check standard VS Code extensions path? 
            // ~/.vscode/extensions/saoudrizwan.claude-dev*
            // But strict path checking is brittle.
            // We'll leave detection empty so it returns false, 
            // BUT the SyncPage logic might need to be looser or we should implement extension detection.
            // Actually, let's try to detect it in the standard path.
            configDirSuffix: 'Code/User/globalStorage/saoudrizwan.claude-dev'
        }
    },
    {
        id: 'windsurf',
        name: 'Windsurf',
        type: 'ide',
        detection: {
            macAppPath: ['/Applications/Windsurf.app', '~/Applications/Windsurf.app'],
            configDirSuffix: 'Windsurf' // Assumption based on research
        }
    },
    {
        id: 'antigravity',
        name: 'Antigravity',
        type: 'ide',
        detection: {
            macAppPath: ['/Applications/Antigravity.app', '~/Applications/Antigravity.app'],
            configDirSuffix: 'Antigravity' // Assumption
        }
    },

    // --- Desktop ---
    {
        id: 'claude-desktop',
        name: 'Claude Desktop',
        type: 'desktop',
        detection: {
            macAppPath: ['/Applications/Claude.app', '~/Applications/Claude.app'],
            configDirSuffix: 'Claude'
        }
    }
];
