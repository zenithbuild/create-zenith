# CREATE_CONTRACT.md — Sealed Scaffolder Interface

> This document is a legal boundary.
> `create-zenith` is a deterministic file generator.
> It does not execute package-manager-specific logic.

## Status: FROZEN (V0)

## 1. Identity

`create-zenith` generates new Zenith project folders from static local presets.

It is:
- deterministic
- file-system only
- package-manager neutral

It is not:
- a downloader
- a runtime resolver
- an environment-dependent templating engine

## 2. Allowed Responsibilities

`create-zenith` may:
- parse CLI input (`project name`, `preset`)
- prompt interactively when required args are missing
- copy files from `templates/basic` or `templates/router`
- write generated `package.json` using pinned versions from `src/version.js`
- fail fast on invalid presets or existing destination directory

## 3. Prohibited Behavior

`create-zenith` must never:
- read versions from installed packages or `node_modules`
- derive versions from `npm`, `pnpm`, `yarn`, lockfiles, or env vars
- mutate template content based on OS, timezone, cwd absolute path, or package manager
- emit nondeterministic values (`Date`, `Math.random`, `crypto.randomUUID`, `process.env`)
- fetch remote templates or execute network calls

## 4. Determinism Boundary

Determinism verification scope is:
- generated file tree names
- generated file contents

Excluded from determinism scope:
- `npm install` output
- `node_modules`
- package manager lockfile side effects in generated apps

## 5. Presets

### `basic`
- static template
- `zenith.config.js` with `router: false`

### `router`
- static template
- `zenith.config.js` with `router: true`

Preset content is static. No runtime interpolation in templates.

## 6. Version Authority

`src/version.js` is the single source of truth for generated dependency versions.

Rules:
- hardcoded values only
- pinned versions only (`1.0.0`, never `^1.0.0` or `~1.0.0`)
- no fallback to installed package metadata

## 7. Package Manager Neutrality

Generated output must be byte-for-byte identical regardless of invocation via:
- npm
- pnpm
- yarn
- bun

`create-zenith` may not branch output based on detected package manager.

## 8. Required Hardening Tests

The test suite must enforce:
- scaffold snapshots for both presets
- two-run determinism deep compare (file tree + content)
- no forbidden `@zenithbuild/*` imports in generator source
- no nondeterministic primitives in generated output:
  - `Date(`
  - `new Date(`
  - `Math.random(`
  - `process.env`
  - `crypto.randomUUID(`

