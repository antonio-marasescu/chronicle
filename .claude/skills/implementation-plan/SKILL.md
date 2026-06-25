---
name: implementation-plan
description: Create implementation plans from feature specs or task descriptions. Use this skill whenever the user wants to plan how to implement something before writing code — phrases like "plan this", "how would I implement", "break this down", "what files do I need to change", "create a plan for", or any request that involves mapping out file changes and implementation steps for a feature, refactor, or integration. Also use when the user references an existing spec or business doc and wants to turn it into actionable steps.
---

# Implementation Plan Skill

Create structured implementation plans that map out what files change, what gets created, and in what order — so the user can review the approach before any code is written.

Plans live in `./plans/` (git-ignored) and are disposable working documents, not permanent artifacts.

## Process

### 1. Understand the Scope

Read the user's spec or description. If they reference an existing document (e.g., something in `docs/business/`), read it. Ask clarifying questions only if something is genuinely ambiguous — don't interrogate. One or two targeted questions max.

### 2. Research the Codebase

Before writing the plan, understand what already exists. This is critical — a plan that ignores existing patterns or duplicates existing code is worse than no plan.

**Check these things:**
- Existing files in the area you'll be touching (read them, understand the patterns)
- How similar features are structured (find a reference implementation)
- Shared utilities, services, or patterns that should be reused
- The architecture docs at `docs/architecture/` for conventions

Spend enough time here that the plan reflects reality, not assumptions.

### 3. Write the Plan

Create a markdown file at `./plans/plan-<descriptive-name>.md`.

Use this structure:

```markdown
# Plan: <Feature/Change Name>

Brief one-liner of what this accomplishes.

**Based on**: <source spec or user description>
**Date**: <today>

## Summary

2-3 sentences explaining the change at a high level — what's being built, the main moving parts, and any key decisions.

## Files

### New Files

| File | Purpose |
|------|---------|
| `path/to/file.ts` | What this file does |

### Modified Files

| File | Change |
|------|--------|
| `path/to/existing.ts` | What's being added or changed |

## Implementation Order

List files in the order they should be implemented, grouped by dependency. Files that don't depend on each other can be in the same step.

1. **Step 1** — <what this accomplishes>
   - `file-a.ts` — reason this goes first
   - `file-b.ts` — also independent

2. **Step 2** — <what this accomplishes>
   - `file-c.ts` — depends on step 1 because...

3. **Step 3** — <what this accomplishes>
   - `file-d.ts` — ties it together
```

### When to Add Phases

Only add phases (numbered sections with their own file tables) when the change is large enough that it makes sense to ship or review in distinct chunks — for example, "backend first, then frontend" or "data model, then API, then UI."

Most plans should NOT have phases. A plan with 3-8 files in a clear dependency order doesn't need phases — just use the implementation order.

If phases are warranted, use 2-3 at most:

```markdown
## Phase 1: <Name>

What this phase delivers (should be independently useful or reviewable).

### New Files
...

### Modified Files
...

### Implementation Order
...

## Phase 2: <Name>
...
```

### 4. Key Decisions (optional section)

If the plan involves choices that could reasonably go another way, note them briefly:

```markdown
## Decisions

- **Using X instead of Y** — because <reason>
- **Not including Z in this change** — will be a follow-up because <reason>
```

## Guidelines

- Keep plans concise. The point is to align on approach, not to write a spec.
- File paths should be exact (relative to project root), not approximate.
- Every file listed should have a clear purpose — if you can't explain why it exists in one line, rethink the decomposition.
- Reference existing patterns by name ("follows the same pattern as `campaigns.service.ts`") so the user knows you've done your homework.
- Don't plan tests separately unless the testing approach is non-obvious. Assume tests accompany each file.
- If the plan reveals that the spec is incomplete or contradictory, say so at the top before proceeding.
