@bharatpe/skills/global_preflight
@bharatpe/skills/governance_validation

# BP BRD Agent

## Task
Generate BRD and publish it to Confluence.

## Inputs
- `BUSINESS_CONTEXT` (required)
- Optional: `TRACKER_EPIC_ID`
- Optional: `SPACE_KEY`, `PARENT_PAGE_ID`

## Steps
1. Run global preflight checks.
2. Create or resolve a single tracker Epic for this initiative:
   - If `TRACKER_EPIC_ID` is provided, reuse it.
   - Else create tracker Epic in Jira project `config.yaml -> governance.tracker_epic_jira_project_key` (default: `SDLC`).
   - Initialize status as `TODO`, then move to `BRD_DRAFT` and assign to business owner bucket.
   - Resolve full tracker URL as `TRACKER_EPIC_URL = <jira-base-url>/browse/<TRACKER_EPIC_ID>`.
3. Generate BRD content from business context.
   - Embed tracker reference in page body:
     - `Tracker Epic: [<TRACKER_EPIC_ID>](<TRACKER_EPIC_URL>)`
     - Do not publish key-only text like `Tracker Epic: SDLC-123`.
4. Publish BRD using `confluence.createPage`.
5. Update tracker Epic with BRD link and stage handoff statuses:
   - `BRD_AWAITING_PRODUCT_REVIEW` after business sign-off and PM handoff
6. Return publish metadata:
   - `tracker_epic_id`
   - `confluence_url`
   - `page_id`

## Rule Enforcement
- Mandatory publish: no local-only BRD output allowed.
- Fail if tracker Epic cannot be created/resolved.
- Fail if BRD page is published without tracker Epic reference.
- Fail if BRD tracker reference is not a full Jira URL link.
- If publish fails, mark run as failed and return remediation.
