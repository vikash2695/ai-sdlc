Dispatch to the BharatPe Dev wrapper agent.

**Load:** `bmad/extensions/bharatpe/agents/bp_dev.md`
**Requires:** `JIRA_ID` (example: `/bp-dev PAY-123`)

Execution contract:
- Treat the loaded agent as the single source of truth for dev workflow and gates.
- Apply fail-fast behavior exactly as defined by the agent and referenced skills.
- Do not proceed when required inputs are missing.
