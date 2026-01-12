# Rules Feature - Unit Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 96 |
| High Priority | 57 (59%) |
| Medium Priority | 33 (34%) |
| Low Priority | 6 (6%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 13 | █░░░░░░░░░ 14% |
| Handler | 9 | █░░░░░░░░░ 9% |
| Hook | 14 | ██░░░░░░░░ 15% |
| Component | 49 | █████░░░░░ 51% |
| Utility | 8 | █░░░░░░░░░ 8% |
| Service | 3 | ░░░░░░░░░░ 3% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 96 |
| High Priority | 57 (59%) |
| Medium Priority | 33 (34%) |
| Low Priority | 6 (6%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 13 | █░░░░░░░░░ 14% |
| Handler | 9 | █░░░░░░░░░ 9% |
| Hook | 14 | ██░░░░░░░░ 15% |
| Component | 49 | █████░░░░░ 51% |
| Utility | 8 | █░░░░░░░░░ 8% |
| Service | 3 | ░░░░░░░░░░ 3% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 9 |
| High Priority | 57 (633%) |
| Medium Priority | 33 (367%) |
| Low Priority | 6 (67%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 3 | ███░░░░░░░ 33% |
| Component | 6 | ███████░░░ 67% |

## Overview
This document describes unit test scenarios for the Rules feature, covering both frontend (React components, hooks) and backend (Services, Handlers) layers.

---

## Backend Layer Tests

### Service Layer: RulesService

#### TC-RULES-R001: Create Rule with Valid Parameters
- **Description**: Verify that creating a rule with valid parameters succeeds and logs history
- **Preconditions**: RulesService initialized with mock repository and history service
- **Steps**:
  1. Call `service.create({ name: 'Test Rule', content: 'Test content', isActive: true })`
  2. Verify repository.create was called with correct parameters
  3. Verify historyService.addEntry was called with 'rule', id, 'create', and rule data
  4. Verify returned rule contains id, name, content, isActive, createdAt, updatedAt
- **Expected Result**: Rule is created and history is logged
- **Priority**: High

#### TC-RULES-R002: Create Rule without Logging History
- **Description**: Verify that skipLog option prevents history logging
- **Preconditions**: RulesService initialized
- **Steps**:
  1. Call `service.create(params, { skipLog: true })`
  2. Verify repository.create was called
  3. Verify historyService.addEntry was NOT called
- **Expected Result**: Rule is created but history is not logged
- **Priority**: Medium

#### TC-RULES-R003: Update Existing Rule
- **Description**: Verify that updating an existing rule succeeds and logs history
- **Preconditions**: Rule exists in repository
- **Steps**:
  1. Mock repository.getById to return existing rule
  2. Mock repository.update to return updated rule
  3. Call `service.update({ id: 'rule-1', name: 'Updated Name' })`
  4. Verify repository.update was called with correct parameters
  5. Verify historyService.addEntry was called with old rule data
- **Expected Result**: Rule is updated and history contains previous state
- **Priority**: High

#### TC-RULES-R004: Update Non-existent Rule
- **Description**: Verify that updating a non-existent rule throws error
- **Preconditions**: Repository returns null for getById
- **Steps**:
  1. Mock repository.update to return null
  2. Call `service.update({ id: 'non-existent' })`
  3. Expect promise to reject with 'Rule not found'
- **Expected Result**: Error is thrown
- **Priority**: High

#### TC-RULES-R005: Delete Existing Rule
- **Description**: Verify that deleting a rule succeeds and logs history
- **Preconditions**: Rule exists in repository
- **Steps**:
  1. Mock repository.getById to return existing rule
  2. Call `service.delete('rule-1')`
  3. Verify repository.delete was called with rule id
  4. Verify historyService.addEntry was called with 'delete' action
- **Expected Result**: Rule is deleted and history is logged
- **Priority**: High

#### TC-RULES-R006: Get All Rules
- **Description**: Verify that getAll returns all rules from repository
- **Preconditions**: Repository contains multiple rules
- **Steps**:
  1. Mock repository.getAll to return array of rules
  2. Call `service.getAll()`
  3. Verify repository.getAll was called
  4. Verify returned array matches mocked data
- **Expected Result**: All rules are returned
- **Priority**: High

#### TC-RULES-R007: Get Rule by ID
- **Description**: Verify that getById returns correct rule
- **Preconditions**: Rule exists in repository
- **Steps**:
  1. Mock repository.getById to return specific rule
  2. Call `service.getById('rule-1')`
  3. Verify repository.getById was called with correct id
  4. Verify returned rule matches mocked data
- **Expected Result**: Correct rule is returned
- **Priority**: Medium

---

### Service Layer: RuleSetService

#### TC-RULES-R021: Create Rule Set
- **Description**: Verify that creating a rule set succeeds
- **Preconditions**: RuleSetService initialized
- **Steps**:
  1. Call `service.create({ name: 'Dev Rules', items: [] })`
  2. Verify repository.create was called with correct parameters
  3. Verify returned set contains id, name, items, createdAt, updatedAt
- **Expected Result**: Rule set is created
- **Priority**: High

#### TC-RULES-R022: Update Rule Set Items
- **Description**: Verify that updating rule set items (adding/removing rules) succeeds
- **Preconditions**: Rule set exists
- **Steps**:
  1. Mock repository.update to return updated set
  2. Call `service.update({ id: 'set-1', items: ['rule-1', 'rule-2'] })`
  3. Verify repository.update was called
  4. Verify returned set has updated items array
- **Expected Result**: Rule set items are updated
- **Priority**: High

#### TC-RULES-R023: Update Rule Set Name
- **Description**: Verify that renaming a rule set succeeds
- **Preconditions**: Rule set exists
- **Steps**:
  1. Call `service.update({ id: 'set-1', name: 'New Name' })`
  2. Verify repository.update was called with new name
  3. Verify returned set has updated name
- **Expected Result**: Rule set is renamed
- **Priority**: Medium

#### TC-RULES-R024: Update Non-existent Rule Set
- **Description**: Verify that updating a non-existent set throws error
- **Preconditions**: Repository returns null
- **Steps**:
  1. Mock repository.update to return null
  2. Call `service.update({ id: 'bad-id' })`
  3. Expect promise to reject with 'RuleSet not found'
- **Expected Result**: Error is thrown
- **Priority**: High

#### TC-RULES-R025: Delete Rule Set
- **Description**: Verify that deleting a rule set succeeds
- **Preconditions**: Rule set exists
- **Steps**:
  1. Call `service.delete('set-1')`
  2. Verify repository.delete was called with correct id
- **Expected Result**: Rule set is deleted
- **Priority**: High

#### TC-RULES-R026: Get All Rule Sets
- **Description**: Verify that getAll returns all rule sets
- **Preconditions**: Repository contains multiple sets
- **Steps**:
  1. Mock repository.getAll to return array of sets
  2. Call `service.getAll()`
  3. Verify returned array matches mocked data
- **Expected Result**: All rule sets are returned
- **Priority**: High

---

### Handler Layer: RulesHandler

#### TC-RULES-H001: Create Rule with Validation
- **Description**: Verify that handler validates input before calling service
- **Preconditions**: Handler registered with IPC
- **Steps**:
  1. Send IPC call with valid params: `{ name: 'Test', content: 'Content', isActive: true }`
  2. Verify Zod schema validation passes
  3. Verify service.create was called
  4. Verify response has `success: true`
- **Expected Result**: Rule is created with validation
- **Priority**: High

#### TC-RULES-H002: Create Rule with Missing Name
- **Description**: Verify that validation rejects missing name
- **Preconditions**: Handler registered
- **Steps**:
  1. Send IPC call with `{ content: 'Content' }` (missing name)
  2. Expect validation error
  3. Verify service.create was NOT called
  4. Verify response has `success: false` and error message
- **Expected Result**: Validation error is returned
- **Priority**: High

#### TC-RULES-H003: Create Rule with Empty Content
- **Description**: Verify that validation rejects empty content
- **Preconditions**: Handler registered
- **Steps**:
  1. Send IPC call with `{ name: 'Test', content: '' }`
  2. Expect validation error for content
  3. Verify service.create was NOT called
- **Expected Result**: Validation error is returned
- **Priority**: High

#### TC-RULES-H004: Update Rule with Invalid UUID
- **Description**: Verify that validation rejects invalid UUID format
- **Preconditions**: Handler registered
- **Steps**:
  1. Send IPC call with `{ id: 'not-a-uuid', name: 'New' }`
  2. Expect validation error for id format
  3. Verify service.update was NOT called
- **Expected Result**: Validation error is returned
- **Priority**: Medium

#### TC-RULES-H005: List All Rules
- **Description**: Verify that list handler returns all rules
- **Preconditions**: Rules exist in service
- **Steps**:
  1. Send IPC call to 'rules:list'
  2. Verify service.getAll was called
  3. Verify response contains array of rules
- **Expected Result**: All rules are returned
- **Priority**: High

#### TC-RULES-H006: Get Rule by ID
- **Description**: Verify that get handler returns specific rule
- **Preconditions**: Rule exists
- **Steps**:
  1. Send IPC call to 'rules:get' with id
  2. Verify service.getById was called with correct id
  3. Verify response contains rule data
- **Expected Result**: Correct rule is returned
- **Priority**: Medium

---

### Handler Layer: SetsHandler (Rules)

#### TC-RULES-H021: Create Rule Set via IPC
- **Description**: Verify that creating a rule set via IPC succeeds
- **Preconditions**: Handler registered
- **Steps**:
  1. Send IPC call to 'sets:rules:create' with `{ name: 'Set 1', items: [] }`
  2. Verify ruleSetService.create was called
  3. Verify response has `success: true`
- **Expected Result**: Rule set is created
- **Priority**: High

#### TC-RULES-H022: Update Rule Set via IPC
- **Description**: Verify that updating a rule set via IPC succeeds
- **Preconditions**: Rule set exists
- **Steps**:
  1. Send IPC call to 'sets:rules:update' with updated params
  2. Verify ruleSetService.update was called
  3. Verify response contains updated set
- **Expected Result**: Rule set is updated
- **Priority**: High

#### TC-RULES-H023: Delete Rule Set via IPC
- **Description**: Verify that deleting a rule set via IPC succeeds
- **Preconditions**: Rule set exists
- **Steps**:
  1. Send IPC call to 'sets:rules:delete' with set id
  2. Verify ruleSetService.delete was called with correct id
  3. Verify response has `success: true`
- **Expected Result**: Rule set is deleted
- **Priority**: High

---

## Frontend Layer Tests

### Hooks: useRules

#### TC-RULES-K001: Fetch Rule Sets on Mount
- **Description**: Verify that rule sets are fetched when hook is initialized
- **Preconditions**: Mock API configured
- **Steps**:
  1. Render component using `useRules` hook
  2. Verify 'rule-sets' query is triggered
  3. Verify window.api.sets.rules.list was called
  4. Verify `sets` array is populated
- **Expected Result**: Rule sets are loaded
- **Priority**: High

#### TC-RULES-K002: Fetch Rules on Mount
- **Description**: Verify that rules are fetched when hook is initialized
- **Preconditions**: Mock API configured
- **Steps**:
  1. Render component using `useRules`
  2. Verify 'rules' query is triggered
  3. Verify window.api.rules.list was called
  4. Verify `rules` array is populated
- **Expected Result**: Rules are loaded
- **Priority**: High

#### TC-RULES-K003: Create Rule Set Mutation
- **Description**: Verify that creating a rule set invalidates cache
- **Preconditions**: Hook initialized
- **Steps**:
  1. Call `createSet({ name: 'New Set', items: [] })`
  2. Verify window.api.sets.rules.create was called
  3. Verify 'rule-sets' query is invalidated
  4. Verify new set appears in `sets` array
- **Expected Result**: Rule set is created and cache refreshed
- **Priority**: High

#### TC-RULES-K004: Update Rule Set Mutation
- **Description**: Verify that updating a rule set invalidates cache
- **Preconditions**: Rule set exists
- **Steps**:
  1. Call `updateSet({ id: 'set-1', name: 'Updated' })`
  2. Verify window.api.sets.rules.update was called
  3. Verify 'rule-sets' query is invalidated
- **Expected Result**: Rule set is updated and cache refreshed
- **Priority**: High

#### TC-RULES-K005: Delete Rule Set Mutation
- **Description**: Verify that deleting a rule set invalidates cache
- **Preconditions**: Rule set exists
- **Steps**:
  1. Call `deleteSet('set-1')`
  2. Verify window.api.sets.rules.delete was called
  3. Verify 'rule-sets' query is invalidated
- **Expected Result**: Rule set is deleted and removed from list
- **Priority**: High

#### TC-RULES-K006: Create Rule Mutation
- **Description**: Verify that creating a rule invalidates cache
- **Preconditions**: Hook initialized
- **Steps**:
  1. Call `createRule({ name: 'New Rule', content: 'Content' })`
  2. Verify window.api.rules.create was called
  3. Verify 'rules' query is invalidated
- **Expected Result**: Rule is created and appears in pool
- **Priority**: High

#### TC-RULES-K007: Update Rule Mutation
- **Description**: Verify that updating a rule invalidates cache
- **Preconditions**: Rule exists
- **Steps**:
  1. Call `updateRule({ id: 'rule-1', name: 'Updated' })`
  2. Verify window.api.rules.update was called
  3. Verify 'rules' query is invalidated
- **Expected Result**: Rule is updated and cache refreshed
- **Priority**: High

#### TC-RULES-K008: Delete Rule Mutation
- **Description**: Verify that deleting a rule invalidates cache
- **Preconditions**: Rule exists
- **Steps**:
  1. Call `deleteRule('rule-1')`
  2. Verify window.api.rules.delete was called
  3. Verify 'rules' query is invalidated
- **Expected Result**: Rule is deleted and removed from pool
- **Priority**: High

---

### Hooks: useRuleSelection

#### TC-RULES-K021: Initialize with Null Selection
- **Description**: Verify that selection starts as null when no localStorage value exists
- **Preconditions**: localStorage is empty
- **Steps**:
  1. Clear localStorage 'rules-last-selected-id'
  2. Render hook with empty sets
  3. Verify `selectedSetId` is null
- **Expected Result**: No set is selected initially
- **Priority**: Medium

#### TC-RULES-K022: Auto-select First Set on Load
- **Description**: Verify that first set is auto-selected when sets load and no previous selection exists
- **Preconditions**: Sets exist, no localStorage value
- **Steps**:
  1. Clear localStorage
  2. Render hook with non-empty sets array
  3. Wait for effect to run
  4. Verify `selectedSetId` equals first set's id
- **Expected Result**: First set is auto-selected
- **Priority**: High

#### TC-RULES-K023: Restore Last Selected Set from localStorage
- **Description**: Verify that last selected set is restored from localStorage
- **Preconditions**: localStorage has 'rules-last-selected-id'
- **Steps**:
  1. Set localStorage to 'set-2'
  2. Render hook with sets containing 'set-2'
  3. Verify `selectedSetId` is 'set-2'
- **Expected Result**: Last selected set is restored
- **Priority**: High

#### TC-RULES-K024: Handle Select Set Action
- **Description**: Verify that selecting a set updates state and localStorage
- **Preconditions**: Hook initialized with sets
- **Steps**:
  1. Call `handleSelectSet('set-1')`
  2. Verify `selectedSetId` is updated to 'set-1'
  3. Verify localStorage 'rules-last-selected-id' is set to 'set-1'
- **Expected Result**: Selection is updated and persisted
- **Priority**: High

#### TC-RULES-K025: Deselect Set (Set to Null)
- **Description**: Verify that setting selection to null clears localStorage
- **Preconditions**: Set is selected
- **Steps**:
  1. Call `handleSelectSet(null)`
  2. Verify `selectedSetId` is null
  3. Verify localStorage 'rules-last-selected-id' is removed
- **Expected Result**: Selection is cleared
- **Priority**: Medium

#### TC-RULES-K026: Ignore Redundant Selection
- **Description**: Verify that selecting already-selected set does nothing
- **Preconditions**: Set is already selected
- **Steps**:
  1. Set `selectedSetId` to 'set-1'
  2. Call `handleSelectSet('set-1')` again
  3. Verify no state change occurs
- **Expected Result**: No redundant update
- **Priority**: Low

---

### Component: RuleEditor

#### TC-RULES-C001: Render in Create Mode
- **Description**: Verify that editor renders in create mode with empty fields
- **Preconditions**: None
- **Steps**:
  1. Render `<RuleEditor mode="create" onCancel={...} onSubmit={...} />`
  2. Verify title is 'New Rule'
  3. Verify name input is empty
  4. Verify content textarea is empty
  5. Verify submit button says 'Create'
- **Expected Result**: Create mode UI is displayed
- **Priority**: High

#### TC-RULES-C002: Render in Edit Mode with Initial Data
- **Description**: Verify that editor renders in edit mode with pre-filled data
- **Preconditions**: Rule data provided
- **Steps**:
  1. Render with `mode="edit"` and `initialData={{ name: 'Test', content: 'Content', isActive: true }}`
  2. Verify title is 'Edit Rule'
  3. Verify name input shows 'Test'
  4. Verify content textarea shows 'Content'
  5. Verify submit button says 'Save'
- **Expected Result**: Edit mode UI is displayed with data
- **Priority**: High

#### TC-RULES-C003: Submit Create Form
- **Description**: Verify that submitting create form calls onSubmit with correct data
- **Preconditions**: Create mode
- **Steps**:
  1. Enter name 'New Rule'
  2. Enter content 'Some content'
  3. Click submit button
  4. Verify onSubmit was called with `{ name: 'New Rule', content: 'Some content', isActive: true }`
- **Expected Result**: Form data is submitted
- **Priority**: High

#### TC-RULES-C004: Cancel Button Calls onCancel
- **Description**: Verify that clicking cancel triggers onCancel callback
- **Preconditions**: Editor rendered
- **Steps**:
  1. Click cancel button
  2. Verify onCancel was called
- **Expected Result**: Cancel callback is invoked
- **Priority**: Medium

#### TC-RULES-C005: Toggle Active State in Edit Mode
- **Description**: Verify that toggling active/archived state works
- **Preconditions**: Edit mode with isActive: true
- **Steps**:
  1. Click 'Archive' button
  2. Verify isActive state changes to false
  3. Verify button now shows 'Activate'
  4. Click 'Activate' button
  5. Verify isActive state changes to true
- **Expected Result**: Active state toggles correctly
- **Priority**: Medium

#### TC-RULES-C006: Disable Submit When Form is Invalid
- **Description**: Verify that submit button is disabled when required fields are empty
- **Preconditions**: Create mode
- **Steps**:
  1. Leave name and content empty
  2. Verify submit button is disabled (implicitly via required attribute)
- **Expected Result**: Invalid form cannot be submitted
- **Priority**: Medium

---

### Component: RuleDialog

#### TC-RULES-C021: Open Dialog in Create Mode
- **Description**: Verify that dialog opens in create mode with empty fields
- **Preconditions**: None
- **Steps**:
  1. Render `<RuleDialog open={true} mode="create" />`
  2. Verify dialog is visible
  3. Verify title is 'Create New Rule'
  4. Verify name and content inputs are empty
- **Expected Result**: Create dialog is displayed
- **Priority**: High

#### TC-RULES-C022: Open Dialog in Edit Mode with Data
- **Description**: Verify that dialog opens in edit mode with pre-filled data
- **Preconditions**: Rule data provided
- **Steps**:
  1. Render with `mode="edit"` and `initialData={{ id: 'r1', name: 'Test', content: 'Content', isActive: true }}`
  2. Verify title is 'Edit Rule'
  3. Verify fields are pre-filled
- **Expected Result**: Edit dialog is displayed with data
- **Priority**: High

#### TC-RULES-C023: Submit Create Form via Dialog
- **Description**: Verify that submitting form calls onSuccess callback
- **Preconditions**: Create mode dialog open
- **Steps**:
  1. Enter name and content
  2. Click 'Create Rule' button
  3. Verify onSuccess was called with form data
- **Expected Result**: Form submission triggers callback
- **Priority**: High

#### TC-RULES-C024: Close Dialog via onOpenChange
- **Description**: Verify that dialog can be closed
- **Preconditions**: Dialog open
- **Steps**:
  1. Click outside dialog or press ESC
  2. Verify onOpenChange(false) was called
- **Expected Result**: Dialog closes
- **Priority**: Medium

#### TC-RULES-C025: Delete Rule from Edit Dialog
- **Description**: Verify that delete button in edit mode triggers onDelete
- **Preconditions**: Edit mode with onDelete callback
- **Steps**:
  1. Open edit dialog
  2. Click delete icon button
  3. Confirm deletion in alert dialog
  4. Verify onDelete was called with rule id
- **Expected Result**: Delete callback is invoked
- **Priority**: High

#### TC-RULES-C026: Disable Submit When Fields are Empty
- **Description**: Verify that submit button is disabled when name or content is empty
- **Preconditions**: Dialog open
- **Steps**:
  1. Leave name or content empty
  2. Verify submit button is disabled
- **Expected Result**: Invalid form cannot be submitted
- **Priority**: Medium

---

### Component: RuleSetList

#### TC-RULES-C041: Display Empty State
- **Description**: Verify that empty state is displayed when no sets exist
- **Preconditions**: Empty sets array
- **Steps**:
  1. Render with `sets={[]}`
  2. Verify message 'No sets created yet.' is displayed
- **Expected Result**: Empty state message is shown
- **Priority**: Medium

#### TC-RULES-C042: Display Loading State
- **Description**: Verify that loading spinner is shown while fetching
- **Preconditions**: isLoading is true
- **Steps**:
  1. Render with `isLoading={true}`
  2. Verify Loader2 spinner is visible
- **Expected Result**: Loading state is displayed
- **Priority**: Medium

#### TC-RULES-C043: Render List of Sets
- **Description**: Verify that all sets are rendered in the list
- **Preconditions**: Multiple sets exist
- **Steps**:
  1. Render with `sets={[{id: 's1', name: 'Set 1', items: []}, {id: 's2', name: 'Set 2', items: ['r1']}]}`
  2. Verify two set items are rendered
  3. Verify each set shows name and item count
- **Expected Result**: All sets are displayed with correct data
- **Priority**: High

#### TC-RULES-C044: Select Set on Click
- **Description**: Verify that clicking a set triggers onSelectSet
- **Preconditions**: Sets rendered
- **Steps**:
  1. Click on a set item
  2. Verify onSelectSet was called with correct set id
- **Expected Result**: Set selection callback is invoked
- **Priority**: High

#### TC-RULES-C045: Highlight Selected Set
- **Description**: Verify that selected set has different styling
- **Preconditions**: Set is selected
- **Steps**:
  1. Render with `selectedSetId='s1'`
  2. Verify set 's1' has highlighted background and border styles
- **Expected Result**: Selected set is visually distinct
- **Priority**: Medium

#### TC-RULES-C046: Create New Set via Popover
- **Description**: Verify that creating a new set works
- **Preconditions**: List rendered
- **Steps**:
  1. Click '+' button to open popover
  2. Enter set name 'New Set'
  3. Click 'Create' button
  4. Verify onCreateSet was called with `{ name: 'New Set', items: [] }`
- **Expected Result**: New set is created
- **Priority**: High

#### TC-RULES-C047: Disable Create Button When Name is Empty
- **Description**: Verify that create button is disabled when input is empty
- **Preconditions**: Popover open
- **Steps**:
  1. Leave name input empty
  2. Verify 'Create' button is disabled
- **Expected Result**: Cannot create set without name
- **Priority**: Medium

#### TC-RULES-C048: Drag and Drop to Reorder Sets
- **Description**: Verify that sets can be reordered via drag and drop
- **Preconditions**: Multiple sets rendered
- **Steps**:
  1. Drag set 's2' above set 's1'
  2. Verify local state updates to reflect new order
  3. (Note: Backend persistence not yet implemented)
- **Expected Result**: Sets are visually reordered
- **Priority**: Low

---

### Component: RuleSetDetail

#### TC-RULES-C061: Display Empty State When No Set is Selected
- **Description**: Verify that placeholder is shown when no set is selected
- **Preconditions**: set prop is undefined
- **Steps**:
  1. Render with `set={undefined}`
  2. Verify message 'Select a rule set to view details' is displayed
- **Expected Result**: Empty state is shown
- **Priority**: Medium

#### TC-RULES-C062: Display Set Name and Rules
- **Description**: Verify that selected set's name and rules are displayed
- **Preconditions**: Set with rules selected
- **Steps**:
  1. Render with `set={{ id: 's1', name: 'Dev Set', items: ['r1'] }}` and `rules=[{ id: 'r1', name: 'Rule 1', ... }]`
  2. Verify set name 'Dev Set' is displayed in title
  3. Verify rule 'Rule 1' is listed
- **Expected Result**: Set details are displayed
- **Priority**: High

#### TC-RULES-C063: Remove Rule from Set
- **Description**: Verify that clicking remove button triggers onRemoveRule
- **Preconditions**: Set with rules displayed
- **Steps**:
  1. Hover over rule item to reveal remove button
  2. Click 'X' button
  3. Verify onRemoveRule was called with rule id
- **Expected Result**: Remove callback is invoked
- **Priority**: High

#### TC-RULES-C064: Delete Set via Alert Dialog
- **Description**: Verify that deleting set requires confirmation
- **Preconditions**: Set selected
- **Steps**:
  1. Click trash icon button
  2. Verify alert dialog appears with confirmation message
  3. Click 'Delete' in alert
  4. Verify onDeleteSet was called
- **Expected Result**: Set deletion is confirmed and executed
- **Priority**: High

#### TC-RULES-C065: Rename Set Inline
- **Description**: Verify that clicking set name allows inline editing
- **Preconditions**: Set selected
- **Steps**:
  1. Click on set name in title
  2. Verify input field appears with current name
  3. Change name to 'Renamed Set'
  4. Press Enter or blur input
  5. Verify onRenameSet was called with new name
- **Expected Result**: Set is renamed
- **Priority**: Medium

#### TC-RULES-C066: Cancel Rename on Escape
- **Description**: Verify that pressing Escape cancels rename
- **Preconditions**: Rename input active
- **Steps**:
  1. Click set name to edit
  2. Type new name but press Escape
  3. Verify input closes without calling onRenameSet
- **Expected Result**: Rename is cancelled
- **Priority**: Low

#### TC-RULES-C067: Reorder Rules via Drag and Drop
- **Description**: Verify that rules within set can be reordered
- **Preconditions**: Multiple rules in set
- **Steps**:
  1. Drag rule 'r2' above rule 'r1'
  2. Verify onReorderRules was called with new order ['r2', 'r1']
- **Expected Result**: Rule order is updated
- **Priority**: Medium

---

### Component: RulePool

#### TC-RULES-C081: Display Loading State
- **Description**: Verify that loading spinner is shown
- **Preconditions**: isLoading is true
- **Steps**:
  1. Render with `isLoading={true}`
  2. Verify Loader2 spinner is visible
- **Expected Result**: Loading state is displayed
- **Priority**: Medium

#### TC-RULES-C082: Display Empty State
- **Description**: Verify that empty message is shown when no rules exist
- **Preconditions**: rules array is empty
- **Steps**:
  1. Render with `rules={[]}`
  2. Verify message 'No rules found.' is displayed
- **Expected Result**: Empty state is shown
- **Priority**: Medium

#### TC-RULES-C083: Render All Rules in Pool
- **Description**: Verify that all rules are displayed
- **Preconditions**: Multiple rules exist
- **Steps**:
  1. Render with array of rules
  2. Verify each rule is rendered with name and date
- **Expected Result**: All rules are displayed
- **Priority**: High

#### TC-RULES-C084: Filter Rules via Search
- **Description**: Verify that search filters rules by name and content
- **Preconditions**: Rules exist
- **Steps**:
  1. Click filter icon to open search popover
  2. Type 'Python' in search input
  3. Verify only rules matching 'Python' are displayed
- **Expected Result**: Search filters correctly
- **Priority**: High

#### TC-RULES-C085: Add Rule to Selected Set
- **Description**: Verify that clicking '+' button adds rule to set
- **Preconditions**: Set is selected, rule not in set
- **Steps**:
  1. Click '+' button on rule item
  2. Verify onAddRuleToSet was called with rule id
- **Expected Result**: Rule is added to set
- **Priority**: High

#### TC-RULES-C086: Hide Add Button for Rules Already in Set
- **Description**: Verify that '+' button is hidden for rules already in selected set
- **Preconditions**: Set selected, rule already in set
- **Steps**:
  1. Render with rule id in `selectedSet.items`
  2. Verify '+' button is not visible on that rule
- **Expected Result**: Add button is hidden
- **Priority**: Medium

#### TC-RULES-C087: Open Create Dialog
- **Description**: Verify that clicking '+' in header opens create dialog
- **Preconditions**: Pool rendered
- **Steps**:
  1. Click '+' button in pool header
  2. Verify RuleDialog opens in create mode
- **Expected Result**: Create dialog is opened
- **Priority**: High

#### TC-RULES-C088: Edit Rule via Actions Menu
- **Description**: Verify that clicking edit in actions menu opens edit dialog
- **Preconditions**: Rules rendered
- **Steps**:
  1. Hover over rule to reveal actions menu
  2. Click three-dot menu
  3. Click 'Edit' option
  4. Verify RuleDialog opens in edit mode with rule data
- **Expected Result**: Edit dialog is opened
- **Priority**: High

#### TC-RULES-C089: Delete Rule via Actions Menu
- **Description**: Verify that clicking delete in actions menu triggers deletion
- **Preconditions**: Rules rendered
- **Steps**:
  1. Open actions menu
  2. Click 'Delete' option
  3. Verify onDeleteRule was called with rule id
- **Expected Result**: Delete callback is invoked
- **Priority**: High

#### TC-RULES-C090: Reorder Rules in Pool
- **Description**: Verify that pool rules can be reordered (UI only, no backend persistence)
- **Preconditions**: Multiple rules in pool
- **Steps**:
  1. Drag rule to new position
  2. Verify local state updates to reflect new order
- **Expected Result**: Visual order changes
- **Priority**: Low

---

### Utility: rule-import

#### TC-RULES-U001: Parse Valid JSON Array
- **Description**: Verify that valid JSON array is parsed correctly
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('[{"name": "Rule 1", "content": "Content 1"}]')`
  2. Verify result has `success: true`
  3. Verify data array contains 1 rule with correct name and content
- **Expected Result**: JSON is parsed successfully
- **Priority**: High

#### TC-RULES-U002: Parse Valid JSON Object with Rules Property
- **Description**: Verify that object with 'rules' key is parsed
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('{"rules": [{"name": "R1", "content": "C1"}]}')`
  2. Verify result.success is true
  3. Verify rules array is extracted correctly
- **Expected Result**: Nested rules are parsed
- **Priority**: Medium

#### TC-RULES-U003: Parse Single Rule Object
- **Description**: Verify that single rule object is parsed
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('{"name": "Single", "content": "Content"}')`
  2. Verify result.success is true
  3. Verify data array contains 1 rule
- **Expected Result**: Single rule is parsed
- **Priority**: Medium

#### TC-RULES-U004: Parse Rule Map (Key-Value)
- **Description**: Verify that map of rules is parsed (key as name, value as content)
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('{"Rule A": "Content A", "Rule B": "Content B"}')`
  2. Verify result.success is true
  3. Verify data array contains 2 rules with names from keys
- **Expected Result**: Map is parsed correctly
- **Priority**: Medium

#### TC-RULES-U005: Handle Invalid JSON
- **Description**: Verify that invalid JSON returns error
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('{invalid json}')`
  2. Verify result.success is false
  3. Verify error message indicates invalid JSON
- **Expected Result**: Error is returned
- **Priority**: High

#### TC-RULES-U006: Handle Empty Rules
- **Description**: Verify that input with no valid rules returns error
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('{"key": "value"}')`  (no content field)
  2. Verify result.success is false
  3. Verify error message indicates no valid rules found
- **Expected Result**: Error is returned
- **Priority**: Medium

#### TC-RULES-U007: Handle Trailing Commas
- **Description**: Verify that relaxJson removes trailing commas
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('[{"name": "R1", "content": "C1"},]')`  (trailing comma)
  2. Verify result.success is true (relaxJson should clean it)
- **Expected Result**: Trailing comma is handled gracefully
- **Priority**: Low

#### TC-RULES-U008: Default isActive to True
- **Description**: Verify that rules without isActive field default to true
- **Preconditions**: None
- **Steps**:
  1. Call `parseRuleInput('[{"name": "R1", "content": "C1"}]')`  (no isActive)
  2. Verify parsed rule has `isActive: true`
- **Expected Result**: Default isActive is applied
- **Priority**: Medium

---

### Component: RuleImportDialog

#### TC-RULES-C101: Display Import Dialog
- **Description**: Verify that import dialog renders correctly
- **Preconditions**: Dialog open
- **Steps**:
  1. Render `<RuleImportDialog onCancel={...} onImport={...} />`
  2. Verify title 'Import Rules JSON' is displayed
  3. Verify textarea is visible
- **Expected Result**: Dialog is displayed
- **Priority**: Medium

#### TC-RULES-C102: Preview Valid JSON
- **Description**: Verify that valid JSON shows preview with rule count
- **Preconditions**: Dialog open
- **Steps**:
  1. Paste valid JSON into textarea
  2. Wait 500ms for debounce
  3. Verify green 'Valid JSON' message appears
  4. Verify badge shows correct rule count
  5. Verify rule names are listed in preview
- **Expected Result**: Preview is displayed
- **Priority**: High

#### TC-RULES-C103: Show Parse Error for Invalid JSON
- **Description**: Verify that invalid JSON shows error message
- **Preconditions**: Dialog open
- **Steps**:
  1. Paste invalid JSON
  2. Wait for debounce
  3. Verify red 'Parse Error' alert is displayed
  4. Verify error message describes the issue
- **Expected Result**: Error is displayed
- **Priority**: High

#### TC-RULES-C104: Disable Import Button for Invalid JSON
- **Description**: Verify that import button is disabled when JSON is invalid
- **Preconditions**: Invalid JSON entered
- **Steps**:
  1. Enter invalid JSON
  2. Verify 'Import' button is disabled
- **Expected Result**: Cannot import invalid data
- **Priority**: High

#### TC-RULES-C105: Trigger Import on Valid JSON
- **Description**: Verify that clicking Import calls onImport with parsed rules
- **Preconditions**: Valid JSON entered
- **Steps**:
  1. Enter valid JSON with 2 rules
  2. Click 'Import (2)' button
  3. Verify onImport was called with array of 2 CreateRuleParams objects
- **Expected Result**: Import callback is invoked
- **Priority**: High

#### TC-RULES-C106: Cancel Import Dialog
- **Description**: Verify that clicking Cancel closes dialog without importing
- **Preconditions**: Dialog open
- **Steps**:
  1. Click 'Cancel' button
  2. Verify onCancel was called
  3. Verify onImport was NOT called
- **Expected Result**: Dialog is cancelled
- **Priority**: Medium

---

## Integration Tests (Frontend + Backend)

### TC-RULES-S001: Full Rule Creation Flow
- **Description**: Verify end-to-end rule creation from UI to DB
- **Preconditions**: App running with real backend
- **Steps**:
  1. Open RulesPage
  2. Click '+' in pool header
  3. Enter rule name and content
  4. Submit form
  5. Verify IPC call to 'rules:create' is sent
  6. Verify RulesService.create is called
  7. Verify rule appears in pool
- **Expected Result**: Rule is created and persisted
- **Priority**: High

### TC-RULES-S002: Full Rule Set Creation and Rule Assignment
- **Description**: Verify complete workflow of creating set and adding rules
- **Preconditions**: Rules exist in pool
- **Steps**:
  1. Create new rule set
  2. Select the set
  3. Add existing rule to set
  4. Verify IPC call to 'sets:rules:update' with new items array
  5. Verify rule appears in set detail panel
- **Expected Result**: Set is created and rule is added
- **Priority**: High

### TC-RULES-S003: Rule Deletion Removes from Sets
- **Description**: Verify that deleting a rule also removes it from all sets
- **Preconditions**: Rule is in multiple sets
- **Steps**:
  1. Delete rule from pool
  2. Verify rule is removed from all sets that contained it
  3. Verify sets' items arrays no longer include deleted rule id
- **Expected Result**: Rule and all references are deleted
- **Priority**: High (Note: This behavior may need to be implemented)

---

## Performance Tests

### TC-RULES-C201: Render Large Rule Pool
- **Description**: Verify that rendering 100+ rules does not freeze UI
- **Preconditions**: 100 rules in pool
- **Steps**:
  1. Render RulePool with 100 rules
  2. Measure render time
  3. Verify time is under 200ms
- **Expected Result**: UI remains responsive
- **Priority**: Medium

### TC-RULES-C202: Drag and Drop Performance
- **Description**: Verify that drag and drop is smooth with many items
- **Preconditions**: 50 rules in set
- **Steps**:
  1. Drag rule from top to bottom
  2. Verify animation is smooth (60fps)
- **Expected Result**: No lag during drag
- **Priority**: Low

---

## Accessibility Tests

### TC-RULES-C211: Keyboard Navigation
- **Description**: Verify that all actions can be performed via keyboard
- **Preconditions**: RulesPage loaded
- **Steps**:
  1. Tab through all interactive elements
  2. Verify focus is visible
  3. Press Enter to activate buttons
  4. Verify dialogs can be closed with Escape
- **Expected Result**: Full keyboard accessibility
- **Priority**: Medium

### TC-RULES-C212: Screen Reader Labels
- **Description**: Verify that all buttons have aria-labels
- **Preconditions**: RulesPage loaded
- **Steps**:
  1. Inspect buttons (Edit, Delete, Add, etc.)
  2. Verify each has aria-label or accessible text
- **Expected Result**: All actions are labeled
- **Priority**: Medium

---

## Error Handling Tests

### TC-RULES-C221: Handle Network Error on Create
- **Description**: Verify that network errors are handled gracefully
- **Preconditions**: Mock API to simulate failure
- **Steps**:
  1. Trigger rule creation
  2. Mock API throws error
  3. Verify error message is displayed to user
  4. Verify UI does not crash
- **Expected Result**: Error is handled gracefully
- **Priority**: High

### TC-RULES-C222: Handle Validation Error from Backend
- **Description**: Verify that backend validation errors are shown to user
- **Preconditions**: Backend rejects invalid input
- **Steps**:
  1. Submit invalid data (e.g., empty name after client validation bypass)
  2. Backend returns validation error
  3. Verify error message is displayed
- **Expected Result**: Validation error is shown
- **Priority**: Medium

---

## Summary
This document covers unit tests for:
- **Backend**: RulesService, RuleSetService, RulesHandler, SetsHandler
- **Frontend**: useRules hook, useRuleSelection hook, RuleEditor, RuleDialog, RuleSetList, RuleSetDetail, RulePool, rule-import utility, RuleImportDialog
- **Integration**: End-to-end flows
- **Non-functional**: Performance, accessibility, error handling

Total Test Cases: 89
