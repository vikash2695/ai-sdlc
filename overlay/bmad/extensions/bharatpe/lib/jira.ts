import {
  parseReferencesBlock,
  renderReferencesBlock,
  type GovernanceRoutingConfig,
  type GovernanceStage,
  type ReferencesBlock,
  type StageApprovalConfig,
} from "./contracts";

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary?: string;
    description?: string;
    assignee?: { accountId?: string; displayName?: string } | null;
    status?: { name?: string };
    [k: string]: unknown;
  };
  comments?: Array<{ body?: string; author?: { accountId?: string; displayName?: string; emailAddress?: string } }>;
}

export interface JiraApi {
  getIssue(issueId: string): Promise<JiraIssue>;
  addComment(issueId: string, comment: string): Promise<void>;
  transitionIssue(issueId: string, targetStatus: string): Promise<void>;
  createIssue(payload: Record<string, unknown>): Promise<{ id: string; key: string }>;
}

export interface DevReadinessResult {
  ready: boolean;
  missing: string[];
  references: ReferencesBlock;
}

export interface TeamGovernanceValidationResult {
  ready: boolean;
  team?: string;
  missing: string[];
}

const CONFLUENCE_URL_RE = /https?:\/\/[^\s)]+\/wiki\/[^\s)]+/gi;

export async function getJiraIssue(api: JiraApi, issueId: string): Promise<JiraIssue> {
  return api.getIssue(issueId);
}

export function extractLinksFromJira(issue: JiraIssue): ReferencesBlock {
  const description = String(issue.fields.description ?? "");
  const refsFromBlock = parseReferencesBlock(description);

  const urls = description.match(CONFLUENCE_URL_RE) ?? [];
  const refs = { ...refsFromBlock };

  for (const url of urls) {
    const lower = url.toLowerCase();
    if (!refs.prd && lower.includes("prd")) refs.prd = url;
    if (!refs.architecture && (lower.includes("architecture") || lower.includes("hld") || lower.includes("lld"))) {
      refs.architecture = url;
    }
    if (!refs.brd && lower.includes("brd")) refs.brd = url;
  }

  return refs;
}

export function extractTeamFromJira(issue: JiraIssue): string | undefined {
  // Team is expected to be resolved from workspace config.
  // Kept for backward compatibility, but no longer required.
  const description = String(issue.fields.description ?? "");
  const teamMatch = description.match(/^-\s*Team:\s*(.+)$/im) ?? description.match(/^Team:\s*(.+)$/im);
  return teamMatch?.[1]?.trim();
}

function normalize(v: string): string {
  return v.trim().toLowerCase();
}

function isApprovalSignal(commentBody: string, role: "business" | "product" | "tech" | "team"): boolean {
  const roleName = role[0].toUpperCase() + role.slice(1);
  const body = commentBody.toLowerCase();
  if (body.includes("architecture - approved by em")) return role === "tech";
  if (body.includes("approval")) return true;
  if (body.includes("approved")) return true;
  if (body.includes(`approval - ${roleName.toLowerCase()}`)) return true;
  if (body.includes(`approved - ${roleName.toLowerCase()}`)) return true;
  return false;
}

function getApprovalValues(issue: JiraIssue, role: "business" | "product" | "tech" | "team"): string[] {
  const roleName = role[0].toUpperCase() + role.slice(1);
  const values: string[] = [];

  // Comment author metadata is the primary approval evidence.
  for (const comment of issue.comments ?? []) {
    const body = comment.body ?? "";
    const inlinePattern = new RegExp(`Approval\\s*-\\s*${roleName}\\s*:\\s*(.+)$`, "im");
    const inlineMatch = body.match(inlinePattern);
    if (inlineMatch?.[1]) {
      values.push(inlineMatch[1].trim());
    }
    if (!isApprovalSignal(body, role)) continue;
    if (comment.author?.accountId) values.push(comment.author.accountId);
    if (comment.author?.displayName) values.push(comment.author.displayName);
    if (comment.author?.emailAddress) values.push(comment.author.emailAddress);
    values.push("__ROLE_ONLY__");
  }

  return values;
}

