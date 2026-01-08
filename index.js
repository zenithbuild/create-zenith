#!/usr/bin/env node
/**
 * create-zenith
 * 
 * Thin resolver adapter for bun/npm/npx/pnpm create zenith.
 * Delegates directly to @zenithbuild/cli create with all arguments.
 * 
 * This package contains NO framework logic, NO build logic, NO scaffolding logic.
 * It is a permanent proxy and should never grow features.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

// Check if we're in the monorepo development context
// (zenith-cli is a sibling directory)
function getLocalCLIPath() {
    const monorepoCliPath = join(__dirname, "..", "zenith-cli", "bin", "zenith");
    if (existsSync(monorepoCliPath)) {
        return monorepoCliPath;
    }
    return null;
}

// Detect if Bun is available
function hasBun() {
    try {
        const result = spawnSync("bun", ["--version"], { stdio: "pipe" });
        return result.status === 0;
    } catch {
        return false;
    }
}

// Try to find the zenith CLI
const localCLI = getLocalCLIPath();

if (localCLI) {
    // Development mode: use local CLI directly
    const child = spawn("bun", [localCLI, "create", ...args], { stdio: "inherit" });
    child.on("exit", (code) => process.exit(code ?? 0));
} else {
    // Production mode: use package manager to resolve @zenithbuild/cli
    const useBun = hasBun();
    const runner = useBun ? "bunx" : (process.platform === "win32" ? "npx.cmd" : "npx");
    const runnerArgs = ["@zenithbuild/cli", "create", ...args];

    const child = spawn(runner, runnerArgs, { stdio: "inherit" });
    child.on("exit", (code) => process.exit(code ?? 0));
}
