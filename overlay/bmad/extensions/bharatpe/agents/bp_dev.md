@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation
@bharatpe/skills/context_hydration

# BP Dev Agent

## Input
- `JIRA_ID` (required)

## Steps
1. Run global preflight.
2. Validate Dev-stage team routing and approvals:
   - Jira board/project matches mapped team
   - Tech + Team approvals match team allowlist
   - Jira comment text check: `Approved for Development`
   - Jira EM approval commenter identity check against team EM allowlist
3. Run context hydration for `JIRA_ID`.
4. Load hydrated context files:
   - `context_summary.md`
   - `prd.md`
   - `architecture.md`
5. Invoke base BMAD dev agent for implementation execution:
   - Primary: `_bmad/bmm/agents/dev.md`
   - Execute in non-interactive mode for wrapper flows:
     - do not stop at menu/help
     - do not wait for additional user prompt
     - proceed directly to story execution and code implementation for `JIRA_ID`
   - Use hydrated context as authoritative input and complete development tasks end-to-end.
6. Post execution:
   - Append/update `decisions.md`
   - Add Jira comment with implementation summary

## Rule Enforcement
- Fail if Jira does not contain PRD and Architecture links.
- Fail if Jira does not include the required EM approval comment: `Approved for Development`.
- Fail if Jira EM approval comment author is not in org governance EM approver allowlist.
- Fail if team routing or approval validation fails.
- Fail if hydration does not complete.
- Do not execute base dev agent without hydrated context.
- Do not stop after hydration; wrapper run must continue into implementation unless a fail-fast gate blocks execution.
