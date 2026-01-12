---
description: Implement a new feature strictly following Clean Architecture and TDD.
---
# Feature Implementation Workflow

This workflow enforces the "Strong Wall" protocol. You MUST follow these steps strictly.

## 1. Documentation Review (The Wall)
Before listing any tasks or writing code, **YOU MUST READ AND VERIFY** the core principles.
// turbo-all
1. Read `doc/core/01_PRINCIPLES.md` (Clean Architecture & Philosophy)
2. Read `doc/core/02_STRUCTURE.md` (Where code belongs)
3. Read `doc/core/03_WORKFLOW.md` (TDD Protocol)
4. Read `GEMINI.md` (Project Context)

## 2. Planning
1. **Understand Goal**: Rephrase the user request in your own words.
2. **Check Specifications**: If a spec exists in `doc/specs/`, read it. If not, ask if needed.
3. **Create Plan**: Write an `implementation_plan.md` artifact.
    - Define `[TargetFile]`s.
    - Define Test Cases (RED phase).
    - Request user approval.

## 3. TDD Cycle (Strict Red-Green-Refactor)
1. **RED**: Write the test first.
    - If logic -> `electron/services/__tests__/`
    - If UI -> `src/__tests__/` or E2E
2. **GREEN**: Write the minimal code to pass the test.
    - **Architecture Check**: 
        - Is Logic in Renderer? -> **STOP**. Move to Main.
        - Is UI in Main? -> **STOP**. Move to Renderer.
3. **REFACTOR**: Clean up.

## 4. Verification
1. Run `npm run test` (or specific test file).
2. Run `npm run typecheck`.
3. Create `walkthrough.md` to show proof of work.
