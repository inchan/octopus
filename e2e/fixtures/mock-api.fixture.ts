/**
 * Mock API Fixture
 *
 * E2E 테스트에서 window.api를 일관되게 모킹하기 위한 Playwright Fixture
 *
 * 사용법:
 * import { test, expect } from '../fixtures/mock-api.fixture';
 *
 * test('my test', async ({ page, setupMockApi }) => {
 *   await setupMockApi();
 *   // ... test code
 * });
 */

import { test as base, Page } from '@playwright/test';
import { SettingsSchema, HistoryEntry } from '../../shared/types';

// Mock 데이터 저장소 (테스트 간 초기화됨)
interface MockRule {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MockRuleSet {
  id: string;
  name: string;
  items: string[];
  isArchived: boolean;
}

interface MockTool {
  id: string;
  name: string;
  type: string;
  isInstalled: boolean;
  paths: { app: string; config?: string };
}

interface MockMcpServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  isActive: boolean;
}

interface MockMcpSet {
  id: string;
  name: string;
  items: string[];
}

interface MockToolConfig {
  id: string;
  toolId: string;
  contextId: string;
  ruleSetId?: string;
  mcpSetId?: string;
  isEnabled: boolean;
  updatedAt: string;
}

interface MockProject {
  id: string;
  name: string;
  path: string;
  type: string;
  updatedAt: string;
}

// Mock 데이터 저장소 (테스트 간 초기화됨)
interface MockDataStore {
  rules: MockRule[];
  ruleSets: MockRuleSet[];
  tools: MockTool[];
  mcpServers: MockMcpServer[];
  mcpSets: MockMcpSet[];
  toolConfigs: MockToolConfig[];
  settings: SettingsSchema;
  history: HistoryEntry[];
  projects: MockProject[];
}

// 기본 Mock 데이터
const defaultMockData: MockDataStore = {
  rules: [],
  ruleSets: [],
  tools: [
    {
      id: 'cursor',
      name: 'Cursor',
      type: 'ide',
      isInstalled: true,
      paths: { app: '/Applications/Cursor.app' },
    },
    {
      id: 'vscode',
      name: 'VS Code',
      type: 'ide',
      isInstalled: true,
      paths: { app: '/Applications/Visual Studio Code.app' },
    },
  ],
  mcpServers: [],
  mcpSets: [],
  toolConfigs: [],
  settings: { theme: 'dark', language: 'ko', autoSync: false },
  history: [],
  projects: [],
};

// Fixture 타입 정의
type MockApiFixture = {
  setupMockApi: (customData?: Partial<MockDataStore>) => Promise<void>;
  mockData: MockDataStore;
};

/**
 * Mock API를 설정하는 헬퍼 함수
 */
