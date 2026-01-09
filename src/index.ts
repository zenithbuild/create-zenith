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
import * as os from 'node:os'
import { execSync } from 'node:child_process'
import * as readline from 'node:readline'
import * as brand from './branding.js'

export interface ProjectOptions {
    name: string
    eslint: boolean
    prettier: boolean
    pathAlias: boolean
}

// Version constant
const VERSION = '0.4.2'

// GitHub repository info
const GITHUB_REPO = 'zenithbuild/create-zenith'
const TEMPLATE_PATH = 'examples/starter'

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
 * Check if git is available
 */
function hasGit(): boolean {
    try {
        execSync('git --version', { stdio: 'pipe' })
        return true
    } catch {
        return false
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
 * Download template from GitHub
 */
async function downloadTemplate(targetDir: string): Promise<void> {
    const tempDir = path.join(os.tmpdir(), `zenith-template-${Date.now()}`)

    try {
        if (hasGit()) {
            // Use git clone with sparse checkout for efficiency
            execSync(`git clone --depth 1 --filter=blob:none --sparse https://github.com/${GITHUB_REPO}.git "${tempDir}"`, {
                stdio: 'pipe'
            })
            execSync(`git sparse-checkout set ${TEMPLATE_PATH}`, {
                cwd: tempDir,
                stdio: 'pipe'
            })

            // Copy template contents to target
            const templateSource = path.join(tempDir, TEMPLATE_PATH)
            fs.cpSync(templateSource, targetDir, { recursive: true })
        } else {
            // Fallback: download tarball via curl/fetch
            const tarballUrl = `https://github.com/${GITHUB_REPO}/archive/refs/heads/main.tar.gz`
            const tarballPath = path.join(os.tmpdir(), `zenith-${Date.now()}.tar.gz`)

            // Download tarball
            execSync(`curl -sL "${tarballUrl}" -o "${tarballPath}"`, { stdio: 'pipe' })

            // Extract
            fs.mkdirSync(tempDir, { recursive: true })
            execSync(`tar -xzf "${tarballPath}" -C "${tempDir}"`, { stdio: 'pipe' })

            // Find extracted directory (create-zenith-main)
            const extractedDir = fs.readdirSync(tempDir).find(f => f.startsWith('create-zenith'))
            if (!extractedDir) {
                throw new Error('Failed to extract template from GitHub')
            }

            // Copy template contents
            const templateSource = path.join(tempDir, extractedDir, TEMPLATE_PATH)
            fs.cpSync(templateSource, targetDir, { recursive: true })

            // Cleanup tarball
            fs.unlinkSync(tarballPath)
        }
    } finally {
        // Cleanup temp directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true })
        }
    }
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
            eslint: true,
            prettier: true,
            pathAlias: true
        }
    }

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
        eslint,
        prettier,
        pathAlias
    }
}

/**
 * Create the project directory structure and files
 */
async function createProject(options: ProjectOptions): Promise<void> {
    const targetDir = path.resolve(process.cwd(), options.name)

    // Download template from GitHub
    await downloadTemplate(targetDir)

    // Update package.json
    const pkgPath = path.join(targetDir, 'package.json')
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
        pkg.name = options.name
        pkg.version = '0.1.0'

        // Remove ESLint dependencies and scripts if not selected
        if (!options.eslint) {
            delete pkg.devDependencies?.['eslint']
            delete pkg.devDependencies?.['@typescript-eslint/eslint-plugin']
            delete pkg.devDependencies?.['@typescript-eslint/parser']
            delete pkg.scripts?.lint

            // Remove config file
            const eslintPath = path.join(targetDir, '.eslintrc.json')
            if (fs.existsSync(eslintPath)) fs.unlinkSync(eslintPath)
        }

        // Remove Prettier dependencies and scripts if not selected
        if (!options.prettier) {
            delete pkg.devDependencies?.['prettier']
            delete pkg.scripts?.format

            // Remove config files
            const prettierRc = path.join(targetDir, '.prettierrc')
            const prettierIgnore = path.join(targetDir, '.prettierignore')
            if (fs.existsSync(prettierRc)) fs.unlinkSync(prettierRc)
            if (fs.existsSync(prettierIgnore)) fs.unlinkSync(prettierIgnore)
        }

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4))
    }

    // Update tsconfig.json for path alias
    const tsconfigPath = path.join(targetDir, 'tsconfig.json')
    if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))

        if (options.pathAlias) {
            tsconfig.compilerOptions = tsconfig.compilerOptions || {}
            tsconfig.compilerOptions.baseUrl = '.'
            tsconfig.compilerOptions.paths = {
                '@/*': [`./src/*`]
            }
        } else if (tsconfig.compilerOptions?.paths) {
            delete tsconfig.compilerOptions.paths
        }

        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4))
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
    const spinner = new brand.Spinner('Downloading starter template...')
    spinner.start()

    try {
        // Create project
        await createProject(options)
        spinner.succeed('Project created')

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
        brand.success('Project created with Zenith Starter Template!')
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
