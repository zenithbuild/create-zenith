#!/usr/bin/env node
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS((exports, module) => {
  var p = process || {};
  var argv = p.argv || [];
  var env = p.env || {};
  var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
  var formatter = (open, close, replace = open) => (input) => {
    let string = "" + input, index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };
  var replaceClose = (string, close, replace, index) => {
    let result = "", cursor = 0;
    do {
      result += string.substring(cursor, index) + replace;
      cursor = index + close.length;
      index = string.indexOf(close, cursor);
    } while (~index);
    return result + string.substring(cursor);
  };
  var createColors = (enabled = isColorSupported) => {
    let f = enabled ? formatter : () => String;
    return {
      isColorSupported: enabled,
      reset: f("\x1B[0m", "\x1B[0m"),
      bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: f("\x1B[3m", "\x1B[23m"),
      underline: f("\x1B[4m", "\x1B[24m"),
      inverse: f("\x1B[7m", "\x1B[27m"),
      hidden: f("\x1B[8m", "\x1B[28m"),
      strikethrough: f("\x1B[9m", "\x1B[29m"),
      black: f("\x1B[30m", "\x1B[39m"),
      red: f("\x1B[31m", "\x1B[39m"),
      green: f("\x1B[32m", "\x1B[39m"),
      yellow: f("\x1B[33m", "\x1B[39m"),
      blue: f("\x1B[34m", "\x1B[39m"),
      magenta: f("\x1B[35m", "\x1B[39m"),
      cyan: f("\x1B[36m", "\x1B[39m"),
      white: f("\x1B[37m", "\x1B[39m"),
      gray: f("\x1B[90m", "\x1B[39m"),
      bgBlack: f("\x1B[40m", "\x1B[49m"),
      bgRed: f("\x1B[41m", "\x1B[49m"),
      bgGreen: f("\x1B[42m", "\x1B[49m"),
      bgYellow: f("\x1B[43m", "\x1B[49m"),
      bgBlue: f("\x1B[44m", "\x1B[49m"),
      bgMagenta: f("\x1B[45m", "\x1B[49m"),
      bgCyan: f("\x1B[46m", "\x1B[49m"),
      bgWhite: f("\x1B[47m", "\x1B[49m"),
      blackBright: f("\x1B[90m", "\x1B[39m"),
      redBright: f("\x1B[91m", "\x1B[39m"),
      greenBright: f("\x1B[92m", "\x1B[39m"),
      yellowBright: f("\x1B[93m", "\x1B[39m"),
      blueBright: f("\x1B[94m", "\x1B[39m"),
      magentaBright: f("\x1B[95m", "\x1B[39m"),
      cyanBright: f("\x1B[96m", "\x1B[39m"),
      whiteBright: f("\x1B[97m", "\x1B[39m"),
      bgBlackBright: f("\x1B[100m", "\x1B[49m"),
      bgRedBright: f("\x1B[101m", "\x1B[49m"),
      bgGreenBright: f("\x1B[102m", "\x1B[49m"),
      bgYellowBright: f("\x1B[103m", "\x1B[49m"),
      bgBlueBright: f("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
      bgCyanBright: f("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: f("\x1B[107m", "\x1B[49m")
    };
  };
  module.exports = createColors();
  module.exports.createColors = createColors;
});

// src/index.ts
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import * as readline from "node:readline";

// src/branding.ts
var import_picocolors = __toESM(require_picocolors(), 1);
var colors = {
  primary: import_picocolors.default.blue,
  secondary: import_picocolors.default.cyan,
  success: import_picocolors.default.green,
  warning: import_picocolors.default.yellow,
  error: import_picocolors.default.red,
  muted: import_picocolors.default.gray,
  bold: import_picocolors.default.bold,
  dim: import_picocolors.default.dim
};
var LOGO = `
${import_picocolors.default.cyan("╔═══════════════════════════════════════════════════════════╗")}
${import_picocolors.default.cyan("║")}                                                           ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}   ${import_picocolors.default.bold(import_picocolors.default.blue("███████╗"))}${import_picocolors.default.bold(import_picocolors.default.cyan("███████╗"))}${import_picocolors.default.bold(import_picocolors.default.blue("███╗   ██╗"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██╗"))}${import_picocolors.default.bold(import_picocolors.default.blue("████████╗"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██╗  ██╗"))}   ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}   ${import_picocolors.default.bold(import_picocolors.default.blue("╚══███╔╝"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██╔════╝"))}${import_picocolors.default.bold(import_picocolors.default.blue("████╗  ██║"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██║"))}${import_picocolors.default.bold(import_picocolors.default.blue("╚══██╔══╝"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██║  ██║"))}   ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}   ${import_picocolors.default.bold(import_picocolors.default.blue("  ███╔╝ "))}${import_picocolors.default.bold(import_picocolors.default.cyan("█████╗  "))}${import_picocolors.default.bold(import_picocolors.default.blue("██╔██╗ ██║"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██║"))}${import_picocolors.default.bold(import_picocolors.default.blue("   ██║   "))}${import_picocolors.default.bold(import_picocolors.default.cyan("███████║"))}   ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}   ${import_picocolors.default.bold(import_picocolors.default.blue(" ███╔╝  "))}${import_picocolors.default.bold(import_picocolors.default.cyan("██╔══╝  "))}${import_picocolors.default.bold(import_picocolors.default.blue("██║╚██╗██║"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██║"))}${import_picocolors.default.bold(import_picocolors.default.blue("   ██║   "))}${import_picocolors.default.bold(import_picocolors.default.cyan("██╔══██║"))}   ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}   ${import_picocolors.default.bold(import_picocolors.default.blue("███████╗"))}${import_picocolors.default.bold(import_picocolors.default.cyan("███████╗"))}${import_picocolors.default.bold(import_picocolors.default.blue("██║ ╚████║"))}${import_picocolors.default.bold(import_picocolors.default.cyan("██║"))}${import_picocolors.default.bold(import_picocolors.default.blue("   ██║   "))}${import_picocolors.default.bold(import_picocolors.default.cyan("██║  ██║"))}   ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}   ${import_picocolors.default.bold(import_picocolors.default.blue("╚══════╝"))}${import_picocolors.default.bold(import_picocolors.default.cyan("╚══════╝"))}${import_picocolors.default.bold(import_picocolors.default.blue("╚═╝  ╚═══╝"))}${import_picocolors.default.bold(import_picocolors.default.cyan("╚═╝"))}${import_picocolors.default.bold(import_picocolors.default.blue("   ╚═╝   "))}${import_picocolors.default.bold(import_picocolors.default.cyan("╚═╝  ╚═╝"))}   ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}                                                           ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}       ${import_picocolors.default.dim("The Modern Reactive Web Framework")}                  ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("║")}                                                           ${import_picocolors.default.cyan("║")}
${import_picocolors.default.cyan("╚═══════════════════════════════════════════════════════════╝")}
`;
var LOGO_COMPACT = `
  ${import_picocolors.default.bold(import_picocolors.default.blue("⚡"))} ${import_picocolors.default.bold(import_picocolors.default.cyan("ZENITH"))} ${import_picocolors.default.dim("- Modern Reactive Framework")}
`;
var spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

class Spinner {
  interval = null;
  frameIndex = 0;
  message;
  constructor(message) {
    this.message = message;
  }
  start() {
    const write = (text) => {
      if (typeof process !== "undefined" && process.stdout && process.stdout.write) {
        process.stdout.write(text);
      } else {
        console.log(text);
      }
    };
    this.interval = setInterval(() => {
      write(`\r${import_picocolors.default.cyan(spinnerFrames[this.frameIndex])} ${this.message}`);
      this.frameIndex = (this.frameIndex + 1) % spinnerFrames.length;
    }, 80);
  }
  stop(finalMessage) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    const write = (text) => {
      if (typeof process !== "undefined" && process.stdout && process.stdout.write) {
        process.stdout.write(text);
      } else {
        console.log(text);
      }
    };
    write("\r" + " ".repeat(this.message.length + 5) + "\r");
    if (finalMessage) {
      console.log(finalMessage);
    }
  }
  succeed(message) {
    this.stop(`${import_picocolors.default.green("✓")} ${message}`);
  }
  fail(message) {
    this.stop(`${import_picocolors.default.red("✗")} ${message}`);
  }
}
function showLogo() {
  console.log(LOGO);
}
function showCompactLogo() {
  console.log(LOGO_COMPACT);
}
function header(text) {
  console.log(`
${import_picocolors.default.bold(import_picocolors.default.cyan("▸"))} ${import_picocolors.default.bold(text)}
`);
}
function error(text) {
  console.log(`${import_picocolors.default.red("✗")} ${text}`);
}
function warn(text) {
  console.log(`${import_picocolors.default.yellow("⚠")} ${text}`);
}
function info(text) {
  console.log(`${import_picocolors.default.blue("ℹ")} ${text}`);
}
function highlight(text) {
  return import_picocolors.default.cyan(text);
}
function dim(text) {
  return import_picocolors.default.dim(text);
}
function bold(text) {
  return import_picocolors.default.bold(text);
}
async function showIntro() {
  console.clear();
  showLogo();
  await sleep(300);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function showNextSteps(projectName) {
  const padding = Math.max(0, 40 - projectName.length);
  console.log(`
${import_picocolors.default.cyan("┌─────────────────────────────────────────────────────────┐")}
${import_picocolors.default.cyan("│")}                                                         ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}   ${import_picocolors.default.green("✨")} ${import_picocolors.default.bold("Your Zenith app is ready!")}                         ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}                                                         ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}   ${import_picocolors.default.dim("Next steps:")}                                          ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}                                                         ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}   ${import_picocolors.default.cyan("$")} ${import_picocolors.default.bold(`cd ${projectName}`)}${" ".repeat(padding)}${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}   ${import_picocolors.default.cyan("$")} ${import_picocolors.default.bold("bun run dev")}                                       ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}                                                         ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}   ${import_picocolors.default.dim("Then open")} ${import_picocolors.default.underline(import_picocolors.default.blue("http://localhost:3000"))}                  ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("│")}                                                         ${import_picocolors.default.cyan("│")}
${import_picocolors.default.cyan("└─────────────────────────────────────────────────────────┘")}
`);
}

// src/templates.ts
function generatePackageJson(options) {
  const pkg = {
    name: options.name,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "zen-dev",
      build: "zen-build",
      preview: "zen-preview",
      test: "bun test"
    },
    dependencies: {
      "@zenithbuild/core": "^0.1.0"
    },
    devDependencies: {
      "@types/bun": "latest"
    }
  };
  const devDeps = pkg.devDependencies;
  if (options.eslint) {
    devDeps["eslint"] = "^8.0.0";
    devDeps["@typescript-eslint/eslint-plugin"] = "^6.0.0";
    devDeps["@typescript-eslint/parser"] = "^6.0.0";
    pkg.scripts = { ...pkg.scripts, lint: "eslint ." };
  }
  if (options.prettier) {
    devDeps["prettier"] = "^3.0.0";
    pkg.scripts = { ...pkg.scripts, format: "prettier --write ." };
  }
  return JSON.stringify(pkg, null, 4);
}
function generateIndexPage() {
  return `<script setup="ts">
    state count = 0
    
    function increment() {
        count = count + 1
    }
    
    function decrement() {
        count = count - 1
    }
    
    zenOnMount(() => {
        console.log('\uD83D\uDE80 Zenith app mounted!')
    })
</script>

<DefaultLayout title="Zenith App">
    <main>
        <div class="hero">
            <h1>Welcome to <span class="brand">Zenith</span></h1>
            <p class="tagline">The Modern Reactive Web Framework</p>
        </div>
    
    <div class="counter-card">
        <h2>Interactive Counter</h2>
        <p class="count">{count}</p>
        <div class="buttons">
            <button onclick="decrement" class="btn-secondary">−</button>
            <button onclick="increment" class="btn-primary">+</button>
        </div>
    </div>
    
    <div class="features">
        <div class="feature">
            <span class="icon">⚡</span>
            <h3>Reactive State</h3>
            <p>Built-in state management with automatic DOM updates</p>
        </div>
        <div class="feature">
            <span class="icon">\uD83C\uDFAF</span>
            <h3>Zero Config</h3>
            <p>Works immediately with no build step required</p>
        </div>
        <div class="feature">
            <span class="icon">\uD83D\uDD25</span>
            <h3>Hot Reload</h3>
            <p>Instant updates during development</p>
        </div>
    </div>
    </div>
</DefaultLayout>

<style>
    main {
        max-width: 900px;
        margin: 0 auto;
        padding: 3rem 2rem;
        font-family: system-ui, -apple-system, sans-serif;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #f1f5f9;
        min-height: 100vh;
    }
    
    .hero {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .brand {
        background: linear-gradient(135deg, #3b82f6, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .tagline {
        color: #94a3b8;
        font-size: 1.25rem;
    }
    
    .counter-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .counter-card h2 {
        color: #e2e8f0;
        margin-bottom: 1rem;
    }
    
    .count {
        font-size: 4rem;
        font-weight: 700;
        color: #3b82f6;
        margin: 1rem 0;
    }
    
    .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    button {
        font-size: 1.5rem;
        width: 60px;
        height: 60px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #e2e8f0;
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }
    
    .feature {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
    }
    
    .icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.75rem;
    }
    
    .feature h3 {
        color: #e2e8f0;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    
    .feature p {
        color: #94a3b8;
        font-size: 0.9rem;
        line-height: 1.5;
    }
</style>
`;
}
function generateDefaultLayout() {
  return `<script setup="ts">
    // interface Props { title?: string; lang?: string }
    
    zenEffect(() => {
        document.title = title || 'Zenith App'
    })
    
    zenOnMount(() => {
        console.log(\`[Layout] Mounted with title: \${title || 'Zenith App'}\`)
    })
</script>

<html lang={lang || 'en'}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/styles/global.css">
</head>
<body>
    <div class="layout">
        <header class="header">
            <nav class="nav">
                <a href="/" class="logo">⚡ Zenith</a>
                <div class="nav-links">
                    <a href="/">Home</a>
                    <a href="/docs">Docs</a>
                    <a href="https://github.com/zenithbuild/zenith" target="_blank">GitHub</a>
                </div>
            </nav>
        </header>
        
        <main class="content">
            <slot />
        </main>
        
        <footer class="footer">
            <p>Built with ⚡ Zenith Framework</p>
        </footer>
    </div>
</body>
</html>

<style>
    .layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    .header {
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .nav {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .logo {
        font-size: 1.25rem;
        font-weight: 700;
        color: #3b82f6;
        text-decoration: none;
    }
    
    .nav-links {
        display: flex;
        gap: 2rem;
    }
    
    .nav-links a {
        color: #94a3b8;
        text-decoration: none;
        transition: color 0.2s;
    }
    
    .nav-links a:hover {
        color: #f1f5f9;
    }
    
    .content {
        flex: 1;
    }
    
    .footer {
        background: #0f172a;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem;
        text-align: center;
        color: #64748b;
    }
</style>
`;
}
function generateGlobalCSS() {
  return `/* Zenith Global Styles */

/* CSS Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    background: #0f172a;
    color: #f1f5f9;
}

a {
    color: #3b82f6;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

img, video {
    max-width: 100%;
    height: auto;
}

button, input, select, textarea {
    font: inherit;
}

/* Utility Classes */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.text-center { text-align: center; }
.text-muted { color: #94a3b8; }

/* Zenith Brand Colors */
:root {
    --zen-primary: #3b82f6;
    --zen-secondary: #06b6d4;
    --zen-bg: #0f172a;
    --zen-surface: #1e293b;
    --zen-text: #f1f5f9;
    --zen-muted: #94a3b8;
}
`;
}
function generateGitignore() {
  return `# Dependencies
node_modules/
bun.lock

# Build output
dist/
.cache/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# Testing
coverage/
`;
}
function generateTsconfig(options) {
  const tsconfig = {
    compilerOptions: {
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "bundler",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      noEmit: true
    },
    include: [options.directory + "/**/*", "*.ts"],
    exclude: ["node_modules", "dist"]
  };
  if (options.pathAlias) {
    tsconfig.compilerOptions.baseUrl = ".";
    tsconfig.compilerOptions.paths = {
      "@/*": [`./${options.directory}/*`]
    };
  }
  return JSON.stringify(tsconfig, null, 4);
}
function generateEslintConfig() {
  const eslintConfig = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    env: {
      browser: true,
      node: true,
      es2022: true
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn"
    },
    ignorePatterns: ["dist", "node_modules"]
  };
  return JSON.stringify(eslintConfig, null, 4);
}
function generatePrettierConfig() {
  const prettierConfig = {
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: "es5",
    printWidth: 100
  };
  return JSON.stringify(prettierConfig, null, 4);
}
function generatePrettierIgnore() {
  return `dist
node_modules
bun.lock
`;
}

// src/index.ts
var VERSION = "0.4.0";
function detectPackageManager() {
  try {
    execSync("bun --version", { stdio: "pipe" });
    return "bun";
  } catch {
    return "npm";
  }
}
function isInteractive() {
  return Boolean(process.stdin.isTTY);
}
var rl = null;
function getReadlineInterface() {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: process.stdin.isTTY
    });
  }
  return rl;
}
function closeReadlineInterface() {
  if (rl) {
    rl.close();
    rl = null;
  }
}
async function prompt(question, defaultValue) {
  if (!isInteractive()) {
    return defaultValue || "";
  }
  const iface = getReadlineInterface();
  const displayQuestion = defaultValue ? `${question} ${dim(`(${defaultValue})`)}: ` : `${question}: `;
  return new Promise((resolve2) => {
    iface.question(displayQuestion, (answer) => {
      resolve2(answer.trim() || defaultValue || "");
    });
  });
}
async function confirm(question, defaultYes = true) {
  if (!isInteractive()) {
    return defaultYes;
  }
  const hint = defaultYes ? "Y/n" : "y/N";
  const answer = await prompt(`${question} ${dim(`(${hint})`)}`);
  if (!answer)
    return defaultYes;
  return answer.toLowerCase().startsWith("y");
}
async function gatherOptions(providedName) {
  let name = providedName;
  if (!name) {
    if (isInteractive()) {
      name = await prompt(highlight("Project name"));
    }
    if (!name) {
      error("Project name is required");
      console.log("");
      console.log("Usage: create-zenith <project-name>");
      console.log("");
      console.log("Examples:");
      console.log("  npx create-zenith my-app");
      console.log("  bunx create-zenith my-app");
      process.exit(1);
    }
  }
  const targetDir = path.resolve(process.cwd(), name);
  if (fs.existsSync(targetDir)) {
    error(`Directory "${name}" already exists`);
    process.exit(1);
  }
  console.log("");
  info(`Creating ${bold(name)} in ${dim(targetDir)}`);
  console.log("");
  if (!isInteractive()) {
    info("Non-interactive mode detected, using defaults...");
    return {
      name,
      directory: "app",
      eslint: true,
      prettier: true,
      pathAlias: true
    };
  }
  const useSrc = await confirm("Use src/ directory instead of app/?", false);
  const directory = useSrc ? "src" : "app";
  const eslint = await confirm("Add ESLint for code linting?", true);
  const prettier = await confirm("Add Prettier for code formatting?", true);
  const pathAlias = await confirm("Add TypeScript path alias (@/*)?", true);
  closeReadlineInterface();
  return {
    name,
    directory,
    eslint,
    prettier,
    pathAlias
  };
}
async function createProject(options) {
  const targetDir = path.resolve(process.cwd(), options.name);
  const baseDir = options.directory;
  const appDir = path.join(targetDir, baseDir);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(appDir, "pages"), { recursive: true });
  fs.mkdirSync(path.join(appDir, "layouts"), { recursive: true });
  fs.mkdirSync(path.join(appDir, "components"), { recursive: true });
  fs.mkdirSync(path.join(appDir, "styles"), { recursive: true });
  fs.writeFileSync(path.join(targetDir, "package.json"), generatePackageJson(options));
  fs.writeFileSync(path.join(targetDir, baseDir, "pages", "index.zen"), generateIndexPage());
  fs.writeFileSync(path.join(targetDir, baseDir, "layouts", "DefaultLayout.zen"), generateDefaultLayout());
  fs.writeFileSync(path.join(appDir, "styles", "global.css"), generateGlobalCSS());
  fs.writeFileSync(path.join(targetDir, ".gitignore"), generateGitignore());
}
async function generateConfigs(options) {
  const targetDir = path.resolve(process.cwd(), options.name);
  fs.writeFileSync(path.join(targetDir, "tsconfig.json"), generateTsconfig(options));
  if (options.eslint) {
    fs.writeFileSync(path.join(targetDir, ".eslintrc.json"), generateEslintConfig());
  }
  if (options.prettier) {
    fs.writeFileSync(path.join(targetDir, ".prettierrc"), generatePrettierConfig());
    fs.writeFileSync(path.join(targetDir, ".prettierignore"), generatePrettierIgnore());
  }
}
async function create(appName) {
  if (isInteractive()) {
    await showIntro();
  } else {
    showLogo();
  }
  header("Create a new Zenith app");
  const options = await gatherOptions(appName);
  console.log("");
  const spinner = new Spinner("Creating project structure...");
  spinner.start();
  try {
    await createProject(options);
    spinner.succeed("Project structure created");
    const configSpinner = new Spinner("Generating configurations...");
    configSpinner.start();
    await generateConfigs(options);
    configSpinner.succeed("Configurations generated");
    const installSpinner = new Spinner("Installing dependencies...");
    installSpinner.start();
    const targetDir = path.resolve(process.cwd(), options.name);
    const pm = detectPackageManager();
    try {
      execSync(`${pm} install`, {
        cwd: targetDir,
        stdio: "pipe"
      });
      installSpinner.succeed("Dependencies installed");
    } catch {
      installSpinner.fail("Could not install dependencies automatically");
      warn(`Run "${pm} install" manually in the project directory`);
    }
    showNextSteps(options.name);
  } catch (err) {
    spinner.fail("Failed to create project");
    const message = err instanceof Error ? err.message : String(err);
    error(message);
    process.exit(1);
  }
}
var args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  showCompactLogo();
  console.log(`Usage: create-zenith [project-name]
`);
  console.log(`Create a new Zenith application.
`);
  console.log("Options:");
  console.log("  -h, --help     Show this help message");
  console.log("  -v, --version  Show version number");
  console.log("");
  console.log("Examples:");
  console.log("  npx create-zenith my-app");
  console.log("  bunx create-zenith my-app");
  console.log("  npm create zenith my-app");
  process.exit(0);
}
if (args.includes("--version") || args.includes("-v")) {
  console.log(`create-zenith ${VERSION}`);
  process.exit(0);
}
var projectName = args.find((arg) => !arg.startsWith("-"));
create(projectName).catch((err) => {
  error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