async function injectMockApi(page: Page, data: MockDataStore) {
  await page.addInitScript((mockData) => {
    // @ts-ignore - window.api는 런타임에 정의됨
    window.api = {
      ping: async () => 'pong',

      // Rules API
      rules: {
        list: async () => ({
          success: true,
          data: [...mockData.rules],
        }),
        create: async (params: { name: string; content: string }) => {
          const now = new Date().toISOString();
          const newRule = {
            id: `rule-${Date.now()}`,
            name: params.name,
            content: params.content,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          };
          mockData.rules = [...mockData.rules, newRule];
          return { success: true, data: newRule };
        },
        update: async (params: { id: string; name?: string; content?: string; isActive?: boolean }) => {
          // Add small delay to simulate network/IPC
          await new Promise(resolve => setTimeout(resolve, 100));
          const index = mockData.rules.findIndex((r) => r.id === params.id);
          if (index !== -1) {
            const updatedRule = {
              ...mockData.rules[index],
              ...params,
              updatedAt: new Date().toISOString()
            };
            mockData.rules = [
              ...mockData.rules.slice(0, index),
              updatedRule,
              ...mockData.rules.slice(index + 1)
            ];
            return { success: true, data: updatedRule };
          }
          return { success: false, error: 'Rule not found' };
        },
        delete: async (id: string) => {
          const index = mockData.rules.findIndex((r) => r.id === id);
          if (index !== -1) {
            // Immutable 업데이트로 변경
            mockData.rules = mockData.rules.filter((r) => r.id !== id);
            return { success: true };
          }
          return { success: false, error: 'Rule not found' };
        },
      },

      // Rule Sets API
      sets: {
        rules: {
          list: async () => ({
            success: true,
            data: [...mockData.ruleSets],
          }),
          create: async (params: { name: string; items: string[] }) => {
            const newSet = {
              id: `set-${Date.now()}`,
              name: params.name,
              items: params.items || [],
              isArchived: false,
            };
            mockData.ruleSets = [...mockData.ruleSets, newSet];
            return { success: true, data: newSet };
          },
          update: async (params: { id: string; name?: string; items?: string[] }) => {
            const index = mockData.ruleSets.findIndex((s) => s.id === params.id);
            if (index !== -1) {
              const updatedSet = {
                ...mockData.ruleSets[index],
                ...params
              };
              mockData.ruleSets = [
                ...mockData.ruleSets.slice(0, index),
                updatedSet,
                ...mockData.ruleSets.slice(index + 1)
              ];
              return { success: true, data: updatedSet };
            }
            return { success: false, error: 'Set not found' };
          },
          delete: async (id: string) => {
            const index = mockData.ruleSets.findIndex((s) => s.id === id);
            if (index !== -1) {
              // Immutable 업데이트로 변경
              mockData.ruleSets = mockData.ruleSets.filter((s) => s.id !== id);
              return { success: true };
            }
            return { success: false, error: 'Set not found' };
          },
        },
        mcp: {
          list: async () => ({
            success: true,
            data: mockData.mcpSets,
          }),
          create: async (params: { name: string; items: string[] }) => {
            const newSet = {
              id: `mcp-set-${Date.now()}`,
              name: params.name,
              items: params.items || [],
              isArchived: false,
            };
            mockData.mcpSets.push(newSet);
            return { success: true, data: newSet };
          },
          update: async (params: { id: string; name?: string; items?: string[] }) => {
            const set = mockData.mcpSets.find((s) => s.id === params.id);
            if (set) {
              if (params.name !== undefined) set.name = params.name;
              if (params.items !== undefined) set.items = params.items;
              return { success: true, data: set };
            }
            return { success: false, error: 'MCP Set not found' };
          },
          delete: async (id: string) => {
            const index = mockData.mcpSets.findIndex((s) => s.id === id);
            if (index !== -1) {
              // Immutable 업데이트로 변경
              mockData.mcpSets = mockData.mcpSets.filter((s) => s.id !== id);
              return { success: true };
            }
            return { success: false, error: 'MCP Set not found' };
          },
        },
      },

      // Tool Detection API
      toolDetection: {
        detect: async () => ({
          success: true,
          data: mockData.tools,
        }),
        getCached: async () => ({
          success: true,
          data: mockData.tools,
        }),
      },

      // Tool Integration API
      toolIntegration: {
        generateConfig: async (tool: string) => ({
          success: true,
          data: [
            { path: `generated/${tool}/rules.md`, content: '# Generated Rules' },
            { path: `generated/${tool}/mcp.json`, content: '{"servers": {}}' },
          ],
        }),
      },

      // Sync API
      sync: {
        apply: async (path: string, content: string) => {
          console.log(`[Mock Sync] Writing to ${path}`);
          return { success: true };
        },
      },

      // MCP Servers API
      mcp: {
        list: async () => ({ success: true, data: mockData.mcpServers }),
        get: async (id: string) => {
          const server = mockData.mcpServers.find((s) => s.id === id);
          return server ? { success: true, data: server } : { success: false, error: 'Not found' };
        },
        create: async (params: { name: string; command: string; args?: string[]; env?: Record<string, string>; isActive?: boolean }) => {
          const newServer = {
            id: `mcp-${Date.now()}`,
            name: params.name,
            command: params.command,
            args: params.args || [],
            env: params.env || {},
            isActive: params.isActive ?? true,
          };
          mockData.mcpServers.push(newServer);
          return { success: true, data: newServer };
        },
        update: async (params: { id: string; name?: string; command?: string; args?: string[]; env?: Record<string, string>; isActive?: boolean }) => {
          const server = mockData.mcpServers.find((s) => s.id === params.id);
          if (server) {
            Object.assign(server, params);
            return { success: true, data: server };
          }
          return { success: false, error: 'Not found' };
        },
        delete: async (id: string) => {
          const index = mockData.mcpServers.findIndex((s) => s.id === id);
          if (index !== -1) {
            // Immutable 업데이트로 변경
            mockData.mcpServers = mockData.mcpServers.filter((s) => s.id !== id);
            return { success: true };
          }
          return { success: false, error: 'Not found' };
        },
      },

      // Settings API
      settings: {
        get: async (key: keyof SettingsSchema) => mockData.settings[key] ?? null,
        getAll: async () => mockData.settings,
        set: async (key: keyof SettingsSchema, value: unknown) => {
          (mockData.settings as any)[key] = value;
          return { success: true };
        },
      },

      // Tool Config API
      toolConfig: {
        get: async (toolId: string, contextId?: string) => {
          const config = mockData.toolConfigs.find(
            (c) => c.toolId === toolId && c.contextId === (contextId || 'global')
          );
          return { success: true, data: config || null };
        },
        set: async (params: { toolId: string; contextType: string; contextId: string; ruleSetId?: string; mcpSetId?: string }) => {
          const index = mockData.toolConfigs.findIndex(
            (c) => c.toolId === params.toolId && c.contextId === (params.contextId || 'global')
          );
          if (index !== -1) {
            Object.assign(mockData.toolConfigs[index], params);
          } else {
            mockData.toolConfigs.push({
              id: `config-${Date.now()}`,
              updatedAt: new Date().toISOString(),
              isEnabled: true,
              ...params,
            });
          }
          return { success: true };
        },
      },

      // History API
      history: {
        list: async () => ({ success: true, data: mockData.history }),
        revert: async (id: string) => {
          console.log(`[Mock History] Reverting to ${id}`);
          return { success: true };
        },
      },

      // Projects API
      projects: {
        list: async () => ({
          success: true,
          data: mockData.projects,
          debugInfo: { source: 'mock' },
        }),
        create: async (params: { name: string; path: string; type: string }) => {
          const newProject = {
            id: `proj-${Date.now()}`,
            name: params.name,
            path: params.path,
            type: params.type,
            updatedAt: new Date().toISOString(),
          };
          mockData.projects.push(newProject);
          return { success: true, data: newProject };
        },
        delete: async (id: string) => {
          const index = mockData.projects.findIndex((p) => p.id === id);
          if (index !== -1) {
            // Immutable 업데이트로 변경
            mockData.projects = mockData.projects.filter((p) => p.id !== id);
            return { success: true };
          }
          return { success: false, error: 'Project not found' };
        },
        scan: async (path: string) => {
          // Mock scan result: return a candidate project based on path
          const name = path.split('/').pop() || 'New Project';
          return {
            success: true,
            data: [
              { id: `scan-${Date.now()}`, name, path, type: 'general', updatedAt: new Date().toISOString() }
            ]
          };
        },
      },
    };
  }, data);
}

