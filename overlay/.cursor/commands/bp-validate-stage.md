Dispatch to the BharatPe stage validation wrapper agent.

**Load:** `bmad/extensions/bharatpe/agents/bp_validate_stage.md`
**Requires:** `JIRA_ID` (example: `/bp-validate-stage PAY-123`)
**Optional:** `STAGE` (`brd | prd | architecture | jira | dev | auto`)

Execution contract:
- Treat the loaded agent as the single source of truth for stage validation logic.
- Keep this command validation-only; do not run generation or development flows.
- Apply fail-fast behavior exactly as defined by the agent and referenced skills.
