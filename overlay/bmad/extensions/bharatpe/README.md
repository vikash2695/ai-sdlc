# BharatPe BMAD Extension Layer

This folder provides a non-invasive orchestration layer that wraps BMAD core behavior without changing core files.

## Design Rules
- Never modify `bmad/core/*` from this extension.
- Wrapper agents run **pre-hooks -> base agent -> post-hooks**.
- JIRA and Confluence are the source of truth.
- Local files under `memory/` are cache/hydration artifacts only.

## Layout
- `agents/`: slash-command wrapper agents (`bp_*`).
- `skills/`: reusable preflight and hydration skills.
- `lib/`: thin Jira/Confluence SDK and shared contracts.
- `memory/`: persistent per-JIRA working context.

## Standard Blocks
### References block
```md
## References
- BRD: <url>
- PRD: <url>
- Architecture: <url>
```

### Team routing source
- Team is resolved from local workspace config:
  - `config.yaml -> governance.active_team`
  - fallback: `config.yaml -> governance.default_team`
- Team/project/space/approval matrix is loaded from:
  - `config.yaml -> governance.org_governance_file`
  - default file: `governance/org-governance.yaml`
- Jira issue description does not need team metadata.

### Approval markers (Jira description/comments)
```md
Approval - Business: <approver-id-or-email>
Approval - Product: <approver-id-or-email>
Approval - Tech: <approver-id-or-email>
Approval - Team: <approver-id-or-email>
```

Approvals are matched against allowlists defined in `governance/org-governance.yaml -> governance.teams.<team>.stage_approvals`.
Approval evidence is read primarily from Jira comments (author identity + approval signal text).

### BRD -> PRD gate
- PRD generation requires BRD approval evidence in Confluence comments.
- Required approval comment text on BRD: `Approved from Business`.
- Approval is valid only when commenter email exists in `governance/org-governance.yaml -> governance.teams.<team>.stage_approvals.brd.business.approvers`.
- Wrapper must fail fast if this comment is missing.

### PRD -> Architecture gate
- Architecture generation requires PRD approval evidence in Confluence comments.
- Required approval comment text on PRD: `Approved from Product`.
- Approval is valid only when commenter email exists in `governance/org-governance.yaml -> governance.teams.<team>.stage_approvals.prd.product.approvers`.
- Wrapper must fail fast if this comment is missing.

### Jira -> Dev gate
- Dev execution requires Jira approval evidence from team-defined EM reviewers.
- Required approval comment text on Jira: `Approved for Development`.
- Approval is valid only when commenter email exists in `governance/org-governance.yaml -> governance.teams.<team>.stage_approvals.dev.em.approvers`.
- Wrapper must fail fast if this comment is missing.

### PRD + Architecture -> Jira gate
- Epic/Story creation requires approvals on source Confluence documents.
- Required PRD comment text: `Approved from Product` (author must be in `governance.teams.<team>.stage_approvals.prd.product.approvers`).
- Required Architecture comment text: `Architecture Approved for implmentation` (author must be in `governance.teams.<team>.stage_approvals.architecture.em.approvers`).
- Wrapper must fail fast before story breaking if either approval is missing.

### Metadata block
```md
---
type: PRD
derived_from: <BRD_URL>
---
```

## Exposed commands
- `/bp-brd` -> `agents/bp_brd.md`
- `/bp-prd` -> `agents/bp_prd.md`
- `/bp-arch` -> `agents/bp_arch.md`
- `/bp-tpm` -> `agents/bp_tpm.md`
- `/bp-dev` -> `agents/bp_dev.md`
- `/bp-validate-stage` -> `agents/bp_validate_stage.md`
