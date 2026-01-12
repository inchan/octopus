---
description: Review code for strict adherence to Clean Architecture and SOLID.
---
# Architecture Review Workflow

Use this workflow to audit the codebase or specific files against the "Iron-clad" standards.

## 1. Documentation Load (The Wall)
// turbo-all
1. Read `doc/core/01_PRINCIPLES.md`
2. Read `doc/core/02_STRUCTURE.md`
3. Read `doc/core/04_IPC_STANDARDS.md`

## 2. Layer Analysis
1. **Identify Files**: List the files to review.
2. **Check Dependencies**:
    - Does `src/` import `electron/`? (Should be NO, except Types)
    - Does `electron/services/` import `electron/handlers/`? (Should be NO)
    - Does Business Logic reside in React components? (Should be NO)

## 3. SOLID Check
1. **SRP**: Does the file do one thing?
2. **OCP**: Is it open for extension?
3. **DIP**: Do Services depend on Repositories (Interfaces), not direct DB code?

## 4. Report
1. Generate a report in `reviews/architecture_audit_[DATE].md`.
2. List violations and recommended fixes.
