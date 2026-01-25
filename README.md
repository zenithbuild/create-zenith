# create-zenith ⚡

The official CLI for scaffolding new Zenith applications. Fast, animated, and delightful.

## Overview

`create-zenith` is the entry point to the Zenith ecosystem. It provides a signature, high-quality terminal experience for initializing new projects, ensuring you go from command line to `localhost` in seconds with confidence.

## Features

- **Animated Logo**: A branded, progressive gradient reveal that sets the tone for the framework.
- **Interactive UX**: Built with `@clack/prompts` for intuitive arrow-key navigation and clear visual indicators.
- **Reliable Fallbacks**: Automatically detects CI environments and non-TTY pipes to provide clean, static output.
- **Smart Detection**: automatically detects your preferred package manager (Bun, pnpm, Yarn, or npm).
- **Batteries Included**: Optional setup for ESLint, Prettier, and TypeScript path aliases.

## Quick Start

```bash
# Using npm
npm create @zenithbuild/zenith@latest

# Using Bun (Recommended)
bun create @zenithbuild/zenith

# Using pnpm
pnpm create @zenithbuild/zenith
```

## Options

| Flag | Description |
|------|-------------|
| `[project-name]` | The name of your new project and directory |
| `-h, --help` | Show usage information |
| `-v, --version` | Show version number |

## Development

```bash
# Clone the repository
git clone https://github.com/zenithbuild/create-zenith.git

# Install dependencies
bun install

# Build the CLI
bun run build

# Test locally
bun run create my-test-app
```

## License

MIT
