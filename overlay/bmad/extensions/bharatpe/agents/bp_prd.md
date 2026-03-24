@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP PRD Agent

## Input
- `BRD_LINK` (mandatory)
- `TRACKER_EPIC_ID` (optional if resolvable from BRD tracker reference)

## Precondition
- `BRD_LINK` must be present and resolvable.
- `TRACKER_EPIC_ID` must exist and be resolvable when provided.
- If `TRACKER_EPIC_ID` is not provided, resolve it from BRD tracker Epic reference.
- BRD page must include tracker Epic reference.
- If both BRD tracker reference and `TRACKER_EPIC_ID` are provided, they must match.
- BRD must include a business-owner approval comment with exact text: `Approved from Business`.
- Approval comment author must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.brd.business.approvers`.

## Steps
1. Run global preflight checks.
2. Resolve tracker Epic for PRD run:
   - Use provided `TRACKER_EPIC_ID` when supplied.
   - Else parse BRD tracker Epic reference and derive `TRACKER_EPIC_ID`.
3. Validate team routing and PRD-stage approvals against config:
   - Jira/Confluence target alignment for team
   - Business + Product approvals allowlist match
   - BRD approval comment text check: `Approved from Business`
   - BRD approval commenter identity check against business-owner allowlist
   - Tracker status transition check for product handoff:
     - `READY_FOR_PRD` before PRD drafting
     - move to `PRD_DRAFT` at generation start
4. Fetch BRD from Confluence via `BRD_LINK`.
5. Generate PRD.
   - Embed tracker reference in page body:
     - `Tracker Epic: <TRACKER_EPIC_ID or URL>`
6. Embed lineage section:

Derived From: <BRD_LINK>

7. Publish PRD to team-mapped Confluence space.
8. Update tracker Epic:
   - attach PRD link
   - move to `PRD_AWAITING_TECH_REVIEW` for tech review queue
   - move to `READY_FOR_ARCHITECTURE` for architecture handoff

## Output
- `tracker_epic_id`
- `confluence_url`
- `page_id`

## Rule Enforcement
- Fail if `BRD_LINK` missing.
- Fail if `TRACKER_EPIC_ID` missing and cannot be resolved from BRD tracker reference.
- Fail if BRD does not include tracker Epic reference.
- Fail if provided `TRACKER_EPIC_ID` conflicts with BRD tracker reference.
- Fail if PRD page is published without tracker Epic reference.
- Fail if BRD does not include the required approval comment: `Approved from Business`.
- Fail if BRD approval comment author is not in org governance business approver allowlist.
- Fail if team routing/approval validation fails.
- Fail if publish to Confluence does not succeed.
