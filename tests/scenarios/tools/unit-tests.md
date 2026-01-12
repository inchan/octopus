# Tools Feature - Unit Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 68 |
| High Priority | 32 (47%) |
| Medium Priority | 21 (31%) |
| Low Priority | 15 (22%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 10 | ██░░░░░░░░ 15% |
| Service | 20 | ███░░░░░░░ 29% |
| Handler | 8 | █░░░░░░░░░ 12% |
| Component | 30 | ████░░░░░░ 44% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 68 |
| High Priority | 32 (47%) |
| Medium Priority | 21 (31%) |
| Low Priority | 15 (22%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 10 | ██░░░░░░░░ 15% |
| Service | 20 | ███░░░░░░░ 29% |
| Handler | 8 | █░░░░░░░░░ 12% |
| Component | 30 | ████░░░░░░ 44% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 68 |
| High Priority | 32 (47%) |
| Medium Priority | 21 (31%) |
| Low Priority | 15 (22%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 10 | ██░░░░░░░░ 15% |
| Service | 20 | ███░░░░░░░ 29% |
| Handler | 8 | █░░░░░░░░░ 12% |
| Component | 30 | ████░░░░░░ 44% |

## Tool Detection Service

### TC-TOOLS-R001: Detect all supported tools on clean system
- **Description**: Verify ToolDetector correctly identifies all defined tools in SUPPORTED_TOOLS array
- **Preconditions**:
  - Fresh system with no AI tools installed
  - SUPPORTED_TOOLS contains 9 tool definitions (claude-code, codex-cli, gemini-cli, qwen-code, cursor, vscode, windsurf, antigravity, claude-desktop)
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Verify returned array length matches SUPPORTED_TOOLS length
  3. Check all tools have `isInstalled: false`
- **Expected Result**: Returns 9 ToolDetectionResult objects, all with `isInstalled: false`
- **Priority**: High

### TC-TOOLS-R002: Detect CLI tool via which command
- **Description**: Verify CLI tool detection using `which` command
- **Preconditions**:
  - Mock `which claude` to return `/usr/local/bin/claude`
  - Mock `claude --version` to return `Claude Code v1.2.3`
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Find claude-code in results
  3. Verify `isInstalled: true`
  4. Verify `paths.bin` equals `/usr/local/bin/claude`
  5. Verify `version` equals `Claude Code v1.2.3`
- **Expected Result**: Claude Code detected with correct bin path and version
- **Priority**: High

### TC-TOOLS-R003: Detect macOS app bundle
- **Description**: Verify IDE detection via .app bundle path
- **Preconditions**:
  - Mock fs.stat to return directory exists for `/Applications/Cursor.app`
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Find cursor in results
  3. Verify `isInstalled: true`
  4. Verify `paths.app` equals `/Applications/Cursor.app`
- **Expected Result**: Cursor detected with correct app path
- **Priority**: High

### TC-TOOLS-R004: Detect config directory
- **Description**: Verify config directory detection for installed tools
- **Preconditions**:
  - Mock fs.stat to return directory exists for `~/Library/Application Support/Cursor`
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Find cursor in results
  3. Verify `paths.config` contains correct path
- **Expected Result**: Config path populated in result
- **Priority**: Medium

### TC-TOOLS-R005: Handle CLI command not found
- **Description**: Verify graceful handling when CLI tool is not installed
- **Preconditions**:
  - Mock `which codex` to throw error (command not found)
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Find codex-cli in results
  3. Verify `isInstalled: false`
  4. Verify `paths.bin` is empty or undefined
- **Expected Result**: Tool marked as not installed, no crash
- **Priority**: High

### TC-TOOLS-R006: Handle version check failure
- **Description**: Verify detection succeeds even when version check fails
- **Preconditions**:
  - Mock `which gemini` to succeed
  - Mock `gemini --version` to throw error
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Find gemini-cli in results
  3. Verify `isInstalled: true` (based on which command)
  4. Verify `version` is undefined or empty
- **Expected Result**: Tool detected but without version info
- **Priority**: Medium

### TC-TOOLS-R007: Detect multiple installation locations
- **Description**: Verify detection prioritizes first found location
- **Preconditions**:
  - Mock both `/Applications/VS Code.app` and `~/Applications/VS Code.app` to exist
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Find vscode in results
  3. Verify `paths.app` equals `/Applications/Visual Studio Code.app` (first in list)
- **Expected Result**: First matching path is used
- **Priority**: Low

### TC-TOOLS-R008: Handle tilde expansion in paths
- **Description**: Verify home directory expansion works correctly
- **Preconditions**:
  - Mock os.homedir() to return `/Users/testuser`
  - Mock fs.stat for `/Users/testuser/Applications/Cursor.app`
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Verify tilde is replaced with actual home directory
- **Expected Result**: Tilde correctly expanded to home directory
- **Priority**: Medium

### TC-TOOLS-R009: Detect multiple tools simultaneously
- **Description**: Verify detection works when multiple tools are installed
- **Preconditions**:
  - Mock `which claude` to succeed
  - Mock `/Applications/Cursor.app` to exist
  - Mock `~/Library/Application Support/Claude` to exist
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Verify claude-code has `isInstalled: true`
  3. Verify cursor has `isInstalled: true`
  4. Verify claude-desktop has config path
- **Expected Result**: All installed tools correctly detected
- **Priority**: High

### TC-TOOLS-R010: Handle exec command timeout
- **Description**: Verify graceful handling of hung exec commands
- **Preconditions**:
  - Mock exec to timeout for specific command
- **Steps**:
  1. Call `ToolDetector.detect()`
  2. Wait for completion
  3. Verify promise resolves (doesn't hang)
  4. Verify affected tool marked as not installed
- **Expected Result**: Detection completes, tool marked as unavailable
- **Priority**: Medium

## Tool Configuration Service

### TC-TOOLS-S001: Get global configuration for tool
- **Description**: Verify retrieval of global tool configuration
- **Preconditions**:
  - Database has config: toolId=cursor, contextType=global, contextId=global
- **Steps**:
  1. Call `ToolConfigService.getConfig('cursor', 'global')`
  2. Verify returned ToolConfig matches database record
- **Expected Result**: Correct ToolConfig object returned
- **Priority**: High

### TC-TOOLS-S002: Get project-specific configuration
- **Description**: Verify retrieval of project-scoped configuration
- **Preconditions**:
  - Database has config: toolId=cursor, contextType=project, contextId=proj-123
- **Steps**:
  1. Call `ToolConfigService.getConfig('cursor', 'proj-123')`
  2. Verify contextType inferred as 'project' (not 'global')
  3. Verify correct record returned
- **Expected Result**: Project-specific config retrieved
- **Priority**: High

### TC-TOOLS-S003: Return null for non-existent configuration
- **Description**: Verify null returned when config doesn't exist
- **Preconditions**:
  - Database has no config for windsurf
- **Steps**:
  1. Call `ToolConfigService.getConfig('windsurf', 'global')`
  2. Verify result is null
- **Expected Result**: null returned without error
- **Priority**: High

### TC-TOOLS-S004: Create new tool configuration
- **Description**: Verify new configuration creation
- **Preconditions**:
  - Database has no config for cursor
- **Steps**:
  1. Call `ToolConfigService.setConfig({ toolId: 'cursor', contextType: 'global', contextId: 'global', ruleSetId: 'rs-001', mcpSetId: 'mcp-001' })`
  2. Verify ToolConfig object returned with id
  3. Verify database record created
- **Expected Result**: New config created successfully
- **Priority**: High

### TC-TOOLS-S005: Update existing tool configuration
- **Description**: Verify configuration update (upsert behavior)
- **Preconditions**:
  - Database has config: toolId=cursor, ruleSetId=rs-001
- **Steps**:
  1. Call `ToolConfigService.setConfig({ toolId: 'cursor', contextType: 'global', contextId: 'global', ruleSetId: 'rs-002', mcpSetId: 'mcp-001' })`
  2. Verify existing record updated (not duplicated)
  3. Verify ruleSetId changed to rs-002
- **Expected Result**: Existing config updated
- **Priority**: High

### TC-TOOLS-S006: Set configuration with undefined ruleSetId
- **Description**: Verify optional fields can be omitted
- **Preconditions**:
  - Database empty
- **Steps**:
  1. Call `ToolConfigService.setConfig({ toolId: 'cursor', contextType: 'global', contextId: 'global', mcpSetId: 'mcp-001' })`
  2. Verify config created with ruleSetId as null/undefined
- **Expected Result**: Config created with only mcpSetId
- **Priority**: Medium

### TC-TOOLS-S007: Get all configurations for a project
- **Description**: Verify retrieval of all tool configs for a project
- **Preconditions**:
  - Database has 3 configs for projectId=proj-123 (cursor, windsurf, vscode)
  - Database has 1 config for projectId=proj-456 (cursor)
- **Steps**:
  1. Call `ToolConfigService.getProjectConfigs('proj-123')`
  2. Verify array length is 3
  3. Verify all items have contextId='proj-123'
- **Expected Result**: Only proj-123 configs returned
- **Priority**: High

### TC-TOOLS-S008: Get global configurations
- **Description**: Verify retrieval of all global configs
- **Preconditions**:
  - Database has 2 global configs (cursor, windsurf)
  - Database has 1 project config
- **Steps**:
  1. Call `ToolConfigService.getGlobalConfigs()`
  2. Verify array length is 2
  3. Verify all items have contextType='global'
- **Expected Result**: Only global configs returned
- **Priority**: Medium

### TC-TOOLS-S009: Handle empty project configurations
- **Description**: Verify empty array returned for project with no configs
- **Preconditions**:
  - Database has no configs for projectId=proj-999
- **Steps**:
  1. Call `ToolConfigService.getProjectConfigs('proj-999')`
  2. Verify empty array returned
- **Expected Result**: Empty array (not null or error)
- **Priority**: Medium

### TC-TOOLS-S010: Validate updatedAt timestamp on update
- **Description**: Verify timestamp updates on config change
- **Preconditions**:
  - Database has config with updatedAt=2024-01-01T00:00:00Z
- **Steps**:
  1. Call `ToolConfigService.setConfig()` to update the record
  2. Verify updatedAt is newer than original timestamp
- **Expected Result**: Timestamp reflects update time
- **Priority**: Low

## Tool Config Handler (IPC Layer)

### TC-TOOLS-H001: Validate toolId enum on set
- **Description**: Verify Zod validation rejects invalid toolId
- **Preconditions**:
  - Handler registered with valid tool IDs
- **Steps**:
  1. Call IPC handler with `{ toolId: 'invalid-tool', contextType: 'global', contextId: 'global' }`
  2. Verify Zod throws validation error
  3. Verify error wrapped in Result object with success=false
- **Expected Result**: Validation error returned
- **Priority**: High

### TC-TOOLS-H002: Validate contextType enum
- **Description**: Verify Zod validation rejects invalid contextType
- **Preconditions**:
  - Handler registered
- **Steps**:
  1. Call IPC handler with `{ toolId: 'cursor', contextType: 'workspace', contextId: 'global' }`
  2. Verify validation error
- **Expected Result**: Error for invalid contextType
- **Priority**: High

### TC-TOOLS-H003: Require contextId
- **Description**: Verify contextId is required
- **Preconditions**:
  - Handler registered
- **Steps**:
  1. Call IPC handler with `{ toolId: 'cursor', contextType: 'global' }`
  2. Verify validation error for missing contextId
- **Expected Result**: Validation fails
- **Priority**: High

### TC-TOOLS-H004: Allow optional ruleSetId and mcpSetId
- **Description**: Verify optional fields can be omitted
- **Preconditions**:
  - Handler registered
- **Steps**:
  1. Call IPC handler with `{ toolId: 'cursor', contextType: 'global', contextId: 'global' }`
  2. Verify validation passes
  3. Verify service called with undefined for optional fields
- **Expected Result**: Validation succeeds
- **Priority**: Medium

### TC-TOOLS-H005: Handle missing toolId in get request
- **Description**: Verify error thrown for missing toolId in get
- **Preconditions**:
  - Handler registered
- **Steps**:
  1. Call `tool-config:get` with `{ contextId: 'global' }`
  2. Verify error message "Tool ID is required"
- **Expected Result**: Error returned
- **Priority**: High

### TC-TOOLS-H006: Default contextId to 'global' in get
- **Description**: Verify contextId defaults when omitted
- **Preconditions**:
  - Handler registered
- **Steps**:
  1. Call `tool-config:get` with `{ toolId: 'cursor' }`
  2. Verify service.getConfig called with contextId='global'
- **Expected Result**: Default contextId used
- **Priority**: Medium

### TC-TOOLS-H007: Wrap service errors in Result object
- **Description**: Verify service errors don't crash handler
- **Preconditions**:
  - Mock service to throw database error
- **Steps**:
  1. Call IPC handler
  2. Verify handler returns Result with success=false
  3. Verify error message included
- **Expected Result**: Error wrapped in Result format
- **Priority**: High

### TC-TOOLS-H008: Handle list-project call
- **Description**: Verify project config listing
- **Preconditions**:
  - Handler registered
- **Steps**:
  1. Call `tool-config:list-project` with projectId='proj-123'
  2. Verify service.getProjectConfigs called with correct projectId
- **Expected Result**: Service method invoked correctly
- **Priority**: Medium

## Frontend Components

### TC-TOOLS-C001: ToolsPage - Render loading state
- **Description**: Verify loading spinner shown during detection
- **Preconditions**:
  - Mock useQuery to return `{ isLoading: true }`
- **Steps**:
  1. Render ToolsPage
  2. Verify Loader2 component rendered
  3. Verify text "Detecting installed tools..." shown
- **Expected Result**: Loading UI displayed
- **Priority**: High

### TC-TOOLS-C002: ToolsPage - Render error state
- **Description**: Verify error message shown on detection failure
- **Preconditions**:
  - Mock useQuery to return `{ error: new Error('Detection failed') }`
- **Steps**:
  1. Render ToolsPage
  2. Verify error message contains "Detection failed"
- **Expected Result**: Error UI displayed
- **Priority**: High

### TC-TOOLS-C003: ToolsPage - Render empty tools array
- **Description**: Verify handling of empty tools list
- **Preconditions**:
  - Mock API to return `{ success: true, data: [] }`
- **Steps**:
  1. Render ToolsPage
  2. Verify "No tools match your search" message shown
  3. Verify DebugInfoBlock rendered
- **Expected Result**: Empty state displayed
- **Priority**: Medium

### TC-TOOLS-C004: ToolsPage - Render tools grid
- **Description**: Verify tools rendered in grid layout
- **Preconditions**:
  - Mock API to return 3 tools
- **Steps**:
  1. Render ToolsPage
  2. Verify 3 ToolCard components rendered
  3. Verify grid classes applied
- **Expected Result**: Tools displayed in grid
- **Priority**: High

### TC-TOOLS-C005: ToolsPage - Filter tools by search
- **Description**: Verify search functionality
- **Preconditions**:
  - Mock API to return tools: [Claude Code, Cursor, Windsurf]
- **Steps**:
  1. Render ToolsPage
  2. Type "cur" in search input
  3. Verify only Cursor displayed (case-insensitive match)
- **Expected Result**: Tools filtered correctly
- **Priority**: High

### TC-TOOLS-C006: ToolsPage - Handle malformed API response
- **Description**: Verify graceful handling of non-array response
- **Preconditions**:
  - Mock API to return `{ success: true, data: { tool1: {...}, tool2: {...} } }`
- **Steps**:
  1. Render ToolsPage
  2. Verify Object.values() extracts tools
  3. Verify tools rendered correctly
- **Expected Result**: Object values converted to array
- **Priority**: Medium

### TC-TOOLS-C007: ToolsPage - Open configuration dialog
- **Description**: Verify configure button opens dialog
- **Preconditions**:
  - Mock API to return 1 installed tool
- **Steps**:
  1. Render ToolsPage
  2. Click "Configure" button on tool card
  3. Verify ToolConfigDialog rendered with isOpen=true
  4. Verify toolId and toolName passed correctly
- **Expected Result**: Dialog opens with correct props
- **Priority**: High

### TC-TOOLS-C008: ToolsPage - Close configuration dialog
- **Description**: Verify dialog closes on close callback
- **Preconditions**:
  - Dialog open
- **Steps**:
  1. Trigger onClose callback
  2. Verify ToolConfigDialog receives isOpen=false
- **Expected Result**: Dialog closes
- **Priority**: Medium

### TC-TOOLS-C009: ToolCard - Render installed tool
- **Description**: Verify installed tool styling and badges
- **Preconditions**:
  - Tool object with isInstalled=true
- **Steps**:
  1. Render ToolCard
  2. Verify "Installed" badge has emerald color
  3. Verify Configure button is enabled
- **Expected Result**: Correct UI for installed tool
- **Priority**: High

### TC-TOOLS-C010: ToolCard - Render not installed tool
- **Description**: Verify uninstalled tool styling
- **Preconditions**:
  - Tool object with isInstalled=false
- **Steps**:
  1. Render ToolCard
  2. Verify "Not Detected" badge has zinc color
  3. Verify Configure button is disabled
- **Expected Result**: Correct UI for uninstalled tool
- **Priority**: High

### TC-TOOLS-C011: ToolCard - Display version info
- **Description**: Verify version displayed when available
- **Preconditions**:
  - Tool object with version="v1.2.3"
- **Steps**:
  1. Render ToolCard
  2. Verify version text shown in card footer
- **Expected Result**: Version displayed
- **Priority**: Medium

### TC-TOOLS-C012: ToolCard - Display app path basename
- **Description**: Verify only filename shown for long paths
- **Preconditions**:
  - Tool with paths.app="/Applications/Cursor.app"
- **Steps**:
  1. Render ToolCard
  2. Verify "Cursor.app" shown (not full path)
- **Expected Result**: Path basename extracted
- **Priority**: Low

### TC-TOOLS-C013: ToolCard - Render correct icon by type
- **Description**: Verify icon matches tool type
- **Preconditions**:
  - Three tools: type=cli, type=ide, type=desktop
- **Steps**:
  1. Render three ToolCards
  2. Verify CLI shows Terminal icon
  3. Verify IDE shows Code2 icon
  4. Verify Desktop shows Monitor icon (default)
- **Expected Result**: Icons match types
- **Priority**: Low

### TC-TOOLS-C014: ToolConfigDialog - Load existing configuration
- **Description**: Verify dialog loads current config on open
- **Preconditions**:
  - API returns existing config with ruleSetId=rs-001, mcpSetId=mcp-001
- **Steps**:
  1. Open dialog for toolId=cursor
  2. Verify API calls: sets.rules.list(), sets.mcp.list(), toolConfig.get()
  3. Verify Select components show rs-001 and mcp-001 selected
- **Expected Result**: Existing values populated
- **Priority**: High

### TC-TOOLS-C015: ToolConfigDialog - Load with no existing config
- **Description**: Verify defaults when no config exists
- **Preconditions**:
  - API returns null for toolConfig.get()
- **Steps**:
  1. Open dialog
  2. Verify both Select components default to "none"
- **Expected Result**: Default to "none"
- **Priority**: High

### TC-TOOLS-C016: ToolConfigDialog - Display orphaned RuleSet
- **Description**: Verify placeholder shown for missing RuleSet
- **Preconditions**:
  - Config has ruleSetId=rs-999
  - sets.rules.list() doesn't include rs-999
- **Steps**:
  1. Open dialog
  2. Verify Select shows option: "(Missing) ID: rs-999..."
  3. Verify console warning logged
- **Expected Result**: Orphan RuleSet visible with warning
- **Priority**: High

### TC-TOOLS-C017: ToolConfigDialog - Display orphaned McpSet
- **Description**: Verify placeholder shown for missing McpSet
- **Preconditions**:
  - Config has mcpSetId=mcp-999
  - sets.mcp.list() doesn't include mcp-999
- **Steps**:
  1. Open dialog
  2. Verify Select shows option: "(Missing) ID: mcp-999..."
  3. Verify console warning logged
- **Expected Result**: Orphan McpSet visible with warning
- **Priority**: High

### TC-TOOLS-C018: ToolConfigDialog - Save new configuration
- **Description**: Verify save creates new config
- **Preconditions**:
  - No existing config
  - User selects rs-001 and mcp-001
- **Steps**:
  1. Change selections
  2. Click "Save Changes"
  3. Verify toolConfig.set called with correct params
  4. Verify dialog closes on success
- **Expected Result**: Config saved and dialog closes
- **Priority**: High

### TC-TOOLS-C019: ToolConfigDialog - Save with 'none' selection
- **Description**: Verify 'none' converts to undefined
- **Preconditions**:
  - User selects "none" for both RuleSet and McpSet
- **Steps**:
  1. Click "Save Changes"
  2. Verify toolConfig.set called with ruleSetId=undefined, mcpSetId=undefined
- **Expected Result**: undefined passed to API (not string 'none')
- **Priority**: High

### TC-TOOLS-C020: ToolConfigDialog - Handle save error
- **Description**: Verify error handling during save
- **Preconditions**:
  - Mock toolConfig.set to throw error
- **Steps**:
  1. Click "Save Changes"
  2. Verify error logged to console
  3. Verify isSaving state reset
  4. Verify dialog remains open (user can retry)
- **Expected Result**: Error handled gracefully
- **Priority**: Medium

### TC-TOOLS-C021: ToolConfigDialog - Import from CLAUDE.md
- **Description**: Verify import button triggers import flow
- **Preconditions**:
  - User has ~/.claude/CLAUDE.md file
- **Steps**:
  1. Click "Import from ~/.claude/CLAUDE.md" button
  2. Confirm dialog
  3. Verify sync.import('~/.claude/CLAUDE.md') called
  4. Verify new RuleSet appears in dropdown
  5. Verify new RuleSet auto-selected
- **Expected Result**: Import creates and selects new RuleSet
- **Priority**: High

### TC-TOOLS-C022: ToolConfigDialog - Cancel import
- **Description**: Verify import cancellation
- **Preconditions**:
  - Dialog open
- **Steps**:
  1. Click import button
  2. Click "Cancel" on confirm dialog
  3. Verify sync.import NOT called
- **Expected Result**: Import aborted
- **Priority**: Low

### TC-TOOLS-C023: ToolConfigDialog - Handle import failure
- **Description**: Verify import error handling
- **Preconditions**:
  - Mock sync.import to return { success: false, error: 'File not found' }
- **Steps**:
  1. Trigger import
  2. Confirm
  3. Verify alert shown with error message
- **Expected Result**: Error alert displayed
- **Priority**: Medium

### TC-TOOLS-C024: ToolConfigDialog - Show loading spinner during data fetch
- **Description**: Verify loading UI during initial data load
- **Preconditions**:
  - Mock API calls to delay response
- **Steps**:
  1. Open dialog
  2. Verify Loader2 spinner shown
  3. Wait for data
  4. Verify spinner replaced with form
- **Expected Result**: Loading state displayed
- **Priority**: Medium

### TC-TOOLS-C025: ToolConfigDialog - Disable save button during save
- **Description**: Verify button disabled while saving
- **Preconditions**:
  - Dialog open with valid selections
- **Steps**:
  1. Click "Save Changes"
  2. Immediately check button state
  3. Verify button disabled
  4. Verify spinner shown in button
- **Expected Result**: Save button disabled during save
- **Priority**: Low

### TC-TOOLS-C026: ToolConfigDialog - Respect contextType and contextId
- **Description**: Verify project-specific config can be set
- **Preconditions**:
  - Dialog opened with contextType='project', contextId='proj-123'
- **Steps**:
  1. Save config
  2. Verify toolConfig.set called with contextType='project', contextId='proj-123'
- **Expected Result**: Project context preserved
- **Priority**: High

### TC-TOOLS-C027: ToolsPage - Handle window.api undefined
- **Description**: Verify graceful handling when IPC bridge unavailable
- **Preconditions**:
  - Mock window.api to undefined
- **Steps**:
  1. Render ToolsPage
  2. Verify error message or empty state shown
  3. Verify no crash
- **Expected Result**: Graceful degradation
- **Priority**: Medium

### TC-TOOLS-C028: ToolsPage - Display debug info on empty state
- **Description**: Verify debug info helps troubleshooting
- **Preconditions**:
  - API returns empty tools array with debugInfo
- **Steps**:
  1. Render ToolsPage
  2. Verify DebugInfoBlock rendered with debugInfo prop
- **Expected Result**: Debug data visible
- **Priority**: Low

### TC-TOOLS-C029: ToolCard - Handle missing version gracefully
- **Description**: Verify version section hidden when undefined
- **Preconditions**:
  - Tool object without version field
- **Steps**:
  1. Render ToolCard
  2. Verify version row not rendered (conditional rendering)
- **Expected Result**: No version displayed
- **Priority**: Low

### TC-TOOLS-C030: ToolCard - Handle missing path gracefully
- **Description**: Verify path section hidden when undefined
- **Preconditions**:
  - Tool object with paths.app=undefined
- **Steps**:
  1. Render ToolCard
  2. Verify PATH row not rendered
- **Expected Result**: No path displayed
- **Priority**: Low

## Edge Cases & Error Handling

### TC-TOOLS-S051: ToolDetector - Handle permission denied on directory check
- **Description**: Verify permission errors don't crash detection
- **Preconditions**:
  - Mock fs.stat to throw EACCES error
- **Steps**:
  1. Call ToolDetector.detect()
  2. Verify tool marked as not installed
  3. Verify error logged but detection continues
- **Expected Result**: Detection completes for other tools
- **Priority**: Medium

### TC-TOOLS-S052: ToolDetector - Handle symlink loops
- **Description**: Verify symlink loops handled gracefully
- **Preconditions**:
  - Mock app path to point to circular symlink
- **Steps**:
  1. Call ToolDetector.detect()
  2. Verify detection doesn't hang
  3. Verify tool marked as not installed
- **Expected Result**: No infinite loop
- **Priority**: Low

### TC-TOOLS-S053: ToolConfigService - Handle concurrent updates
- **Description**: Verify last write wins on concurrent updates
- **Preconditions**:
  - Database with existing config
- **Steps**:
  1. Call setConfig for same toolId from two threads
  2. Verify both succeed (upsert behavior)
  3. Verify final state reflects last write
- **Expected Result**: No database lock errors
- **Priority**: Low

### TC-TOOLS-S054: ToolConfigDialog - Handle rapid open/close
- **Description**: Verify no race conditions on rapid dialog toggling
- **Preconditions**:
  - Dialog initially closed
- **Steps**:
  1. Open dialog
  2. Immediately close before data loads
  3. Verify no setState calls on unmounted component
- **Expected Result**: No memory leaks or warnings
- **Priority**: Low

### TC-TOOLS-S055: ToolsPage - Handle very long tool names
- **Description**: Verify UI doesn't break with long names
- **Preconditions**:
  - Mock tool with name="Very Long Tool Name That Exceeds Normal Length And Should Wrap Or Truncate"
- **Steps**:
  1. Render ToolsPage
  2. Verify card layout intact
  3. Verify text wraps or truncates gracefully
- **Expected Result**: UI remains functional
- **Priority**: Low

### TC-TOOLS-S056: ToolDetector - Handle PATH environment variable undefined
- **Description**: Verify detection works when PATH is missing
- **Preconditions**:
  - Mock process.env.PATH to undefined
- **Steps**:
  1. Call ToolDetector.detect()
  2. Verify CLI detection skipped gracefully
  3. Verify app bundle detection still works
- **Expected Result**: Partial detection succeeds
- **Priority**: Medium

### TC-TOOLS-S057: ToolConfigHandler - Handle database connection failure
- **Description**: Verify IPC handler returns error on DB failure
- **Preconditions**:
  - Mock repository to throw database connection error
- **Steps**:
  1. Call tool-config:get
  2. Verify Result with success=false returned
  3. Verify error message descriptive
- **Expected Result**: Error communicated to renderer
- **Priority**: High

### TC-TOOLS-S058: ToolConfigDialog - Handle empty RuleSets list
- **Description**: Verify Select works with zero options
- **Preconditions**:
  - sets.rules.list() returns []
- **Steps**:
  1. Open dialog
  2. Verify RuleSet Select shows only "None" option
  3. Verify user can still save with none selected
- **Expected Result**: Functional with empty sets
- **Priority**: Medium

### TC-TOOLS-S059: ToolsPage - Handle search with special characters
- **Description**: Verify search doesn't break with regex characters
- **Preconditions**:
  - Tools list loaded
- **Steps**:
  1. Type "[cursor]" in search
  2. Verify search treats input as literal string
  3. Verify no regex errors
- **Expected Result**: Search works safely
- **Priority**: Low

### TC-TOOLS-S060: ToolCard - Handle onConfigure callback undefined
- **Description**: Verify card handles missing callback gracefully
- **Preconditions**:
  - ToolCard rendered without onConfigure prop
- **Steps**:
  1. Click Configure button
  2. Verify no crash (though button shouldn't be clickable)
- **Expected Result**: No runtime error
- **Priority**: Low
