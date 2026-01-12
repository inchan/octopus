import { describe, it, expect } from 'vitest';
import { extractServersFromText } from './config-parser';

describe('config-parser', () => {
  describe('extractServersFromText', () => {
    it('should extract servers from mcpServers block', () => {
      const text = `
Some text
"mcpServers": {
    "server1": {
        "command": "npx",
        "args": ["-y", "server1"]
    }
}
More text
`;
      const result = extractServersFromText(text);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('server1');
      expect(result[0].command).toBe('npx');
    });

    it('should handle README style json blocks', () => {
      const text = `
To use this server:

\`\`\`json
{
  "mcpServers": {
    "weather": {
      "command": "uvx",
      "args": ["mcp-weather"]
    }
  }
}
\`\`\`
`;
      const result = extractServersFromText(text);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('weather');
      expect(result[0].command).toBe('uvx');
    });

    it('should extract multiple servers', () => {
      const text = `
\`\`\`json
{
  "mcpServers": {
    "s1": { "command": "c1" },
    "s2": { "command": "c2" }
  }
}
\`\`\`
`;
      const result = extractServersFromText(text);
      expect(result).toHaveLength(2);
      expect(result.map(s => s.name)).toContain('s1');
      expect(result.map(s => s.name)).toContain('s2');
    });

    it('should extract from js code block (playwright example)', () => {
      const text = `
First, install the Playwright MCP server with your client.

**Standard config** works in most of the tools:

\`\`\`js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
\`\`\`
`;
      const result = extractServersFromText(text);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('playwright');
      expect(result[0].command).toBe('npx');
      expect(result[0].args).toContain('@playwright/mcp@latest');
    });

    it('should extract single server config in code block', () => {
      const text = `
\`\`\`json
{
    "command": "python",
    "args": ["server.py"],
    "env": { "KEY": "VAL" }
}
\`\`\`
`;
      const result = extractServersFromText(text);
      expect(result).toHaveLength(1);
      expect(result[0].command).toBe('python');
      // Name defaults to 'Server' key from logic if missing, or maybe 'Server' string?
      // checking implementation: name: s.name || 'Server'
      expect(result[0].name).toBe('Server');
    });

    it('should deduplicate same server configs', () => {
      const text = `
\`\`\`json
{
  "mcpServers": {
    "s1": { "command": "c1" }
  }
}
\`\`\`

And again:
\`\`\`json
{
  "mcpServers": {
    "s1": { "command": "c1" }
  }
}
\`\`\`
`;
      const result = extractServersFromText(text);
      expect(result).toHaveLength(1);
    });
  });
});
