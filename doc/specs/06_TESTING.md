# Test Strategy: Mocked E2E Verification

## Overview
In addition to backend integration tests, we utilize **Mocked E2E Tests** using Playwright.
This approach allows us to verify the **Frontend** logic and user flows without interacting with the actual Electron backend or Native modules (which can be flaky in CI/CD environments or incompatible with some test runners).

## Architecture
- **Environment**: Playwright checks the `src/mocks/api.ts` injection.
- **Mock API**: An in-memory implementation of the `IElectronAPI` interface.
- **Data Persistence**: Data is stored in ephemeral arrays (`_rules`, `_history`) within the Mock API instance, which resets on page reload.

## Running Tests
```bash
# Install dependencies
npm install -D playwright @playwright/test
npx playwright install chromium

# Run all E2E tests
npx playwright test

# Debug mode
npx playwright test --debug
```

## Coverage
1. **History & Rollback**:
   - Create Rule -> Verify History Entry
   - Revert Create -> Verify Rule Deletion
   - Revert Delete -> Verify Rule Restoration
2. **Settings**:
   - Change Theme -> Verify Persistence (Mock) & UI Update
   - Toggle Auto-Sync -> Verify State
