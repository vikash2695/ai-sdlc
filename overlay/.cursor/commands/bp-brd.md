Dispatch to the BharatPe BRD wrapper agent.

**Load:** `bmad/extensions/bharatpe/agents/bp_brd.md`
**Requires:** `BUSINESS_CONTEXT`

Execution contract:
- Treat the loaded agent as the single source of truth for BRD workflow and gates.
- Apply fail-fast behavior exactly as defined by the agent and referenced skills.
- Do not create local-only BRD output.
