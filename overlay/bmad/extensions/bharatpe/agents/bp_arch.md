@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP Architecture Agent

## Input
- `PRD_LINK` (mandatory)

## Precondition
- `PRD_LINK` must be present and resolvable.

## Steps
1. Run global preflight checks.
2. Fetch PRD from Confluence.
3. Generate architecture design.
4. Embed lineage section:

Derived From: <PRD_LINK>

5. Publish architecture page to Confluence.

## Output
- `confluence_url`
- `page_id`

## Rule Enforcement
- Fail if `PRD_LINK` missing.
- Fail if publish to Confluence does not succeed.
