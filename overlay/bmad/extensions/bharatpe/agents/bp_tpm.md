@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP TPM Agent

## Input
- `PRD_LINK` (required)
- `ARCH_LINK` (required)

## Steps
1. Run global preflight checks.
2. Validate both links are present.
3. Validate Jira-stage team routing and approval dependencies:
   - Jira/Confluence target alignment for team
   - PRD Product approval comment text check: `Approved from Product`
   - PRD Product approval commenter identity check against team product allowlist
   - Architecture EM approval comment text check: `Architecture Approved for implmentation`
   - Architecture EM approval commenter identity check against team EM allowlist
4. Resolve team routing from config and create issues in team-mapped Jira project.
5. Inject references into each description:

## References
- PRD: <PRD_LINK>
- Architecture: <ARCH_LINK>

6. Return created Jira IDs.

## Output
- `epic_id`
- `story_ids[]`

## Rule Enforcement
- Fail if either link is missing.
- Fail if PRD does not include the required product approval comment: `Approved from Product`.
- Fail if PRD product approval comment author is not in org governance product approver allowlist.
- Fail if Architecture does not include the required EM approval comment: `Architecture Approved for implmentation`.
- Fail if Architecture EM approval comment author is not in org governance EM approver allowlist.
- Fail if team routing validation fails.
- Every created item must include references block.
