---
description: Fix a bug or issue with strict root cause analysis and verification.
---
# Bug Fix Workflow

This workflow enforces the "Strong Wall" protocol for stability.

## 1. Context & Setup (The Wall)
**DO NOT GUESS.** You must establish ground truth.
// turbo-all
1. Read `doc/core/01_PRINCIPLES.md` (Verify architecture alignment)
2. Read `GEMINI.md` (Project Rules)

## 2. Reproduction
1. **Create Repro**: Can you reproduce this with a test case?
    - YES: Write a failing test case in the appropriate `__tests__` dir.
    - NO: Create a script or manual steps in `repro.md`.
2. **Confirm Failure**: Run the test/script to confirm it fails.

## 3. Analysis & Plan
1. **Analyze**: Why is it failing? Trace the execution.
2. **Plan**: Update `implementation_plan.md` with:
    - Root Cause
    - Proposed Fix
    - Side Effect Check

## 4. Execution
1. **Fix**: Apply the code change.
2. **Verify**: Run the reproduction test/script. It MUST pass now.
3. **Regression Check**: Run related tests to ensure no breakage.

## 5. Document
1. Update `walkthrough.md` with "Before/After" and verification results.
