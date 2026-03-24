@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP Architecture Agent

## Input
- `PRD_LINK` (mandatory)
- `TRACKER_EPIC_ID` (mandatory)

## Precondition
- `PRD_LINK` must be present and resolvable.
- `TRACKER_EPIC_ID` must exist and be resolvable.
- PRD page must include tracker Epic reference matching `TRACKER_EPIC_ID`.
- PRD must include a product-owner approval comment with exact text: `Approved from Product`.
- Approval comment author must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.prd.product.approvers`.

## Steps
1. Run global preflight checks.
2. Validate team routing and Architecture-stage approval dependency:
   - Jira/Confluence target alignment for team
   - PRD Product approval allowlist match
   - PRD approval comment text check: `Approved from Product`
   - PRD approval commenter identity check against product-owner allowlist
   - Tracker status transition check:
     - PRD is in `READY_FOR_ARCHITECTURE` before architecture start
     - move tracker to `ARCHITECTURE_DRAFT` at generation start
3. Fetch PRD from Confluence.
4. Generate architecture design.
   - Embed tracker reference in page body:
     - `Tracker Epic: <TRACKER_EPIC_ID or URL>`
5. Embed lineage section:

Derived From: <PRD_LINK>

6. Publish architecture page to Confluence.
7. Update tracker Epic:
   - attach Architecture link
   - move to `ARCHITECTURE_AWAITING_EM_REVIEW` for EM review queue
   - on approval move to `READY_FOR_TECH`

## Output
- `tracker_epic_id`
- `confluence_url`
- `page_id`

## Rule Enforcement
- Fail if `PRD_LINK` missing.
- Fail if `TRACKER_EPIC_ID` missing.
- Fail if PRD does not include tracker Epic reference.
- Fail if Architecture page is published without tracker Epic reference.
- Fail if PRD does not include the required approval comment: `Approved from Product`.
- Fail if PRD approval comment author is not in org governance product approver allowlist.
- Fail if team routing/approval validation fails.
- Fail if publish to Confluence does not succeed.
