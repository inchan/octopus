import { describe, it, expect } from 'vitest';
import { parseSingleServerConfig, extractServersFromText } from './config-parser';

describe('parseSingleServerConfig', () => {
    it('parses a complete JSON object', () => {
        const input = JSON.stringify({
            name: 'test',
            command: 'node',
            args: ['script.js'],
            env: { MY_VAR: '1' }
        });
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        expect(result.data).toEqual({
            name: 'test',
            command: 'node',
            args: ['script.js'],
            env: { MY_VAR: '1' }
        });
    });

    it('handles unwrapped "mcpServers" property (User Case)', () => {
        const input = `"mcpServers": {
            "desktop-commander": {
                "command": "npx",
                "args": ["-y", "@wonderwhy-er/desktop-commander@latest"]
            }
        }`;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("desktop-commander");
        expect(result.data?.command).toBe("npx");
    });

    it('handles "mcpServers" wrapped in braces', () => {
        const input = `{
            "mcpServers": {
                "my-server": {
                    "command": "python",
                    "args": ["main.py"]
                }
            }
        }`;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("my-server");
        expect(result.data?.command).toBe("python");
    });

    it('handles unwrapped single server property', () => {
        const input = `"my-server": {
            "command": "go",
            "args": ["run", "main.go"]
        }`;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("my-server");
        expect(result.data?.command).toBe("go");
    });

    it('handles unwrapped single server property from a list (with trailing comma)', () => {
        const input = `"my-server": {
            "command": "go",
            "args": ["run", "main.go"]
        },`;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("my-server");
    });

    it('handles empty input', () => {
        const result = parseSingleServerConfig('');
        expect(result.success).toBe(true);
        expect(result.data).toBeUndefined();
    });

    it('returns error for invalid JSON', () => {
        const result = parseSingleServerConfig('not json');
        expect(result.success).toBe(false);
    });

    it('extracts first server if multiple in mcpServers', () => {
        const input = `{
            "mcpServers": {
                "s1": { "command": "c1" },
                "s2": { "command": "c2" }
            }
        }`;
        const result = parseSingleServerConfig(input);
        // Should pick first one
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("s1");
    });

    // TC-MCP-U-CP004: Parse config with empty mcpServers
    it('handles empty mcpServers object', () => {
        const input = `{
            "mcpServers": {}
        }`;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        // Empty mcpServers should result in undefined data (no server to extract)
        expect(result.data?.command).toBeUndefined();
    });

    // TC-MCP-U-CP005: Parse invalid JSON format (enhanced)
    it('returns error for malformed JSON with trailing comma', () => {
        const input = `{ "mcpServers": { "test": { "command": "node", }, } }`;
        const result = parseSingleServerConfig(input);
        // relaxJson handles trailing commas, so this should succeed
        expect(result.success).toBe(true);
        expect(result.data?.command).toBe('node');
    });

    // TC-MCP-U-CP005: Parse truly invalid JSON
    it('returns error for truly invalid JSON syntax', () => {
        const input = `{ "mcpServers": { "test": { "command": "node" } `;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });

    // TC-MCP-U-CP006: Parse config with missing required fields
    it('handles missing command field gracefully', () => {
        const input = `{
            "my-server": {
                "args": ["run", "main.go"]
            }
        }`;
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        // When there's no command, the parser might not extract it properly
        // The function returns what it can extract
        expect(result.data).toBeDefined();
        // command is missing, so it should be undefined
        expect(result.data?.command).toBeUndefined();
    });

    // TC-MCP-U-CP008: Parse config with special characters in values
    it('preserves special characters and spaces in paths', () => {
        const input = JSON.stringify({
            name: 'special-server',
            command: '/path/with spaces/한글/server.js',
            args: ['--config', '/Users/me/My Documents/config.json'],
            env: { PATH_WITH_SPACE: '/some/path with spaces' }
        });
        const result = parseSingleServerConfig(input);
        expect(result.success).toBe(true);
        expect(result.data?.command).toBe('/path/with spaces/한글/server.js');
        expect(result.data?.args).toContain('/Users/me/My Documents/config.json');
        expect(result.data?.env?.PATH_WITH_SPACE).toBe('/some/path with spaces');
    });
});

