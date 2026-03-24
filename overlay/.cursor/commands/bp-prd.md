Dispatch to the BharatPe PRD wrapper agent.

**Load:** `bmad/extensions/bharatpe/agents/bp_prd.md`
**Requires:** `BRD_LINK`, `TRACKER_EPIC_ID`

Execution contract:
- Treat the loaded agent as the single source of truth for PRD workflow and governance.
- Apply fail-fast behavior exactly as defined by the agent and referenced skills.
- Do not proceed when required inputs are missing.
