@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP Architecture Agent

## Input
- `PRD_LINK` (mandatory)

## Precondition
- `PRD_LINK` must be present and resolvable.
- PRD must include a product-owner approval comment with exact text: `Approved from Product`.
- Approval comment author must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.prd.product.approvers`.

## Steps
1. Run global preflight checks.
2. Validate team routing and Architecture-stage approval dependency:
   - Jira/Confluence target alignment for team
   - PRD Product approval allowlist match
   - PRD approval comment text check: `Approved from Product`
   - PRD approval commenter identity check against product-owner allowlist
3. Fetch PRD from Confluence.
4. Generate architecture design.
5. Embed lineage section:

Derived From: <PRD_LINK>

6. Publish architecture page to Confluence.

## Output
- `confluence_url`
- `page_id`

## Rule Enforcement
- Fail if `PRD_LINK` missing.
- Fail if PRD does not include the required approval comment: `Approved from Product`.
- Fail if PRD approval comment author is not in org governance product approver allowlist.
- Fail if team routing/approval validation fails.
- Fail if publish to Confluence does not succeed.
