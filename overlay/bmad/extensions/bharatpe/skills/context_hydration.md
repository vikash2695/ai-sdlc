# Context Hydration

## Purpose
Build a working dev context from Jira and Confluence, then persist it under per-issue memory.

## Input
- `JIRA_ID` (required)

## Steps
1. Fetch Jira issue by `JIRA_ID`.
2. Extract `PRD` and `Architecture` links from issue description/fields.
3. Fail fast if either link is missing.
4. Pull PRD and Architecture pages from Confluence.
5. Create memory directory:
   - `bmad/extensions/bharatpe/memory/<JIRA_ID>/`
6. Save normalized files:
   - `prd.md`
   - `architecture.md`
7. Generate/update:
   - `context_summary.md`
   - `decisions.md` (create if absent, preserve existing decisions)
8. Return structured hydrated payload for wrapper agent execution.

## Output Contract
- `hydrated_context.issue`
- `hydrated_context.references.prd`
- `hydrated_context.references.architecture`
- `hydrated_context.memory_path`
- `hydrated_context.context_summary_path`

## Rules
- Source of truth is Jira + Confluence, not stale local docs.
- Local memory is only an execution cache and decision trail.
