# BharatPe Memory Store

Each Jira issue has an isolated memory folder:

`bmad/extensions/bharatpe/memory/<JIRA_ID>/`

Required files per issue:
- `prd.md`
- `architecture.md`
- `context_summary.md`
- `decisions.md`

## Workflow Memory Index (optional)
Track lineage for dependency resolution:
- BRD -> PRD -> ARCH -> JIRA

Use deterministic identifiers to avoid duplicate publish records.
