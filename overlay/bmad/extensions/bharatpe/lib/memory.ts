import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface HydratedMemoryFiles {
  memoryDir: string;
  prdPath: string;
  architecturePath: string;
  contextSummaryPath: string;
  decisionsPath: string;
}

export function issueMemoryDir(basePath: string, jiraId: string): string {
  return path.join(basePath, jiraId);
}

export async function ensureIssueMemory(basePath: string, jiraId: string): Promise<HydratedMemoryFiles> {
  const memoryDir = issueMemoryDir(basePath, jiraId);
  await mkdir(memoryDir, { recursive: true });

  const files: HydratedMemoryFiles = {
    memoryDir,
    prdPath: path.join(memoryDir, "prd.md"),
    architecturePath: path.join(memoryDir, "architecture.md"),
    contextSummaryPath: path.join(memoryDir, "context_summary.md"),
    decisionsPath: path.join(memoryDir, "decisions.md"),
  };

  await ensureFile(files.decisionsPath, "# Decisions\n\n");
  return files;
}

async function ensureFile(filePath: string, initial: string): Promise<void> {
  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, initial, "utf8");
  }
}

export async function writeHydratedContext(
  files: HydratedMemoryFiles,
  data: {
    prd: string;
    architecture: string;
    contextSummary: string;
  },
): Promise<void> {
  await Promise.all([
    writeFile(files.prdPath, data.prd, "utf8"),
    writeFile(files.architecturePath, data.architecture, "utf8"),
    writeFile(files.contextSummaryPath, data.contextSummary, "utf8"),
  ]);
}

export async function appendDecision(files: HydratedMemoryFiles, decision: string): Promise<void> {
  const trimmed = decision.trim();
  if (!trimmed) return;

  const entry = `- ${trimmed}\n`;
  await writeFile(files.decisionsPath, entry, { encoding: "utf8", flag: "a" });
}
