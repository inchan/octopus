---
description: Create a new Architecture Decision Record (ADR) following the standard template.
---
# Create ADR Workflow

Use this workflow to record significant architectural decisions.

## 1. Safety Check (The Wall)
// turbo-all
1. Read `doc/adrs/0000-template.md`.
2. check `doc/core/01_PRINCIPLES.md`.

## 2. Draft
1. **Determine ID**: Find the next available number (e.g., 0001, 0002).
2. **Title**: Choose a short, imperative title (e.g., "Use SQLite", "Adopt Relay").
3. **Write**: Create the file `doc/adrs/XXXX-title.md` using the template content.
    - **Context**: MUST explain the "Why".
    - **Decision**: MUST explain the "What".
    - **Consequences**: MUST explain the "So What".

## 3. Review & Log
1. **Review**: Ensure it is not empty or vague.
2. **Log**: Update `doc/adrs/README.md` (if it exists) or create one to list the new ADR.
