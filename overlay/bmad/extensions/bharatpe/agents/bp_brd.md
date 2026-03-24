@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP BRD Agent

## Task
Generate BRD and publish it to Confluence.

## Inputs
- `BUSINESS_CONTEXT` (required)
- Optional: `SPACE_KEY`, `PARENT_PAGE_ID`

## Steps
1. Run global preflight checks.
2. Generate BRD content from business context.
3. Publish BRD using `confluence.createPage`.
4. Return publish metadata:
   - `confluence_url`
   - `page_id`

## Rule Enforcement
- Mandatory publish: no local-only BRD output allowed.
- If publish fails, mark run as failed and return remediation.
