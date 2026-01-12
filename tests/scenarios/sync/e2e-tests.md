# Sync Feature - E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 38 |
| High Priority | 16 (42%) |
| Medium Priority | 15 (39%) |
| Low Priority | 7 (18%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 38 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 38 |
| High Priority | 16 (42%) |
| Medium Priority | 15 (39%) |
| Low Priority | 7 (18%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 38 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 38 |
| High Priority | 16 (42%) |
| Medium Priority | 15 (39%) |
| Low Priority | 7 (18%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 38 | ██████████ 100% |

## 3-Column Sync Workflow

### TC-SYNC-E001: Initial Page Load
- **Description**: Verifies Sync page loads with correct 3-column layout
- **Preconditions**:
  - Application running
  - Mock data loaded (tools detected, rule sets, MCP sets)
- **Steps**:
  1. Navigate to /sync route
  2. Wait for page to render
  3. Inspect DOM structure
- **Expected Result**:
  - 3 columns visible: "1. Target Tools", "2. Rules", "3. MCP Servers"
  - Default "All Tools" selected in first column
  - "None" selected in Rules column
  - "None" selected in MCP column
  - "Start Sync" button visible but disabled
  - "Auto-backup active" message displayed
- **Priority**: High

### TC-SYNC-E002: Virtual Tool Sets Display
- **Description**: Validates virtual tool set items are rendered correctly
- **Preconditions**:
  - Tools detection completed
- **Steps**:
  1. Navigate to Sync page
  2. Inspect "Target Tools" column
- **Expected Result**:
  - "All Tools" item shows count badge (e.g., "2 installed tools")
  - "CLI Tools" item visible with "Default" badge
  - "IDE Tools" item visible
  - "Desktop Apps" item visible
  - All items show "Default" badge
- **Priority**: Medium

### TC-SYNC-E003: Rule Sets Display
- **Description**: Validates rule sets from database are displayed
- **Preconditions**:
  - Database contains 2 custom rule sets
- **Steps**:
  1. Navigate to Sync page
  2. Inspect "Rules" column
- **Expected Result**:
  - "None" option displayed with "Default" badge
  - Custom rule sets displayed with "Custom" badge
  - Each set shows item count (e.g., "3 rules")
- **Priority**: Medium

### TC-SYNC-E004: MCP Sets Display
- **Description**: Validates MCP sets from database are displayed
- **Preconditions**:
  - Database contains 1 custom MCP set
- **Steps**:
  1. Navigate to Sync page
  2. Inspect "MCP Servers" column
- **Expected Result**:
  - "None" option displayed
  - Custom MCP sets displayed with server count
- **Priority**: Medium

### TC-SYNC-E005: Tool Set Selection
- **Description**: Validates user can select different tool sets
- **Preconditions**:
  - Sync page loaded
- **Steps**:
  1. Click "CLI Tools" option
  2. Verify selection highlight
  3. Click "IDE Tools"
  4. Verify selection changes
- **Expected Result**:
  - Selected item highlighted (bg-zinc-800/80 border)
  - Previous selection unhighlighted
  - Text color changes (zinc-100 when selected)
  - Badge color changes accordingly
- **Priority**: High

### TC-SYNC-E006: Rule Set Selection
- **Description**: Validates user can select rule sets
- **Preconditions**:
  - Sync page loaded with rule sets
- **Steps**:
  1. Click "My Rules" in Rules column
  2. Verify "Start Sync" button becomes enabled
  3. Click "None"
  4. Verify button disabled again
- **Expected Result**:
  - Selection state updates correctly
  - Button state reflects valid selection (not both None)
- **Priority**: High

### TC-SYNC-E007: MCP Set Selection
- **Description**: Validates user can select MCP sets
- **Preconditions**:
  - Sync page loaded with MCP sets
- **Steps**:
  1. Click "My MCPs" in MCP column
  2. Verify "Start Sync" button enabled
- **Expected Result**:
  - Selection updates
  - Sync button enabled
- **Priority**: High

### TC-SYNC-E008: Sync Button Enable Logic
- **Description**: Validates sync button only enabled when Rules OR MCP selected (not both None)
- **Preconditions**:
  - Sync page with default selections
- **Steps**:
  1. Verify button initially disabled (both None)
  2. Select rule set -> button enabled
  3. Select MCP set -> button enabled
  4. Select None for both -> button disabled
  5. Select both rule set and MCP set -> button enabled
- **Expected Result**:
  - Button disabled only when both are "None"
  - Enabled in all other combinations
- **Priority**: High

### TC-SYNC-E009: Start Sync - Loading State
- **Description**: Validates loading state when generating preview
- **Preconditions**:
  - Valid rule set selected
- **Steps**:
  1. Click "Start Sync" button
  2. Observe button state during generation
- **Expected Result**:
  - Button shows spinner (Loader2 icon)
  - Button text changes to "Analyzing..."
  - Button disabled during generation
- **Priority**: Medium

### TC-SYNC-E010: Preview Dialog Opens
- **Description**: Validates preview dialog opens with generated files
- **Preconditions**:
  - Rule set and MCP set selected
  - Mock API returns generated files
- **Steps**:
  1. Click "Start Sync"
  2. Wait for preview generation
  3. Verify dialog appears
- **Expected Result**:
  - Dialog visible with title "Sync Preview"
  - Description text displayed
  - Warning banner shows file count (e.g., "4 configuration files")
  - File list displays all generated files
  - Cancel and "Confirm & Sync" buttons visible
- **Priority**: High

### TC-SYNC-E011: Preview File List Display
- **Description**: Validates individual file items in preview
- **Preconditions**:
  - Preview dialog open with 2 files
- **Steps**:
  1. Inspect file list items
  2. Verify file information
- **Expected Result**:
  - Each file shows filename (last path segment)
  - Full path shown in smaller text
  - File size badge displayed (e.g., "1024b")
  - File icon displayed
  - Hover effect works
- **Priority**: Medium

### TC-SYNC-E012: Preview Dialog - Cancel
- **Description**: Validates cancel action in preview dialog
- **Preconditions**:
  - Preview dialog open
- **Steps**:
  1. Click "Cancel" button
  2. Verify dialog closes
- **Expected Result**:
  - Dialog closes immediately
  - No files written
  - User returns to selection view
  - Previous selections preserved
- **Priority**: High

### TC-SYNC-E013: Preview Dialog - Confirm Sync
- **Description**: Validates sync execution on confirmation
- **Preconditions**:
  - Preview dialog open with files
- **Steps**:
  1. Click "Confirm & Sync" button
  2. Observe sync process
  3. Wait for completion
- **Expected Result**:
  - Button shows "Syncing..." with spinner
  - Button disabled during sync
  - IPC call made for each file (sync:apply)
  - Dialog closes after completion
  - Success implied by dialog close
- **Priority**: High

### TC-SYNC-E014: Empty Preview Handling
- **Description**: Handles case where no files generated
- **Preconditions**:
  - Rule set selected but contains no active rules
  - Mock returns empty files array
- **Steps**:
  1. Click "Start Sync"
  2. Verify preview dialog state
- **Expected Result**:
  - Dialog opens
  - Shows "No changes detected" message
  - "Confirm & Sync" button disabled
  - Cancel button works normally
- **Priority**: Medium

### TC-SYNC-E015: Full Workflow - All Tools + Rules
- **Description**: Complete workflow selecting All Tools and Rules only
- **Preconditions**:
  - 2 tools installed (Cursor, Vscode)
  - "My Rules" set with 3 rules
- **Steps**:
  1. Navigate to Sync page
  2. Verify "All Tools" selected by default
  3. Select "My Rules"
  4. Click "Start Sync"
  5. Verify preview shows 2 files (one per tool)
  6. Click "Confirm & Sync"
  7. Verify dialog closes
- **Expected Result**:
  - Preview shows .cursorrules and another config file
  - Both files contain rule content
  - Sync completes successfully
- **Priority**: High

### TC-SYNC-E016: Full Workflow - CLI Tools + MCP Only
- **Description**: Complete workflow selecting CLI Tools and MCP only (no rules)
- **Preconditions**:
  - CLI tools detected (Cursor)
  - "My MCPs" set with 2 servers
- **Steps**:
  1. Select "CLI Tools"
  2. Keep Rules as "None"
  3. Select "My MCPs"
  4. Click "Start Sync"
  5. Verify preview
  6. Confirm sync
- **Expected Result**:
  - Preview shows MCP config files only (e.g., CLAUDE.md with MCP section)
  - No rule content in files
  - Sync succeeds
- **Priority**: High

### TC-SYNC-E017: Full Workflow - All Options Selected
- **Description**: Maximum complexity scenario with all selections
- **Preconditions**:
  - Multiple tools installed
  - Rules and MCP sets available
- **Steps**:
  1. Select "All Tools"
  2. Select "My Rules"
  3. Select "My MCPs"
  4. Click "Start Sync"
  5. Verify preview file count
  6. Confirm sync
- **Expected Result**:
  - Preview shows files for all tools
  - Each file contains both rules and MCP config
  - File count = tools × expected files per tool
  - All files synced successfully
- **Priority**: High

### TC-SYNC-E018: Tool Filtering - CLI Tools
- **Description**: Validates CLI Tools filter targets only terminal-based tools
- **Preconditions**:
  - Mix of CLI and IDE tools installed
- **Steps**:
  1. Select "CLI Tools"
  2. Click "Start Sync" (with rule set)
  3. Inspect generated files
- **Expected Result**:
  - Files generated only for Cursor, Windsurf, Cline
  - No VSCode or desktop app files
- **Priority**: Medium

### TC-SYNC-E019: Tool Filtering - IDE Tools
- **Description**: Validates IDE Tools filter targets IDEs only
- **Preconditions**:
  - Mix of tools installed
- **Steps**:
  1. Select "IDE Tools"
  2. Generate preview
- **Expected Result**:
  - Files for Cursor, VSCode only
  - No CLI-only or desktop-only tools
- **Priority**: Medium

### TC-SYNC-E020: Error Handling - Generation Failure
- **Description**: Handles API error during preview generation
- **Preconditions**:
  - Mock API configured to fail on generateConfig
- **Steps**:
  1. Select valid options
  2. Click "Start Sync"
  3. Wait for error
- **Expected Result**:
  - Alert shown: "Failed to generate preview."
  - Loading state ends
  - User can retry
- **Priority**: High

### TC-SYNC-E021: Error Handling - Sync Failure
- **Description**: Handles API error during sync:apply
- **Preconditions**:
  - Preview opened successfully
  - Mock API fails on sync:apply
- **Steps**:
  1. Click "Confirm & Sync"
  2. Wait for error
- **Expected Result**:
  - Console error logged
  - Alert shown: "Sync failed execution."
  - Dialog remains open or closes (depending on error timing)
- **Priority**: High

### TC-SYNC-E022: Resizable Panels
- **Description**: Validates resizable panel functionality
- **Preconditions**:
  - Sync page loaded
- **Steps**:
  1. Locate resize handles between columns
  2. Drag handle to resize
  3. Verify column widths change
- **Expected Result**:
  - Drag works smoothly
  - Column proportions update
  - Content reflows correctly
  - Min size constraints respected (minSize={20})
- **Priority**: Low

### TC-SYNC-E023: Responsive Layout
- **Description**: Validates layout behavior at different viewport sizes
- **Preconditions**:
  - Sync page loaded
- **Steps**:
  1. Resize browser window to 1024px width
  2. Resize to 1440px
  3. Verify column layout
- **Expected Result**:
  - Columns remain visible and functional at all sizes
  - No horizontal scroll required
  - Text truncates properly if needed
- **Priority**: Low

## Empty State Scenarios

### TC-SYNC-E024: No Tools Detected
- **Description**: Handles case where no tools are installed
- **Preconditions**:
  - Tool detection returns empty array
- **Steps**:
  1. Navigate to Sync page
  2. Inspect "Target Tools" column
- **Expected Result**:
  - Virtual tool sets still displayed
  - "All Tools" shows "0 installed tools"
  - User can still select tool sets
  - Warning or help message may be shown
- **Priority**: Medium

### TC-SYNC-E025: No Rule Sets Available
- **Description**: Handles case where no custom rule sets exist
- **Preconditions**:
  - Database has no rule sets
- **Steps**:
  1. Navigate to Sync page
  2. Inspect "Rules" column
- **Expected Result**:
  - Only "None" option displayed
  - No error shown
  - User can navigate to Rules page to create sets
- **Priority**: Medium

### TC-SYNC-E026: No MCP Sets Available
- **Description**: Handles case where no MCP sets exist
- **Preconditions**:
  - Database has no MCP sets
- **Steps**:
  1. Navigate to Sync page
  2. Inspect "MCP Servers" column
- **Expected Result**:
  - Only "None" option displayed
  - Sync still works with Rules only
- **Priority**: Medium

### TC-SYNC-E027: All Empty State
- **Description**: Handles complete empty state (no tools, rules, or MCP)
- **Preconditions**:
  - Fresh installation, nothing configured
- **Steps**:
  1. Navigate to Sync page
  2. Verify all columns
- **Expected Result**:
  - Virtual tool sets displayed but show "0 installed tools"
  - "None" only option in Rules and MCP columns
  - "Start Sync" button disabled
  - Help text guides user to setup
- **Priority**: Low

## Data Consistency Scenarios

### TC-SYNC-E028: Rule Set Content Accuracy
- **Description**: Validates generated files contain correct rule content
- **Preconditions**:
  - "My Rules" set contains 3 specific rules
  - Rule IDs: r1, r2, r3
- **Steps**:
  1. Select "All Tools" and "My Rules"
  2. Open preview
  3. Inspect file content
- **Expected Result**:
  - All 3 rules present in generated files
  - Rule content matches database exactly
  - No rule duplication
  - No missing rules
- **Priority**: High

### TC-SYNC-E029: MCP Set Content Accuracy
- **Description**: Validates MCP servers correctly included in configs
- **Preconditions**:
  - "My MCPs" set contains 2 servers with specific commands
- **Steps**:
  1. Select tool set and "My MCPs"
  2. Generate preview
  3. Inspect file content for MCP section
- **Expected Result**:
  - Both servers listed
  - Commands and args correctly formatted
  - Server names accurate
- **Priority**: High

### TC-SYNC-E030: Inactive Rule Filtering
- **Description**: Ensures inactive rules excluded even if in set
- **Preconditions**:
  - Rule set contains 3 rule IDs
  - One rule marked isActive: false
- **Steps**:
  1. Select rule set
  2. Generate preview
  3. Count rules in output
- **Expected Result**:
  - Only 2 active rules included
  - Inactive rule not present
- **Priority**: Medium

### TC-SYNC-E031: Tool Type-Specific Formatting
- **Description**: Validates each tool gets appropriate file format
- **Preconditions**:
  - Cursor, Windsurf, Claude all configured
- **Steps**:
  1. Select "All Tools" with rules
  2. Open preview
  3. Inspect each file
- **Expected Result**:
  - Cursor: .cursorrules with plain text
  - Windsurf: .windsurfrules with formatted rules
  - Claude: CLAUDE.md with markdown structure
- **Priority**: High

## Performance Scenarios

### TC-SYNC-E032: Large Rule Set Performance
- **Description**: Validates performance with 50+ rules in set
- **Preconditions**:
  - Rule set with 50 rules, each 500 chars
- **Steps**:
  1. Select large rule set
  2. Click "Start Sync"
  3. Measure time to preview
- **Expected Result**:
  - Preview generation completes in < 2 seconds
  - UI remains responsive
  - Preview dialog scrolls smoothly
- **Priority**: Low

### TC-SYNC-E033: Multiple Tools Performance
- **Description**: Validates performance with 5+ tools
- **Preconditions**:
  - 5 tools installed
  - Large rule and MCP sets selected
- **Steps**:
  1. Select "All Tools", rules, MCP
  2. Generate preview
  3. Measure generation time
- **Expected Result**:
  - Completes in < 5 seconds
  - Preview shows 5+ files
  - No UI freeze
- **Priority**: Low

### TC-SYNC-E034: Sync Write Performance
- **Description**: Validates file writing performance for many files
- **Preconditions**:
  - Preview with 10 files
- **Steps**:
  1. Confirm sync
  2. Measure completion time
- **Expected Result**:
  - All files written in < 3 seconds
  - Dialog closes promptly
  - No visible lag
- **Priority**: Low

## Accessibility Scenarios

### TC-SYNC-E035: Keyboard Navigation
- **Description**: Validates sync workflow can be completed via keyboard
- **Preconditions**:
  - Sync page loaded
- **Steps**:
  1. Tab through interface elements
  2. Use arrow keys to select items in columns
  3. Press Enter to confirm selections
  4. Tab to "Start Sync" and press Enter
  5. Navigate preview dialog via keyboard
  6. Press Enter on "Confirm & Sync"
- **Expected Result**:
  - All interactive elements accessible via keyboard
  - Focus indicators visible
  - Tab order logical
  - Enter key activates buttons
- **Priority**: Medium

### TC-SYNC-E036: Screen Reader Compatibility
- **Description**: Validates ARIA labels and semantic HTML for screen readers
- **Preconditions**:
  - Screen reader enabled (e.g., VoiceOver)
- **Steps**:
  1. Navigate to Sync page
  2. Use screen reader to explore interface
  3. Verify announcements for state changes
- **Expected Result**:
  - Column titles announced
  - Selection state changes announced
  - Button state (enabled/disabled) announced
  - Dialog opens and closes with announcements
- **Priority**: Medium

## Test Data Scenarios

### TC-SYNC-E037: testid Attributes Present
- **Description**: Validates all testid attributes for automation
- **Preconditions**:
  - Sync page loaded
- **Steps**:
  1. Inspect DOM for data-testid attributes
- **Expected Result**:
  - [data-testid="sync-page"] on root
  - [data-testid="sync-column-tools"] on tools column
  - [data-testid="sync-column-rules"] on rules column
  - [data-testid="sync-column-mcp"] on MCP column
  - [data-testid="sync-start-button"] on sync button
  - [data-testid="sync-preview-dialog"] on dialog
  - [data-testid^="sync-preview-file-"] on file items
  - [data-testid="sync-preview-cancel-button"]
  - [data-testid="sync-preview-confirm-button"]
- **Priority**: Medium

### TC-SYNC-E038: Column Item testid Pattern
- **Description**: Validates testid pattern for column items
- **Preconditions**:
  - Sync page with data
- **Steps**:
  1. Inspect tool set items
  2. Verify testid format
- **Expected Result**:
  - Format: [data-testid="sync-column-tools-item-{id}"]
  - Example: [data-testid="sync-column-tools-item-all-tools"]
  - Same pattern for rules and MCP columns
- **Priority**: Low
