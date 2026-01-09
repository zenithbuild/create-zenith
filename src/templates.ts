/**
 * Template Generators
 * 
 * All project templates as embedded string literals.
 * This ensures the CLI is completely directory-agnostic.
 */

export interface ProjectOptions {
    name: string
    directory: 'app' | 'src'
    eslint: boolean
    prettier: boolean
    pathAlias: boolean
}

// package.json template
export function generatePackageJson(options: ProjectOptions): string {
    const pkg: Record<string, unknown> = {
        name: options.name,
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: {
            dev: 'zen-dev',
            build: 'zen-build',
            preview: 'zen-preview',
            test: 'bun test'
        },
        dependencies: {
            '@zenithbuild/core': '^0.1.0'
        },
        devDependencies: {
            '@types/bun': 'latest'
        } as Record<string, string>
    }

    // Add optional dev dependencies
    const devDeps = pkg.devDependencies as Record<string, string>
    if (options.eslint) {
        devDeps['eslint'] = '^8.0.0'
        devDeps['@typescript-eslint/eslint-plugin'] = '^6.0.0'
        devDeps['@typescript-eslint/parser'] = '^6.0.0'
        pkg.scripts = { ...(pkg.scripts as object), lint: 'eslint .' }
    }
    if (options.prettier) {
        devDeps['prettier'] = '^3.0.0'
        pkg.scripts = { ...(pkg.scripts as object), format: 'prettier --write .' }
    }

    return JSON.stringify(pkg, null, 4)
}

// index.zen page template
export function generateIndexPage(): string {
    return `<script setup="ts">
    state count = 0
    
    function increment() {
        count = count + 1
    }
    
    function decrement() {
        count = count - 1
    }
    
    zenOnMount(() => {
        console.log('🚀 Zenith app mounted!')
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
            <span class="icon">🎯</span>
            <h3>Zero Config</h3>
            <p>Works immediately with no build step required</p>
        </div>
        <div class="feature">
            <span class="icon">🔥</span>
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
`
}

// DefaultLayout.zen template
export function generateDefaultLayout(): string {
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
`
}

// global.css template
export function generateGlobalCSS(): string {
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
`
}

// .gitignore template
export function generateGitignore(): string {
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
`
}

// tsconfig.json template
export function generateTsconfig(options: ProjectOptions): string {
    const tsconfig: Record<string, unknown> = {
        compilerOptions: {
            target: 'ESNext',
            module: 'ESNext',
            moduleResolution: 'bundler',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            declaration: true,
            declarationMap: true,
            noEmit: true
        },
        include: [options.directory + '/**/*', '*.ts'],
        exclude: ['node_modules', 'dist']
    }

    if (options.pathAlias) {
        (tsconfig.compilerOptions as Record<string, unknown>).baseUrl = '.'
            ; (tsconfig.compilerOptions as Record<string, unknown>).paths = {
                '@/*': [`./${options.directory}/*`]
            }
    }

    return JSON.stringify(tsconfig, null, 4)
}

// ESLint config template
export function generateEslintConfig(): string {
    const eslintConfig = {
        root: true,
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended'
        ],
        env: {
            browser: true,
            node: true,
            es2022: true
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn'
        },
        ignorePatterns: ['dist', 'node_modules']
    }

    return JSON.stringify(eslintConfig, null, 4)
}

// Prettier config template
export function generatePrettierConfig(): string {
    const prettierConfig = {
        semi: false,
        singleQuote: true,
        tabWidth: 4,
        trailingComma: 'es5',
        printWidth: 100
    }

    return JSON.stringify(prettierConfig, null, 4)
}

// .prettierignore template
export function generatePrettierIgnore(): string {
    return `dist
node_modules
bun.lock
`
}
