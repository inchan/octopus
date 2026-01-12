# Settings Unit Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 28 |
| High Priority | 16 (57%) |
| Medium Priority | 9 (32%) |
| Low Priority | 3 (11%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 28 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 28 |
| High Priority | 16 (57%) |
| Medium Priority | 9 (32%) |
| Low Priority | 3 (11%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 28 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 28 |
| High Priority | 16 (57%) |
| Medium Priority | 9 (32%) |
| Low Priority | 3 (11%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| Service | 28 | ██████████ 100% |

## SettingsService

### TC-SET-S001: Initialize with Default Values
- **Description**: Verify SettingsService initializes with correct default values
- **Preconditions**: Fresh instance of SettingsService
- **Steps**:
  1. Create new SettingsService instance
  2. Call getAll()
- **Expected Result**:
  - Returns object with defaults: `{ theme: 'system', language: 'ko', autoSync: false }`
  - openAIKey and anthropicKey should be undefined
- **Priority**: High

### TC-SET-S002: Get Individual Setting Value
- **Description**: Verify get() retrieves individual setting value correctly
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Call get('theme')
  2. Call get('language')
  3. Call get('autoSync')
- **Expected Result**:
  - Returns correct value for each key
  - Type matches SettingsSchema definition
- **Priority**: High

### TC-SET-S003: Set Individual Setting Value
- **Description**: Verify set() updates individual setting value
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Call set('theme', 'dark')
  2. Call get('theme')
  3. Call set('autoSync', true)
  4. Call get('autoSync')
- **Expected Result**:
  - Get returns the newly set value
  - Other settings remain unchanged
- **Priority**: High

### TC-SET-S004: Set Optional API Key
- **Description**: Verify optional API keys can be set and retrieved
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Call set('openAIKey', 'sk-test-key')
  2. Call get('openAIKey')
  3. Call set('anthropicKey', 'sk-ant-test-key')
  4. Call get('anthropicKey')
- **Expected Result**:
  - Keys are stored and retrieved correctly
  - Keys persist in store
- **Priority**: High

### TC-SET-S005: Get All Settings
- **Description**: Verify getAll() returns complete settings object
- **Preconditions**:
  - SettingsService initialized
  - Some settings modified from defaults
- **Steps**:
  1. Set theme to 'dark'
  2. Set autoSync to true
  3. Set openAIKey to 'test-key'
  4. Call getAll()
- **Expected Result**:
  - Returns object with all settings including modified ones
  - Contains both default and custom values
- **Priority**: High

### TC-SET-S006: Type Safety for Theme Values
- **Description**: Verify only valid theme values are accepted
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Attempt to set theme to 'light'
  2. Attempt to set theme to 'dark'
  3. Attempt to set theme to 'system'
- **Expected Result**:
  - All valid values ('light', 'dark', 'system') are accepted
  - Values are stored correctly
- **Priority**: Medium

### TC-SET-S007: Type Safety for Language Values
- **Description**: Verify only valid language values are accepted
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Attempt to set language to 'en'
  2. Attempt to set language to 'ko'
- **Expected Result**:
  - Both valid values ('en', 'ko') are accepted
  - Values are stored correctly
- **Priority**: Medium

### TC-SET-S008: Boolean AutoSync Setting
- **Description**: Verify autoSync accepts boolean values
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Set autoSync to true
  2. Verify value is true
  3. Set autoSync to false
  4. Verify value is false
- **Expected Result**:
  - Boolean values are stored correctly
  - No type coercion occurs
- **Priority**: Medium

### TC-SET-S009: Persistence Across Service Instances
- **Description**: Verify settings persist when creating new service instance
- **Preconditions**: None
- **Steps**:
  1. Create SettingsService instance A
  2. Set theme to 'dark' via instance A
  3. Create new SettingsService instance B
  4. Get theme from instance B
- **Expected Result**:
  - Instance B retrieves 'dark' theme
  - Settings persist via electron-store
- **Priority**: High

### TC-SET-S010: Empty String API Keys
- **Description**: Verify empty string handling for optional API keys
- **Preconditions**: SettingsService initialized
- **Steps**:
  1. Set openAIKey to empty string ''
  2. Get openAIKey
  3. Set anthropicKey to empty string ''
  4. Get anthropicKey
- **Expected Result**:
  - Empty strings are stored as-is
  - No undefined/null conversion occurs
- **Priority**: Low

## SettingsHandler

### TC-SET-S011: Handler Get Valid Key
- **Description**: Verify handler validates and processes get requests
- **Preconditions**: Handler registered with valid SettingsService
- **Steps**:
  1. Invoke 'settings:get' with key 'theme'
  2. Invoke 'settings:get' with key 'autoSync'
- **Expected Result**:
  - Returns current value for valid keys
  - No error thrown
- **Priority**: High

### TC-SET-S012: Handler Get Invalid Key
- **Description**: Verify handler rejects invalid keys
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:get' with key 'invalidKey'
  2. Invoke 'settings:get' with number 123
  3. Invoke 'settings:get' with null
- **Expected Result**:
  - Throws error: "Invalid setting key: [value]"
  - Does not call service method
- **Priority**: High

### TC-SET-S013: Handler Get All Settings
- **Description**: Verify handler returns all settings without validation
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:getAll'
- **Expected Result**:
  - Returns complete SettingsSchema object
  - No parameters required
- **Priority**: High

### TC-SET-S014: Handler Set Valid Key with Valid Value
- **Description**: Verify handler validates both key and value for set operation
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'theme', value 'dark'
  2. Invoke 'settings:set' with key 'autoSync', value true
  3. Invoke 'settings:set' with key 'openAIKey', value 'sk-test'
- **Expected Result**:
  - All valid combinations are accepted
  - Service.set is called with validated values
- **Priority**: High

### TC-SET-S015: Handler Set Invalid Key
- **Description**: Verify handler rejects invalid keys for set operation
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'invalidKey', value 'test'
  2. Invoke 'settings:set' with key 123, value 'test'
- **Expected Result**:
  - Throws error: "Invalid setting key: [value]"
  - Service.set is not called
- **Priority**: High

### TC-SET-S016: Handler Set Invalid Value Type
- **Description**: Verify Zod schema validates value types
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'theme', value 'invalid-theme'
  2. Invoke 'settings:set' with key 'autoSync', value 'not-a-boolean'
  3. Invoke 'settings:set' with key 'language', value 123
- **Expected Result**:
  - Zod throws validation error for each invalid type
  - Service.set is not called
- **Priority**: High

### TC-SET-S017: Handler Set Theme with Zod Validation
- **Description**: Verify theme value validation via Zod enum
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'theme', value 'light'
  2. Invoke 'settings:set' with key 'theme', value 'dark'
  3. Invoke 'settings:set' with key 'theme', value 'system'
  4. Invoke 'settings:set' with key 'theme', value 'blue'
- **Expected Result**:
  - First three calls succeed
  - Fourth call fails with Zod validation error
- **Priority**: Medium

### TC-SET-S018: Handler Set Language with Zod Validation
- **Description**: Verify language value validation via Zod enum
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'language', value 'en'
  2. Invoke 'settings:set' with key 'language', value 'ko'
  3. Invoke 'settings:set' with key 'language', value 'fr'
- **Expected Result**:
  - First two calls succeed
  - Third call fails with Zod validation error
- **Priority**: Medium

### TC-SET-S019: Handler Set AutoSync with Zod Validation
- **Description**: Verify autoSync boolean validation
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'autoSync', value true
  2. Invoke 'settings:set' with key 'autoSync', value false
  3. Invoke 'settings:set' with key 'autoSync', value 'true' (string)
- **Expected Result**:
  - First two calls succeed
  - Third call fails with Zod validation error
- **Priority**: Medium

### TC-SET-S020: Handler Set Optional String Keys
- **Description**: Verify optional API keys accept string or undefined
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' with key 'openAIKey', value 'sk-test'
  2. Invoke 'settings:set' with key 'openAIKey', value undefined
  3. Invoke 'settings:set' with key 'anthropicKey', value 'sk-ant-test'
- **Expected Result**:
  - All calls succeed
  - Zod accepts both string and undefined for optional fields
- **Priority**: Medium

### TC-SET-S021: Handler Wrapped with SafeHandler
- **Description**: Verify all handlers use safeHandler wrapper
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke handler that throws error
  2. Check response structure
- **Expected Result**:
  - Errors are caught by safeHandler
  - Returns consistent error format
- **Priority**: High

### TC-SET-S022: Handler Concurrent Set Operations
- **Description**: Verify handler handles concurrent set operations safely
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:set' for 'theme' simultaneously
  2. Invoke 'settings:set' for different keys simultaneously
- **Expected Result**:
  - All operations complete successfully
  - No race conditions or data corruption
- **Priority**: Medium

## IPC Integration

### TC-SET-S023: IPC Channel Name Correctness
- **Description**: Verify IPC channel names match between preload and handler
- **Preconditions**: preload.ts and SettingsHandler registered
- **Steps**:
  1. Check preload.ts settings API channel names
  2. Check SettingsHandler registered channel names
- **Expected Result**:
  - 'settings:get' channel exists in both
  - 'settings:getAll' channel exists in both
  - 'settings:set' channel exists in both
- **Priority**: High

### TC-SET-S024: IPC Type Safety in Preload
- **Description**: Verify preload.ts exposes type-safe settings API
- **Preconditions**: preload.ts compiled
- **Steps**:
  1. Verify settings.get accepts keyof SettingsSchema
  2. Verify settings.set accepts keyof SettingsSchema and typed value
  3. Verify settings.getAll returns Promise<SettingsSchema>
- **Expected Result**:
  - TypeScript enforces correct types
  - No any types in API signature
- **Priority**: High

### TC-SET-S025: IPC Return Value Structure
- **Description**: Verify IPC handlers return consistent value structure
- **Preconditions**: Handler registered
- **Steps**:
  1. Invoke 'settings:get' and check return type
  2. Invoke 'settings:getAll' and check return type
  3. Invoke 'settings:set' and check return type
- **Expected Result**:
  - get: returns raw value (not Result wrapper)
  - getAll: returns SettingsSchema object
  - set: returns void (wrapped in safeHandler)
- **Priority**: Medium

## Integration with electron-store

### TC-SET-S026: Store Initialization with Defaults
- **Description**: Verify electron-store initializes with default values
- **Preconditions**: Clean electron-store state
- **Steps**:
  1. Create new SettingsService
  2. Verify Store constructor called with defaults object
- **Expected Result**:
  - Store initialized with correct defaults
  - defaults contains theme, language, autoSync
- **Priority**: High

### TC-SET-S027: Store Persistence Location
- **Description**: Verify settings are stored in correct location
- **Preconditions**: SettingsService created
- **Steps**:
  1. Set a setting value
  2. Check electron-store default path
- **Expected Result**:
  - Settings stored in app's userData directory
  - File format is JSON
- **Priority**: Low

### TC-SET-S028: Store Data Corruption Handling
- **Description**: Verify service handles corrupted store data
- **Preconditions**:
  - Manually corrupt electron-store JSON file
  - Create SettingsService
- **Steps**:
  1. Attempt to read settings
- **Expected Result**:
  - electron-store handles corruption gracefully
  - Falls back to defaults or throws clear error
- **Priority**: Low