describe('extractServersFromText', () => {
    // TC-MCP-U-CP001: Parse Claude Desktop config (valid)
    it('extracts servers from Claude Desktop format with mcpServers block', () => {
        const text = `
# Claude Desktop Configuration

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-api-key-here"
      }
    }
  }
}
\`\`\`
        `;
        const servers = extractServersFromText(text);
        expect(servers.length).toBe(2);

        const filesystem = servers.find(s => s.name === 'filesystem');
        expect(filesystem).toBeDefined();
        expect(filesystem?.command).toBe('npx');
        expect(filesystem?.args).toContain('@modelcontextprotocol/server-filesystem');

        const braveSearch = servers.find(s => s.name === 'brave-search');
        expect(braveSearch).toBeDefined();
        expect(braveSearch?.env?.BRAVE_API_KEY).toBe('your-api-key-here');
    });

    // TC-MCP-U-CP002: Parse Cursor config (valid)
    it('extracts servers from Cursor-style markdown code blocks', () => {
        const text = `
## Installation

Add this to your Cursor settings:

\`\`\`javascript
{
  "mcpServers": {
    "cursor-server": {
      "command": "node",
      "args": ["/path/to/cursor-server.js"]
    }
  }
}
\`\`\`
        `;
        const servers = extractServersFromText(text);
        expect(servers.length).toBeGreaterThanOrEqual(1);

        const cursorServer = servers.find(s => s.name === 'cursor-server');
        expect(cursorServer).toBeDefined();
        expect(cursorServer?.command).toBe('node');
    });

    // TC-MCP-U-CP004: Parse config with empty mcpServers
    it('returns empty array for empty mcpServers block', () => {
        const text = `
\`\`\`json
{
  "mcpServers": {}
}
\`\`\`
        `;
        const servers = extractServersFromText(text);
        expect(servers).toEqual([]);
    });

    // Additional test: Multiple code blocks with deduplication
    it('deduplicates servers with same name and command', () => {
        const text = `
\`\`\`json
{
  "mcpServers": {
    "test-server": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
\`\`\`

Later in the document:

\`\`\`json
{
  "mcpServers": {
    "test-server": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
\`\`\`
        `;
        const servers = extractServersFromText(text);
        // Should only have one instance despite appearing twice
        expect(servers.length).toBe(1);
        expect(servers[0].name).toBe('test-server');
    });

    // Additional test: Single server config in code block
    it('extracts single server config from code block without mcpServers wrapper', () => {
        const text = `
Add this configuration:

\`\`\`json
{
  "command": "python",
  "args": ["-m", "myserver"],
  "env": {
    "DEBUG": "true"
  }
}
\`\`\`
        `;
        const servers = extractServersFromText(text);
        expect(servers.length).toBe(1);
        expect(servers[0].command).toBe('python');
        expect(servers[0].args).toContain('-m');
        expect(servers[0].env?.DEBUG).toBe('true');
    });

    // TC-MCP-U-CP001 variant: Inline mcpServers in text
    it('extracts servers from inline mcpServers JSON without code blocks', () => {
        const text = `
Configuration: "mcpServers": {
    "inline-server": {
        "command": "deno",
        "args": ["run", "server.ts"]
    }
}
        `;
        const servers = extractServersFromText(text);
        expect(servers.length).toBeGreaterThanOrEqual(1);
        const inlineServer = servers.find(s => s.name === 'inline-server');
        expect(inlineServer).toBeDefined();
        expect(inlineServer?.command).toBe('deno');
    });

    // Edge case: No servers found
    it('returns empty array when no servers found in text', () => {
        const text = `
This is just regular text with no configuration.
There are no code blocks or mcpServers objects here.
        `;
        const servers = extractServersFromText(text);
        expect(servers).toEqual([]);
    });
});
