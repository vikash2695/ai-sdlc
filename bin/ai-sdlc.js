#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const BMAD_VERSION = "6.2.0";

function parseArgs(argv) {
  const parsed = {
    directory: process.cwd(),
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      parsed.help = true;
      continue;
    }
    if (arg === "-d" || arg === "--directory") {
      parsed.directory = argv[i + 1] ? path.resolve(argv[i + 1]) : parsed.directory;
      i += 1;
      continue;
    }
  }

  return parsed;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: ai-sdlc [options]",
      "",
      "Installs BMAD core + BMAD SDLC module in normal mode,",
      "then applies BharatPe extension and command customizations.",
      "",
      "Options:",
      "  -d, --directory <path>  Target workspace (default: current directory)",
      "  -h, --help              Show help"
    ].join("\n") + "\n"
  );
}

function ensureDirectory(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
}

function runBmadInstall(targetDir) {
  const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = [
    "-y",
    `bmad-method@${BMAD_VERSION}`,
    "install",
    "--directory",
    targetDir,
    "--modules",
    "core,bmm",
    "--tools",
    "cursor",
    "-y"
  ];

  const result = spawnSync(npxBin, args, {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(
      "BMAD install failed. Please run `npx -y bmad-method@" +
        BMAD_VERSION +
        " install --directory \"" +
        targetDir +
        "\" --modules core,bmm -y` manually to inspect details."
    );
  }
}

function validateRequiredModules(targetDir) {
  const manifestPath = path.join(targetDir, "_bmad", "_config", "manifest.yaml");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      "BMAD manifest not found at `" +
        manifestPath +
        "`. Installation may be incomplete."
    );
  }

  const manifestContent = fs.readFileSync(manifestPath, "utf8");
  const hasCore = /-\s+name:\s+core\b/.test(manifestContent);
  const hasBmm = /-\s+name:\s+bmm\b/.test(manifestContent);

  if (!hasCore || !hasBmm) {
    throw new Error(
      "Required modules missing in manifest. Expected both `core` and `bmm`."
    );
  }

  process.stdout.write("Verified modules: core + bmm\n");
}

function copyOverlay(targetDir) {
  const overlayRoot = path.resolve(__dirname, "..", "overlay");
  const entries = fs.readdirSync(overlayRoot, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(overlayRoot, entry.name);
    const destinationPath = path.join(targetDir, entry.name);

    fs.cpSync(sourcePath, destinationPath, {
      recursive: true,
      force: true
    });
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const targetDir = path.resolve(args.directory);
  ensureDirectory(targetDir);

  process.stdout.write(
    "Installing BMAD core + SDLC module (normal mode), pinned to v" +
      BMAD_VERSION +
      "...\n"
  );
  runBmadInstall(targetDir);
  validateRequiredModules(targetDir);
  process.stdout.write("Applying ai-sdlc overlays...\n");
  copyOverlay(targetDir);
  process.stdout.write("Setup complete. Workspace is ready.\n");
}

try {
  main();
} catch (error) {
  process.stderr.write("ai-sdlc failed: " + error.message + "\n");
  process.exit(1);
}
