# Global Preflight

## Purpose
Ensure system readiness before any BharatPe wrapper agent executes.

## Inputs
- `JIRA_ID` (required for story-driven flows)
- Command-specific required links (`BRD_LINK`, `PRD_LINK`, `ARCH_LINK`)

## Fail-Fast Checks
1. Validate required MCP connectivity:
   - Atlassian Jira (read/write)
   - Atlassian Confluence (read/write)
2. Validate authentication:
   - Active account has permission to read/write Jira and Confluence spaces.
3. Validate required environment:
   - Required secrets/tokens are available through MCP auth flow.
4. Validate required runtime inputs:
   - Required IDs/links are present and non-empty.

## Enforcement
- If **any** check fails, stop execution immediately.
- Return a clear error plus a remediation action.
- Never continue with partial readiness.

## Output
- `preflight_status: pass | fail`
- `validated_inputs`
- `blocking_errors[]` (empty if pass)
