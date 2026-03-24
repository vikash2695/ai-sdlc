export type DocumentType = "BRD" | "PRD" | "ARCHITECTURE";
export type GovernanceStage = "prd" | "architecture" | "jira" | "dev";

export interface ReferencesBlock {
  brd?: string;
  prd?: string;
  architecture?: string;
}

export interface MetadataBlock {
  type: DocumentType;
  derived_from?: string;
}

export interface PublishResult {
  url: string;
  id: string;
}

export interface ApprovalRoleConfig {
  required: boolean;
  approvers: string[];
}

export interface StageApprovalConfig {
  business?: ApprovalRoleConfig;
  product?: ApprovalRoleConfig;
  tech?: ApprovalRoleConfig;
  team?: ApprovalRoleConfig;
}

export interface TeamRoutingConfig {
  jira_project_key: string;
  confluence_space_key: string;
  stage_approvals?: Partial<Record<GovernanceStage, StageApprovalConfig>>;
}

export interface GovernanceRoutingConfig {
  active_team?: string;
  default_team?: string;
  org_governance_file?: string;
  teams: Record<string, TeamRoutingConfig>;
}

const LINK_PREFIX = "- ";

export function renderReferencesBlock(refs: ReferencesBlock): string {
  return [
    "## References",
    `${LINK_PREFIX}BRD: ${refs.brd ?? ""}`,
    `${LINK_PREFIX}PRD: ${refs.prd ?? ""}`,
    `${LINK_PREFIX}Architecture: ${refs.architecture ?? ""}`,
  ].join("\n");
}

export function renderMetadataBlock(meta: MetadataBlock): string {
  const lines = ["---", `type: ${meta.type}`];
  if (meta.derived_from) {
    lines.push(`derived_from: ${meta.derived_from}`);
  }
  lines.push("---");
  return lines.join("\n");
}

export function parseReferencesBlock(text: string): ReferencesBlock {
  const refs: ReferencesBlock = {};

  const brd = text.match(/^-\s*BRD:\s*(.+)$/im);
  const prd = text.match(/^-\s*PRD:\s*(.+)$/im);
  const architecture = text.match(/^-\s*Architecture:\s*(.+)$/im);

  if (brd?.[1]) refs.brd = brd[1].trim();
  if (prd?.[1]) refs.prd = prd[1].trim();
  if (architecture?.[1]) refs.architecture = architecture[1].trim();

  return refs;
}
