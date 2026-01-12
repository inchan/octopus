# History Feature - E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 58 |
| High Priority | 15 (26%) |
| Medium Priority | 17 (29%) |
| Low Priority | 24 (41%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 58 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 58 |
| High Priority | 15 (26%) |
| Medium Priority | 17 (29%) |
| Low Priority | 24 (41%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 58 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 58 |
| High Priority | 15 (26%) |
| Medium Priority | 17 (29%) |
| Low Priority | 24 (41%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 58 | ██████████ 100% |

This document outlines end-to-end test scenarios for the History feature from a user's perspective, covering UI interactions, navigation, and integration with other features.

---

## Navigation & Page Load

### TC-HIST-E001: Navigate to History Page
- **Description**: Verify user can navigate to History page from sidebar
- **Preconditions**: Application is running and user is on dashboard
- **Steps**:
  1. Launch application
  2. Click "History" menu item in sidebar
  3. Wait for page to load
- **Expected Result**:
  - URL changes to /history route
  - History page is displayed with data-testid="history-page"
  - Page title shows "Change History"
  - Sidebar "History" item is highlighted
- **Priority**: High

### TC-HIST-E002: History Page Initial Load State
- **Description**: Verify loading state is shown during initial data fetch
- **Preconditions**: Application just started
- **Steps**:
  1. Navigate to History page
  2. Observe page during data loading
- **Expected Result**:
  - "Loading history..." message is displayed briefly
  - Loading message disappears when data arrives
  - No flash of unstyled content
- **Priority**: Medium

### TC-HIST-E003: Empty History State
- **Description**: Verify empty state is shown when no history exists
- **Preconditions**: Fresh database with no history entries
- **Steps**:
  1. Navigate to History page
  2. Wait for data to load
- **Expected Result**:
  - "No history found" message is displayed in list area
  - Detail area shows placeholder with clock icon
  - Message: "Select a history entry to view details"
  - No entries are shown in the list
- **Priority**: Medium

### TC-HIST-E004: Error State Display
- **Description**: Verify error message when history data fails to load
- **Preconditions**: Database is inaccessible or API returns error
- **Steps**:
  1. Simulate database connection failure
  2. Navigate to History page
- **Expected Result**:
  - Error message displayed in red text
  - Error text: "Error loading history: {error message}"
  - No history entries are shown
  - User can still navigate away
- **Priority**: Medium

---

## History List Display

### TC-HIST-E005: Display History Entries List
- **Description**: Verify history entries are displayed in chronological order
- **Preconditions**: Database contains 5 history entries from different times
- **Steps**:
  1. Create 5 history entries with timestamps: T1, T2, T3, T4, T5
  2. Navigate to History page
  3. Observe entry order
- **Expected Result**:
  - All 5 entries are visible in list
  - Entries are sorted newest first (T5, T4, T3, T2, T1)
  - Each entry shows action badge, entity info, timestamp, and ID
- **Priority**: High

### TC-HIST-E006: Action Badge Visual Indicators
- **Description**: Verify action badges have distinct colors for CREATE/UPDATE/DELETE
- **Preconditions**: History contains entries with all three action types
- **Steps**:
  1. Create rule (CREATE action)
  2. Update rule (UPDATE action)
  3. Delete rule (DELETE action)
  4. Navigate to History page
- **Expected Result**:
  - CREATE badge is green with green background
  - UPDATE badge is blue with blue background
  - DELETE badge is red with red background
  - Badge text shows action in uppercase
- **Priority**: Medium

### TC-HIST-E007: Entry Information Display
- **Description**: Verify each entry shows complete metadata
- **Preconditions**: History contains at least one entry
- **Steps**:
  1. Create a rule named "Test Rule"
  2. Navigate to History page
  3. Inspect first entry
- **Expected Result**:
  - Action badge shows "CREATE"
  - Entity info shows "rule: {ruleId}"
  - Timestamp shows formatted date/time
  - Entry ID shows first 8 characters of UUID
  - All text is readable with proper contrast
- **Priority**: High

### TC-HIST-E008: Scrollable History List
- **Description**: Verify history list is scrollable when many entries exist
- **Preconditions**: Database contains 50+ history entries
- **Steps**:
  1. Create 50 history entries
  2. Navigate to History page
  3. Scroll in history list area
- **Expected Result**:
  - List area has vertical scrollbar
  - Can scroll through all entries
  - Header "Change History" remains sticky at top
  - Scroll is smooth without lag
- **Priority**: Low

---

## Entry Selection & Detail View

### TC-HIST-E009: Select History Entry
- **Description**: Verify clicking an entry shows its detail
- **Preconditions**: History page with multiple entries
- **Steps**:
  1. Navigate to History page with 3 entries
  2. Click the second entry in the list
- **Expected Result**:
  - Selected entry is highlighted with gray background
  - Selected entry has blue left border (2px)
  - Detail panel on right shows entry information
  - Detail panel shows "History Detail" heading
- **Priority**: High

### TC-HIST-E010: Detail View Transaction ID
- **Description**: Verify detail view displays full transaction ID
- **Preconditions**: History entry is selected
- **Steps**:
  1. Select a history entry
  2. Check detail panel header
- **Expected Result**:
  - "Transaction ID:" label is shown
  - Full UUID of entry is displayed in monospace font
  - Transaction ID matches selected entry's ID
- **Priority**: Medium

### TC-HIST-E011: Detail View Snapshot Data
- **Description**: Verify detail view shows formatted JSON snapshot
- **Preconditions**: History entry with complex data is selected
- **Steps**:
  1. Create rule with name="Test", content="Content", isActive=true
  2. Navigate to History and select the entry
  3. Inspect snapshot data section
- **Expected Result**:
  - "Snapshot Data" section header is visible
  - JSON is formatted with 2-space indentation
  - All fields from rule are visible (id, name, content, isActive, createdAt, updatedAt)
  - JSON is syntax-highlighted (if supported)
  - Code block has dark background
- **Priority**: High

### TC-HIST-E012: Detail View Scrollable Content
- **Description**: Verify snapshot data is scrollable for large objects
- **Preconditions**: History entry with large data object
- **Steps**:
  1. Create rule with very long content (5000 characters)
  2. Select the history entry
  3. Check snapshot data area
- **Expected Result**:
  - Snapshot data section has max-height constraint
  - Vertical scrollbar appears if content exceeds height
  - Scrollbar is inside the code block
  - Content is not truncated
- **Priority**: Low

### TC-HIST-E013: Switch Between Entries
- **Description**: Verify switching selection updates detail view
- **Preconditions**: History page with 3+ entries
- **Steps**:
  1. Select first entry
  2. Observe detail data
  3. Click third entry
  4. Observe detail data changes
- **Expected Result**:
  - First entry's data is shown initially
  - Third entry becomes highlighted when clicked
  - Detail panel updates to show third entry's data
  - Transition is smooth without flicker
- **Priority**: Medium

### TC-HIST-E014: Deselect Entry Behavior
- **Description**: Verify current behavior when no entry is selected (initial state)
- **Preconditions**: History page just loaded
- **Steps**:
  1. Navigate to History page
  2. Do not click any entry
- **Expected Result**:
  - No entry has highlight or blue border
  - Detail panel shows placeholder message
  - Clock icon is displayed
  - "Select a history entry to view details" text shown
- **Priority**: Low

---

## Revert Functionality

### TC-HIST-E015: Revert Button Visibility
- **Description**: Verify revert button is shown when entry is selected
- **Preconditions**: History page loaded with entries
- **Steps**:
  1. Navigate to History page
  2. Select an entry
  3. Check detail panel header
- **Expected Result**:
  - "Revert to this state" button is visible
  - Button is styled with red background (bg-red-600)
  - Button is positioned in header area
  - Button is clickable
- **Priority**: High

### TC-HIST-E016: Revert Confirmation Dialog
- **Description**: Verify confirmation dialog appears before reverting
- **Preconditions**: History entry is selected
- **Steps**:
  1. Select a history entry
  2. Click "Revert to this state" button
  3. Observe browser dialog
- **Expected Result**:
  - Native browser confirm dialog appears
  - Message: "Are you sure you want to revert to this state?"
  - Dialog has OK and Cancel buttons
- **Priority**: High

### TC-HIST-E017: Cancel Revert Operation
- **Description**: Verify canceling revert does nothing
- **Preconditions**: History entry selected
- **Steps**:
  1. Click "Revert to this state" button
  2. Click "Cancel" on confirmation dialog
  3. Observe page state
- **Expected Result**:
  - Dialog closes
  - No revert operation is performed
  - No API call is made
  - Page remains unchanged
  - Entry remains selected
- **Priority**: Medium

### TC-HIST-E018: Revert Rule Creation (Undo Create)
- **Description**: Verify reverting a rule creation deletes the rule
- **Preconditions**: Rule has been created
- **Steps**:
  1. Create a new rule "Test Rule"
  2. Navigate to History page
  3. Find CREATE entry for "Test Rule"
  4. Select the entry and click Revert
  5. Confirm the dialog
  6. Wait for success message
  7. Navigate to Rules page
- **Expected Result**:
  - Success alert shows "Reverted successfully"
  - Navigate to Rules page
  - "Test Rule" is no longer in the list
  - Rule was successfully deleted
- **Priority**: High

### TC-HIST-E019: Revert Rule Update (Restore Old State)
- **Description**: Verify reverting a rule update restores previous values
- **Preconditions**: Rule has been updated
- **Steps**:
  1. Create rule with name="Original"
  2. Update rule name to "Modified"
  3. Navigate to History page
  4. Find UPDATE entry (shows old state in data)
  5. Select entry and click Revert
  6. Confirm dialog
  7. Navigate to Rules page and check rule
- **Expected Result**:
  - Success alert appears
  - Navigate to Rules page
  - Rule name is back to "Original"
  - Other fields also restored to previous state
- **Priority**: High

### TC-HIST-E020: Revert Rule Deletion (Restore Deleted Rule)
- **Description**: Verify reverting a rule deletion restores the rule
- **Preconditions**: Rule has been deleted
- **Steps**:
  1. Create rule "To Be Deleted"
  2. Delete the rule
  3. Navigate to History page
  4. Find DELETE entry (contains full rule snapshot)
  5. Select entry and click Revert
  6. Confirm dialog
  7. Navigate to Rules page
- **Expected Result**:
  - Success alert appears
  - Navigate to Rules page
  - "To Be Deleted" rule is back in the list
  - Rule has same ID as before deletion
  - All fields are restored correctly
- **Priority**: High

### TC-HIST-E021: Revert MCP Server Creation
- **Description**: Verify reverting MCP server creation works
- **Preconditions**: MCP server has been created
- **Steps**:
  1. Create MCP server "Test Server"
  2. Navigate to History page
  3. Find CREATE entry for MCP server
  4. Revert the entry
  5. Navigate to MCP page
- **Expected Result**:
  - Success alert appears
  - MCP server is deleted
  - MCP page no longer shows "Test Server"
- **Priority**: Medium

### TC-HIST-E022: Revert Error Handling
- **Description**: Verify error message when revert fails
- **Preconditions**: History entry exists but target entity is in invalid state
- **Steps**:
  1. Manually corrupt database or simulate revert failure
  2. Select history entry
  3. Click Revert and confirm
- **Expected Result**:
  - Error alert appears: "Failed to revert: {error message}"
  - Page remains on History
  - Entry remains selected
  - User can try again or cancel
- **Priority**: Medium

### TC-HIST-E023: Revert Entry Not Found
- **Description**: Verify error handling when history entry doesn't exist
- **Preconditions**: History entry ID is invalid
- **Steps**:
  1. Simulate selecting entry with non-existent ID
  2. Attempt to revert
- **Expected Result**:
  - Error alert: "Failed to revert: History entry not found"
  - No state change occurs
- **Priority**: Low

### TC-HIST-E024: Revert No Handler Registered
- **Description**: Verify error when revert handler is not available
- **Preconditions**: History entry for unsupported entity type
- **Steps**:
  1. Create history entry with entityType='unknown'
  2. Attempt to revert
- **Expected Result**:
  - Error alert: "Failed to revert: No revert handler registered for entity type: unknown"
  - Clear message about missing handler
- **Priority**: Low

---

## History Tracking Integration

### TC-HIST-E025: Rule Creation Tracked in History
- **Description**: Verify creating a rule automatically adds history entry
- **Preconditions**: Fresh state with no rules
- **Steps**:
  1. Navigate to Rules page
  2. Create rule "New Rule" with content "Content"
  3. Navigate to History page
  4. Check for new entry
- **Expected Result**:
  - History page shows new entry
  - Entry has action="CREATE"
  - Entry entityType="rule"
  - Entry data contains rule snapshot (id, name, content, isActive, timestamps)
  - Entry appears at top of list (newest)
- **Priority**: High

### TC-HIST-E026: Rule Update Tracked in History
- **Description**: Verify updating a rule records old state in history
- **Preconditions**: Rule "Test" exists
- **Steps**:
  1. Navigate to Rules page
  2. Edit rule "Test" to change name to "Updated"
  3. Save changes
  4. Navigate to History page
  5. Check latest entry
- **Expected Result**:
  - New history entry appears
  - Entry has action="UPDATE"
  - Entry data contains PREVIOUS state (name="Test")
  - Can be used to revert to old state
- **Priority**: High

### TC-HIST-E027: Rule Deletion Tracked in History
- **Description**: Verify deleting a rule records full snapshot
- **Preconditions**: Rule exists
- **Steps**:
  1. Navigate to Rules page
  2. Delete a rule
  3. Navigate to History page
  4. Find DELETE entry
- **Expected Result**:
  - History shows DELETE entry
  - Entry data contains complete rule object
  - Includes id, name, content, isActive, timestamps
  - Sufficient data to restore rule if needed
- **Priority**: High

### TC-HIST-E028: Multiple Operations Create Multiple Entries
- **Description**: Verify each CRUD operation creates separate history entry
- **Preconditions**: Fresh state
- **Steps**:
  1. Create rule "R1" (action 1)
  2. Update "R1" to "R1-Modified" (action 2)
  3. Create rule "R2" (action 3)
  4. Delete "R1" (action 4)
  5. Navigate to History page
- **Expected Result**:
  - History shows 4 entries
  - Order: Delete R1, Create R2, Update R1, Create R1 (newest to oldest)
  - Each entry has correct action and data
  - All entries are distinguishable
- **Priority**: High

### TC-HIST-E029: MCP Server Operations Tracked
- **Description**: Verify MCP server CRUD operations create history entries
- **Preconditions**: Fresh state
- **Steps**:
  1. Create MCP server
  2. Update MCP server
  3. Delete MCP server
  4. Navigate to History page
- **Expected Result**:
  - 3 history entries exist
  - Each has entityType="mcp"
  - Actions are CREATE, UPDATE, DELETE
  - Data contains MCP server snapshots
- **Priority**: Medium

---

## UI/UX & Styling

### TC-HIST-E030: Responsive Layout
- **Description**: Verify history page layout adapts to window size
- **Preconditions**: History page loaded
- **Steps**:
  1. Resize window to 1024px width
  2. Resize to 1920px width
  3. Observe layout changes
- **Expected Result**:
  - List takes 1/3 width, detail takes 2/3 width
  - Layout remains readable at different sizes
  - Scrollbars appear when needed
  - No horizontal overflow
- **Priority**: Low

### TC-HIST-E031: Entry Hover Effect
- **Description**: Verify visual feedback when hovering over entries
- **Preconditions**: History page with entries
- **Steps**:
  1. Hover mouse over an entry in the list
  2. Observe visual change
- **Expected Result**:
  - Entry background changes to gray on hover (hover:bg-gray-800)
  - Cursor changes to pointer
  - Transition is smooth
  - Hover state is clearly visible
- **Priority**: Low

### TC-HIST-E032: Selected Entry Visual Indicator
- **Description**: Verify selected entry has distinct appearance
- **Preconditions**: History page with entries
- **Steps**:
  1. Select an entry
  2. Observe styling
- **Expected Result**:
  - Selected entry has bg-gray-800 background
  - Left border is blue (border-l-2 border-blue-500)
  - Clearly distinguishable from unselected entries
  - Remains highlighted when scrolling
- **Priority**: Medium

### TC-HIST-E033: Dark Theme Consistency
- **Description**: Verify history page follows dark theme design
- **Preconditions**: Application using dark theme
- **Steps**:
  1. Navigate to History page
  2. Check color scheme
- **Expected Result**:
  - Background is dark (bg-gray-900, bg-gray-950)
  - Text is light colored (text-white, text-gray-200)
  - Borders are subtle gray (border-gray-800)
  - High contrast for readability
- **Priority**: Low

### TC-HIST-E034: Timestamp Formatting
- **Description**: Verify timestamps are formatted in user's locale
- **Preconditions**: History entry with known timestamp
- **Steps**:
  1. Create entry at specific time
  2. Check timestamp display
- **Expected Result**:
  - Timestamp uses toLocaleString() formatting
  - Format matches system locale settings
  - Shows date and time clearly
  - Text is gray and small (text-xs text-gray-500)
- **Priority**: Low

---

## Accessibility & Keyboard Navigation

### TC-HIST-E035: Keyboard Navigation Through Entries
- **Description**: Verify entries can be navigated with keyboard
- **Preconditions**: History page with multiple entries
- **Steps**:
  1. Navigate to History page
  2. Tab to focus first entry
  3. Use arrow keys to navigate
- **Expected Result**:
  - Can tab into entry list
  - Arrow keys move selection up/down (if implemented)
  - Enter key selects focused entry (if implemented)
  - Visual focus indicator is clear
- **Priority**: Low

### TC-HIST-E036: Screen Reader Support
- **Description**: Verify history page works with screen readers
- **Preconditions**: Screen reader enabled
- **Steps**:
  1. Navigate to History page with screen reader
  2. Read entry list
  3. Read detail panel
- **Expected Result**:
  - Page structure is announced
  - Entry information is readable
  - Action badges are announced with color meaning
  - Detail data is accessible
- **Priority**: Low

### TC-HIST-E037: Focus Management After Revert
- **Description**: Verify focus returns to appropriate element after revert
- **Preconditions**: Entry selected, about to revert
- **Steps**:
  1. Select entry
  2. Click Revert button
  3. Confirm dialog
  4. Wait for success alert
  5. Observe focus location
- **Expected Result**:
  - Focus returns to revert button or entry list
  - User can continue navigation without re-focusing
  - Alert is announced to screen reader
- **Priority**: Low

---

## Performance & Load Testing

### TC-HIST-E038: Load History with 100 Entries
- **Description**: Verify performance with moderate number of entries
- **Preconditions**: Database with 100 history entries
- **Steps**:
  1. Create 100 history entries
  2. Navigate to History page
  3. Measure load time
- **Expected Result**:
  - Page loads within 2 seconds
  - All entries are rendered
  - Scrolling is smooth
  - No visible lag or jank
- **Priority**: Medium

### TC-HIST-E039: Load History with 1000+ Entries
- **Description**: Verify performance with large dataset
- **Preconditions**: Database with 1000+ entries
- **Steps**:
  1. Create 1000 history entries
  2. Navigate to History page
  3. Scroll through list
- **Expected Result**:
  - Page loads within 5 seconds
  - Initial render shows first 50-100 entries
  - Virtual scrolling or pagination if needed
  - No browser freeze or crash
- **Priority**: Low

### TC-HIST-E040: Memory Usage During Long Session
- **Description**: Verify no memory leaks during extended use
- **Preconditions**: History page open for extended time
- **Steps**:
  1. Navigate to History page
  2. Select different entries 50 times
  3. Monitor browser memory usage
- **Expected Result**:
  - Memory usage remains stable
  - No continuous increase (memory leak)
  - Page remains responsive
- **Priority**: Low

---

## Edge Cases & Error Scenarios

### TC-HIST-E041: Refresh Page While Entry Selected
- **Description**: Verify behavior when page is refreshed
- **Preconditions**: History entry is selected
- **Steps**:
  1. Select an entry
  2. Press F5 or Cmd+R to refresh
  3. Wait for page reload
- **Expected Result**:
  - Page reloads successfully
  - Entry list is restored
  - Selection state is lost (no entry selected)
  - Detail panel shows placeholder
- **Priority**: Low

### TC-HIST-E042: Network Error During Load
- **Description**: Verify error handling when API is unreachable
- **Preconditions**: Simulate network failure
- **Steps**:
  1. Disconnect network or block IPC
  2. Navigate to History page
- **Expected Result**:
  - Error message is displayed
  - Error is user-friendly
  - Page doesn't crash
  - Can retry by refreshing
- **Priority**: Medium

### TC-HIST-E043: Concurrent Revert Operations
- **Description**: Verify behavior when reverting multiple entries quickly
- **Preconditions**: Multiple history entries selected sequentially
- **Steps**:
  1. Select entry 1, click Revert
  2. Immediately select entry 2, click Revert
  3. Confirm both dialogs
- **Expected Result**:
  - Both operations are queued or second is blocked
  - No race condition occurs
  - Both reverts succeed or clear error is shown
- **Priority**: Low

### TC-HIST-E044: Revert with Stale Data
- **Description**: Verify handling when underlying entity has changed
- **Preconditions**: Rule has been modified since history entry created
- **Steps**:
  1. Create rule "Original"
  2. Update to "Version 2"
  3. Update to "Version 3"
  4. Try to revert to "Version 2" history entry
- **Expected Result**:
  - Revert succeeds and restores to "Version 2" state
  - Latest state "Version 3" is overwritten
  - Clear indication of what happened
- **Priority**: Medium

### TC-HIST-E045: Very Long Rule Content in Snapshot
- **Description**: Verify display of large content in detail view
- **Preconditions**: Rule with 10,000 character content
- **Steps**:
  1. Create rule with very long content
  2. Navigate to History
  3. Select the entry
- **Expected Result**:
  - Detail panel shows complete content
  - Scrollbar appears in code block
  - No truncation or ellipsis
  - Page remains responsive
- **Priority**: Low

### TC-HIST-E046: Special Characters in Rule Name
- **Description**: Verify handling of special characters in displayed data
- **Preconditions**: Rule with name containing quotes, newlines, etc.
- **Steps**:
  1. Create rule with name: `Test "Rule" with 'quotes' and \n newline`
  2. Navigate to History
  3. Check display
- **Expected Result**:
  - Special characters are properly escaped in JSON
  - Display is not broken
  - JSON is valid and parseable
  - Revert works correctly
- **Priority**: Low

---

## Cross-Feature Integration

### TC-HIST-E047: Navigate from History to Rules
- **Description**: Verify user can navigate from History to Rules page
- **Preconditions**: History page is open
- **Steps**:
  1. On History page, note a rule ID from an entry
  2. Click "Rules" in sidebar
  3. Find the rule by ID
- **Expected Result**:
  - Rules page loads successfully
  - Rule mentioned in history is visible
  - User can verify rule state
- **Priority**: Low

### TC-HIST-E048: History After Sync Operation
- **Description**: Verify sync operations create appropriate history entries
- **Preconditions**: Sync operation imports rules
- **Steps**:
  1. Perform sync import of CLAUDE.md with 3 rules
  2. Navigate to History page
- **Expected Result**:
  - History shows entries for imported rules
  - Each has action=CREATE
  - Data contains imported rule content
- **Priority**: Medium

### TC-HIST-E049: Revert After Application Restart
- **Description**: Verify history persists across app restarts
- **Preconditions**: History entries exist
- **Steps**:
  1. Create history entries
  2. Close application
  3. Reopen application
  4. Navigate to History page
- **Expected Result**:
  - All history entries are still present
  - Can select and view entries
  - Can revert entries
  - No data loss occurred
- **Priority**: High

### TC-HIST-E050: History for Rule Set Operations
- **Description**: Verify rule set operations are tracked (if applicable)
- **Preconditions**: Rule sets feature exists
- **Steps**:
  1. Create a rule set
  2. Add rules to set
  3. Check History page
- **Expected Result**:
  - If tracking is enabled, set operations appear in history
  - OR clear indication that sets are not tracked
  - Behavior is consistent with design
- **Priority**: Low

---

## Smoke Tests (Critical Path)

### TC-HIST-E051: Basic History Flow - Happy Path
- **Description**: End-to-end smoke test of core history functionality
- **Preconditions**: Fresh application state
- **Steps**:
  1. Create a rule "Smoke Test"
  2. Navigate to History page
  3. Verify entry appears
  4. Select the entry
  5. View detail
  6. Click Revert
  7. Confirm dialog
  8. Verify success
  9. Navigate to Rules page
  10. Verify rule is gone
- **Expected Result**:
  - All steps complete without error
  - History tracking works
  - Revert works
  - Integration with Rules works
  - User experience is smooth
- **Priority**: Critical

### TC-HIST-E052: Multi-Action History Workflow
- **Description**: Test complete CRUD cycle with history tracking
- **Preconditions**: Fresh state
- **Steps**:
  1. Create rule "R1"
  2. Update "R1" to "R1-Updated"
  3. Create rule "R2"
  4. Delete "R2"
  5. Navigate to History
  6. Verify 4 entries
  7. Revert delete of "R2"
  8. Verify "R2" is restored
- **Expected Result**:
  - All operations tracked correctly
  - History shows all 4 entries
  - Revert successfully restores deleted rule
  - No errors occur
- **Priority**: Critical

---

## Regression Tests

### TC-HIST-E053: History Page After UI Redesign
- **Description**: Verify history page works after major UI changes
- **Preconditions**: UI components have been updated
- **Steps**:
  1. Navigate to History page
  2. Test all core features (list, select, detail, revert)
- **Expected Result**:
  - All features still work
  - No broken layouts
  - No missing functionality
- **Priority**: Medium

### TC-HIST-E054: History API Backward Compatibility
- **Description**: Verify old history entries are still readable after schema changes
- **Preconditions**: Database contains old-format history entries
- **Steps**:
  1. Load database with legacy history entries
  2. Navigate to History page
  3. Try to view and revert old entries
- **Expected Result**:
  - Old entries are displayed correctly
  - Old data format is handled gracefully
  - Revert works or shows clear message if not supported
- **Priority**: Medium

---

## Future Enhancements (Placeholders)

### TC-HIST-E055: Search/Filter History Entries
- **Description**: Verify search functionality if implemented
- **Preconditions**: History page has search feature
- **Steps**:
  1. Enter "rule" in search box
  2. Verify only rule entries shown
- **Expected Result**: TBD when feature is implemented
- **Priority**: Low

### TC-HIST-E056: Pagination Controls
- **Description**: Verify pagination if implemented
- **Preconditions**: History has pagination
- **Steps**:
  1. Load 100+ entries
  2. Navigate through pages
- **Expected Result**: TBD when feature is implemented
- **Priority**: Low

### TC-HIST-E057: Export History to File
- **Description**: Verify export functionality if added
- **Preconditions**: Export button exists
- **Steps**:
  1. Click Export button
  2. Save file
- **Expected Result**: TBD when feature is implemented
- **Priority**: Low

### TC-HIST-E058: Bulk Revert Operations
- **Description**: Verify multi-select revert if implemented
- **Preconditions**: Multi-select feature exists
- **Steps**:
  1. Select multiple entries
  2. Click Bulk Revert
- **Expected Result**: TBD when feature is implemented
- **Priority**: Low

---

## Notes

- All E2E tests should be run with VITE_USE_MOCK=true for mock mode, and without for real integration testing
- Tests marked as "Critical" or "High" priority should be automated in CI/CD pipeline
- Performance tests should have baseline metrics recorded for regression detection
- Accessibility tests should follow WCAG 2.1 Level AA guidelines
- All tests should verify data-testid attributes are present for reliable test automation
