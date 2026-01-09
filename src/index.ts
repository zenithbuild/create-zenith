/**
 * create-zenith
 * 
 * Create a new Zenith application with interactive prompts.
 * 
 * Runtime-agnostic: works identically on Bun and Node.
 * This is the main CLI entry point - bundles to dist/cli.js
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'
import * as readline from 'node:readline'
import * as brand from './branding.js'
import {
    type ProjectOptions,
    generatePackageJson,
    generateIndexPage,
    generateDefaultLayout,
    generateGlobalCSS,
    generateGitignore,
    generateTsconfig,
    generateEslintConfig,
    generatePrettierConfig,
    generatePrettierIgnore
} from './templates.js'

// Version constant
const VERSION = '0.4.0'

/**
 * Detect which package manager is available
 * Returns 'bun' | 'npm' for consistent install behavior
 */
function detectPackageManager(): 'bun' | 'npm' {
    try {
        execSync('bun --version', { stdio: 'pipe' })
        return 'bun'
    } catch {
        return 'npm'
    }
}

/**
 * Check if running in interactive mode (TTY)
 */
function isInteractive(): boolean {
    return Boolean(process.stdin.isTTY)
}

/**
 * Creates a single readline interface for the entire session.
 * This avoids Bun's issue with multiple createInterface calls.
 */
let rl: readline.Interface | null = null

function getReadlineInterface(): readline.Interface {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: process.stdin.isTTY
        })
    }
    return rl
}

function closeReadlineInterface(): void {
    if (rl) {
        rl.close()
        rl = null
    }
}

/**
 * Interactive readline prompt helper
 * Uses a single persistent readline interface to avoid Bun issues
 */
async function prompt(question: string, defaultValue?: string): Promise<string> {
    // If not interactive, return default immediately
    if (!isInteractive()) {
        return defaultValue || ''
    }

    const iface = getReadlineInterface()

    const displayQuestion = defaultValue
        ? `${question} ${brand.dim(`(${defaultValue})`)}: `
        : `${question}: `

    return new Promise((resolve) => {
        iface.question(displayQuestion, (answer: string) => {
            resolve(answer.trim() || defaultValue || '')
        })
    })
}

/**
 * Yes/No prompt helper
 */
async function confirm(question: string, defaultYes: boolean = true): Promise<boolean> {
    // If not interactive, return default
    if (!isInteractive()) {
        return defaultYes
    }

    const hint = defaultYes ? 'Y/n' : 'y/N'
    const answer = await prompt(`${question} ${brand.dim(`(${hint})`)}`)

    if (!answer) return defaultYes
    return answer.toLowerCase().startsWith('y')
}

/**
 * Gather all project options through interactive prompts
 */
async function gatherOptions(providedName?: string): Promise<ProjectOptions> {
    // Project name - REQUIRED
    let name = providedName
    if (!name) {
        if (isInteractive()) {
            name = await prompt(brand.highlight('Project name'))
        }
        if (!name) {
            brand.error('Project name is required')
            console.log('')
            console.log('Usage: create-zenith <project-name>')
            console.log('')
            console.log('Examples:')
            console.log('  npx create-zenith my-app')
            console.log('  bunx create-zenith my-app')
            process.exit(1)
        }
    }

    // CRITICAL: Use process.cwd() to resolve the target directory
    // This ensures the CLI works from ANY location
    const targetDir = path.resolve(process.cwd(), name)
    if (fs.existsSync(targetDir)) {
        brand.error(`Directory "${name}" already exists`)
        process.exit(1)
    }

    console.log('')
    brand.info(`Creating ${brand.bold(name)} in ${brand.dim(targetDir)}`)
    console.log('')

    // If not interactive, use defaults
    if (!isInteractive()) {
        brand.info('Non-interactive mode detected, using defaults...')
        return {
            name,
            directory: 'app',
            eslint: true,
            prettier: true,
            pathAlias: true
        }
    }

    // Directory structure
    const useSrc = await confirm('Use src/ directory instead of app/?', false)
    const directory = useSrc ? 'src' : 'app'

    // ESLint
    const eslint = await confirm('Add ESLint for code linting?', true)

    // Prettier
    const prettier = await confirm('Add Prettier for code formatting?', true)

    // TypeScript path aliases
    const pathAlias = await confirm('Add TypeScript path alias (@/*)?', true)

    // Close readline after all prompts are done
    closeReadlineInterface()

    return {
        name,
        directory,
        eslint,
        prettier,
        pathAlias
    }
}

/**
 * Create the project directory structure and files
 */
