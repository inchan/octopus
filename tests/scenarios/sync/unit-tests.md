# Sync Feature - Unit Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 36 |
| High Priority | 17 (47%) |
| Medium Priority | 14 (39%) |
| Low Priority | 5 (14%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 23 | ██████░░░░ 64% |
| Utility | 8 | ██░░░░░░░░ 22% |
| Handler | 5 | █░░░░░░░░░ 14% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 36 |
| High Priority | 17 (47%) |
| Medium Priority | 14 (39%) |
| Low Priority | 5 (14%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 23 | ██████░░░░ 64% |
| Utility | 8 | ██░░░░░░░░ 22% |
| Handler | 5 | █░░░░░░░░░ 14% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 36 |
| High Priority | 17 (47%) |
| Medium Priority | 14 (39%) |
| Low Priority | 5 (14%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 23 | ██████░░░░ 64% |
| Utility | 8 | ██░░░░░░░░ 22% |
| Handler | 5 | █░░░░░░░░░ 14% |

## Service Layer Tests

### TC-SYNC-S001: Sync All - Active Servers Only
- **Description**: Verifies that syncAll() processes only active MCP servers and skips inactive ones
- **Preconditions**:
  - MockMcpService returns mixed active/inactive servers
  - MockConnectionManager can connect successfully
- **Steps**:
  1. Setup 2 servers: one active, one inactive
  2. Call syncService.syncAll()
  3. Verify connection attempts
- **Expected Result**:
  - connect() called only once for active server
  - Results array length equals 1
  - Result status is 'success'
- **Priority**: High

### TC-SYNC-S002: Sync All - Connection Failure Handling
- **Description**: Ensures graceful handling when MCP server connection fails
- **Preconditions**:
  - MockMcpService returns one active server
  - MockConnectionManager.connect() rejects with error
- **Steps**:
  1. Configure connection mock to throw error
  2. Call syncService.syncAll()
  3. Inspect result array
- **Expected Result**:
  - Result status is 'failed'
  - Error message is captured in result.error field
  - No exception thrown
- **Priority**: High

### TC-SYNC-S003: Generate Preview - CLAUDE.md Generator
- **Description**: Validates CLAUDE.md file generation with correct filename and path
- **Preconditions**:
  - Rules and MCP servers available in mocks
  - Target directory is valid
- **Steps**:
  1. Call generatePreview(targetDir, 'claude')
  2. Inspect returned SyncPreviewData
- **Expected Result**:
  - targetPath ends with 'CLAUDE.md'
  - diff.hasChanges is boolean
  - diff.newContent contains generated markdown
- **Priority**: High

### TC-SYNC-S004: Generate Preview - Cursor Rules
- **Description**: Validates .cursorrules file generation for Cursor tool
- **Preconditions**:
  - Rules available in mock
  - Target directory is valid
- **Steps**:
  1. Call generatePreview(targetDir, 'cursor')
  2. Inspect targetPath
- **Expected Result**:
  - targetPath ends with '.cursorrules'
  - Content contains rule text (no markdown headers)
- **Priority**: High

### TC-SYNC-S005: Generate Preview - Windsurf Rules
- **Description**: Validates .windsurfrules file generation for Windsurf tool
- **Preconditions**:
  - Rules available in mock
- **Steps**:
  1. Call generatePreview(targetDir, 'windsurf')
- **Expected Result**:
  - targetPath ends with '.windsurfrules'
  - Content contains rule text with Windsurf-specific formatting
- **Priority**: Medium

### TC-SYNC-S006: Generate Preview - Tool ID Aliases
- **Description**: Ensures 'claude-code' and 'claude-desktop' aliases resolve to CLAUDE.md
- **Preconditions**: Rules/MCP mocks configured
- **Steps**:
  1. Call generatePreview(dir, 'claude-code')
  2. Call generatePreview(dir, 'claude-desktop')
- **Expected Result**:
  - Both return targetPath ending with 'CLAUDE.md'
- **Priority**: Low

### TC-SYNC-S007: Apply Sync - File Write Success
- **Description**: Verifies applySync writes content to specified path
- **Preconditions**:
  - Target directory exists and is writable
- **Steps**:
  1. Call applySync(targetPath, content)
  2. Read file from disk
- **Expected Result**:
  - File exists at targetPath
  - File content matches input content
- **Priority**: High

### TC-SYNC-S008: Apply Sync - Directory Creation
- **Description**: Ensures parent directories are created if missing
- **Preconditions**:
  - Parent directory does not exist
- **Steps**:
  1. Call applySync with path containing non-existent parent dirs
  2. Verify filesystem state
- **Expected Result**:
  - Parent directories created recursively
  - File written successfully
- **Priority**: High

### TC-SYNC-S009: Import CLAUDE.md - Valid File
- **Description**: Validates successful import of well-formed CLAUDE.md file
- **Preconditions**:
  - CLAUDE.md file exists with valid markdown structure
  - File contains ## headings with rule content
- **Steps**:
  1. Create test CLAUDE.md with 2-3 rules
  2. Call importClaudeMd(filePath)
  3. Verify RulesService.create calls
  4. Verify RuleSetService.create call
- **Expected Result**:
  - ruleCount matches number of extracted rules
  - ruleSetId is non-empty string
  - Rules created with correct name/content
  - RuleSet created with all rule IDs
- **Priority**: High

### TC-SYNC-S010: Import CLAUDE.md - Empty File
- **Description**: Handles empty or invalid CLAUDE.md gracefully
- **Preconditions**:
  - CLAUDE.md file exists but is empty
- **Steps**:
  1. Create empty file
  2. Call importClaudeMd(filePath)
- **Expected Result**:
  - ruleCount is 0
  - ruleSetId is empty string
  - No rules created
  - RuleSetService.create not called
- **Priority**: Medium

### TC-SYNC-S011: Import CLAUDE.md - Tilde Expansion
- **Description**: Verifies ~/path expansion for Unix home directory
- **Preconditions**:
  - File path starts with '~/'
  - os.homedir() available
- **Steps**:
  1. Call importClaudeMd('~/test/CLAUDE.md')
  2. Verify path expansion logic
- **Expected Result**:
  - Path correctly expanded to /Users/<user>/test/CLAUDE.md
- **Priority**: Medium

### TC-SYNC-S012: Generate Preview - Diff Detection
- **Description**: Validates hasChanges flag when comparing old vs new content
- **Preconditions**:
  - Target file already exists with content
- **Steps**:
  1. Create existing file with known content
  2. Call generatePreview with rules that produce identical content
  3. Call again with different rules
- **Expected Result**:
  - hasChanges is false when content identical
  - hasChanges is true when content differs
  - oldContent correctly read from disk
- **Priority**: Medium

### TC-SYNC-S013: Generate Preview - New File Detection
- **Description**: Ensures oldContent is null when file doesn't exist
- **Preconditions**:
  - Target file does not exist
- **Steps**:
  1. Call generatePreview for non-existent path
- **Expected Result**:
  - diff.oldContent is null
  - diff.hasChanges is true (new file)
- **Priority**: Medium

### TC-SYNC-S014: Project Sync Preview - Multi-Tool Config
- **Description**: Generates config for multiple tools configured in a project
- **Preconditions**:
  - Project exists with 2 tool configs (e.g., Cursor + Windsurf)
  - Each config has different rule sets
- **Steps**:
  1. Call getProjectSyncPreview(projectId)
  2. Inspect returned GeneratedFile array
- **Expected Result**:
  - Array contains files for both tools
  - Paths are absolute (project path prepended)
  - Tool-specific content matches respective rule sets
- **Priority**: High

### TC-SYNC-S015: Project Sync Preview - Missing Project
- **Description**: Handles request for non-existent project
- **Preconditions**:
  - Project ID does not exist
- **Steps**:
  1. Call getProjectSyncPreview('invalid-id')
- **Expected Result**:
  - Throws error "Project not found: invalid-id"
- **Priority**: Medium

### TC-SYNC-S016: Project Sync Preview - Empty Config
- **Description**: Returns empty array when project has no tool configs
- **Preconditions**:
  - Project exists but toolConfigService returns empty array
- **Steps**:
  1. Call getProjectSyncPreview(projectId)
- **Expected Result**:
  - Returns empty array
  - No errors thrown
- **Priority**: Low

### TC-SYNC-S017: Project Sync Preview - Rule Set Resolution
- **Description**: Resolves rule IDs from rule set and filters correctly
- **Preconditions**:
  - Project config references rule set with 3 rule IDs
  - Only 2 rules exist in database
- **Steps**:
  1. Call getProjectSyncPreview(projectId)
  2. Inspect rules passed to generator
- **Expected Result**:
  - Only 2 existing rules passed to generator
  - Non-existent rule ID is silently skipped
- **Priority**: Medium

### TC-SYNC-S018: Project Sync Preview - MCP Set Resolution
- **Description**: Resolves MCP server IDs from MCP set
- **Preconditions**:
  - Project config references MCP set with server IDs
  - McpSetService returns valid set
- **Steps**:
  1. Call getProjectSyncPreview(projectId)
  2. Verify mcpServers passed to generator
- **Expected Result**:
  - mcpServers array contains servers matching set items
  - Servers correctly filtered from all servers
- **Priority**: Medium

### TC-SYNC-S019: Project Sync Preview - Tool ID Case Handling
- **Description**: Converts lowercase tool ID (e.g., 'cursor') to TitleCase ('Cursor') for generator
- **Preconditions**:
  - Config stores tool ID as 'cursor'
  - ToolIntegrationService expects 'Cursor'
- **Steps**:
  1. Setup config with toolId: 'cursor'
  2. Call getProjectSyncPreview(projectId)
  3. Verify ToolIntegrationService call
- **Expected Result**:
  - ToolIntegrationService.generateConfig called with 'Cursor' (TitleCase)
- **Priority**: Medium

### TC-SYNC-S020: Project Sync Preview - Generator Failure Handling
- **Description**: Continues processing other tools when one generator fails
- **Preconditions**:
  - Project has 2 tool configs
  - First tool's generator throws error
- **Steps**:
  1. Mock ToolIntegrationService to throw on first call
  2. Call getProjectSyncPreview(projectId)
- **Expected Result**:
  - Second tool still processed
  - Results contain files from successful tool
  - Warning logged for failed tool
- **Priority**: Medium

## Generator Tests

### TC-SYNC-S001: ClaudeMdGenerator - Rule Formatting
- **Description**: Validates rule section structure in CLAUDE.md output
- **Preconditions**:
  - Context contains 2 active rules
- **Steps**:
  1. Create context with rules
  2. Call ClaudeMdGenerator.generate(context)
  3. Parse output markdown
- **Expected Result**:
  - Contains "## Active Rules" header
  - Each rule has ### heading with rule name
  - Rule content follows heading
  - No undefined or [object Object] in output
- **Priority**: High

### TC-SYNC-S002: ClaudeMdGenerator - MCP Server Section
- **Description**: Validates MCP server section in CLAUDE.md
- **Preconditions**:
  - Context contains 2 active MCP servers
- **Steps**:
  1. Create context with MCP servers
  2. Call generator.generate(context)
- **Expected Result**:
  - Contains "## Active MCP Servers" header
  - Each server has ### heading with server name
  - Command line displayed with backticks
- **Priority**: High

### TC-SYNC-S003: ClaudeMdGenerator - Inactive Server Filtering
- **Description**: Ensures inactive MCP servers are excluded from output
- **Preconditions**:
  - Context contains 1 active, 1 inactive server
- **Steps**:
  1. Create context with mixed servers
  2. Call generator.generate(context)
- **Expected Result**:
  - Only active server appears in output
  - Inactive server name not present
- **Priority**: Medium

### TC-SYNC-S004: ClaudeMdGenerator - Empty Context
- **Description**: Handles generation with no rules or servers
- **Preconditions**:
  - Context has empty rules and mcpServers arrays
- **Steps**:
  1. Call generator.generate(emptyContext)
- **Expected Result**:
  - Returns valid markdown string
  - Contains header and auto-generation warning
  - No "## Active Rules" or "## Active MCP Servers" sections
- **Priority**: Low

### TC-SYNC-S005: CursorRulesGenerator - Plain Text Output
- **Description**: Validates Cursor rules are plain text without markdown formatting
- **Preconditions**:
  - Context contains 2 rules
- **Steps**:
  1. Call CursorRulesGenerator.generate(context)
- **Expected Result**:
  - Output contains rule content directly
  - No ### headings or markdown syntax
  - Rules separated by blank lines
- **Priority**: High

### TC-SYNC-S006: WindsurfRulesGenerator - Format Consistency
- **Description**: Validates Windsurf-specific formatting
- **Preconditions**:
  - Context contains rules with various content types
- **Steps**:
  1. Call WindsurfRulesGenerator.generate(context)
  2. Inspect output format
- **Expected Result**:
  - Output follows Windsurf conventions
  - Rules properly separated
- **Priority**: Medium

### TC-SYNC-S007: Generator - Long Content Handling
- **Description**: Ensures generators handle rules with very long content (>10KB)
- **Preconditions**:
  - Rule content is 15KB text
- **Steps**:
  1. Create context with large rule
  2. Call each generator
- **Expected Result**:
  - All generators produce complete output
  - No truncation occurs
  - No performance issues
- **Priority**: Low

### TC-SYNC-S008: Generator - Special Character Escaping
- **Description**: Validates handling of markdown special characters in rule content
- **Preconditions**:
  - Rule contains *, #, [], (), etc.
- **Steps**:
  1. Create context with special chars
  2. Call ClaudeMdGenerator.generate(context)
- **Expected Result**:
  - Special characters preserved as-is
  - No unintended markdown rendering
- **Priority**: Medium

## Handler Tests

### TC-SYNC-H001: sync:start Handler - Success
- **Description**: Validates sync:start IPC handler invokes syncAll()
- **Preconditions**:
  - SyncService.syncAll() mocked
- **Steps**:
  1. Invoke 'sync:start' via ipcMain
  2. Verify service method call
- **Expected Result**:
  - syncService.syncAll() called once
  - Result wrapped in ApiResponse format
- **Priority**: High

### TC-SYNC-H002: sync:preview Handler - Validation
- **Description**: Validates input validation for sync:preview
- **Preconditions**:
  - Zod schema configured
- **Steps**:
  1. Call sync:preview with invalid params (empty targetPath)
  2. Call with valid params
- **Expected Result**:
  - Invalid call returns error response with validation message
  - Valid call returns success with preview data
- **Priority**: High

### TC-SYNC-H003: sync:apply Handler - Validation
- **Description**: Validates input validation for sync:apply
- **Preconditions**:
  - applySchema requires targetPath and content
- **Steps**:
  1. Call sync:apply with missing content
  2. Call with empty targetPath
  3. Call with valid params
- **Expected Result**:
  - Invalid calls rejected with clear error
  - Valid call succeeds and writes file
- **Priority**: High

### TC-SYNC-H004: sync:import Handler - Success
- **Description**: Validates sync:import handler invokes importClaudeMd
- **Preconditions**:
  - SyncService.importClaudeMd mocked
- **Steps**:
  1. Invoke 'sync:import' with file path
  2. Verify service call
- **Expected Result**:
  - importClaudeMd called with correct path
  - Result contains ruleSetId and ruleCount
- **Priority**: High

### TC-SYNC-H005: Handler Error Propagation
- **Description**: Ensures service errors are caught and wrapped properly
- **Preconditions**:
  - SyncService method throws error
- **Steps**:
  1. Mock service to throw error
  2. Invoke handler
- **Expected Result**:
  - Handler returns ApiResponse with success: false
  - Error message included in response.error
  - No unhandled rejection
- **Priority**: High

## Integration Tests

### TC-SYNC-S051: End-to-End Preview and Apply
- **Description**: Full workflow from preview to apply using real filesystem
- **Preconditions**:
  - Temp directory available
  - Real services wired (not all mocked)
- **Steps**:
  1. Setup rules in database
  2. Call generatePreview
  3. Verify diff
  4. Call applySync with preview content
  5. Read file from disk
- **Expected Result**:
  - Preview shows correct diff
  - File written matches preview content
- **Priority**: High

### TC-SYNC-S052: Round-trip Import-Export
- **Description**: Import CLAUDE.md, then generate preview to verify consistency
- **Preconditions**:
  - Sample CLAUDE.md file
- **Steps**:
  1. Import CLAUDE.md
  2. Verify rules created
  3. Generate preview using created rule set
  4. Compare with original file
- **Expected Result**:
  - Generated content similar to original (may differ in formatting)
  - All rule content preserved
- **Priority**: Medium

### TC-SYNC-S053: Concurrent Sync Operations
- **Description**: Handles multiple sync operations in parallel
- **Preconditions**:
  - Multiple projects configured
- **Steps**:
  1. Trigger syncAll() for 3 servers simultaneously
  2. Monitor connection manager
- **Expected Result**:
  - All operations complete successfully
  - No race conditions
  - Connection manager handles concurrency
- **Priority**: Low
