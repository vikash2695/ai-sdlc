# Cursor Command Mapping

Use these aliases in Cursor to invoke BharatPe wrapper agents.

- `/bp-brd` -> `bmad/extensions/bharatpe/agents/bp_brd.md`
- `/bp-prd` -> `bmad/extensions/bharatpe/agents/bp_prd.md`
- `/bp-arch` -> `bmad/extensions/bharatpe/agents/bp_arch.md`
- `/bp-tpm` -> `bmad/extensions/bharatpe/agents/bp_tpm.md`
- `/bp-dev` -> `bmad/extensions/bharatpe/agents/bp_dev.md`
- `/bp-validate-stage` -> `bmad/extensions/bharatpe/agents/bp_validate_stage.md`

## Installed Slash Command Files

These command entrypoints are installed under:
- `.cursor/commands/bp-brd.md`
- `.cursor/commands/bp-prd.md`
- `.cursor/commands/bp-arch.md`
- `.cursor/commands/bp-tpm.md`
- `.cursor/commands/bp-dev.md`
- `.cursor/commands/bp-validate-stage.md`

## Resolution Order
1. Run global preflight
2. Run command-specific checks
3. Execute wrapper flow
4. Enforce publish/linking post-checks

## Redundancy Policy
- `.cursor/commands/*` files should stay thin dispatchers (load target agent + required inputs).
- Detailed workflow steps, governance gates, and fail-fast rules must live in `agents/*` and `skills/*`.
- Avoid duplicating policy text across command files and agent files to prevent drift.