/**
 * Extended test fixture with Mock API support
 */
export const test = base.extend<MockApiFixture>({
  mockData: async ({ }, use) => {
    // 각 테스트마다 새로운 데이터 복사본 생성
    const data: MockDataStore = {
      rules: [...defaultMockData.rules],
      ruleSets: [...defaultMockData.ruleSets],
      tools: [...defaultMockData.tools],
      mcpServers: [...defaultMockData.mcpServers],
      mcpSets: [...defaultMockData.mcpSets],
      toolConfigs: [...defaultMockData.toolConfigs],
      settings: { ...defaultMockData.settings },
      history: [...defaultMockData.history],
      projects: [...defaultMockData.projects],
    };
    await use(data);
  },

  setupMockApi: async ({ page, mockData }, use) => {
    const setup = async (customData?: Partial<MockDataStore>) => {
      const data = {
        ...mockData,
        ...customData,
      };
      await injectMockApi(page, data);
    };
    await use(setup);
  },
});

export { expect } from '@playwright/test';

/**
 * 미리 정의된 테스트 데이터 시나리오
 */
export const mockScenarios = {
  // 빈 상태
  empty: {
    rules: [],
    ruleSets: [],
    tools: defaultMockData.tools,
    mcpServers: [],
    mcpSets: [],
    toolConfigs: [],
    settings: defaultMockData.settings,
    history: [],
    projects: [],
  },

  // 기본 데이터가 있는 상태
  withData: {
    rules: [
      { id: 'rule-1', name: 'Python Guidelines', content: 'Use type hints', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      { id: 'rule-2', name: 'TypeScript Rules', content: 'Strict mode', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ],
    ruleSets: [
      { id: 'set-1', name: 'Development', items: ['rule-1'], isArchived: false },
      { id: 'set-2', name: 'Production', items: ['rule-1', 'rule-2'], isArchived: false },
    ],
    tools: defaultMockData.tools,
    mcpServers: [
      { id: 'mcp-1', name: 'Mock Server', command: 'node', args: ['index.js'], env: {}, isActive: true },
    ],
    mcpSets: [
      { id: 'mcp-set-1', name: 'My MCPs', items: ['mcp-1'], isArchived: false },
    ],
    toolConfigs: [],
    settings: defaultMockData.settings,
    history: [],
    projects: [],
  },

  // Sync 워크플로우 테스트용
  forSyncWorkflow: {
    rules: [
      { id: 'rule-1', name: 'Python Guidelines', content: 'No bugs', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ],
    ruleSets: [
      { id: 'rule-set-1', name: 'My Rules', items: ['rule-1'], isArchived: false },
    ],
    tools: defaultMockData.tools,
    mcpServers: [
      { id: 'mcp-1', name: 'Mock MCP', command: 'npx', args: ['mcp-server'], env: {}, isActive: true },
    ],
    mcpSets: [
      { id: 'mcp-set-1', name: 'My MCPs', items: ['mcp-1'], isArchived: false },
    ],
    toolConfigs: [],
    settings: defaultMockData.settings,
    history: [],
    projects: [],
  },

  // 많은 데이터가 있는 상태 (스크롤 테스트 등)
  withManyItems: {
    rules: Array.from({ length: 20 }, (_, i) => ({
      id: `rule-${i}`,
      name: `Rule ${i}`,
      content: `Content for rule ${i}`,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    })),
    ruleSets: Array.from({ length: 10 }, (_, i) => ({
      id: `set-${i}`,
      name: `Set ${i}`,
      items: [`rule-${i}`, `rule-${i + 1}`],
      isArchived: false,
    })),
    tools: defaultMockData.tools,
    mcpServers: Array.from({ length: 5 }, (_, i) => ({
      id: `mcp-${i}`,
      name: `Server ${i}`,
      command: 'node',
      args: [`server-${i}.js`],
      env: {},
      isActive: true,
    })),
    mcpSets: [],
    toolConfigs: [],
    settings: defaultMockData.settings,
    history: [],
    projects: [],
  },
};