async function createProject(options: ProjectOptions): Promise<void> {
    // CRITICAL: Use process.cwd() for output directory
    const targetDir = path.resolve(process.cwd(), options.name)
    const baseDir = options.directory
    const appDir = path.join(targetDir, baseDir)

    // Create directories
    fs.mkdirSync(targetDir, { recursive: true })
    fs.mkdirSync(path.join(appDir, 'pages'), { recursive: true })
    fs.mkdirSync(path.join(appDir, 'layouts'), { recursive: true })
    fs.mkdirSync(path.join(appDir, 'components'), { recursive: true })
    fs.mkdirSync(path.join(appDir, 'styles'), { recursive: true })

    // package.json
    fs.writeFileSync(
        path.join(targetDir, 'package.json'),
        generatePackageJson(options)
    )

    // index.zen
    fs.writeFileSync(
        path.join(targetDir, baseDir, 'pages', 'index.zen'),
        generateIndexPage()
    )

    // DefaultLayout.zen
    fs.writeFileSync(
        path.join(targetDir, baseDir, 'layouts', 'DefaultLayout.zen'),
        generateDefaultLayout()
    )

    // global.css
    fs.writeFileSync(
        path.join(appDir, 'styles', 'global.css'),
        generateGlobalCSS()
    )

    // .gitignore
    fs.writeFileSync(
        path.join(targetDir, '.gitignore'),
        generateGitignore()
    )
}

/**
 * Generate configuration files based on options
 */
async function generateConfigs(options: ProjectOptions): Promise<void> {
    const targetDir = path.resolve(process.cwd(), options.name)

    // tsconfig.json
    fs.writeFileSync(
        path.join(targetDir, 'tsconfig.json'),
        generateTsconfig(options)
    )

    // ESLint config
    if (options.eslint) {
        fs.writeFileSync(
            path.join(targetDir, '.eslintrc.json'),
            generateEslintConfig()
        )
    }

    // Prettier config
    if (options.prettier) {
        fs.writeFileSync(
            path.join(targetDir, '.prettierrc'),
            generatePrettierConfig()
        )

        fs.writeFileSync(
            path.join(targetDir, '.prettierignore'),
            generatePrettierIgnore()
        )
    }
}

/**
 * Main create command
 */
async function create(appName?: string): Promise<void> {
    // Show branded intro (skip clear if not interactive to preserve context)
    if (isInteractive()) {
        await brand.showIntro()
    } else {
        brand.showLogo()
    }
    brand.header('Create a new Zenith app')

    // Gather project options
    const options = await gatherOptions(appName)

    console.log('')
    const spinner = new brand.Spinner('Creating project structure...')
    spinner.start()

    try {
        // Create project
        await createProject(options)
        spinner.succeed('Project structure created')

        // Always generate configs (tsconfig.json is required)
        const configSpinner = new brand.Spinner('Generating configurations...')
        configSpinner.start()
        await generateConfigs(options)
        configSpinner.succeed('Configurations generated')

        // Install dependencies
        const installSpinner = new brand.Spinner('Installing dependencies...')
        installSpinner.start()

        const targetDir = path.resolve(process.cwd(), options.name)
        const pm = detectPackageManager()

        try {
            // Run install in the target directory
            execSync(`${pm} install`, {
                cwd: targetDir,
                stdio: 'pipe'
            })
            installSpinner.succeed('Dependencies installed')
        } catch {
            installSpinner.fail('Could not install dependencies automatically')
            brand.warn(`Run "${pm} install" manually in the project directory`)
        }

        // Show success message
        brand.showNextSteps(options.name)

    } catch (err: unknown) {
        spinner.fail('Failed to create project')
        const message = err instanceof Error ? err.message : String(err)
        brand.error(message)
        process.exit(1)
    }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

const args = process.argv.slice(2)

// Handle help flag
if (args.includes('--help') || args.includes('-h')) {
    brand.showCompactLogo()
    console.log('Usage: create-zenith [project-name]\n')
    console.log('Create a new Zenith application.\n')
    console.log('Options:')
    console.log('  -h, --help     Show this help message')
    console.log('  -v, --version  Show version number')
    console.log('')
    console.log('Examples:')
    console.log('  npx create-zenith my-app')
    console.log('  bunx create-zenith my-app')
    console.log('  npm create zenith my-app')
    process.exit(0)
}

// Handle version flag
if (args.includes('--version') || args.includes('-v')) {
    console.log(`create-zenith ${VERSION}`)
    process.exit(0)
}

// Get project name from arguments (first non-flag argument)
const projectName = args.find((arg: string) => !arg.startsWith('-'))

// Run the create command
create(projectName).catch((err: unknown) => {
    brand.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
})
