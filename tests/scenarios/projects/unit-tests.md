# Projects Feature - Unit Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 57 |
| High Priority | 38 (67%) |
| Medium Priority | 15 (26%) |
| Low Priority | 4 (7%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 8 | █░░░░░░░░░ 14% |
| Service | 19 | ███░░░░░░░ 33% |
| Handler | 12 | ██░░░░░░░░ 21% |
| Component | 18 | ███░░░░░░░ 32% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 57 |
| High Priority | 38 (67%) |
| Medium Priority | 15 (26%) |
| Low Priority | 4 (7%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 8 | █░░░░░░░░░ 14% |
| Service | 19 | ███░░░░░░░ 33% |
| Handler | 12 | ██░░░░░░░░ 21% |
| Component | 18 | ███░░░░░░░ 32% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 57 |
| High Priority | 38 (67%) |
| Medium Priority | 15 (26%) |
| Low Priority | 4 (7%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 8 | █░░░░░░░░░ 14% |
| Service | 19 | ███░░░░░░░ 33% |
| Handler | 12 | ██░░░░░░░░ 21% |
| Component | 18 | ███░░░░░░░ 32% |

## Table of Contents
- [ProjectRepository Tests](#projectrepository-tests)
- [ProjectScanner Tests](#projectscanner-tests)
- [ProjectService Tests](#projectservice-tests)
- [ProjectHandler Tests](#projecthandler-tests)
- [Frontend Component Tests](#frontend-component-tests)

---

## ProjectRepository Tests

### TC-PROJ-R001: Create a new project successfully
- **Description**: Verify that a project can be created with valid parameters
- **Preconditions**: Database is initialized
- **Steps**:
  1. Call `repository.create()` with valid CreateProjectParams (name, path, type)
  2. Verify returned project has auto-generated UUID
  3. Verify createdAt and updatedAt timestamps are set
- **Expected Result**: Project is created and returned with all fields populated
- **Priority**: High

### TC-PROJ-R002: Retrieve project by ID
- **Description**: Verify that a project can be retrieved by its ID
- **Preconditions**: A project exists in the database
- **Steps**:
  1. Create a project
  2. Call `repository.getById(id)` with the created project's ID
  3. Compare returned project with original
- **Expected Result**: Correct project is returned with matching fields
- **Priority**: High

### TC-PROJ-R003: Retrieve project by path
- **Description**: Verify that a project can be retrieved by its file path
- **Preconditions**: A project exists in the database
- **Steps**:
  1. Create a project with specific path
  2. Call `repository.getByPath(path)` with the project's path
  3. Verify returned project matches
- **Expected Result**: Correct project is returned
- **Priority**: High

### TC-PROJ-R004: Get all projects
- **Description**: Verify that all projects can be listed
- **Preconditions**: Multiple projects exist in the database
- **Steps**:
  1. Create 3 projects with different parameters
  2. Call `repository.getAll()`
  3. Verify returned array contains all 3 projects
- **Expected Result**: All projects are returned in an array
- **Priority**: High

### TC-PROJ-R005: Update project fields
- **Description**: Verify that project fields can be updated
- **Preconditions**: A project exists in the database
- **Steps**:
  1. Create a project
  2. Call `repository.update()` with modified name and type
  3. Retrieve the project and verify changes
  4. Verify updatedAt timestamp is newer than createdAt
- **Expected Result**: Project is updated successfully, updatedAt is refreshed
- **Priority**: High

### TC-PROJ-R006: Update non-existent project
- **Description**: Verify that updating a non-existent project returns null
- **Preconditions**: Database is initialized
- **Steps**:
  1. Call `repository.update()` with a random UUID that doesn't exist
  2. Verify return value is null
- **Expected Result**: Returns null without throwing error
- **Priority**: Medium

### TC-PROJ-R007: Delete project
- **Description**: Verify that a project can be deleted
- **Preconditions**: A project exists in the database
- **Steps**:
  1. Create a project
  2. Call `repository.delete(id)`
  3. Attempt to retrieve the deleted project
- **Expected Result**: Project is removed, subsequent getById returns null
- **Priority**: High

### TC-PROJ-R008: Duplicate path handling
- **Description**: Verify behavior when creating projects with duplicate paths
- **Preconditions**: Database is initialized
- **Steps**:
  1. Create a project with path "/foo/bar"
  2. Attempt to create another project with the same path
  3. Observe behavior (should fail due to SQLite UNIQUE constraint or business logic)
- **Expected Result**: Second creation fails or returns error
- **Priority**: Medium

---

## ProjectScanner Tests

### TC-PROJ-S001: Detect Node.js project by package.json
- **Description**: Verify that a Node.js project is detected when package.json exists
- **Preconditions**: Mock filesystem returns entries including package.json
- **Steps**:
  1. Mock fs.readdir to return [{ name: 'package.json', isDirectory: () => false }]
  2. Call `scanner.scan(rootPath, 1)`
  3. Verify results contain one project with type 'node'
- **Expected Result**: One Node.js project is detected
- **Priority**: High

### TC-PROJ-S002: Detect Python project by requirements.txt
- **Description**: Verify that a Python project is detected when requirements.txt exists
- **Preconditions**: Mock filesystem returns entries including requirements.txt
- **Steps**:
  1. Mock fs.readdir to return [{ name: 'requirements.txt', isDirectory: () => false }]
  2. Call `scanner.scan(rootPath, 1)`
  3. Verify results contain one project with type 'python'
- **Expected Result**: One Python project is detected
- **Priority**: High

### TC-PROJ-S003: Detect Python project by pyproject.toml
- **Description**: Verify that a Python project is detected when pyproject.toml exists
- **Preconditions**: Mock filesystem returns entries including pyproject.toml
- **Steps**:
  1. Mock fs.readdir to return [{ name: 'pyproject.toml', isDirectory: () => false }]
  2. Call `scanner.scan(rootPath, 1)`
  3. Verify results contain one project with type 'python'
- **Expected Result**: One Python project is detected
- **Priority**: High

### TC-PROJ-S004: Detect Go project by go.mod
- **Description**: Verify that a Go project is detected when go.mod exists
- **Preconditions**: Mock filesystem returns entries including go.mod
- **Steps**:
  1. Mock fs.readdir to return [{ name: 'go.mod', isDirectory: () => false }]
  2. Call `scanner.scan(rootPath, 1)`
  3. Verify results contain one project with type 'go'
- **Expected Result**: One Go project is detected
- **Priority**: High

### TC-PROJ-S005: Detect Rust project by Cargo.toml
- **Description**: Verify that a Rust project is detected when Cargo.toml exists
- **Preconditions**: Mock filesystem returns entries including Cargo.toml
- **Steps**:
  1. Mock fs.readdir to return [{ name: 'Cargo.toml', isDirectory: () => false }]
  2. Call `scanner.scan(rootPath, 1)`
  3. Verify results contain one project with type 'rust'
- **Expected Result**: One Rust project is detected
- **Priority**: High

### TC-PROJ-S006: Detect nested project in workspace
- **Description**: Verify that projects nested in subdirectories are detected
- **Preconditions**: Mock filesystem with nested structure
- **Steps**:
  1. Mock first readdir call to return [{ name: 'backend', isDirectory: () => true }]
  2. Mock second readdir call to return [{ name: 'package.json', isDirectory: () => false }]
  3. Call `scanner.scan('/workspace', 2)`
  4. Verify results contain project at '/workspace/backend' with type 'node'
- **Expected Result**: Nested project is detected with correct path and type
- **Priority**: High

### TC-PROJ-S007: Ignore node_modules directory
- **Description**: Verify that node_modules directory is not traversed during scan
- **Preconditions**: Mock filesystem with node_modules folder
- **Steps**:
  1. Mock readdir to return [{ name: 'node_modules', isDirectory: () => true }]
  2. Call `scanner.scan(rootPath, 2)`
  3. Verify readdir is not called for node_modules path
- **Expected Result**: node_modules is skipped during traversal
- **Priority**: High

### TC-PROJ-S008: Ignore hidden directories
- **Description**: Verify that hidden directories (starting with .) are ignored except .git
- **Preconditions**: Mock filesystem with hidden directories
- **Steps**:
  1. Mock readdir to return [{ name: '.idea', isDirectory: () => true }, { name: '.vscode', isDirectory: () => true }]
  2. Call `scanner.scan(rootPath, 2)`
  3. Verify these directories are not traversed
- **Expected Result**: Hidden directories are skipped
- **Priority**: Medium

### TC-PROJ-S009: Respect maxDepth parameter
- **Description**: Verify that scanning stops at maxDepth level
- **Preconditions**: Mock deeply nested filesystem structure
- **Steps**:
  1. Set up mock with 4 levels of nesting
  2. Call `scanner.scan(rootPath, 2)`
  3. Verify only first 3 levels (0, 1, 2) are scanned
- **Expected Result**: Scanning stops at depth 2
- **Priority**: Medium

### TC-PROJ-S010: Handle access denied errors gracefully
- **Description**: Verify that scanner continues when encountering access denied errors
- **Preconditions**: Mock filesystem throws EACCES error
- **Steps**:
  1. Mock readdir to throw EACCES error for a specific directory
  2. Call `scanner.scan(rootPath, 2)`
  3. Verify scanner continues without crashing
- **Expected Result**: Error is caught and scanning continues
- **Priority**: Medium

### TC-PROJ-S011: Handle empty directory
- **Description**: Verify that scanning an empty directory returns empty results
- **Preconditions**: Mock empty directory
- **Steps**:
  1. Mock readdir to return empty array
  2. Call `scanner.scan(rootPath, 1)`
  3. Verify results array is empty
- **Expected Result**: Empty array is returned
- **Priority**: Low

### TC-PROJ-S012: Detect multiple project types in same directory
- **Description**: Verify behavior when multiple project markers exist (e.g., both package.json and Cargo.toml)
- **Preconditions**: Mock directory with multiple markers
- **Steps**:
  1. Mock readdir to return both package.json and go.mod
  2. Call `scanner.scan(rootPath, 1)`
  3. Observe which type is detected (first match in MARKERS object)
- **Expected Result**: One project is detected with first matched type
- **Priority**: Low

---

## ProjectService Tests

### TC-PROJ-S021: Get all projects via service
- **Description**: Verify that service layer correctly delegates to repository
- **Preconditions**: Repository has mock data
- **Steps**:
  1. Mock repository.getAll() to return test projects
  2. Call `service.getAll()`
  3. Verify result matches mock data
- **Expected Result**: Service returns repository data
- **Priority**: High

### TC-PROJ-S022: Create project via service
- **Description**: Verify that service layer validates and creates project
- **Preconditions**: Valid CreateProjectParams
- **Steps**:
  1. Call `service.create()` with valid parameters
  2. Verify repository.create() was called with correct params
  3. Verify returned project matches created data
- **Expected Result**: Project is created successfully
- **Priority**: High

### TC-PROJ-S023: Update project via service
- **Description**: Verify that service layer updates project
- **Preconditions**: Project exists
- **Steps**:
  1. Call `service.update()` with valid UpdateProjectParams
  2. Verify repository.update() was called
  3. Verify returned project has updated fields
- **Expected Result**: Project is updated successfully
- **Priority**: High

### TC-PROJ-S024: Update non-existent project throws error
- **Description**: Verify that service throws error when updating non-existent project
- **Preconditions**: Repository returns null for update
- **Steps**:
  1. Mock repository.update() to return null
  2. Call `service.update()` with random ID
  3. Expect error to be thrown
- **Expected Result**: Error "Project not found" is thrown
- **Priority**: Medium

### TC-PROJ-S025: Delete project via service
- **Description**: Verify that service layer deletes project
- **Preconditions**: Project exists
- **Steps**:
  1. Call `service.delete(id)`
  2. Verify repository.delete() was called with correct ID
- **Expected Result**: Project is deleted
- **Priority**: High

### TC-PROJ-S026: Scan directory returns temporary project candidates
- **Description**: Verify that scan returns projects with temporary IDs and timestamps
- **Preconditions**: Scanner returns project candidates
- **Steps**:
  1. Mock scanner.scan() to return projects without id/timestamps
  2. Call `service.scan(rootPath)`
  3. Verify returned projects have 'temp-' prefixed UUIDs
  4. Verify createdAt and updatedAt are set
- **Expected Result**: Candidates are enriched with temporary metadata
- **Priority**: High

### TC-PROJ-S027: Scan empty directory returns empty array
- **Description**: Verify that scanning empty directory returns empty results
- **Preconditions**: Scanner returns empty array
- **Steps**:
  1. Mock scanner.scan() to return []
  2. Call `service.scan(rootPath)`
  3. Verify result is empty array
- **Expected Result**: Empty array is returned
- **Priority**: Medium

---

## ProjectHandler Tests

### TC-PROJ-H001: List projects handler success
- **Description**: Verify that list handler returns projects successfully
- **Preconditions**: Service has projects
- **Steps**:
  1. Mock projectService.getAll() to return test projects
  2. Invoke 'projects:list' IPC handler
  3. Verify response is { success: true, data: [...] }
- **Expected Result**: Handler returns success response with data
- **Priority**: High

### TC-PROJ-H002: List projects handler error handling
- **Description**: Verify that list handler catches and returns errors
- **Preconditions**: Service throws error
- **Steps**:
  1. Mock projectService.getAll() to throw error
  2. Invoke 'projects:list' IPC handler
  3. Verify response is { success: false, error: '...' }
- **Expected Result**: Handler returns error response without crashing
- **Priority**: High

### TC-PROJ-H003: Scan handler with valid path
- **Description**: Verify that scan handler validates input and returns candidates
- **Preconditions**: Valid root path provided
- **Steps**:
  1. Invoke 'projects:scan' IPC handler with rootPath
  2. Verify projectService.scan() was called with correct path
  3. Verify response contains project candidates
- **Expected Result**: Scan completes successfully
- **Priority**: High

### TC-PROJ-H004: Scan handler with empty path
- **Description**: Verify that scan handler rejects empty path
- **Preconditions**: None
- **Steps**:
  1. Invoke 'projects:scan' IPC handler with empty string
  2. Verify response is { success: false, error: 'Root path is required' }
- **Expected Result**: Handler validates input and returns error
- **Priority**: High

### TC-PROJ-H005: Scan handler with null path
- **Description**: Verify that scan handler rejects null path
- **Preconditions**: None
- **Steps**:
  1. Invoke 'projects:scan' IPC handler with null
  2. Verify response is { success: false, error: 'Root path is required' }
- **Expected Result**: Handler validates input and returns error
- **Priority**: Medium

### TC-PROJ-H006: Create project handler with valid params
- **Description**: Verify that create handler validates and creates project
- **Preconditions**: Valid CreateProjectParams
- **Steps**:
  1. Mock Zod schema validation to pass
  2. Invoke 'projects:create' IPC handler with valid params
  3. Verify projectService.create() was called
  4. Verify response contains created project
- **Expected Result**: Project is created successfully
- **Priority**: High

### TC-PROJ-H007: Create project handler with invalid name
- **Description**: Verify that create handler rejects empty name
- **Preconditions**: Invalid params (empty name)
- **Steps**:
  1. Invoke 'projects:create' with { name: '', path: '/foo', type: 'node' }
  2. Verify Zod validation fails
  3. Verify response is { success: false, error: '...' }
- **Expected Result**: Validation error is returned
- **Priority**: High

### TC-PROJ-H008: Create project handler with invalid type
- **Description**: Verify that create handler rejects invalid project type
- **Preconditions**: Invalid params (type not in enum)
- **Steps**:
  1. Invoke 'projects:create' with { name: 'Test', path: '/foo', type: 'invalid' }
  2. Verify Zod validation fails
  3. Verify response contains error
- **Expected Result**: Validation error is returned
- **Priority**: Medium

### TC-PROJ-H009: Update project handler with valid params
- **Description**: Verify that update handler validates and updates project
- **Preconditions**: Valid UpdateProjectParams with UUID
- **Steps**:
  1. Invoke 'projects:update' with valid params including UUID
  2. Verify projectService.update() was called
  3. Verify response contains updated project
- **Expected Result**: Project is updated successfully
- **Priority**: High

### TC-PROJ-H010: Update project handler with invalid UUID
- **Description**: Verify that update handler rejects malformed UUID
- **Preconditions**: Invalid UUID format
- **Steps**:
  1. Invoke 'projects:update' with { id: 'not-a-uuid', name: 'Test' }
  2. Verify Zod validation fails
  3. Verify response contains error
- **Expected Result**: Validation error is returned
- **Priority**: Medium

### TC-PROJ-H011: Delete project handler success
- **Description**: Verify that delete handler removes project
- **Preconditions**: Project exists
- **Steps**:
  1. Invoke 'projects:delete' with valid UUID
  2. Verify projectService.delete() was called
  3. Verify response is { success: true }
- **Expected Result**: Project is deleted
- **Priority**: High

### TC-PROJ-H012: Preview sync handler
- **Description**: Verify that previewSync handler delegates to SyncService
- **Preconditions**: Project exists, SyncService is injected
- **Steps**:
  1. Invoke 'projects:previewSync' with projectId
  2. Verify syncService.getProjectSyncPreview() was called
  3. Verify response contains GeneratedFile array
- **Expected Result**: Sync preview is returned
- **Priority**: High

---

## Frontend Component Tests

### TC-PROJ-C001: ProjectsPage renders loading state
- **Description**: Verify that loading spinner is displayed while fetching projects
- **Preconditions**: useQuery is in loading state
- **Steps**:
  1. Mock useQuery to return { isLoading: true }
  2. Render ProjectsPage component
  3. Verify Loader2 icon is rendered
- **Expected Result**: Loading spinner is visible
- **Priority**: Medium

### TC-PROJ-C002: ProjectsPage renders empty state
- **Description**: Verify that empty state message is shown when no projects exist
- **Preconditions**: useQuery returns empty array
- **Steps**:
  1. Mock useQuery to return { data: { projects: [] }, isLoading: false }
  2. Render ProjectsPage component
  3. Verify "No projects found" message is displayed
- **Expected Result**: Empty state UI is shown
- **Priority**: Medium

### TC-PROJ-C003: ProjectsPage renders project list
- **Description**: Verify that projects are displayed as cards
- **Preconditions**: useQuery returns projects
- **Steps**:
  1. Mock useQuery to return 3 test projects
  2. Render ProjectsPage component
  3. Verify 3 ProjectCard components are rendered
- **Expected Result**: All projects are displayed
- **Priority**: High

### TC-PROJ-C004: ProjectsPage search filters projects
- **Description**: Verify that search input filters projects by name and path
- **Preconditions**: Multiple projects exist
- **Steps**:
  1. Render ProjectsPage with 3 projects
  2. Type "backend" in search input
  3. Verify only projects with "backend" in name or path are visible
- **Expected Result**: Filtered results are displayed
- **Priority**: High

### TC-PROJ-C005: ProjectCard click navigates to detail page
- **Description**: Verify that clicking a project card shows ProjectDetailPage
- **Preconditions**: Projects exist
- **Steps**:
  1. Render ProjectsPage with projects
  2. Click on a ProjectCard
  3. Verify ProjectDetailPage is rendered with selected project
- **Expected Result**: Detail page is shown
- **Priority**: High

### TC-PROJ-C006: Add Project Dialog opens on button click
- **Description**: Verify that "Add Project" button opens AddProjectDialog
- **Preconditions**: ProjectsPage is rendered
- **Steps**:
  1. Click "Add Project" button
  2. Verify AddProjectDialog is rendered with isOpen=true
- **Expected Result**: Dialog opens
- **Priority**: High

### TC-PROJ-C007: AddProjectDialog scan mode
- **Description**: Verify that scan mode is active by default
- **Preconditions**: Dialog is open
- **Steps**:
  1. Render AddProjectDialog with isOpen=true
  2. Verify "Scan Directory" button has active variant
  3. Verify scan input is visible
- **Expected Result**: Scan mode UI is displayed
- **Priority**: Medium

### TC-PROJ-C008: AddProjectDialog scan triggers API call
- **Description**: Verify that scan button calls projects.scan API
- **Preconditions**: Dialog is open, valid path entered
- **Steps**:
  1. Enter "/Users/test" in scan path input
  2. Click "Scan" button
  3. Verify window.api.projects.scan() was called with path
  4. Verify isScanning state shows loader
- **Expected Result**: API is called, loading state is shown
- **Priority**: High

### TC-PROJ-C009: AddProjectDialog displays scan candidates
- **Description**: Verify that scan results are displayed as selectable cards
- **Preconditions**: Scan API returns candidates
- **Steps**:
  1. Mock window.api.projects.scan() to return test projects
  2. Perform scan
  3. Verify candidate cards are rendered
  4. Click a candidate to select it
  5. Verify checkmark icon appears
- **Expected Result**: Candidates are selectable
- **Priority**: High

### TC-PROJ-C010: AddProjectDialog add selected projects
- **Description**: Verify that selected candidates are added via mutation
- **Preconditions**: Candidates are selected
- **Steps**:
  1. Select 2 candidates from scan results
  2. Click "Add Selected (2)" button
  3. Verify onAdd callback is called for each selected candidate
  4. Verify dialog closes after completion
- **Expected Result**: Projects are added and dialog closes
- **Priority**: High

### TC-PROJ-C011: ProjectDetailPage renders project info
- **Description**: Verify that project name and path are displayed
- **Preconditions**: ProjectDetailPage is rendered with project
- **Steps**:
  1. Render ProjectDetailPage with test project
  2. Verify project name is displayed in h1
  3. Verify project path is displayed
- **Expected Result**: Project information is visible
- **Priority**: High

### TC-PROJ-C012: ProjectDetailPage back button navigation
- **Description**: Verify that back button returns to projects list
- **Preconditions**: ProjectDetailPage is rendered
- **Steps**:
  1. Click "Back to Projects" button
  2. Verify onBack callback is called
- **Expected Result**: Navigation callback is triggered
- **Priority**: High

### TC-PROJ-C013: ProjectDetailPage tool detection
- **Description**: Verify that tools are detected and displayed
- **Preconditions**: Tool detection API returns tools
- **Steps**:
  1. Mock window.api.toolDetection.detect() to return test tools
  2. Render ProjectDetailPage
  3. Verify ToolCard components are rendered for each tool
- **Expected Result**: Tools are displayed
- **Priority**: High

### TC-PROJ-C014: ProjectDetailPage sync preview
- **Description**: Verify that sync button triggers preview
- **Preconditions**: Project has tool configurations
- **Steps**:
  1. Click "Sync Project" button
  2. Verify window.api.projects.previewSync() is called with project ID
  3. Verify SyncPreviewDialog opens with generated files
- **Expected Result**: Sync preview dialog is shown
- **Priority**: High

### TC-PROJ-C015: ProjectDetailPage sync preview empty config
- **Description**: Verify that sync with no configurations shows alert
- **Preconditions**: Preview API returns empty array
- **Steps**:
  1. Mock window.api.projects.previewSync() to return []
  2. Click "Sync Project" button
  3. Verify alert message about no configurations
- **Expected Result**: User is notified of empty configuration
- **Priority**: Medium

### TC-PROJ-C016: ProjectDetailPage search tools
- **Description**: Verify that tool search filters displayed tools
- **Preconditions**: Multiple tools detected
- **Steps**:
  1. Render ProjectDetailPage with 5 tools
  2. Type "cursor" in search input
  3. Verify only tools matching "cursor" are displayed
- **Expected Result**: Tools are filtered by search
- **Priority**: Medium

### TC-PROJ-C017: ProjectCard displays correct type icon
- **Description**: Verify that project type determines icon color
- **Preconditions**: Projects with different types
- **Steps**:
  1. Render ProjectCard with type='node'
  2. Verify green Code2 icon is rendered
  3. Render ProjectCard with type='python'
  4. Verify yellow Code2 icon is rendered
- **Expected Result**: Icons match project types
- **Priority**: Low

### TC-PROJ-C018: ProjectCard displays formatted date
- **Description**: Verify that updatedAt is formatted correctly
- **Preconditions**: Project has updatedAt timestamp
- **Steps**:
  1. Render ProjectCard with updatedAt="2025-01-15T10:00:00Z"
  2. Verify formatted date is displayed (e.g., "1/15/2025")
- **Expected Result**: Date is human-readable
- **Priority**: Low

---

## Notes
- All IPC handlers should be tested with safeHandler wrapper to ensure consistent error handling
- Zod schema validation should be tested for all edge cases (empty strings, invalid types, malformed UUIDs)
- Mock filesystem operations in scanner tests to avoid filesystem dependencies
- Use Vitest for unit tests, React Testing Library for component tests
- Ensure all async operations are properly awaited in tests
