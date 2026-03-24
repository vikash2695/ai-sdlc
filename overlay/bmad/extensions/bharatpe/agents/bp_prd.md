@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP PRD Agent

## Input
- `BRD_LINK` (mandatory)

## Precondition
- `BRD_LINK` must be present and resolvable.
- BRD must include a business-owner approval comment with exact text: `Approved from Business`.
- Approval comment author must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.brd.business.approvers`.

## Steps
1. Run global preflight checks.
2. Validate team routing and PRD-stage approvals against config:
   - Jira/Confluence target alignment for team
   - Business + Product approvals allowlist match
   - BRD approval comment text check: `Approved from Business`
   - BRD approval commenter identity check against business-owner allowlist
3. Fetch BRD from Confluence via `BRD_LINK`.
4. Generate PRD.
5. Embed lineage section:

Derived From: <BRD_LINK>

6. Publish PRD to team-mapped Confluence space.

## Output
- `confluence_url`
- `page_id`

## Rule Enforcement
- Fail if `BRD_LINK` missing.
- Fail if BRD does not include the required approval comment: `Approved from Business`.
- Fail if BRD approval comment author is not in org governance business approver allowlist.
- Fail if team routing/approval validation fails.
- Fail if publish to Confluence does not succeed.
