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
- Tracker Epic governance starts at BRD:
  - Create or resolve a single tracker Epic for the initiative.
  - Initialize tracker in `TODO`, then set status to `BRD_DRAFT` at BRD start.
  - BRD Confluence page must include tracker Epic reference (`Tracker Epic: <EPIC_KEY_OR_URL>`).
  - On business sign-off, move tracker status to `BRD_AWAITING_PRODUCT_REVIEW`.

### PRD
- Tracker Epic must already exist for the initiative before PRD generation.
- Source BRD page must already include tracker Epic reference.
- Tracker status flow for PRD stage:
  - Before generation handoff: `READY_FOR_PRD`
  - While PRD drafting: `PRD_DRAFT`
  - During tech review: `PRD_AWAITING_TECH_REVIEW`
  - Handoff checkpoint to architecture: `READY_FOR_ARCHITECTURE`
- `BRD_LINK` must exist and be resolvable.
- BRD approval evidence is mandatory before PRD generation:
  - A Confluence comment on BRD must have exact text: `Approved from Business`.
  - The comment author email must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.brd.business.approvers`.
  - Do not accept approval from non-allowlisted users, even if the comment text matches.
- PRD content must include lineage: `Derived From: <BRD_LINK>`.
- PRD Confluence page must include the same tracker Epic reference carried from BRD.
- PRD must be published to Confluence.
- PRD stage approvals must match team allowlist in config:
- PRD stage approvals must match team allowlist in org governance catalog:
  - `Approval - Business: <approver-id-or-email>`
  - `Approval - Product: <approver-id-or-email>`

### Architecture
- Tracker Epic must already exist for the initiative before Architecture generation.
- Source PRD page must already include tracker Epic reference.
- Tracker status flow for Architecture stage:
  - While architecture drafting: `ARCHITECTURE_DRAFT`
  - During EM review: `ARCHITECTURE_AWAITING_EM_REVIEW`
  - On EM acceptance/handoff: `READY_FOR_TECH`
- `PRD_LINK` must exist and be resolvable.
- PRD approval evidence is mandatory before Architecture generation:
  - A Confluence comment on PRD must have exact text: `Approved from Product`.
  - The comment author email must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.prd.product.approvers`.
  - Do not accept approval from non-allowlisted users, even if the comment text matches.
- Architecture content must include lineage: `Derived From: <PRD_LINK>`.
- Architecture Confluence page must include the same tracker Epic reference carried from PRD/BRD.
- Architecture must be published to Confluence.

### Jira (TPM / Story creation)
- Tracker Epic must already exist before epic/story decomposition.
- Tracker status flow for Jira stage:
  - Before decomposition: `READY_FOR_TECH`
  - After Epic/Story creation: remain in `READY_FOR_TECH` (no additional status required)
- PRD Product approval evidence is mandatory before Epic/Story creation:
  - A Confluence comment on PRD must have exact text: `Approved from Product`.
  - The comment author email must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.prd.product.approvers`.
  - Do not accept approval from non-allowlisted users, even if the comment text matches.
- Architecture EM approval evidence is mandatory before Epic/Story creation:
  - A Confluence comment on Architecture must have exact text: `Architecture Approved for implmentation`.
  - The comment author email must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.architecture.em.approvers`.
  - Do not accept approval from non-allowlisted users, even if the comment text matches.
- Every created Epic/Story must include:
  - `PRD` Confluence link
  - `Architecture` Confluence link
- References must be in a stable `## References` block.

### Dev
- Jira issue must include PRD + Architecture links.
- Jira EM approval evidence is mandatory before dev execution:
  - A Jira comment on the issue must have exact text: `Approved for Development`.
  - The comment author email must be allowlisted in `org-governance.yaml -> governance.teams.<team>.stage_approvals.dev.em.approvers`.
  - Do not accept approval from non-allowlisted users, even if the comment text matches.
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
