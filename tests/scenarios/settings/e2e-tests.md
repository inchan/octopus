# Settings E2E Test Scenarios

## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | 50 |
| High Priority | 25 (50%) |
| Medium Priority | 12 (24%) |
| Low Priority | 13 (26%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 50 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 50 |
| High Priority | 25 (50%) |
| Medium Priority | 12 (24%) |
| Low Priority | 13 (26%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 50 | ██████████ 100% |



| Metric | Value |
|--------|-------|
| Total Scenarios | 50 |
| High Priority | 25 (50%) |
| Medium Priority | 12 (24%) |
| Low Priority | 13 (26%) |
| Last Updated | 2025-12-23 |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
| E2E | 50 | ██████████ 100% |

## Page Navigation

### TC-SET-E001: Navigate to Settings Page
- **Description**: Verify user can navigate to Settings page
- **Preconditions**: Application started
- **Steps**:
  1. Launch application
  2. Click on Settings menu/button
- **Expected Result**:
  - Settings page loads successfully
  - Page displays "Settings" heading
  - testid="settings-page" element is visible
- **Priority**: High

### TC-SET-E002: Settings Page Layout
- **Description**: Verify Settings page displays all required sections
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Observe page structure
- **Expected Result**:
  - "General" section is visible with monitor icon
  - "LLM API Keys" section is visible with key icon
  - All settings controls are rendered
- **Priority**: High

## General Settings - Theme

### TC-SET-E003: Theme Selector Display
- **Description**: Verify theme selector displays current value
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Locate theme select element (testid="settings-theme-select")
- **Expected Result**:
  - Select displays current theme value
  - Default value is 'system'
  - Dropdown contains options: System, Light, Dark
- **Priority**: High

### TC-SET-E004: Change Theme to Light
- **Description**: Verify changing theme to light mode
- **Preconditions**: Settings page loaded, current theme is not 'light'
- **Steps**:
  1. Select 'Light' from theme dropdown
  2. Observe UI changes
  3. Check toast notification
- **Expected Result**:
  - Theme changes to light mode immediately
  - Document root class removes 'dark' class
  - Toast shows "Saved" message
  - Toast disappears after 2 seconds
- **Priority**: High

### TC-SET-E005: Change Theme to Dark
- **Description**: Verify changing theme to dark mode
- **Preconditions**: Settings page loaded, current theme is not 'dark'
- **Steps**:
  1. Select 'Dark' from theme dropdown
  2. Observe UI changes
  3. Check toast notification
- **Expected Result**:
  - Theme changes to dark mode immediately
  - Document root class adds 'dark' class
  - Toast shows "Saved" message
- **Priority**: High

### TC-SET-E006: Change Theme to System
- **Description**: Verify changing theme to system preference
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Select 'System' from theme dropdown
  2. Observe UI changes
- **Expected Result**:
  - Theme follows system preference
  - If system is dark, 'dark' class is added
  - If system is light, 'dark' class is removed
  - Toast shows "Saved" message
- **Priority**: Medium

### TC-SET-E007: Theme Persistence
- **Description**: Verify theme selection persists across sessions
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Change theme to 'dark'
  2. Reload application
  3. Navigate to Settings page
  4. Check theme selector value
- **Expected Result**:
  - Theme selector shows 'dark'
  - UI is in dark mode
  - Setting was persisted via IPC
- **Priority**: High

### TC-SET-E008: Theme Applied on Load
- **Description**: Verify saved theme is applied immediately on app launch
- **Preconditions**: Theme previously set to 'dark'
- **Steps**:
  1. Launch application
  2. Observe initial UI appearance
- **Expected Result**:
  - Dark theme is applied before first render
  - No flash of unstyled content
  - Theme is consistent across all pages
- **Priority**: Medium

## General Settings - Language

### TC-SET-E009: Language Selector Display
- **Description**: Verify language selector displays current value
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Locate language select element
- **Expected Result**:
  - Select displays current language value
  - Default value is 'ko' (한국어)
  - Dropdown contains options: English, 한국어
- **Priority**: High

### TC-SET-E010: Change Language to English
- **Description**: Verify changing language to English
- **Preconditions**: Settings page loaded, current language is 'ko'
- **Steps**:
  1. Select 'English' from language dropdown
  2. Check toast notification
  3. Verify setting saved
- **Expected Result**:
  - Language changes to 'en'
  - Toast shows "Saved" message
  - Setting persisted via IPC
- **Priority**: High

### TC-SET-E011: Change Language to Korean
- **Description**: Verify changing language to Korean
- **Preconditions**: Settings page loaded, current language is 'en'
- **Steps**:
  1. Select '한국어' from language dropdown
  2. Check toast notification
  3. Verify setting saved
- **Expected Result**:
  - Language changes to 'ko'
  - Toast shows "Saved" message
  - Setting persisted via IPC
- **Priority**: High

### TC-SET-E012: Language Persistence
- **Description**: Verify language selection persists across sessions
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Change language to 'en'
  2. Reload application
  3. Navigate to Settings page
  4. Check language selector value
- **Expected Result**:
  - Language selector shows 'en'
  - Setting was persisted
- **Priority**: High

## General Settings - Auto Sync

### TC-SET-E013: Auto Sync Toggle Display
- **Description**: Verify auto sync toggle displays current state
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Locate auto sync toggle (testid="settings-autosync-toggle")
- **Expected Result**:
  - Toggle is visible
  - Default state is OFF (gray background)
  - Toggle shows label and description
- **Priority**: High

### TC-SET-E014: Enable Auto Sync
- **Description**: Verify enabling auto sync
- **Preconditions**: Settings page loaded, autoSync is false
- **Steps**:
  1. Click auto sync toggle
  2. Observe visual change
  3. Check toast notification
- **Expected Result**:
  - Toggle switches to ON state (blue background)
  - Toggle knob moves to right
  - Toast shows "Saved" message
  - Setting saved via IPC
- **Priority**: High

### TC-SET-E015: Disable Auto Sync
- **Description**: Verify disabling auto sync
- **Preconditions**: Settings page loaded, autoSync is true
- **Steps**:
  1. Click auto sync toggle
  2. Observe visual change
  3. Check toast notification
- **Expected Result**:
  - Toggle switches to OFF state (gray background)
  - Toggle knob moves to left
  - Toast shows "Saved" message
  - Setting saved via IPC
- **Priority**: High

### TC-SET-E016: Auto Sync Visual Feedback
- **Description**: Verify toggle provides immediate visual feedback
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Click auto sync toggle rapidly multiple times
  2. Observe state changes
- **Expected Result**:
  - Each click toggles state immediately
  - Visual feedback is instant (no delay)
  - Background color and knob position update correctly
- **Priority**: Medium

### TC-SET-E017: Auto Sync Persistence
- **Description**: Verify auto sync setting persists across sessions
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Enable auto sync
  2. Reload application
  3. Navigate to Settings page
  4. Check toggle state
- **Expected Result**:
  - Toggle is in ON state
  - Setting was persisted
- **Priority**: High

### TC-SET-E018: Auto Sync Focus State
- **Description**: Verify toggle keyboard accessibility
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Tab to auto sync toggle
  2. Press Space or Enter
- **Expected Result**:
  - Toggle receives focus (blue ring)
  - Keyboard activates toggle
  - State changes correctly
- **Priority**: Low

## API Keys Section

### TC-SET-E019: OpenAI API Key Input Display
- **Description**: Verify OpenAI API key input is visible and functional
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Locate OpenAI API Key input field
- **Expected Result**:
  - Input field is visible under "LLM API Keys" section
  - Input type is "password"
  - Placeholder shows "sk-..."
  - Label reads "OpenAI API Key"
- **Priority**: High

### TC-SET-E020: Set OpenAI API Key
- **Description**: Verify user can set OpenAI API key
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Type "sk-test-openai-key" into OpenAI API Key input
  2. Observe changes
  3. Check toast notification
- **Expected Result**:
  - Input updates on each keystroke
  - Toast shows "Saved" after each change
  - Key is saved via IPC (onChange triggers immediately)
- **Priority**: High

### TC-SET-E021: OpenAI API Key Masked Display
- **Description**: Verify OpenAI API key is masked for security
- **Preconditions**: Settings page loaded, OpenAI key is set
- **Steps**:
  1. Enter API key
  2. Observe input display
- **Expected Result**:
  - Input type="password" masks characters
  - Characters appear as dots/asterisks
- **Priority**: High

### TC-SET-E022: OpenAI API Key Persistence
- **Description**: Verify OpenAI API key persists across sessions
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Set OpenAI API key to "sk-test-123"
  2. Reload application
  3. Navigate to Settings page
  4. Check input value
- **Expected Result**:
  - Input contains saved key
  - Key was persisted via IPC
- **Priority**: High

### TC-SET-E023: Clear OpenAI API Key
- **Description**: Verify user can clear OpenAI API key
- **Preconditions**: Settings page loaded, OpenAI key is set
- **Steps**:
  1. Clear OpenAI API Key input (delete all text)
  2. Check toast notification
- **Expected Result**:
  - Input becomes empty
  - Toast shows "Saved"
  - Empty string or undefined saved via IPC
- **Priority**: Medium

### TC-SET-E024: Anthropic API Key Input Display
- **Description**: Verify Anthropic API key input is visible and functional
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Locate Anthropic API Key input field
- **Expected Result**:
  - Input field is visible under "LLM API Keys" section
  - Input type is "password"
  - Placeholder shows "sk-ant-..."
  - Label reads "Anthropic API Key"
- **Priority**: High

### TC-SET-E025: Set Anthropic API Key
- **Description**: Verify user can set Anthropic API key
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Type "sk-ant-test-anthropic-key" into Anthropic API Key input
  2. Observe changes
  3. Check toast notification
- **Expected Result**:
  - Input updates on each keystroke
  - Toast shows "Saved" after each change
  - Key is saved via IPC
- **Priority**: High

### TC-SET-E026: Anthropic API Key Masked Display
- **Description**: Verify Anthropic API key is masked for security
- **Preconditions**: Settings page loaded, Anthropic key is set
- **Steps**:
  1. Enter API key
  2. Observe input display
- **Expected Result**:
  - Input type="password" masks characters
  - Characters appear as dots/asterisks
- **Priority**: High

### TC-SET-E027: Anthropic API Key Persistence
- **Description**: Verify Anthropic API key persists across sessions
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Set Anthropic API key to "sk-ant-test-456"
  2. Reload application
  3. Navigate to Settings page
  4. Check input value
- **Expected Result**:
  - Input contains saved key
  - Key was persisted via IPC
- **Priority**: High

### TC-SET-E028: Clear Anthropic API Key
- **Description**: Verify user can clear Anthropic API key
- **Preconditions**: Settings page loaded, Anthropic key is set
- **Steps**:
  1. Clear Anthropic API Key input (delete all text)
  2. Check toast notification
- **Expected Result**:
  - Input becomes empty
  - Toast shows "Saved"
  - Empty string or undefined saved via IPC
- **Priority**: Medium

### TC-SET-E029: Set Both API Keys
- **Description**: Verify user can set both API keys simultaneously
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Set OpenAI API key
  2. Set Anthropic API key
  3. Reload application
  4. Check both values
- **Expected Result**:
  - Both keys are saved independently
  - Both keys persist across reload
  - No interference between settings
- **Priority**: Medium

## Toast Notifications

### TC-SET-E030: Toast Appears on Save
- **Description**: Verify toast notification appears when setting is saved
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Change any setting (theme, language, autoSync, or API key)
  2. Observe bottom-right corner
- **Expected Result**:
  - Toast appears with "Saved" message
  - Toast has green background (emerald-600)
  - Toast includes checkmark icon
  - testid="settings-toast" element is visible
- **Priority**: High

### TC-SET-E031: Toast Auto-Dismisses
- **Description**: Verify toast automatically disappears after timeout
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Change a setting to trigger toast
  2. Wait for 2 seconds
- **Expected Result**:
  - Toast appears immediately
  - Toast disappears after exactly 2 seconds
  - No manual dismissal required
- **Priority**: Medium

### TC-SET-E032: Multiple Toast Triggers
- **Description**: Verify rapid changes reset toast timer
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Change theme
  2. Immediately change language (before toast disappears)
  3. Observe toast behavior
- **Expected Result**:
  - Toast remains visible
  - Timer resets with each change
  - Toast disappears 2 seconds after last change
- **Priority**: Low

### TC-SET-E033: Toast Position and Styling
- **Description**: Verify toast has correct styling and position
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Trigger toast notification
  2. Inspect toast element
- **Expected Result**:
  - Toast is positioned at bottom-right (fixed position)
  - Has backdrop-blur effect
  - Has shadow
  - Has fade-in animation
- **Priority**: Low

## Settings Initialization

### TC-SET-E034: Load Settings on Page Mount
- **Description**: Verify settings are loaded when page mounts
- **Preconditions**: Settings previously saved
- **Steps**:
  1. Launch application
  2. Navigate to Settings page
- **Expected Result**:
  - IPC call to 'settings:getAll' is made
  - All controls display correct values
  - Loading happens asynchronously without blocking UI
- **Priority**: High

### TC-SET-E035: Handle Empty Settings
- **Description**: Verify page handles case when no settings exist
- **Preconditions**: Fresh install, no settings saved
- **Steps**:
  1. Navigate to Settings page
- **Expected Result**:
  - Default values are displayed
  - No errors occur
  - UI is fully functional
- **Priority**: Medium

### TC-SET-E036: Component Unmount Cleanup
- **Description**: Verify component cleans up properly on unmount
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Navigate to Settings page
  2. Navigate away to another page
  3. Check for memory leaks or warnings
- **Expected Result**:
  - useEffect cleanup function prevents state updates
  - No "setState on unmounted component" warnings
- **Priority**: Low

## Error Handling

### TC-SET-E037: Handle IPC Get Failure
- **Description**: Verify graceful handling when getting settings fails
- **Preconditions**: Mock IPC to return error
- **Steps**:
  1. Navigate to Settings page
  2. Observe behavior when getAll() fails
- **Expected Result**:
  - Page does not crash
  - Error is logged or displayed appropriately
  - Defaults or empty values are shown
- **Priority**: Medium

### TC-SET-E038: Handle IPC Set Failure
- **Description**: Verify graceful handling when saving settings fails
- **Preconditions**: Mock IPC to fail on set
- **Steps**:
  1. Attempt to change a setting
  2. Observe behavior when set() fails
- **Expected Result**:
  - User is notified of failure
  - UI state remains consistent
  - Can retry operation
- **Priority**: Medium

### TC-SET-E039: Network/Storage Unavailable
- **Description**: Verify behavior when electron-store is unavailable
- **Preconditions**: Simulate storage failure
- **Steps**:
  1. Navigate to Settings page
  2. Attempt to change settings
- **Expected Result**:
  - Appropriate error message shown
  - Application does not crash
  - User understands issue
- **Priority**: Low

## Accessibility

### TC-SET-E040: Keyboard Navigation
- **Description**: Verify all settings can be changed via keyboard
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Tab through all form controls
  2. Use arrow keys for selects
  3. Use Space for toggle
- **Expected Result**:
  - All controls are focusable
  - Focus order is logical
  - Visual focus indicators are clear
- **Priority**: Medium

### TC-SET-E041: Screen Reader Labels
- **Description**: Verify all controls have proper labels for screen readers
- **Preconditions**: Settings page loaded with screen reader
- **Steps**:
  1. Navigate with screen reader
  2. Verify labels for each control
- **Expected Result**:
  - All inputs have associated labels
  - Descriptions provide context
  - Current values are announced
- **Priority**: Low

### TC-SET-E042: Focus Management on Toggle
- **Description**: Verify toggle maintains focus after activation
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Tab to auto sync toggle
  2. Press Space to activate
  3. Check focus state
- **Expected Result**:
  - Toggle retains focus after activation
  - User can continue keyboard navigation
- **Priority**: Low

## Theme Application

### TC-SET-E043: Theme Applies Globally
- **Description**: Verify theme change affects entire application
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Change theme to 'dark'
  2. Navigate to other pages (Rules, MCP, etc.)
  3. Return to Settings
- **Expected Result**:
  - Dark theme is applied to all pages
  - Theme is consistent across navigation
  - No page reloads required
- **Priority**: High

### TC-SET-E044: System Theme Change Detection
- **Description**: Verify app responds to OS theme changes when theme is 'system'
- **Preconditions**: Theme set to 'system'
- **Steps**:
  1. Change OS theme from light to dark (or vice versa)
  2. Observe application appearance
- **Expected Result**:
  - Application theme updates to match OS
  - Change happens without page reload
  - matchMedia listener is working
- **Priority**: Low

### TC-SET-E045: Theme Preference at Startup
- **Description**: Verify theme is applied before first paint
- **Preconditions**: Theme previously set to 'dark'
- **Steps**:
  1. Restart application
  2. Observe initial render
- **Expected Result**:
  - No flash of light theme
  - Dark theme applied from first frame
  - Loading is seamless
- **Priority**: Medium

## Visual Regression

### TC-SET-E046: Settings Page Appearance Light Theme
- **Description**: Visual regression test for Settings page in light theme
- **Preconditions**: Theme set to 'light'
- **Steps**:
  1. Navigate to Settings page
  2. Capture screenshot
  3. Compare with baseline
- **Expected Result**:
  - No unintended visual changes
  - All elements are properly styled
- **Priority**: Low

### TC-SET-E047: Settings Page Appearance Dark Theme
- **Description**: Visual regression test for Settings page in dark theme
- **Preconditions**: Theme set to 'dark'
- **Steps**:
  1. Navigate to Settings page
  2. Capture screenshot
  3. Compare with baseline
- **Expected Result**:
  - No unintended visual changes
  - All elements are properly styled in dark mode
- **Priority**: Low

### TC-SET-E048: Toast Visual Appearance
- **Description**: Visual regression test for toast notification
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Trigger toast notification
  2. Capture screenshot
  3. Compare with baseline
- **Expected Result**:
  - Toast appears in correct position
  - Styling is consistent
  - Animation is smooth
- **Priority**: Low

## Performance

### TC-SET-E049: Settings Load Time
- **Description**: Verify settings page loads within acceptable time
- **Preconditions**: Application started
- **Steps**:
  1. Navigate to Settings page
  2. Measure time to interactive
- **Expected Result**:
  - Page loads in under 500ms
  - No perceptible delay
  - IPC call completes quickly
- **Priority**: Low

### TC-SET-E050: Rapid Setting Changes
- **Description**: Verify performance with rapid setting changes
- **Preconditions**: Settings page loaded
- **Steps**:
  1. Rapidly toggle auto sync 10 times
  2. Rapidly change theme multiple times
  3. Observe performance
- **Expected Result**:
  - UI remains responsive
  - No lag or freezing
  - All changes are persisted correctly
- **Priority**: Low
