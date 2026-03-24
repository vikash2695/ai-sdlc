Dispatch to the BharatPe TPM wrapper agent.

**Load:** `bmad/extensions/bharatpe/agents/bp_tpm.md`
**Requires:** `PRD_LINK`, `ARCH_LINK`, `TRACKER_EPIC_ID`

Execution contract:
- Treat the loaded agent as the single source of truth for Jira/TPM workflow and gates.
- Apply fail-fast behavior exactly as defined by the agent and referenced skills.
- Do not proceed when required inputs are missing.
