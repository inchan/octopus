# Rules Feature - E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 63 |
| High Priority | 26 (41%) |
| Medium Priority | 26 (41%) |
| Low Priority | 11 (17%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 63 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 63 |
| High Priority | 26 (41%) |
| Medium Priority | 26 (41%) |
| Low Priority | 11 (17%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 63 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 63 |
| High Priority | 26 (41%) |
| Medium Priority | 26 (41%) |
| Low Priority | 11 (17%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 63 | ██████████ 100% |

## Overview
This document describes end-to-end test scenarios for the Rules feature in Align Agents v2. These tests verify the complete user workflows across the 3-Pane layout (Rule Sets, Set Detail, Rule Pool) from the browser's perspective.

**Testing Principles:**
- No `waitForTimeout()` - use condition-based waits only
- Verify actual state values, not just visibility
- Use Page Object Model for maintainability
- Test realistic user workflows, not isolated actions

---

## Test Environment Setup

### Preconditions for All Tests
- Application running in test mode with mock API (`VITE_USE_MOCK=true`)
- Browser launched via Playwright
- Console logs captured for debugging
- Page navigated to `/rules`

---

## Rule Set Management

### TC-RULES-E001: Create First Rule Set
- **Description**: Verify that a user can create their first rule set when starting from empty state
- **Preconditions**:
  - No rule sets exist
  - No rules exist
- **Steps**:
  1. Navigate to Rules page
  2. Verify message "No sets created yet." is displayed in left panel
  3. Click "+" button in Rule Sets panel header
  4. Popover opens with input field
  5. Enter "Development Rules" in the input
  6. Click "Create" button
  7. Wait for set to appear in list
- **Expected Result**:
  - New set "Development Rules" appears in the left panel
  - Set is automatically selected (highlighted)
  - Set detail panel shows "Development Rules" as title
  - Set detail panel shows "No rules in this set."
  - localStorage contains 'rules-last-selected-id' with new set's id
- **Priority**: High

### TC-RULES-E002: Create Multiple Rule Sets
- **Description**: Verify that multiple rule sets can be created sequentially
- **Preconditions**: Application in empty state
- **Steps**:
  1. Create first set "Frontend Rules"
  2. Create second set "Backend Rules"
  3. Create third set "Testing Rules"
- **Expected Result**:
  - All three sets appear in the list
  - Set count badges show "0" for each (no rules assigned yet)
  - Most recently created set ("Testing Rules") is auto-selected
- **Priority**: High

### TC-RULES-E003: Select Different Rule Set
- **Description**: Verify that clicking a rule set selects it and shows its details
- **Preconditions**:
  - Multiple rule sets exist
  - One set is currently selected
- **Steps**:
  1. Click on "Backend Rules" in the set list
  2. Verify set is highlighted with active styling
  3. Verify set detail panel title changes to "Backend Rules"
- **Expected Result**:
  - Selected set has different background and border color
  - Detail panel updates to show selected set's name and rules
  - localStorage 'rules-last-selected-id' is updated
- **Priority**: High

### TC-RULES-E004: Delete Empty Rule Set
- **Description**: Verify that a rule set with no rules can be deleted
- **Preconditions**: Rule set with no rules exists and is selected
- **Steps**:
  1. Select the set to delete
  2. Click trash icon in set detail panel header
  3. Alert dialog appears with confirmation message
  4. Verify message contains set name
  5. Click "Delete" button in alert dialog
  6. Wait for set to disappear
- **Expected Result**:
  - Set is removed from the list
  - If other sets exist, first set is auto-selected
  - If no sets remain, empty state message appears
  - localStorage 'rules-last-selected-id' is cleared
- **Priority**: High

### TC-RULES-E005: Delete Rule Set with Rules
- **Description**: Verify that deleting a rule set does not delete the rules themselves
- **Preconditions**:
  - Rule set "Dev Set" exists with 2 rules assigned
  - The same rules exist in the pool
- **Steps**:
  1. Select "Dev Set"
  2. Note the rule count (2)
  3. Delete the set via trash icon and confirm
  4. Verify set is deleted
  5. Check Rule Pool panel
- **Expected Result**:
  - Set is removed from list
  - Rules still appear in Rule Pool (count remains same)
  - Rules are not deleted, only the set-rule association is removed
- **Priority**: High

### TC-RULES-E006: Rename Rule Set Inline
- **Description**: Verify that a rule set can be renamed by clicking its name
- **Preconditions**: Rule set exists and is selected
- **Steps**:
  1. Click on the set name in the detail panel header
  2. Input field appears with current name pre-filled
  3. Change name to "Renamed Set"
  4. Press Enter key
  5. Wait for update to complete
- **Expected Result**:
  - Input field closes
  - Set name in detail panel updates to "Renamed Set"
  - Set name in left panel list also updates
  - IPC call to 'sets:rules:update' is sent with new name
- **Priority**: Medium

### TC-RULES-E007: Cancel Rename with Escape
- **Description**: Verify that pressing Escape cancels the rename operation
- **Preconditions**: Rename input is active
- **Steps**:
  1. Click set name to activate rename
  2. Type new name but press Escape before submitting
  3. Verify input closes
- **Expected Result**:
  - Input field closes without saving
  - Set name remains unchanged
  - No IPC call is made
- **Priority**: Low

### TC-RULES-E008: Reorder Rule Sets via Drag and Drop
- **Description**: Verify that rule sets can be reordered by dragging (UI only, no backend persistence yet)
- **Preconditions**: Multiple rule sets exist
- **Steps**:
  1. Hold pointer on "Set B" for 200ms to activate drag
  2. Drag it above "Set A"
  3. Release
- **Expected Result**:
  - Visual order of sets changes
  - "Set B" now appears above "Set A"
  - (Note: Order is not persisted to backend yet)
- **Priority**: Low

---

## Rule Management

### TC-RULES-E021: Create New Rule
- **Description**: Verify that a new rule can be created and appears in the pool
- **Preconditions**: Application loaded (sets can be empty or populated)
- **Steps**:
  1. Click "+" button in Rule Pool panel header
  2. Dialog opens with title "Create New Rule"
  3. Enter name "Python Code Style"
  4. Enter content "# Python Guidelines\n- Use type hints\n- Follow PEP 8"
  5. Verify "Create Rule" button is enabled
  6. Click "Create Rule"
  7. Wait for dialog to close
- **Expected Result**:
  - Dialog closes
  - New rule "Python Code Style" appears in Rule Pool
  - Rule count in pool header increments by 1
  - Rule shows green dot (active by default)
  - IPC call to 'rules:create' is sent
- **Priority**: High

### TC-RULES-E022: Create Rule and Verify in Pool
- **Description**: Verify that newly created rule displays correct metadata
- **Preconditions**: None
- **Steps**:
  1. Create rule "Test Rule" with content "Test content"
  2. Locate the rule in the pool
- **Expected Result**:
  - Rule name is "Test Rule"
  - Green status dot indicates active
  - Date shows today's date
  - Rule is at top or bottom of pool list (depending on sort order)
- **Priority**: Medium

### TC-RULES-E023: Edit Existing Rule
- **Description**: Verify that a rule can be edited via the pool actions menu
- **Preconditions**: Rule "Original Rule" exists in pool
- **Steps**:
  1. Hover over the rule in pool
  2. Click three-dot menu icon
  3. Click "Edit" option
  4. Dialog opens in edit mode with title "Edit Rule"
  5. Verify fields are pre-filled with current data
  6. Change name to "Updated Rule"
  7. Change content to "Updated content"
  8. Click "Save Changes"
  9. Wait for dialog to close
- **Expected Result**:
  - Dialog closes
  - Rule name in pool updates to "Updated Rule"
  - IPC call to 'rules:update' is sent with changes
  - TanStack Query cache is invalidated and rule list refreshes
- **Priority**: High

### TC-RULES-E024: Delete Rule from Pool
- **Description**: Verify that a rule can be deleted via actions menu
- **Preconditions**: Rule exists in pool
- **Steps**:
  1. Hover over rule in pool
  2. Click three-dot menu
  3. Click "Delete" option
  4. (No confirmation dialog for pool delete)
  5. Wait for rule to disappear
- **Expected Result**:
  - Rule is removed from pool
  - Pool count decrements by 1
  - IPC call to 'rules:delete' is sent
  - If rule was in any sets, it should also be removed from those sets (verify in set detail)
- **Priority**: High

### TC-RULES-E025: Delete Rule from Edit Dialog
- **Description**: Verify that a rule can be deleted from within the edit dialog
- **Preconditions**: Rule exists
- **Steps**:
  1. Open rule in edit dialog
  2. Click trash icon button in dialog footer
  3. Alert dialog appears asking for confirmation
  4. Click "Delete" in alert
  5. Wait for dialogs to close
- **Expected Result**:
  - Both dialogs close (alert and edit dialog)
  - Rule is removed from pool
  - IPC call to 'rules:delete' is sent
- **Priority**: Medium

### TC-RULES-E026: Toggle Rule Active Status
- **Description**: Verify that a rule's active status can be toggled in edit mode
- **Preconditions**: Rule exists with isActive: true
- **Steps**:
  1. Open rule in edit dialog
  2. Verify green dot indicator shows "Active"
  3. Click "Archive" icon button (or toggle if using switch)
  4. Verify indicator changes to show "Archived"
  5. Click "Save Changes"
  6. Wait for save to complete
  7. Reopen edit dialog
- **Expected Result**:
  - Rule's active status is toggled
  - Status dot in pool changes from green to gray
  - Saved status persists after closing and reopening
- **Priority**: Medium

### TC-RULES-E027: Cancel Rule Creation
- **Description**: Verify that canceling rule creation does not create rule
- **Preconditions**: None
- **Steps**:
  1. Click "+" to open create dialog
  2. Enter name and content
  3. Click "Cancel" button
  4. Verify dialog closes
- **Expected Result**:
  - Dialog closes
  - No new rule is created
  - Pool count remains unchanged
  - No IPC call to 'rules:create' is made
- **Priority**: Medium

### TC-RULES-E028: Search/Filter Rules in Pool
- **Description**: Verify that pool search filters rules by name and content
- **Preconditions**: Multiple rules exist with different names
- **Steps**:
  1. Click filter icon in pool header
  2. Popover opens with search input
  3. Type "Python" in search box
  4. Wait for debounce (if implemented)
- **Expected Result**:
  - Only rules containing "Python" in name or content are displayed
  - Pool count shows filtered count
  - Other rules are hidden
  - Clearing search shows all rules again
- **Priority**: High

### TC-RULES-E029: Clear Search Filter
- **Description**: Verify that clearing search restores all rules
- **Preconditions**: Search filter is active
- **Steps**:
  1. Clear the search input
  2. Close popover or wait for auto-update
- **Expected Result**:
  - All rules reappear in pool
  - Pool count shows total count
- **Priority**: Medium

---

## Set-Rule Association

### TC-RULES-E041: Add Rule to Set
- **Description**: Verify that a rule can be added to a set from the pool
- **Preconditions**:
  - Rule "Test Rule" exists in pool
  - Rule set "Dev Set" exists and is selected
  - Rule is NOT already in the set
- **Steps**:
  1. Select "Dev Set"
  2. Verify set detail shows 0 rules (or current count)
  3. In pool, locate "Test Rule"
  4. Click "+" button on the rule item
  5. Wait for update to complete
- **Expected Result**:
  - Rule appears in set detail panel
  - Set rule count increments by 1
  - Set list badge updates to show new count
  - "+" button disappears from that rule in pool (since it's now in set)
  - IPC call to 'sets:rules:update' is sent with updated items array
- **Priority**: High

### TC-RULES-E042: Add Multiple Rules to Set
- **Description**: Verify that multiple rules can be added to a set sequentially
- **Preconditions**:
  - Three rules exist in pool
  - Empty set is selected
- **Steps**:
  1. Add "Rule A" to set
  2. Add "Rule B" to set
  3. Add "Rule C" to set
- **Expected Result**:
  - All three rules appear in set detail panel
  - Set count shows 3
  - Rules appear in the order they were added
- **Priority**: High

### TC-RULES-E043: Remove Rule from Set
- **Description**: Verify that a rule can be removed from a set
- **Preconditions**:
  - Set "Dev Set" contains rule "Rule 1"
  - Set is selected
- **Steps**:
  1. In set detail panel, hover over "Rule 1"
  2. "X" button appears on hover
  3. Click "X" button
  4. Wait for update
- **Expected Result**:
  - Rule is removed from set detail panel
  - Set count decrements by 1
  - Rule still exists in pool (not deleted)
  - "+" button reappears on that rule in pool
  - IPC call to 'sets:rules:update' is sent with updated items array
- **Priority**: High

### TC-RULES-E044: Reorder Rules within Set
- **Description**: Verify that rules within a set can be reordered via drag and drop
- **Preconditions**: Set contains at least 2 rules
- **Steps**:
  1. Select set with rules ["Rule A", "Rule B", "Rule C"]
  2. Hold pointer on "Rule C" for 200ms
  3. Drag it to the top position
  4. Release
  5. Wait for update
- **Expected Result**:
  - Visual order changes to ["Rule C", "Rule A", "Rule B"]
  - IPC call to 'sets:rules:update' is sent with reordered items array
  - Order persists after page reload
- **Priority**: Medium

### TC-RULES-E045: Rule Already in Set Hides Add Button
- **Description**: Verify that rules already in the selected set do not show "+" button
- **Preconditions**:
  - Set "Dev Set" contains "Rule 1" and "Rule 2"
  - Set is selected
  - Pool also shows "Rule 1", "Rule 2", and "Rule 3"
- **Steps**:
  1. Verify "Rule 1" and "Rule 2" do NOT have "+" button in pool
  2. Verify "Rule 3" DOES have "+" button (not in set)
- **Expected Result**:
  - Add button visibility is conditional based on set membership
- **Priority**: Medium

---

## Rule Import/Export

### TC-RULES-E061: Import Rules from Valid JSON Array
- **Description**: Verify that rules can be imported from a valid JSON array
- **Preconditions**: Import dialog is available (check if implemented in UI)
- **Steps**:
  1. Open import dialog (trigger depends on UI implementation)
  2. Paste JSON: `[{"name": "Rule 1", "content": "Content 1"}, {"name": "Rule 2", "content": "Content 2"}]`
  3. Wait 500ms for parse preview
  4. Verify "Valid JSON" message appears
  5. Verify badge shows "2 rules found"
  6. Click "Import (2)" button
  7. Wait for import to complete
- **Expected Result**:
  - Dialog closes
  - Two new rules "Rule 1" and "Rule 2" appear in pool
  - Pool count increments by 2
  - IPC calls to 'rules:create' are made for each rule
- **Priority**: High

### TC-RULES-E062: Import Rules from JSON Object with "rules" Key
- **Description**: Verify that JSON with nested "rules" property is parsed correctly
- **Preconditions**: Import dialog open
- **Steps**:
  1. Paste JSON: `{"rules": [{"name": "Nested Rule", "content": "Content"}]}`
  2. Wait for parse
- **Expected Result**:
  - Preview shows 1 rule
  - Import succeeds
  - "Nested Rule" appears in pool
- **Priority**: Medium

### TC-RULES-E063: Import Single Rule Object
- **Description**: Verify that a single rule object (not array) can be imported
- **Preconditions**: Import dialog open
- **Steps**:
  1. Paste JSON: `{"name": "Single Rule", "content": "Content"}`
  2. Wait for parse
- **Expected Result**:
  - Preview shows 1 rule
  - Import succeeds
- **Priority**: Medium

### TC-RULES-E064: Import Fails with Invalid JSON
- **Description**: Verify that invalid JSON shows error and disables import
- **Preconditions**: Import dialog open
- **Steps**:
  1. Paste invalid JSON: `{invalid json}`
  2. Wait for parse
- **Expected Result**:
  - Red "Parse Error" alert appears
  - Error message describes the issue
  - "Import" button is disabled
  - Cannot proceed with import
- **Priority**: High

### TC-RULES-E065: Import with No Valid Rules Shows Error
- **Description**: Verify that JSON with no valid rule structures shows error
- **Preconditions**: Import dialog open
- **Steps**:
  1. Paste JSON: `{"key": "value"}`  (no name/content fields)
  2. Wait for parse
- **Expected Result**:
  - Error message "No valid rule configurations found"
  - Import button is disabled
- **Priority**: Medium

### TC-RULES-E066: Cancel Import Dialog
- **Description**: Verify that canceling import does not create rules
- **Preconditions**: Import dialog open with valid JSON
- **Steps**:
  1. Paste valid JSON
  2. Click "Cancel" button
- **Expected Result**:
  - Dialog closes
  - No rules are created
  - Pool count remains unchanged
- **Priority**: Medium

### TC-RULES-E067: Import Rules with isActive Field
- **Description**: Verify that imported rules respect isActive field
- **Preconditions**: Import dialog open
- **Steps**:
  1. Paste JSON: `[{"name": "Active Rule", "content": "C1", "isActive": true}, {"name": "Inactive Rule", "content": "C2", "isActive": false}]`
  2. Import
- **Expected Result**:
  - "Active Rule" has green dot
  - "Inactive Rule" has gray dot
- **Priority**: Medium

---

## Full User Workflows

### TC-RULES-E081: Complete Workflow - Create Set, Create Rule, Add to Set
- **Description**: Verify the most common user workflow from scratch
- **Preconditions**: Application in empty state
- **Steps**:
  1. Create rule set "My Project Rules"
  2. Verify set is created and selected
  3. Create new rule "Code Review Checklist" with content "- Check tests\n- Check docs"
  4. Verify rule appears in pool
  5. Add rule to "My Project Rules" set
  6. Verify rule appears in set detail panel
  7. Verify set count shows 1
- **Expected Result**:
  - All operations succeed sequentially
  - Final state: 1 set with 1 rule
  - Pool shows 1 rule
- **Priority**: High

### TC-RULES-E082: Create Multiple Sets and Organize Rules
- **Description**: Verify organizing rules into multiple sets
- **Preconditions**: Empty state
- **Steps**:
  1. Create three rules: "Frontend Rule", "Backend Rule", "DevOps Rule"
  2. Create two sets: "Dev Set", "Ops Set"
  3. Add "Frontend Rule" and "Backend Rule" to "Dev Set"
  4. Add "DevOps Rule" to "Ops Set"
  5. Switch between sets and verify contents
- **Expected Result**:
  - "Dev Set" shows 2 rules when selected
  - "Ops Set" shows 1 rule when selected
  - Pool shows all 3 rules
  - Each set displays correct rules in detail panel
- **Priority**: High

### TC-RULES-E083: Remove Rule from Set and Verify Pool Unchanged
- **Description**: Verify that removing a rule from a set does not delete it from pool
- **Preconditions**:
  - Set "Test Set" contains "Rule X"
  - "Rule X" exists in pool
- **Steps**:
  1. Select "Test Set"
  2. Remove "Rule X" from set
  3. Verify rule disappears from set detail
  4. Check pool panel
- **Expected Result**:
  - Set no longer contains "Rule X"
  - "Rule X" still exists in pool
  - "+" button reappears on "Rule X" in pool
- **Priority**: High

### TC-RULES-E084: Delete Rule and Verify Removal from Set
- **Description**: Verify that deleting a rule removes it from all sets
- **Preconditions**:
  - "Rule Y" exists in pool
  - "Rule Y" is in "Set A" and "Set B"
- **Steps**:
  1. Delete "Rule Y" from pool
  2. Select "Set A" and verify "Rule Y" is not there
  3. Select "Set B" and verify "Rule Y" is not there
  4. Verify pool no longer shows "Rule Y"
- **Expected Result**:
  - Rule is deleted from pool
  - Rule is removed from all sets
  - Set counts decrement accordingly
- **Priority**: High (Note: This auto-removal behavior may need implementation)

### TC-RULES-E085: Rename Set and Verify Persistence
- **Description**: Verify that renaming a set persists across navigation
- **Preconditions**: Set "Old Name" exists
- **Steps**:
  1. Select "Old Name"
  2. Rename to "New Name"
  3. Navigate to another page (e.g., Tools)
  4. Navigate back to Rules page
  5. Verify set is still named "New Name"
- **Expected Result**:
  - Set name persists after navigation
  - localStorage and backend state are updated
- **Priority**: Medium

---

## Selection Persistence

### TC-RULES-E101: Persist Selected Set on Page Reload
- **Description**: Verify that selected set is restored after page reload
- **Preconditions**: Two sets exist: "Set A" and "Set B"
- **Steps**:
  1. Select "Set B"
  2. Verify "Set B" is highlighted
  3. Reload the page (hard refresh)
  4. Wait for page to load
- **Expected Result**:
  - "Set B" is still selected after reload
  - Set detail panel shows "Set B"
  - localStorage 'rules-last-selected-id' contains "Set B" id
- **Priority**: High

### TC-RULES-E102: Persist Selection Across Navigation
- **Description**: Verify that selected set is restored when navigating away and back
- **Preconditions**: Set "Set A" is selected
- **Steps**:
  1. Navigate to Tools page
  2. Navigate back to Rules page
- **Expected Result**:
  - "Set A" is still selected
  - Set detail panel shows "Set A"
- **Priority**: High

### TC-RULES-E103: Auto-select First Set on Initial Load
- **Description**: Verify that first set is auto-selected when no previous selection exists
- **Preconditions**:
  - localStorage 'rules-last-selected-id' is cleared
  - Multiple sets exist
- **Steps**:
  1. Clear localStorage
  2. Reload page
  3. Wait for sets to load
- **Expected Result**:
  - First set in the list is automatically selected
  - Set detail panel shows first set's details
- **Priority**: Medium

### TC-RULES-E104: Handle Deleted Set Selection
- **Description**: Verify behavior when previously selected set is deleted
- **Preconditions**:
  - "Set A" is selected
  - "Set B" also exists
- **Steps**:
  1. Delete "Set A"
  2. Wait for deletion to complete
- **Expected Result**:
  - Selection falls back to first available set ("Set B")
  - localStorage is updated to new selection
  - If no sets remain, selection is null and empty state is shown
- **Priority**: Medium

---

## Empty States

### TC-RULES-E121: Display Empty State When No Sets Exist
- **Description**: Verify empty state message in set list panel
- **Preconditions**: No rule sets exist
- **Steps**:
  1. Navigate to Rules page
  2. Verify left panel shows empty state
- **Expected Result**:
  - Message "No sets created yet." is displayed
  - Create button is still available
- **Priority**: Medium

### TC-RULES-E122: Display Empty State When No Rules Exist
- **Description**: Verify empty state message in pool panel
- **Preconditions**: No rules exist
- **Steps**:
  1. Navigate to Rules page
  2. Verify pool panel shows empty state
- **Expected Result**:
  - Message "No rules found." is displayed
  - Create button is still available
- **Priority**: Medium

### TC-RULES-E123: Display Empty State When No Rules in Set
- **Description**: Verify empty state in set detail when set has no rules
- **Preconditions**: Empty set is selected
- **Steps**:
  1. Select empty set
  2. Verify set detail panel shows empty state
- **Expected Result**:
  - Message "No rules in this set." is displayed
- **Priority**: Medium

### TC-RULES-E124: Display Placeholder When No Set is Selected
- **Description**: Verify placeholder in set detail when no set is selected
- **Preconditions**: No sets exist or all sets are deselected
- **Steps**:
  1. Ensure no set is selected
  2. Check set detail panel
- **Expected Result**:
  - Placeholder message "Select a rule set to view details" is displayed
  - Icon is shown
- **Priority**: Low

---

## Loading States

### TC-RULES-E141: Display Loading Spinner While Fetching Sets
- **Description**: Verify that loading spinner appears while sets are being fetched
- **Preconditions**: Slow network or delayed API response
- **Steps**:
  1. Mock API to delay response by 1 second
  2. Navigate to Rules page
  3. Immediately check left panel
- **Expected Result**:
  - Loading spinner (Loader2) is visible
  - No sets are displayed yet
  - After 1 second, spinner disappears and sets appear
- **Priority**: Low

### TC-RULES-E142: Display Loading Spinner While Fetching Rules
- **Description**: Verify that loading spinner appears while rules are being fetched
- **Preconditions**: Slow network
- **Steps**:
  1. Mock API to delay rules list response
  2. Navigate to Rules page
  3. Check pool panel
- **Expected Result**:
  - Loading spinner is visible in pool
  - After delay, spinner disappears and rules appear
- **Priority**: Low

---

## Validation and Error Handling

### TC-RULES-E161: Prevent Creating Set with Empty Name
- **Description**: Verify that set creation requires a name
- **Preconditions**: None
- **Steps**:
  1. Click "+" to open set creation popover
  2. Leave name input empty
  3. Verify "Create" button is disabled
  4. Try to submit form
- **Expected Result**:
  - Cannot create set without name
  - Button remains disabled
- **Priority**: High

### TC-RULES-E162: Prevent Creating Rule with Empty Name
- **Description**: Verify that rule creation requires a name
- **Preconditions**: None
- **Steps**:
  1. Open create rule dialog
  2. Leave name empty but enter content
  3. Verify "Create Rule" button is disabled
- **Expected Result**:
  - Cannot create rule without name
  - Button remains disabled
- **Priority**: High

### TC-RULES-E163: Prevent Creating Rule with Empty Content
- **Description**: Verify that rule creation requires content
- **Preconditions**: None
- **Steps**:
  1. Open create rule dialog
  2. Enter name but leave content empty
  3. Verify "Create Rule" button is disabled
- **Expected Result**:
  - Cannot create rule without content
  - Button remains disabled
- **Priority**: High

### TC-RULES-E164: Handle Backend Validation Error
- **Description**: Verify that backend validation errors are displayed to user
- **Preconditions**: Mock backend to return validation error
- **Steps**:
  1. Attempt to create rule with name exceeding max length (if enforced)
  2. Submit form
  3. Backend returns error
- **Expected Result**:
  - Error message is displayed (toast, alert, or inline)
  - Rule is not created
  - User can correct and retry
- **Priority**: Medium

### TC-RULES-E165: Handle Network Error Gracefully
- **Description**: Verify that network errors do not crash the UI
- **Preconditions**: Mock API to simulate network failure
- **Steps**:
  1. Trigger rule creation
  2. Mock API throws network error
  3. Wait for error handling
- **Expected Result**:
  - Error message is displayed to user
  - UI does not crash or hang
  - User can retry the operation
- **Priority**: High

---

## Responsiveness and UI Behavior

### TC-RULES-E181: Resize Panels
- **Description**: Verify that the 3-pane layout can be resized
- **Preconditions**: Rules page loaded
- **Steps**:
  1. Drag the first resizable handle to expand set list panel
  2. Drag the second handle to expand pool panel
  3. Verify panels resize accordingly
- **Expected Result**:
  - Panels resize smoothly
  - Content adapts to new width
  - Minimum width constraints are respected
- **Priority**: Low

### TC-RULES-E182: Scroll Long Lists
- **Description**: Verify that long lists of sets or rules are scrollable
- **Preconditions**: 20+ rules in pool or 10+ sets in list
- **Steps**:
  1. Scroll through set list
  2. Scroll through pool list
- **Expected Result**:
  - Lists scroll smoothly
  - No layout issues or overflow
- **Priority**: Low

### TC-RULES-E183: Hover Effects on Interactive Elements
- **Description**: Verify that hover effects provide visual feedback
- **Preconditions**: Rules and sets exist
- **Steps**:
  1. Hover over set item
  2. Hover over rule item
  3. Hover over buttons
- **Expected Result**:
  - Background color changes on hover
  - Remove/edit buttons appear on hover (for rule items)
  - Cursor changes to pointer for clickable elements
- **Priority**: Low

---

## Accessibility

### TC-RULES-E201: Navigate with Keyboard Only
- **Description**: Verify that all actions can be performed using keyboard
- **Preconditions**: Rules page loaded
- **Steps**:
  1. Tab through all interactive elements
  2. Press Enter to activate buttons
  3. Press Escape to close dialogs
  4. Use arrow keys for navigation (if supported)
- **Expected Result**:
  - Focus is visible on all elements
  - All actions can be triggered via keyboard
  - Tab order is logical
- **Priority**: Medium

### TC-RULES-E202: Screen Reader Compatibility
- **Description**: Verify that all buttons and actions have accessible labels
- **Preconditions**: Screen reader enabled (or manual inspection)
- **Steps**:
  1. Inspect buttons (Edit, Delete, Add, etc.)
  2. Verify each has aria-label or accessible text
  3. Verify form inputs have labels
- **Expected Result**:
  - All interactive elements are properly labeled
  - Screen reader can announce all actions
- **Priority**: Medium

### TC-RULES-E203: Focus Management in Dialogs
- **Description**: Verify that focus is trapped in dialogs and restored on close
- **Preconditions**: None
- **Steps**:
  1. Open create rule dialog
  2. Tab through dialog elements
  3. Verify focus does not leave dialog
  4. Close dialog
  5. Verify focus returns to trigger button
- **Expected Result**:
  - Focus is trapped in dialog
  - Focus is restored after close
- **Priority**: Medium

---

## Data Integrity

### TC-RULES-E221: Verify Data Persistence After CRUD Operations
- **Description**: Verify that all CRUD operations persist data correctly
- **Preconditions**: None
- **Steps**:
  1. Create set "Persistent Set"
  2. Create rule "Persistent Rule"
  3. Add rule to set
  4. Reload page
  5. Verify set and rule still exist
  6. Verify rule is still in set
- **Expected Result**:
  - All data persists after reload
  - Set-rule associations are maintained
- **Priority**: High

### TC-RULES-E222: Verify Concurrent Updates
- **Description**: Verify that rapid updates do not cause data corruption
- **Preconditions**: Set with multiple rules
- **Steps**:
  1. Rapidly add 5 rules to a set in quick succession
  2. Wait for all operations to complete
  3. Verify all 5 rules are in the set
- **Expected Result**:
  - All operations complete successfully
  - No rules are lost or duplicated
  - Set count is accurate
- **Priority**: Medium

---

## Performance

### TC-RULES-E241: Load Page with Large Dataset
- **Description**: Verify that page loads smoothly with 100+ rules and 20+ sets
- **Preconditions**: Mock API returns large dataset
- **Steps**:
  1. Navigate to Rules page with 100 rules and 20 sets
  2. Measure load time
  3. Interact with UI (scroll, select, etc.)
- **Expected Result**:
  - Page loads in under 2 seconds
  - UI is responsive during interactions
  - No lag or freezing
- **Priority**: Low

### TC-RULES-E242: Drag and Drop Performance
- **Description**: Verify that drag and drop is smooth with many items
- **Preconditions**: Set with 50 rules
- **Steps**:
  1. Drag a rule from bottom to top of set
  2. Observe animation smoothness
- **Expected Result**:
  - Animation is smooth (60fps)
  - No lag or stuttering
- **Priority**: Low

---

## Cross-Browser Compatibility

### TC-RULES-E261: Test on Chrome
- **Description**: Verify that all features work correctly on Chrome
- **Preconditions**: Chrome browser
- **Steps**:
  1. Run all critical workflows on Chrome
- **Expected Result**:
  - All features work as expected
- **Priority**: High

### TC-RULES-E262: Test on Firefox
- **Description**: Verify that all features work correctly on Firefox
- **Preconditions**: Firefox browser
- **Steps**:
  1. Run all critical workflows on Firefox
- **Expected Result**:
  - All features work as expected
- **Priority**: Medium

### TC-RULES-E263: Test on Safari
- **Description**: Verify that all features work correctly on Safari
- **Preconditions**: Safari browser
- **Steps**:
  1. Run all critical workflows on Safari
- **Expected Result**:
  - All features work as expected
- **Priority**: Low

---

## Regression Tests

### TC-RULES-E281: Verify Rules Overflow Fix (Issue LIN-XX)
- **Description**: Verify that long rule content does not overflow container
- **Preconditions**: Rule with very long content exists
- **Steps**:
  1. Create rule with content exceeding 500 characters
  2. Verify content is truncated or scrollable
  3. Check both pool and set detail views
- **Expected Result**:
  - No overflow outside container
  - Content is readable via scroll or truncation
- **Priority**: Medium

---

## Summary

This document covers E2E test scenarios for:
- **Rule Set Management**: CRUD operations, selection, rename, reorder
- **Rule Management**: CRUD operations, edit, delete, filter
- **Set-Rule Association**: Add, remove, reorder rules in sets
- **Import/Export**: JSON import with validation
- **Full Workflows**: Realistic multi-step user journeys
- **Persistence**: Selection state, data integrity
- **Empty/Loading States**: Edge cases
- **Validation**: Form validation, error handling
- **UI/UX**: Responsiveness, drag-and-drop, hover effects
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Large datasets, smooth interactions
- **Cross-browser**: Chrome, Firefox, Safari
- **Regression**: Known issue verification

**Total Test Cases: 68**

**Recommended Execution Order:**
1. High priority tests first (marked as "High")
2. Medium priority for comprehensive coverage
3. Low priority for polish and edge cases

**Automation Notes:**
- Use Playwright's auto-wait features (no waitForTimeout)
- Use data-testid attributes for stable selectors
- Implement Page Object Model for maintainability
- Run tests in parallel where possible
- Use beforeEach for clean state setup
