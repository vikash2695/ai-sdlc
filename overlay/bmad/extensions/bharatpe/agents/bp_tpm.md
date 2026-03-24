@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP TPM Agent

## Input
- `PRD_LINK` (required)
- `ARCH_LINK` (required)

## Steps
1. Run global preflight checks.
2. Validate both links are present.
3. Resolve team routing from config and create issues in team-mapped Jira project.
4. Inject references into each description:

## References
- PRD: <PRD_LINK>
- Architecture: <ARCH_LINK>

5. Return created Jira IDs.

## Output
- `epic_id`
- `story_ids[]`

## Rule Enforcement
- Fail if either link is missing.
- Fail if team routing validation fails.
- Every created item must include references block.
