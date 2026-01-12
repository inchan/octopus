---
description: Refactor code to improve structure without changing behavior.
---
# Refactoring Workflow

Refactoring is dangerous without a safety net. This workflow ensures safety.

## 1. Safety Check (The Wall)
1. **Read Principles**: Read `doc/core/01_PRINCIPLES.md` (Clean Architecture).
2. **Check Tests**: Do tests exist for the target code?
    - YES: Run them to ensure they pass currently.
    - NO: **STOP**. You must write tests *before* refactoring. (Switch to `/feature` or `/fix` to add tests).

## 2. Plan
1. **Identify Goal**: What pattern are we applying? (SOLID, DRY, etc.)
2. **Plan**: Write `implementation_plan.md`.
    - Current Structure
    - Target Structure
    - Verification Strategy

## 3. Execution
1. **Refactor**: Apply changes in small steps.
2. **Verify**: Run tests after *every* significant change. Do not break the build.

## 4. Final Review
1. Check `doc/core/02_STRUCTURE.md`: Did we violate layer boundaries?
2. Run full test suite.
