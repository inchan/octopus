# Tools Feature - E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 50 |
| High Priority | 14 (28%) |
| Medium Priority | 22 (44%) |
| Low Priority | 14 (28%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 50 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 50 |
| High Priority | 14 (28%) |
| Medium Priority | 22 (44%) |
| Low Priority | 14 (28%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 50 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 50 |
| High Priority | 14 (28%) |
| Medium Priority | 22 (44%) |
| Low Priority | 14 (28%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 50 | ██████████ 100% |

## Tool Discovery & Display

### TC-TOOLS-E001: View installed tools on application start
- **Description**: Verify Tools page loads and displays detected tools
- **Preconditions**:
  - Application started
  - At least one AI tool installed on system
- **Steps**:
  1. Navigate to Tools page from sidebar
  2. Wait for tool detection to complete
  3. Verify loading spinner appears initially
  4. Verify tool cards displayed after loading
  5. Verify each card shows tool name, type badge, and installation status
- **Expected Result**: All installed tools displayed with correct metadata
- **Priority**: High

### TC-TOOLS-E002: View tools when none are installed
- **Description**: Verify empty state shown when no tools detected
- **Preconditions**:
  - Clean system with no AI tools installed
- **Steps**:
  1. Navigate to Tools page
  2. Wait for detection to complete
  3. Verify "No tools match your search" message shown
  4. Verify all tool cards show "Not Detected" badge
- **Expected Result**: Empty state or not-detected indicators displayed
- **Priority**: Medium

### TC-TOOLS-E003: Search for specific tool by name
- **Description**: Verify search functionality filters tools correctly
- **Preconditions**:
  - Tools page loaded with multiple tools
- **Steps**:
  1. Type "cursor" in search input
  2. Verify only Cursor tool card visible
  3. Clear search
  4. Verify all tools visible again
  5. Type "xyz" (non-existent)
  6. Verify "No tools match your search" message
- **Expected Result**: Search filters tools in real-time
- **Priority**: High

### TC-TOOLS-E004: View tool details for installed CLI tool
- **Description**: Verify CLI tool displays version and binary path
- **Preconditions**:
  - Claude Code CLI installed via `npm install -g claude-code`
- **Steps**:
  1. Navigate to Tools page
  2. Find Claude Code card
  3. Verify "Installed" badge shown
  4. Verify version number displayed
  5. Verify binary path basename shown
  6. Verify "CLI" type badge visible
- **Expected Result**: CLI tool metadata correctly displayed
- **Priority**: High

### TC-TOOLS-E005: View tool details for installed IDE
- **Description**: Verify IDE tool displays app path
- **Preconditions**:
  - Cursor IDE installed in /Applications
- **Steps**:
  1. Navigate to Tools page
  2. Find Cursor card
  3. Verify "Installed" badge shown
  4. Verify app path basename "Cursor.app" displayed
  5. Verify "IDE" type badge visible
  6. Verify Configure button enabled
- **Expected Result**: IDE tool metadata correctly displayed
- **Priority**: High

### TC-TOOLS-E006: Verify Configure button disabled for uninstalled tools
- **Description**: Ensure users cannot configure uninstalled tools
- **Preconditions**:
  - Tool not installed on system
- **Steps**:
  1. Navigate to Tools page
  2. Find uninstalled tool card
  3. Verify "Not Detected" badge shown
  4. Verify Configure button is disabled (grayed out)
  5. Attempt to click button
  6. Verify no dialog opens
- **Expected Result**: Configure button disabled and non-functional
- **Priority**: Medium

### TC-TOOLS-E007: Refresh tool detection
- **Description**: Verify page re-detects tools on refresh
- **Preconditions**:
  - Tools page loaded
- **Steps**:
  1. Note current tool list
  2. Install new tool (e.g., VS Code)
  3. Refresh browser page
  4. Verify new tool appears in list with "Installed" badge
- **Expected Result**: Detection runs on page load
- **Priority**: Medium

## Tool Configuration

### TC-TOOLS-E008: Open configuration dialog for installed tool
- **Description**: Verify Configure button opens dialog
- **Preconditions**:
  - Cursor installed
  - At least one RuleSet exists
  - At least one McpSet exists
- **Steps**:
  1. Navigate to Tools page
  2. Click "Configure" button on Cursor card
  3. Verify dialog opens with title "Configure Cursor"
  4. Verify RuleSet dropdown visible
  5. Verify McpSet dropdown visible
  6. Verify "Import from ~/.claude/CLAUDE.md" button visible
- **Expected Result**: Dialog opens with all configuration options
- **Priority**: High

### TC-TOOLS-E009: Configure tool with new RuleSet and McpSet
- **Description**: Verify user can save configuration
- **Preconditions**:
  - Configuration dialog open for Cursor
  - RuleSets list: [Web Dev Rules, Python Rules]
  - McpSets list: [Local MCP, Remote MCP]
- **Steps**:
  1. Select "Web Dev Rules" from RuleSet dropdown
  2. Select "Local MCP" from McpSet dropdown
  3. Click "Save Changes"
  4. Wait for save to complete
  5. Verify dialog closes
  6. Reopen configuration dialog
  7. Verify selections persisted (Web Dev Rules and Local MCP selected)
- **Expected Result**: Configuration saved and persists
- **Priority**: High

### TC-TOOLS-E010: Configure tool with only RuleSet (no McpSet)
- **Description**: Verify partial configuration allowed
- **Preconditions**:
  - Configuration dialog open
- **Steps**:
  1. Select "Python Rules" from RuleSet dropdown
  2. Leave McpSet as "None"
  3. Click "Save Changes"
  4. Verify dialog closes
  5. Reopen dialog
  6. Verify only RuleSet saved, McpSet still "None"
- **Expected Result**: Partial configuration works
- **Priority**: Medium

### TC-TOOLS-E011: Clear existing configuration
- **Description**: Verify user can remove configuration
- **Preconditions**:
  - Tool has existing RuleSet and McpSet configured
- **Steps**:
  1. Open configuration dialog
  2. Change RuleSet to "None"
  3. Change McpSet to "None"
  4. Click "Save Changes"
  5. Reopen dialog
  6. Verify both dropdowns show "None"
- **Expected Result**: Configuration cleared successfully
- **Priority**: Medium

### TC-TOOLS-E012: Cancel configuration changes
- **Description**: Verify Cancel button discards changes
- **Preconditions**:
  - Configuration dialog open with no existing config
- **Steps**:
  1. Select "Web Dev Rules" from dropdown
  2. Click "Cancel" button
  3. Verify dialog closes
  4. Reopen dialog
  5. Verify RuleSet still "None" (change not saved)
- **Expected Result**: Changes discarded on cancel
- **Priority**: Medium

### TC-TOOLS-E013: Import rules from ~/.claude/CLAUDE.md
- **Description**: Verify import creates new RuleSet
- **Preconditions**:
  - File exists at ~/.claude/CLAUDE.md with valid rule content
  - Configuration dialog open
- **Steps**:
  1. Click "Import from ~/.claude/CLAUDE.md" button
  2. Confirm import in dialog prompt
  3. Wait for import to complete
  4. Verify success alert shows number of imported rules
  5. Verify new RuleSet appears in dropdown with auto-generated name
  6. Verify new RuleSet is auto-selected
  7. Click Save
  8. Verify configuration saved with imported RuleSet
- **Expected Result**: Import creates and applies new RuleSet
- **Priority**: High

### TC-TOOLS-E014: Handle import failure gracefully
- **Description**: Verify error message on import failure
- **Preconditions**:
  - File ~/.claude/CLAUDE.md does not exist
- **Steps**:
  1. Open configuration dialog
  2. Click import button
  3. Confirm import
  4. Verify error alert shown with descriptive message
  5. Verify dialog remains open
  6. Verify RuleSet dropdown unchanged
- **Expected Result**: Error handled gracefully, dialog usable
- **Priority**: Medium

### TC-TOOLS-E015: Configure multiple tools independently
- **Description**: Verify each tool has separate configuration
- **Preconditions**:
  - Cursor and Windsurf both installed
- **Steps**:
  1. Configure Cursor with RuleSet A
  2. Save and close dialog
  3. Configure Windsurf with RuleSet B
  4. Save and close
  5. Reopen Cursor config
  6. Verify RuleSet A still selected
  7. Reopen Windsurf config
  8. Verify RuleSet B still selected
- **Expected Result**: Configurations independent per tool
- **Priority**: High

### TC-TOOLS-E016: View orphaned RuleSet in configuration
- **Description**: Verify dialog handles deleted RuleSet gracefully
- **Preconditions**:
  - Tool configured with RuleSet "rs-001"
  - RuleSet "rs-001" deleted from database
- **Steps**:
  1. Open configuration dialog for tool
  2. Verify RuleSet dropdown shows "(Missing) ID: rs-001..."
  3. Verify console warning logged
  4. Verify user can change to different RuleSet
  5. Save with new RuleSet
  6. Verify orphan reference replaced
- **Expected Result**: Orphan visible but replaceable
- **Priority**: High

### TC-TOOLS-E017: View orphaned McpSet in configuration
- **Description**: Verify dialog handles deleted McpSet gracefully
- **Preconditions**:
  - Tool configured with McpSet "mcp-999"
  - McpSet deleted from database
- **Steps**:
  1. Open configuration dialog
  2. Verify McpSet dropdown shows "(Missing) ID: mcp-999..."
  3. Verify console warning logged
  4. Change to "None" or valid McpSet
  5. Save changes
  6. Verify orphan reference cleared
- **Expected Result**: Orphan visible and replaceable
- **Priority**: Medium

### TC-TOOLS-E018: Handle slow API response during dialog load
- **Description**: Verify loading spinner shown during data fetch
- **Preconditions**:
  - Slow network or large RuleSet/McpSet lists
- **Steps**:
  1. Open configuration dialog
  2. Verify spinner shown immediately
  3. Verify dropdowns not rendered yet
  4. Wait for data load
  5. Verify spinner replaced with form
- **Expected Result**: Loading state prevents interaction until ready
- **Priority**: Low

### TC-TOOLS-E019: Handle save error with retry
- **Description**: Verify user can retry after save failure
- **Preconditions**:
  - Mock network failure during save
- **Steps**:
  1. Configure tool and click Save
  2. Verify error logged (check console)
  3. Verify dialog remains open
  4. Verify selections still intact
  5. Fix network (unmock)
  6. Click Save again
  7. Verify save succeeds
- **Expected Result**: Failed save doesn't lose data
- **Priority**: Medium

## Project-Specific Configuration

### TC-TOOLS-E020: Configure tool for specific project
- **Description**: Verify project-scoped configuration works
- **Preconditions**:
  - Project "MyApp" exists
  - Navigate to project details page
- **Steps**:
  1. Open tool configuration from project context
  2. Verify contextId matches project ID
  3. Configure with project-specific RuleSet
  4. Save configuration
  5. Navigate to Tools page (global context)
  6. Open same tool config
  7. Verify different configuration (global vs project)
- **Expected Result**: Project config separate from global
- **Priority**: High

### TC-TOOLS-E021: Override global config with project config
- **Description**: Verify project config takes precedence
- **Preconditions**:
  - Global config: Cursor -> RuleSet A
  - Project config: Cursor -> RuleSet B
- **Steps**:
  1. Generate config files for project
  2. Verify RuleSet B rules applied (not RuleSet A)
- **Expected Result**: Project config overrides global
- **Priority**: High

## UI/UX Flow

### TC-TOOLS-E022: Navigate from Tools page to Rules page
- **Description**: Verify workflow to create RuleSet
- **Preconditions**:
  - No RuleSets exist
- **Steps**:
  1. Navigate to Tools page
  2. Click Configure on tool
  3. Notice RuleSet dropdown only has "None"
  4. Cancel dialog
  5. Navigate to Rules page via sidebar
  6. Create new RuleSet "My Rules"
  7. Navigate back to Tools page
  8. Open configuration dialog
  9. Verify "My Rules" now appears in dropdown
- **Expected Result**: Newly created RuleSet available
- **Priority**: Medium

### TC-TOOLS-E023: Configure tool then generate sync files
- **Description**: Verify end-to-end workflow from config to sync
- **Preconditions**:
  - Cursor installed and configured with RuleSet
- **Steps**:
  1. Navigate to Sync page
  2. Trigger sync for Cursor
  3. Verify generated files include rules from configured RuleSet
- **Expected Result**: Tool config affects sync output
- **Priority**: High

### TC-TOOLS-E024: View tool configuration in read-only mode
- **Description**: Verify configuration can be viewed without editing
- **Preconditions**:
  - Tool has existing configuration
- **Steps**:
  1. Open configuration dialog
  2. Note current selections
  3. Do not change anything
  4. Click Cancel or close dialog
  5. Verify no API calls made for save
- **Expected Result**: Read-only viewing works
- **Priority**: Low

### TC-TOOLS-E025: Configure tool with empty RuleSets list
- **Description**: Verify graceful handling when no RuleSets exist
- **Preconditions**:
  - Database has zero RuleSets
- **Steps**:
  1. Open configuration dialog
  2. Verify RuleSet dropdown shows only "None"
  3. Verify McpSet dropdown functional (if sets exist)
  4. Select McpSet only
  5. Save successfully
- **Expected Result**: Can save with no RuleSet available
- **Priority**: Medium

### TC-TOOLS-E026: Configure tool with empty McpSets list
- **Description**: Verify graceful handling when no McpSets exist
- **Preconditions**:
  - Database has zero McpSets
- **Steps**:
  1. Open configuration dialog
  2. Verify McpSet dropdown shows only "None"
  3. Configure RuleSet only
  4. Save successfully
- **Expected Result**: Can save with no McpSet available
- **Priority**: Medium

## Multi-Tool Scenarios

### TC-TOOLS-E027: Detect and configure 5+ tools
- **Description**: Verify scalability with many tools
- **Preconditions**:
  - Install Claude CLI, Cursor, VS Code, Windsurf, Claude Desktop
- **Steps**:
  1. Navigate to Tools page
  2. Verify all 5 tools detected and displayed
  3. Configure each tool with different RuleSets
  4. Verify all configs save independently
  5. Refresh page
  6. Verify all 5 configs persisted
- **Expected Result**: System handles multiple tools correctly
- **Priority**: Medium

### TC-TOOLS-E028: Search and configure in one flow
- **Description**: Verify search doesn't interfere with configuration
- **Preconditions**:
  - Multiple tools installed
- **Steps**:
  1. Search for "cursor"
  2. Click Configure on filtered Cursor card
  3. Configure and save
  4. Clear search
  5. Verify all tools visible again
  6. Verify Cursor config saved (reopen to check)
- **Expected Result**: Search and config work together
- **Priority**: Low

### TC-TOOLS-E029: Configure all installed tools with same RuleSet
- **Description**: Verify batch-like configuration workflow
- **Preconditions**:
  - 3 tools installed
  - RuleSet "Universal Rules" exists
- **Steps**:
  1. Configure Tool 1 with "Universal Rules"
  2. Configure Tool 2 with "Universal Rules"
  3. Configure Tool 3 with "Universal Rules"
  4. Verify all save successfully
- **Expected Result**: Same RuleSet can be assigned to multiple tools
- **Priority**: Low

## Error Handling & Edge Cases

### TC-TOOLS-E030: Handle tool detection failure
- **Description**: Verify graceful degradation on detection error
- **Preconditions**:
  - Mock detection API to throw error
- **Steps**:
  1. Navigate to Tools page
  2. Verify error message shown
  3. Verify page doesn't crash
  4. Reload page (unmock error)
  5. Verify tools load correctly
- **Expected Result**: Recoverable error state
- **Priority**: High

### TC-TOOLS-E031: Handle database error during config load
- **Description**: Verify error message on DB failure
- **Preconditions**:
  - Mock toolConfig.get to fail
- **Steps**:
  1. Open configuration dialog
  2. Verify error logged or shown
  3. Verify dialog shows degraded state or error UI
- **Expected Result**: Error communicated to user
- **Priority**: Medium

### TC-TOOLS-E032: Rapidly open and close dialog
- **Description**: Verify no race conditions or memory leaks
- **Preconditions**:
  - Tools page loaded
- **Steps**:
  1. Click Configure button
  2. Immediately close dialog (before load completes)
  3. Repeat 5 times rapidly
  4. Verify no console errors
  5. Verify dialog still functional
- **Expected Result**: No race conditions or crashes
- **Priority**: Low

### TC-TOOLS-E033: Configure tool while detection is running
- **Description**: Verify concurrent operations don't conflict
- **Preconditions**:
  - Tools page loading
- **Steps**:
  1. Navigate to Tools page
  2. As soon as first tool card appears, click Configure
  3. Verify dialog opens
  4. Verify detection continues in background
- **Expected Result**: Operations independent
- **Priority**: Low

### TC-TOOLS-E034: Handle special characters in tool name search
- **Description**: Verify search doesn't break with special input
- **Preconditions**:
  - Tools page loaded
- **Steps**:
  1. Type "c++" in search (regex special chars)
  2. Verify search treats as literal string
  3. Verify no errors
  4. Type "<script>" (XSS attempt)
  5. Verify no code execution, treated as literal
- **Expected Result**: Search safely handles all input
- **Priority**: Medium

### TC-TOOLS-E035: Handle very long tool name in UI
- **Description**: Verify UI adapts to long names
- **Preconditions**:
  - Mock tool with 100-character name
- **Steps**:
  1. Navigate to Tools page
  2. Verify card layout not broken
  3. Verify text truncates or wraps gracefully
- **Expected Result**: UI remains functional
- **Priority**: Low

### TC-TOOLS-E036: Configure tool after RuleSet deletion
- **Description**: Verify orphan cleanup workflow
- **Preconditions**:
  - Tool configured with RuleSet A
  - Delete RuleSet A
- **Steps**:
  1. Open tool configuration
  2. Verify orphan placeholder shown
  3. Change to valid RuleSet B
  4. Save
  5. Reopen configuration
  6. Verify RuleSet B selected (orphan cleaned)
- **Expected Result**: Orphan replaced smoothly
- **Priority**: Medium

### TC-TOOLS-E037: Import large CLAUDE.md file
- **Description**: Verify import handles large files
- **Preconditions**:
  - ~/.claude/CLAUDE.md contains 100+ rule sections
- **Steps**:
  1. Open configuration dialog
  2. Click import button
  3. Confirm import
  4. Wait for completion (may take several seconds)
  5. Verify success message
  6. Verify new RuleSet contains all imported rules
- **Expected Result**: Large imports succeed
- **Priority**: Low

### TC-TOOLS-E038: Concurrent configuration of same tool
- **Description**: Verify last write wins with concurrent edits
- **Preconditions**:
  - Open configuration dialog in two browser tabs
- **Steps**:
  1. Tab 1: Select RuleSet A
  2. Tab 2: Select RuleSet B
  3. Tab 1: Click Save
  4. Tab 2: Click Save
  5. Reload both tabs
  6. Verify RuleSet B saved (last write)
- **Expected Result**: No data corruption
- **Priority**: Low

### TC-TOOLS-E039: Handle missing IPC bridge (window.api undefined)
- **Description**: Verify graceful degradation without IPC
- **Preconditions**:
  - Run in browser without Electron context
- **Steps**:
  1. Navigate to Tools page
  2. Verify error message or empty state
  3. Verify no console errors (should be caught)
- **Expected Result**: Graceful degradation
- **Priority**: Medium

### TC-TOOLS-E040: Verify debug info visibility
- **Description**: Check debug info helps troubleshooting
- **Preconditions**:
  - Detection returns debugInfo object
- **Steps**:
  1. Navigate to Tools page
  2. Open browser console
  3. Verify debugInfo logged (optional)
  4. Search for non-existent tool to trigger empty state
  5. Verify DebugInfoBlock component visible
  6. Verify debugInfo contains useful metadata (toolsCount, dataType, etc.)
- **Expected Result**: Debug info aids troubleshooting
- **Priority**: Low

## Integration with Other Features

### TC-TOOLS-E041: Configure tool then sync to filesystem
- **Description**: Verify tool config impacts sync output
- **Preconditions**:
  - Cursor installed and configured with specific RuleSet
- **Steps**:
  1. Navigate to Sync page
  2. Preview sync for Cursor
  3. Verify preview shows rules from configured RuleSet
  4. Apply sync
  5. Verify files written with correct content
- **Expected Result**: Tool config flows through sync
- **Priority**: High

### TC-TOOLS-E042: Create RuleSet, configure tool, then delete RuleSet
- **Description**: Verify orphan detection workflow
- **Preconditions**:
  - No RuleSets exist
- **Steps**:
  1. Create RuleSet "Test Rules"
  2. Configure Cursor with "Test Rules"
  3. Delete "Test Rules" from Rules page
  4. Return to Tools page
  5. Open Cursor configuration
  6. Verify orphan placeholder shown
- **Expected Result**: Orphan detected correctly
- **Priority**: Medium

### TC-TOOLS-E043: Configure tool for project then scan new project
- **Description**: Verify project configs isolated
- **Preconditions**:
  - Project A exists with Cursor config
- **Steps**:
  1. Scan and add Project B
  2. Navigate to Project B details
  3. Open Cursor configuration
  4. Verify no config exists (independent from Project A)
- **Expected Result**: New projects start clean
- **Priority**: Medium

### TC-TOOLS-E044: Import rules then immediately assign to tool
- **Description**: Verify import-to-configure workflow
- **Preconditions**:
  - Configuration dialog open
- **Steps**:
  1. Click import button
  2. Confirm import
  3. Verify new RuleSet auto-selected
  4. Click Save without changing anything
  5. Verify tool configured with imported RuleSet
- **Expected Result**: Import auto-assigns new RuleSet
- **Priority**: Medium

### TC-TOOLS-E045: Configure tool then view in history
- **Description**: Verify configuration changes logged
- **Preconditions**:
  - History feature enabled
- **Steps**:
  1. Configure Cursor with RuleSet A
  2. Save
  3. Navigate to History page
  4. Verify "tool-config" entry logged with toolId and changes
- **Expected Result**: Config changes tracked in history
- **Priority**: Low

## Performance & Usability

### TC-TOOLS-E046: Verify tool detection completes within 5 seconds
- **Description**: Performance benchmark for detection
- **Preconditions**:
  - Normal system with 3-5 tools installed
- **Steps**:
  1. Navigate to Tools page
  2. Start timer
  3. Wait for loading to complete
  4. Stop timer
  5. Verify elapsed time < 5 seconds
- **Expected Result**: Fast detection
- **Priority**: Medium

### TC-TOOLS-E047: Verify dialog opens within 1 second
- **Description**: Performance benchmark for dialog load
- **Preconditions**:
  - Tools page loaded
  - 10 RuleSets and 10 McpSets exist
- **Steps**:
  1. Click Configure button
  2. Measure time until form visible
  3. Verify < 1 second
- **Expected Result**: Snappy dialog load
- **Priority**: Low

### TC-TOOLS-E048: Verify search filters in real-time
- **Description**: Test search responsiveness
- **Preconditions**:
  - 9 tools displayed
- **Steps**:
  1. Start typing "cur"
  2. Verify results update with each keystroke (not debounced)
  3. Verify no lag
- **Expected Result**: Instant search feedback
- **Priority**: Low

### TC-TOOLS-E049: Verify smooth hover effects on tool cards
- **Description**: Test UI polish
- **Preconditions**:
  - Tools page loaded
- **Steps**:
  1. Hover over tool card
  2. Verify gradient overlay appears
  3. Verify card lifts with shadow
  4. Verify icon scales smoothly
  5. Move mouse away
  6. Verify effects reverse smoothly
- **Expected Result**: Polished animations
- **Priority**: Low

### TC-TOOLS-E050: Verify responsive layout on window resize
- **Description**: Test responsive grid
- **Preconditions**:
  - Tools page loaded with 6+ tools
- **Steps**:
  1. Resize window to large (1920px)
  2. Verify 3 columns displayed (lg:grid-cols-3)
  3. Resize to medium (1024px)
  4. Verify 2 columns (md:grid-cols-2)
  5. Resize to small (640px)
  6. Verify 1 column (grid-cols-1)
- **Expected Result**: Responsive layout adapts
- **Priority**: Medium
