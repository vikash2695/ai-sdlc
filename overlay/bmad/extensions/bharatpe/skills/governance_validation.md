# Governance Validation

## Purpose
Enforce stage gates for BRD -> PRD -> Architecture -> Jira -> Dev with fail-fast behavior.

## Mandatory Checks by Stage
### Team Routing (applies to PRD/Jira/Dev stages)
- Resolve team from workspace config (`governance.active_team`) or fallback to `governance.default_team`.
- Load org governance catalog from `config.yaml -> governance.org_governance_file`.
- Ensure team exists in org catalog `governance.teams`.
- Ensure Jira issue project key matches team `jira_project_key`.
- Ensure Confluence targets match team `confluence_space_key` for generated docs.

### BRD
- Output must be published to Confluence.
- Local-only BRD output is not allowed.

### PRD
- `BRD_LINK` must exist and be resolvable.
- BRD approval evidence is mandatory before PRD generation:
  - A Confluence comment on BRD must have exact text: `Approved from Business`.
  - The comment author email must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.brd.business.approvers`.
  - Do not accept approval from non-allowlisted users, even if the comment text matches.
- PRD content must include lineage: `Derived From: <BRD_LINK>`.
- PRD must be published to Confluence.
- PRD stage approvals must match team allowlist in config:
- PRD stage approvals must match team allowlist in org governance catalog:
  - `Approval - Business: <approver-id-or-email>`
  - `Approval - Product: <approver-id-or-email>`

### Architecture
- `PRD_LINK` must exist and be resolvable.
- Architecture content must include lineage: `Derived From: <PRD_LINK>`.
- Architecture must be published to Confluence.

### Jira (TPM / Story creation)
- Every created Epic/Story must include:
  - `PRD` Confluence link
  - `Architecture` Confluence link
- References must be in a stable `## References` block.

### Dev
- Jira issue must include PRD + Architecture links.
- Jira must contain comment exactly: `Architecture - Approved by EM`.
- Issue must be assigned to the MCP-connected user.
- Issue must be moved to `In Progress` before dev execution.
- Hydration files must exist before base dev agent invocation.
- Dev stage approvals must match team allowlist in config:
- Dev stage approvals must match team allowlist in org governance catalog:
  - `Approval - Tech: <approver-id-or-email>`
  - `Approval - Team: <approver-id-or-email>`

## Enforcement
- On any failed check: stop immediately and return:
  - failed_check_id
  - reason
  - remediation
