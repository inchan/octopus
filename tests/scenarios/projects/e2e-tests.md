# Projects Feature - E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 36 |
| High Priority | 16 (44%) |
| Medium Priority | 13 (36%) |
| Low Priority | 7 (19%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 36 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 36 |
| High Priority | 16 (44%) |
| Medium Priority | 13 (36%) |
| Low Priority | 7 (19%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 36 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 36 |
| High Priority | 16 (44%) |
| Medium Priority | 13 (36%) |
| Low Priority | 7 (19%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 36 | ██████████ 100% |

## Table of Contents
- [Project CRUD Operations](#project-crud-operations)
- [Directory Scanning](#directory-scanning)
- [Project Detail & Tool Integration](#project-detail--tool-integration)
- [Sync Operations](#sync-operations)
- [Error Handling & Edge Cases](#error-handling--edge-cases)

---

## Project CRUD Operations

### TC-PROJ-E001: View projects page on fresh installation
- **Description**: Verify that the projects page displays correctly when no projects exist
- **Preconditions**: Fresh application installation, no projects in database
- **Steps**:
  1. Launch the application
  2. Navigate to the Projects page
  3. Wait for page to load
- **Expected Result**:
  - "No projects found" message is displayed
  - "Add Project" button is visible
  - Search bar is present but disabled or empty
- **Priority**: High

### TC-PROJ-E002: Add project via directory scan - single project
- **Description**: Verify that a user can scan a directory and add a single project
- **Preconditions**: Test directory exists with a Node.js project (package.json)
- **Steps**:
  1. Navigate to Projects page
  2. Click "Add Project" button
  3. Enter valid directory path in scan input (e.g., `/tmp/test-node-project`)
  4. Click "Scan" button
  5. Wait for scan results to appear
  6. Verify candidate project is displayed with correct name and type
  7. Click the candidate to select it (checkmark appears)
  8. Click "Add Selected (1)" button
  9. Wait for dialog to close
- **Expected Result**:
  - Project is added to the database
  - Project appears in the main list
  - Dialog closes automatically
  - Project card displays correct name, path, type badge, and updated date
- **Priority**: High

### TC-PROJ-E003: Add multiple projects via directory scan
- **Description**: Verify that a user can scan a workspace and add multiple projects at once
- **Preconditions**: Test workspace directory contains 3 projects (Node, Python, Go)
- **Steps**:
  1. Click "Add Project" button
  2. Enter workspace path (e.g., `/tmp/workspace`)
  3. Click "Scan" button
  4. Wait for scan results (should show 3 candidates)
  5. Select all 3 candidates by clicking them
  6. Verify button text updates to "Add Selected (3)"
  7. Click "Add Selected (3)" button
  8. Wait for dialog to close
- **Expected Result**:
  - All 3 projects are added to the database
  - All 3 projects appear in the projects grid
  - Each project card shows correct type icon and badge
- **Priority**: High

### TC-PROJ-E004: Search projects by name
- **Description**: Verify that search functionality filters projects by name
- **Preconditions**: Multiple projects exist in the database (at least 5)
- **Steps**:
  1. Navigate to Projects page
  2. Verify all projects are visible
  3. Type "backend" in the search bar
  4. Wait for results to filter
- **Expected Result**:
  - Only projects with "backend" in their name are displayed
  - Other projects are hidden
  - Search is case-insensitive
- **Priority**: High

### TC-PROJ-E005: Search projects by path
- **Description**: Verify that search functionality filters projects by path
- **Preconditions**: Multiple projects exist with different paths
- **Steps**:
  1. Navigate to Projects page
  2. Type "/Users/test" in the search bar
  3. Wait for results to filter
- **Expected Result**:
  - Only projects with "/Users/test" in their path are displayed
  - Search matches partial paths
- **Priority**: Medium

### TC-PROJ-E006: Clear search filter
- **Description**: Verify that clearing search restores full project list
- **Preconditions**: Search filter is active
- **Steps**:
  1. Apply a search filter (e.g., "backend")
  2. Verify filtered results are shown
  3. Clear the search input
- **Expected Result**:
  - All projects are displayed again
  - Grid returns to full state
- **Priority**: Medium

### TC-PROJ-E007: Navigate to project detail page
- **Description**: Verify that clicking a project card navigates to detail view
- **Preconditions**: At least one project exists
- **Steps**:
  1. Navigate to Projects page
  2. Click on a project card
  3. Wait for page transition
- **Expected Result**:
  - ProjectDetailPage is displayed
  - Project name and path are shown in header
  - "Back to Projects" button is visible
  - Tools detection starts automatically
- **Priority**: High

### TC-PROJ-E008: Navigate back from project detail page
- **Description**: Verify that back button returns to projects list
- **Preconditions**: User is on ProjectDetailPage
- **Steps**:
  1. Click "Back to Projects" button
  2. Wait for page transition
- **Expected Result**:
  - Returns to ProjectsPage
  - Project list is restored
  - Search state is preserved (if any)
- **Priority**: High

---

## Directory Scanning

### TC-PROJ-E101: Scan directory with no projects
- **Description**: Verify behavior when scanning a directory without project markers
- **Preconditions**: Empty directory or directory without package.json, go.mod, etc.
- **Steps**:
  1. Open Add Project dialog
  2. Enter path to empty directory
  3. Click "Scan" button
  4. Wait for scan to complete
- **Expected Result**:
  - No candidates are found
  - Empty state message is displayed
  - "Add Selected" button is disabled
- **Priority**: Medium

### TC-PROJ-E102: Scan directory with nested projects
- **Description**: Verify that nested projects within a workspace are detected
- **Preconditions**: Workspace directory with structure: `/workspace/backend/` (Python) and `/workspace/frontend/` (Node)
- **Steps**:
  1. Open Add Project dialog
  2. Enter workspace root path
  3. Click "Scan" button
  4. Wait for scan results
- **Expected Result**:
  - Both backend and frontend projects are detected as separate candidates
  - Each candidate shows correct subdirectory path
  - Each candidate has correct type badge
- **Priority**: High

### TC-PROJ-E103: Scan directory with node_modules
- **Description**: Verify that node_modules is ignored during scan
- **Preconditions**: Project directory contains node_modules with nested projects inside
- **Steps**:
  1. Open Add Project dialog
  2. Enter path to project with node_modules
  3. Click "Scan" button
  4. Wait for scan results
- **Expected Result**:
  - Only the main project is detected
  - Projects inside node_modules are ignored
  - Scan completes quickly (not traversing thousands of files)
- **Priority**: High

### TC-PROJ-E104: Scan directory with permission errors
- **Description**: Verify graceful handling when encountering restricted directories
- **Preconditions**: Test directory contains a subdirectory without read permissions
- **Steps**:
  1. Open Add Project dialog
  2. Enter path containing restricted directory
  3. Click "Scan" button
  4. Wait for scan results
- **Expected Result**:
  - Scan completes without crashing
  - Accessible projects are detected
  - Restricted directories are silently skipped
  - No error alerts are shown to user
- **Priority**: Medium

### TC-PROJ-E105: Scan very deep directory structure
- **Description**: Verify that maxDepth limit prevents infinite recursion
- **Preconditions**: Directory structure nested 10 levels deep
- **Steps**:
  1. Open Add Project dialog
  2. Enter root path of deeply nested structure
  3. Click "Scan" button
  4. Wait for scan results
- **Expected Result**:
  - Scan completes within reasonable time (<5 seconds)
  - Only projects within maxDepth (default 3) are detected
  - Deeper projects are ignored
- **Priority**: Medium

### TC-PROJ-E106: Scan invalid path
- **Description**: Verify error handling when scanning non-existent path
- **Preconditions**: None
- **Steps**:
  1. Open Add Project dialog
  2. Enter invalid path (e.g., `/this/does/not/exist`)
  3. Click "Scan" button
  4. Wait for response
- **Expected Result**:
  - Error is caught gracefully
  - User-friendly error message is displayed
  - No candidates are shown
  - Dialog remains open for retry
- **Priority**: High

### TC-PROJ-E107: Cancel scan operation (if implemented)
- **Description**: Verify that long-running scans can be cancelled
- **Preconditions**: Very large directory to scan
- **Steps**:
  1. Open Add Project dialog
  2. Enter path to large directory
  3. Click "Scan" button
  4. While scanning, click cancel button (if available)
- **Expected Result**:
  - Scan operation stops
  - Partial results are discarded
  - User can start new scan
- **Priority**: Low

---

## Project Detail & Tool Integration

### TC-PROJ-E201: View detected tools for project
- **Description**: Verify that installed tools are displayed on project detail page
- **Preconditions**: Project exists, tools like Claude/Cursor are installed on system
- **Steps**:
  1. Navigate to a project's detail page
  2. Wait for tool detection to complete
- **Expected Result**:
  - ToolCard components are displayed for each detected tool
  - Each card shows tool name, type (IDE/CLI), and installation status
  - Cards are clickable for configuration
- **Priority**: High

### TC-PROJ-E202: Configure tool for project
- **Description**: Verify that user can configure a tool's rules/MCP for a specific project
- **Preconditions**: Project exists, at least one tool detected
- **Steps**:
  1. Navigate to project detail page
  2. Click "Configure" on a tool card (e.g., Claude)
  3. Wait for ToolConfigDialog to open
  4. Select a rule set from dropdown
  5. Select an MCP set from dropdown
  6. Click "Save" button
  7. Wait for dialog to close
- **Expected Result**:
  - Configuration is saved to database with contextType='project' and contextId=project.id
  - ToolCard updates to show "Configured" status or similar indicator
- **Priority**: High

### TC-PROJ-E203: View project with no tools installed
- **Description**: Verify UI when no tools are detected on the system
- **Preconditions**: System has no supported tools installed (or mock detection to return empty)
- **Steps**:
  1. Navigate to project detail page
  2. Wait for tool detection
- **Expected Result**:
  - Empty state message is displayed (e.g., "No tools found")
  - User is prompted to install tools or check installation
- **Priority**: Medium

### TC-PROJ-E204: Search tools on project detail page
- **Description**: Verify that tool search filters displayed tools
- **Preconditions**: Project detail page with multiple tools detected
- **Steps**:
  1. Navigate to project detail page
  2. Type "cursor" in the tools search bar
  3. Wait for results to filter
- **Expected Result**:
  - Only tools with "cursor" in their name are displayed
  - Other tools are hidden
  - Search is case-insensitive
- **Priority**: Medium

---

## Sync Operations

### TC-PROJ-E301: Sync project with configurations
- **Description**: Verify that sync generates and previews configuration files for project
- **Preconditions**: Project exists with tool configurations (rules + MCP set)
- **Steps**:
  1. Navigate to project detail page
  2. Click "Sync Project" button
  3. Wait for preview to generate
  4. Verify SyncPreviewDialog opens
  5. Review generated files in preview (e.g., `.clauderc`, `.cursorrules`)
  6. Click "Confirm" button
  7. Wait for sync to complete
- **Expected Result**:
  - Preview shows all generated files with content
  - Files are written to project directory after confirmation
  - Success message is displayed
  - Dialog closes
- **Priority**: High

### TC-PROJ-E302: Sync project with no configurations
- **Description**: Verify user is notified when trying to sync without tool configs
- **Preconditions**: Project exists but has no tool configurations set
- **Steps**:
  1. Navigate to project detail page
  2. Click "Sync Project" button
  3. Wait for response
- **Expected Result**:
  - Alert/notification is shown: "No configurations found for this project. Please configure tools first."
  - Preview dialog does NOT open
  - No files are written
- **Priority**: High

### TC-PROJ-E303: Sync preview with existing files
- **Description**: Verify that sync preview shows diff when files already exist
- **Preconditions**: Project directory already has `.clauderc` file from previous sync
- **Steps**:
  1. Modify tool configuration (change rule set)
  2. Navigate to project detail page
  3. Click "Sync Project" button
  4. Wait for preview dialog
- **Expected Result**:
  - Preview shows diff between old and new content
  - User can review changes before applying
  - hasChanges flag is true for modified files
- **Priority**: Medium

### TC-PROJ-E304: Cancel sync preview
- **Description**: Verify that user can cancel sync without applying changes
- **Preconditions**: Sync preview dialog is open
- **Steps**:
  1. Generate sync preview
  2. Review files
  3. Click "Cancel" button in preview dialog
- **Expected Result**:
  - Dialog closes
  - No files are written to disk
  - Project remains unchanged
- **Priority**: Medium

### TC-PROJ-E305: Sync write permission error
- **Description**: Verify error handling when sync cannot write to project directory
- **Preconditions**: Project directory is read-only or write-protected
- **Steps**:
  1. Set project directory to read-only permissions
  2. Navigate to project detail page
  3. Click "Sync Project" button
  4. Confirm sync in preview dialog
  5. Wait for write operation
- **Expected Result**:
  - Write operation fails gracefully
  - Error message is displayed to user
  - Dialog remains open or shows retry option
  - Database state is not corrupted
- **Priority**: High

### TC-PROJ-E306: Sync multiple tools simultaneously
- **Description**: Verify that sync generates files for all configured tools
- **Preconditions**: Project has configurations for Claude, Cursor, and Cline
- **Steps**:
  1. Configure multiple tools for the project
  2. Click "Sync Project" button
  3. Wait for preview
  4. Verify multiple files are generated (e.g., `.clauderc`, `.cursorrules`, `.clinerules`)
  5. Confirm sync
- **Expected Result**:
  - All tool-specific files are generated
  - Each file contains correct configuration
  - No conflicts between file contents
- **Priority**: Medium

---

## Error Handling & Edge Cases

### TC-PROJ-E401: Add duplicate project by path
- **Description**: Verify behavior when trying to add a project that already exists
- **Preconditions**: Project with path `/tmp/test-project` already exists in database
- **Steps**:
  1. Open Add Project dialog
  2. Scan directory containing `/tmp/test-project`
  3. Select the candidate
  4. Click "Add Selected" button
  5. Wait for response
- **Expected Result**:
  - Error is returned from backend (UNIQUE constraint violation)
  - User-friendly error message is shown (e.g., "Project already exists at this path")
  - Dialog remains open for retry
  - Existing project is not duplicated
- **Priority**: High

### TC-PROJ-E402: Network/IPC timeout during scan
- **Description**: Verify handling when IPC call takes too long
- **Preconditions**: Mock slow scan operation (e.g., >30 seconds)
- **Steps**:
  1. Open Add Project dialog
  2. Trigger slow scan
  3. Wait for timeout
- **Expected Result**:
  - Loading spinner is shown during operation
  - Timeout error is caught after reasonable duration
  - User is notified of timeout
  - Application remains responsive
- **Priority**: Medium

### TC-PROJ-E403: Project deleted from filesystem
- **Description**: Verify UI behavior when project directory no longer exists
- **Preconditions**: Project exists in database, but directory has been deleted
- **Steps**:
  1. Navigate to Projects page
  2. Click on project with deleted directory
  3. Attempt to sync or configure tools
- **Expected Result**:
  - Project card displays warning indicator (optional)
  - Error is shown when attempting operations requiring filesystem access
  - User can delete the project from database
- **Priority**: Low

### TC-PROJ-E404: Concurrent project modifications
- **Description**: Verify data consistency when multiple windows modify same project
- **Preconditions**: Two application windows open (if supported)
- **Steps**:
  1. Open project detail in Window 1
  2. Open same project detail in Window 2
  3. Configure tool in Window 1
  4. Configure different tool in Window 2
  5. Sync in both windows
- **Expected Result**:
  - Last write wins or conflict detection occurs
  - No data corruption
  - Both windows eventually show consistent state after refresh
- **Priority**: Low

### TC-PROJ-E405: Special characters in project path
- **Description**: Verify handling of paths with spaces and special characters
- **Preconditions**: Project directory path contains spaces (e.g., `/Users/test/My Projects/backend`)
- **Steps**:
  1. Scan directory with special characters
  2. Add project
  3. Navigate to project detail
  4. Perform sync operation
- **Expected Result**:
  - Path is correctly encoded/escaped
  - All operations succeed
  - Files are written to correct location
- **Priority**: High

### TC-PROJ-E406: Very long project name
- **Description**: Verify UI handles very long project names gracefully
- **Preconditions**: Project with name longer than 100 characters
- **Steps**:
  1. Create or import project with very long name
  2. View in projects list
  3. View in detail page
- **Expected Result**:
  - Name is truncated with ellipsis in card view
  - Full name is visible in detail page or tooltip
  - Layout does not break
- **Priority**: Low

### TC-PROJ-E407: Rapid consecutive scans
- **Description**: Verify that rapid scan requests are handled correctly
- **Preconditions**: None
- **Steps**:
  1. Open Add Project dialog
  2. Enter path and click "Scan"
  3. Immediately change path and click "Scan" again
  4. Repeat 3 times rapidly
- **Expected Result**:
  - Previous scans are cancelled or results ignored
  - Latest scan result is displayed
  - No race conditions or UI corruption
- **Priority**: Low

### TC-PROJ-E408: Large number of projects (performance)
- **Description**: Verify UI performance with 100+ projects
- **Preconditions**: Database contains 100+ projects
- **Steps**:
  1. Navigate to Projects page
  2. Wait for initial render
  3. Type in search bar
  4. Scroll through project grid
- **Expected Result**:
  - Initial load completes within 2 seconds
  - Search filtering is instantaneous (<100ms)
  - Scrolling is smooth (60fps)
  - Consider implementing virtualization if performance degrades
- **Priority**: Low

---

## Integration with Other Features

### TC-PROJ-E501: Project sync updates global sync status
- **Description**: Verify that project-level sync affects global sync tracking
- **Preconditions**: Project has tool configurations
- **Steps**:
  1. Navigate to project detail
  2. Perform sync
  3. Navigate to global Sync page (if exists)
  4. Verify sync history or status is updated
- **Expected Result**:
  - Global sync history shows project sync event
  - Timestamps are accurate
- **Priority**: Low

### TC-PROJ-E502: Deleting project removes tool configurations
- **Description**: Verify that deleting a project cleans up associated tool configs
- **Preconditions**: Project exists with tool configurations
- **Steps**:
  1. Note project ID and verify tool_configs table has entries with contextId=project.id
  2. Delete the project (if delete UI exists)
  3. Verify tool_configs are removed or orphaned
- **Expected Result**:
  - Tool configurations with contextType='project' and matching contextId are deleted (cascade or manual cleanup)
  - Database integrity is maintained
- **Priority**: Medium

### TC-PROJ-E503: Tool configuration inherits from global settings
- **Description**: Verify project-specific config can override global defaults
- **Preconditions**: Global tool configuration exists
- **Steps**:
  1. Set global rule set for Claude
  2. Create project
  3. Configure Claude for project with different rule set
  4. Perform sync
- **Expected Result**:
  - Project-specific configuration takes precedence
  - Global config is not modified
  - Sync generates project-specific files
- **Priority**: Medium

---

## Notes
- Use `VITE_USE_MOCK=true` environment variable for E2E tests without actual filesystem operations
- Playwright should be configured to use test database instead of production DB
- Clean up test projects and files after each test run
- Consider using fixtures for common test data (sample projects, tool configs)
- Test both macOS and Windows paths if cross-platform support is required
- Performance tests (TC-PROJ-E408) should run separately with dedicated test data