function validateRoleApprovals(
  issue: JiraIssue,
  role: "business" | "product" | "tech" | "team",
  config?: { required?: boolean; approvers?: string[] },
): string[] {
  if (!config?.required) return [];

  const approvals = getApprovalValues(issue, role);
  if (approvals.length === 0) {
    return [`Missing required ${role} approval`];
  }

  const allowed = (config.approvers ?? []).map(normalize);
  if (allowed.length === 0) {
    return [];
  }

  const matched = approvals.some((value) => allowed.includes(normalize(value)));
  if (!matched) {
    return [
      `No approved ${role} approver matched allowlist. Expected one of: ${config.approvers.join(", ")}`,
    ];
  }
  return [];
}

function validateStageApprovals(issue: JiraIssue, stageConfig?: StageApprovalConfig): string[] {
  if (!stageConfig) return [];
  return [
    ...validateRoleApprovals(issue, "business", stageConfig.business),
    ...validateRoleApprovals(issue, "product", stageConfig.product),
    ...validateRoleApprovals(issue, "tech", stageConfig.tech),
    ...validateRoleApprovals(issue, "team", stageConfig.team),
  ];
}

export function validateTeamGovernance(
  issue: JiraIssue,
  stage: GovernanceStage,
  routing: GovernanceRoutingConfig,
): TeamGovernanceValidationResult {
  const missing: string[] = [];
  const team = routing.active_team || routing.default_team;

  if (!team) {
    missing.push("No configured team found (set governance.active_team/default_team in config)");
    return { ready: false, missing };
  }

  const teamConfig = routing.teams[team];
  if (!teamConfig) {
    missing.push(`No team routing config found for '${team}'`);
    return { ready: false, team, missing };
  }

  const projectKey = issue.key.split("-")[0];
  if (normalize(projectKey) !== normalize(teamConfig.jira_project_key)) {
    missing.push(
      `Issue project '${projectKey}' does not match team '${team}' project '${teamConfig.jira_project_key}'`,
    );
  }

  const stageConfig = teamConfig.stage_approvals?.[stage];
  missing.push(...validateStageApprovals(issue, stageConfig));

  return { ready: missing.length === 0, team, missing };
}

export const extractLinks = extractLinksFromJira;

export function validateDevReadiness(issue: JiraIssue, currentAccountId?: string): DevReadinessResult {
  const missing: string[] = [];
  const references = extractLinksFromJira(issue);

  if (!references.prd) missing.push("Missing PRD link in Jira issue");
  if (!references.architecture) missing.push("Missing Architecture link in Jira issue");

  const assignee = issue.fields.assignee?.accountId;
  if (currentAccountId && assignee && assignee !== currentAccountId) {
    missing.push("Jira issue is assigned to a different user");
  }

  const hasEmApproval = (issue.comments ?? []).some(
    (comment) => (comment.body ?? "").trim() === "Architecture - Approved by EM",
  );
  if (!hasEmApproval) {
    missing.push("Missing required Jira comment: Architecture - Approved by EM");
  }

  return { ready: missing.length === 0, missing, references };
}

export function appendReferencesToDescription(
  existingDescription: string,
  refs: ReferencesBlock,
): string {
  const base = existingDescription.trim();
  const block = renderReferencesBlock(refs);

  if (!base) return block;
  if (base.includes("## References")) return base;
  return `${base}\n\n${block}`;
}

export async function addComment(api: JiraApi, issueId: string, comment: string): Promise<void> {
  await api.addComment(issueId, comment);
}

export async function moveToInProgressIfNeeded(api: JiraApi, issue: JiraIssue): Promise<void> {
  const status = issue.fields.status?.name?.toLowerCase() ?? "";
  if (status !== "in progress") {
    await api.transitionIssue(issue.key, "In Progress");
  }
}
