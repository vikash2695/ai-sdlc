@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP Architecture Agent

## Input
- `PRD_LINK` (mandatory)
- `TRACKER_EPIC_ID` (optional if resolvable from PRD tracker reference)

## Precondition
- `PRD_LINK` must be present and resolvable.
- `TRACKER_EPIC_ID` must exist and be resolvable when provided.
- If `TRACKER_EPIC_ID` is not provided, resolve it from the PRD page tracker Epic reference (same label and full Jira URL rules as BRD/PRD).
- PRD page must include tracker Epic reference.
- If both PRD tracker reference and `TRACKER_EPIC_ID` are provided, they must match.
- PRD must include a product-owner approval comment with exact text: `Approved from Product`.
- Approval comment author must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.prd.product.approvers`.

## Steps
1. Run global preflight checks.
2. Resolve tracker Epic for Architecture run:
   - Use provided `TRACKER_EPIC_ID` when supplied.
   - Else fetch PRD from Confluence via `PRD_LINK`, parse tracker Epic reference, and derive `TRACKER_EPIC_ID`.
3. Validate team routing and Architecture-stage approval dependency:
   - Jira/Confluence target alignment for team
   - PRD Product approval allowlist match
   - PRD approval comment text check: `Approved from Product`
   - PRD approval commenter identity check against product-owner allowlist
   - Tracker status transition check:
     - PRD is in `READY_FOR_ARCHITECTURE` before architecture start
     - move tracker to `ARCHITECTURE_DRAFT` at generation start
4. Fetch PRD from Confluence (if not already loaded for tracker resolution).
5. Generate architecture design.
   - Embed tracker reference in page body:
     - `Tracker Epic: <TRACKER_EPIC_ID or URL>`
6. Embed lineage section:

Derived From: <PRD_LINK>

7. Publish architecture page to Confluence.
8. Update tracker Epic:
   - attach Architecture link
   - move to `ARCHITECTURE_AWAITING_EM_REVIEW` for EM review queue
   - on approval move to `READY_FOR_TECH`

## Output
- `tracker_epic_id`
- `confluence_url`
- `page_id`

## Rule Enforcement
- Fail if `PRD_LINK` missing.
- Fail if `TRACKER_EPIC_ID` missing and cannot be resolved from PRD tracker reference.
- Fail if PRD does not include tracker Epic reference.
- Fail if provided `TRACKER_EPIC_ID` conflicts with PRD tracker reference.
- Fail if Architecture page is published without tracker Epic reference.
- Fail if PRD does not include the required approval comment: `Approved from Product`.
- Fail if PRD approval comment author is not in org governance product approver allowlist.
- Fail if team routing/approval validation fails.
- Fail if publish to Confluence does not succeed.
