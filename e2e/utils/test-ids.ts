/**
 * E2E 테스트용 data-testid 상수 정의
 *
 * 네이밍 컨벤션: {feature}-{component}-{element}
 * - feature: 도메인/기능 영역 (rules, sync, mcp, settings, history)
 * - component: 컴포넌트 또는 섹션 이름 (list, editor, dialog, preview)
 * - element: 구체적 요소 (button, input, item, count)
 *
 * 사용법:
 * - 컴포넌트: <Button data-testid={TESTID.RULES.NEW_BUTTON}>New</Button>
 * - 테스트: page.getByTestId(TESTID.RULES.NEW_BUTTON)
 */

export const TESTID = {
  // ===========================================
  // Navigation
  // ===========================================
  NAV: {
    RULES: 'nav-rules',
    SYNC: 'nav-sync',
    MCP: 'nav-mcp',
    TOOLS: 'nav-tools',
    SETTINGS: 'nav-settings',
    HISTORY: 'nav-history',
  },

  // ===========================================
  // Rules Feature
  // ===========================================
  RULES: {
    // Page
    PAGE: 'rules-page',

    // Set List (Pane 1)
    SET_LIST: 'rules-set-list',
    SET_NEW_BUTTON: 'rules-set-new-button',
    SET_ITEM: 'rules-set-item', // 동적: rules-set-item-{id}
    SET_ITEM_NAME: 'rules-set-item-name',
    SET_ITEM_COUNT: 'rules-set-item-count',
    SET_CREATE_INPUT: 'rules-set-create-input',
    SET_CREATE_SUBMIT: 'rules-set-create-submit',
    SET_CREATE_CANCEL: 'rules-set-create-cancel',

    // Set Detail (Pane 2)
    SET_DETAIL: 'rules-set-detail',
    SET_DETAIL_TITLE: 'rules-set-detail-title',
    SET_DETAIL_DELETE: 'rules-set-detail-delete',
    SET_RULE_ITEM: 'rules-set-rule-item', // 동적: rules-set-rule-item-{id}
    SET_RULE_REMOVE: 'rules-set-rule-remove',

    // Rule Pool (Pane 3)
    POOL: 'rules-pool',
    POOL_NEW_BUTTON: 'rules-pool-new-button',
    POOL_ITEM: 'rules-pool-item', // 동적: rules-pool-item-{id}
    POOL_ADD_TO_SET: 'rules-pool-add-to-set',

    // Rule Editor
    EDITOR: 'rules-editor',
    EDITOR_NAME_INPUT: 'rules-editor-name-input',
    EDITOR_CONTENT_TEXTAREA: 'rules-editor-content-textarea',
    EDITOR_SAVE_BUTTON: 'rules-editor-save-button',
    EDITOR_DELETE_BUTTON: 'rules-editor-delete-button',

    // Legacy (하위 호환성 - 마이그레이션 후 제거)
    LIST_COUNT: 'rule-count',
  },

  // ===========================================
  // Sync Feature
  // ===========================================
  SYNC: {
    PAGE: 'sync-page',

    // 3-Column Layout
    COLUMN_TOOLS: 'sync-column-tools',
    COLUMN_RULES: 'sync-column-rules',
    COLUMN_MCP: 'sync-column-mcp',

    // Tool Selection
    TOOL_ALL: 'sync-tool-all',
    TOOL_ITEM: 'sync-tool-item', // 동적: sync-tool-item-{id}

    // Rule Set Selection
    RULESET_NONE: 'sync-ruleset-none',
    RULESET_ITEM: 'sync-ruleset-item', // 동적: sync-ruleset-item-{id}

    // MCP Set Selection
    MCPSET_NONE: 'sync-mcpset-none',
    MCPSET_ITEM: 'sync-mcpset-item', // 동적: sync-mcpset-item-{id}

    // Actions
    START_BUTTON: 'sync-start-button',

    // Preview Dialog
    PREVIEW_DIALOG: 'sync-preview-dialog',
    PREVIEW_FILE_ITEM: 'sync-preview-file-item',
    PREVIEW_CONFIRM: 'sync-preview-confirm-button',
    PREVIEW_CANCEL: 'sync-preview-cancel-button',
  },

  // ===========================================
  // MCP Feature
  // ===========================================
  MCP: {
    PAGE: 'mcp-page',

    // Set List (Pane 1)
    SET_NEW_BUTTON: 'mcp-set-new-button',
    SET_ITEM: 'mcp-set-item', // 동적: mcp-set-item-{id}
    SET_ITEM_NAME: 'mcp-set-item-name',
    SET_ITEM_COUNT: 'mcp-set-item-count',

    // Server Pool (Pane 3)
    SERVER_NEW_BUTTON: 'mcp-server-new-button',
    SERVER_ITEM: 'mcp-server-item', // 동적: mcp-server-item-{id}
    SERVER_ITEM_NAME: 'mcp-server-item-name',
    POOL: 'mcp-pool',
  },

  // ===========================================
  // Tools Feature
  // ===========================================
  TOOLS: {
    PAGE: 'tools-page',
    DETECT_BUTTON: 'tools-detect-button',
    LIST: 'tools-list',
    ITEM: 'tools-item', // 동적: tools-item-{id}
  },

  // ===========================================
  // Projects Feature
  // ===========================================
  PROJECTS: {
    PAGE: 'projects-page',
    ADD_BUTTON: 'projects-add-button',
    SEARCH_INPUT: 'projects-search-input',
    LIST: 'projects-list',
    ITEM: 'projects-item', // 동적: projects-item-{id}
    ITEM_NAME: 'projects-item-name',
    ITEM_PATH: 'projects-item-path',
    EMPTY_STATE: 'projects-empty-state',
    LOADING: 'projects-loading',

    // Add Dialog
    ADD_DIALOG: 'projects-add-dialog',
    ADD_PATH_INPUT: 'projects-add-path-input',
    ADD_NAME_INPUT: 'projects-add-name-input',
    ADD_SUBMIT: 'projects-add-submit',
    ADD_CANCEL: 'projects-add-cancel',

    // Detail Page
    DETAIL: 'projects-detail',
    DETAIL_NAME: 'projects-detail-name',
    DETAIL_PATH: 'projects-detail-path',
    DETAIL_BACK: 'projects-detail-back',
    DETAIL_SYNC: 'projects-detail-sync',
    DETAIL_TOOLS: 'projects-detail-tools',
  },

  // ===========================================
  // Settings Feature
  // ===========================================
  SETTINGS: {
    PAGE: 'settings-page',
    THEME_SELECT: 'settings-theme-select',
    LANGUAGE_SELECT: 'settings-language-select',
    AUTOSYNC_TOGGLE: 'settings-autosync-toggle',
    OPENAI_KEY_INPUT: 'settings-openai-key-input',
    ANTHROPIC_KEY_INPUT: 'settings-anthropic-key-input',
    TOAST: 'settings-toast',
  },

  // ===========================================
  // History Feature
  // ===========================================
  HISTORY: {
    PAGE: 'history-page',
    LIST: 'history-list',
    DETAIL: 'history-detail',
    ITEM: 'history-item', // 동적: history-item-{id}
    ITEM_ACTION: 'history-item-action',
    REVERT_BUTTON: 'history-revert-button',
  },

  // ===========================================
  // Common / Shared
  // ===========================================
  DIALOG: {
    OVERLAY: 'dialog-overlay',
    CONTENT: 'dialog-content',
    TITLE: 'dialog-title',
    CONFIRM_BUTTON: 'dialog-confirm-button',
    CANCEL_BUTTON: 'dialog-cancel-button',
  },

  ALERT_DIALOG: {
    CONFIRM_BUTTON: 'alert-dialog-confirm-button',
    CANCEL_BUTTON: 'alert-dialog-cancel-button',
  },

  // Loading States
  LOADING: {
    SPINNER: 'loading-spinner',
    SKELETON: 'loading-skeleton',
  },
} as const;

// Type helper for dynamic test IDs
export const testId = {
  // Rules
  rulesSetItem: (id: string) => `rules-set-item-${id}`,
  rulesPoolItem: (id: string) => `rules-pool-item-${id}`,
  rulesSetRuleItem: (id: string) => `rules-set-rule-item-${id}`,

  // Sync
  syncToolItem: (id: string) => `sync-tool-item-${id}`,
  syncRulesetItem: (id: string) => `sync-ruleset-item-${id}`,
  syncMcpsetItem: (id: string) => `sync-mcpset-item-${id}`,
  // Sync Column Items
  syncColumnToolsItem: (id: string) => `sync-column-tools-item-${id}`,
  syncColumnRulesItem: (id: string) => `sync-column-rules-item-${id}`,
  syncColumnMcpItem: (id: string) => `sync-column-mcp-item-${id}`,

  // MCP
  mcpSetItem: (id: string) => `mcp-set-item-${id}`,
  mcpServerItem: (id: string) => `mcp-server-item-${id}`,

  // History
  historyItem: (id: string) => `history-item-${id}`,
} as const;
