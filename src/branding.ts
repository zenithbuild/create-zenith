/**
 * Zenith CLI Branding
 * 
 * ASCII art logo, colors, animations, and styled output.
 * Runtime-agnostic: works identically on Bun and Node.
 */

import pc from 'picocolors'

// Brand colors
export const colors = {
    primary: pc.blue,
    secondary: pc.cyan,
    success: pc.green,
    warning: pc.yellow,
    error: pc.red,
    muted: pc.gray,
    bold: pc.bold,
    dim: pc.dim
}

// ASCII Zenith logo
export const LOGO = `
${pc.cyan('╔═══════════════════════════════════════════════════════════╗')}
${pc.cyan('║')}                                                           ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.blue('███████╗'))}${pc.bold(pc.cyan('███████╗'))}${pc.bold(pc.blue('███╗   ██╗'))}${pc.bold(pc.cyan('██╗'))}${pc.bold(pc.blue('████████╗'))}${pc.bold(pc.cyan('██╗  ██╗'))}   ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.blue('╚══███╔╝'))}${pc.bold(pc.cyan('██╔════╝'))}${pc.bold(pc.blue('████╗  ██║'))}${pc.bold(pc.cyan('██║'))}${pc.bold(pc.blue('╚══██╔══╝'))}${pc.bold(pc.cyan('██║  ██║'))}   ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.blue('  ███╔╝ '))}${pc.bold(pc.cyan('█████╗  '))}${pc.bold(pc.blue('██╔██╗ ██║'))}${pc.bold(pc.cyan('██║'))}${pc.bold(pc.blue('   ██║   '))}${pc.bold(pc.cyan('███████║'))}   ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.blue(' ███╔╝  '))}${pc.bold(pc.cyan('██╔══╝  '))}${pc.bold(pc.blue('██║╚██╗██║'))}${pc.bold(pc.cyan('██║'))}${pc.bold(pc.blue('   ██║   '))}${pc.bold(pc.cyan('██╔══██║'))}   ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.blue('███████╗'))}${pc.bold(pc.cyan('███████╗'))}${pc.bold(pc.blue('██║ ╚████║'))}${pc.bold(pc.cyan('██║'))}${pc.bold(pc.blue('   ██║   '))}${pc.bold(pc.cyan('██║  ██║'))}   ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.blue('╚══════╝'))}${pc.bold(pc.cyan('╚══════╝'))}${pc.bold(pc.blue('╚═╝  ╚═══╝'))}${pc.bold(pc.cyan('╚═╝'))}${pc.bold(pc.blue('   ╚═╝   '))}${pc.bold(pc.cyan('╚═╝  ╚═╝'))}   ${pc.cyan('║')}
${pc.cyan('║')}                                                           ${pc.cyan('║')}
${pc.cyan('║')}       ${pc.dim('The Modern Reactive Web Framework')}                  ${pc.cyan('║')}
${pc.cyan('║')}                                                           ${pc.cyan('║')}
${pc.cyan('╚═══════════════════════════════════════════════════════════╝')}
`

// Compact logo for smaller spaces
export const LOGO_COMPACT = `
  ${pc.bold(pc.blue('⚡'))} ${pc.bold(pc.cyan('ZENITH'))} ${pc.dim('- Modern Reactive Framework')}
`

// Spinner frames for animations
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export class Spinner {
    private interval: ReturnType<typeof setInterval> | null = null
    private frameIndex = 0
    private message: string

    constructor(message: string) {
        this.message = message
    }

    start(): void {
        // Use stdout.write for cross-runtime compatibility
        const write = (text: string) => {
            if (typeof process !== 'undefined' && process.stdout && process.stdout.write) {
                process.stdout.write(text)
            } else {
                console.log(text)
            }
        }

        this.interval = setInterval(() => {
            write(`\r${pc.cyan(spinnerFrames[this.frameIndex])} ${this.message}`)
            this.frameIndex = (this.frameIndex + 1) % spinnerFrames.length
        }, 80)
    }

    stop(finalMessage?: string): void {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = null
        }

        const write = (text: string) => {
            if (typeof process !== 'undefined' && process.stdout && process.stdout.write) {
                process.stdout.write(text)
            } else {
                console.log(text)
            }
        }

        write('\r' + ' '.repeat(this.message.length + 5) + '\r')
        if (finalMessage) {
            console.log(finalMessage)
        }
    }

    succeed(message: string): void {
        this.stop(`${pc.green('✓')} ${message}`)
    }

    fail(message: string): void {
        this.stop(`${pc.red('✗')} ${message}`)
    }
}

// Styled output functions
export function showLogo(): void {
    console.log(LOGO)
}

export function showCompactLogo(): void {
    console.log(LOGO_COMPACT)
}

export function header(text: string): void {
    console.log(`\n${pc.bold(pc.cyan('▸'))} ${pc.bold(text)}\n`)
}

export function success(text: string): void {
    console.log(`${pc.green('✓')} ${text}`)
}

export function error(text: string): void {
    console.log(`${pc.red('✗')} ${text}`)
}

export function warn(text: string): void {
    console.log(`${pc.yellow('⚠')} ${text}`)
}

export function info(text: string): void {
    console.log(`${pc.blue('ℹ')} ${text}`)
}

export function step(num: number, text: string): void {
    console.log(`${pc.dim(`[${num}]`)} ${text}`)
}

export function highlight(text: string): string {
    return pc.cyan(text)
}

export function dim(text: string): string {
    return pc.dim(text)
}

export function bold(text: string): string {
    return pc.bold(text)
}

// Animated intro
export async function showIntro(): Promise<void> {
    // Clear screen in a cross-runtime way
    console.clear()
    showLogo()
    await sleep(300)
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Next steps box
export function showNextSteps(projectName: string): void {
    const padding = Math.max(0, 40 - projectName.length)
    console.log(`
${pc.cyan('┌─────────────────────────────────────────────────────────┐')}
${pc.cyan('│')}                                                         ${pc.cyan('│')}
${pc.cyan('│')}   ${pc.green('✨')} ${pc.bold('Your Zenith app is ready!')}                         ${pc.cyan('│')}
${pc.cyan('│')}                                                         ${pc.cyan('│')}
${pc.cyan('│')}   ${pc.dim('Next steps:')}                                          ${pc.cyan('│')}
${pc.cyan('│')}                                                         ${pc.cyan('│')}
${pc.cyan('│')}   ${pc.cyan('$')} ${pc.bold(`cd ${projectName}`)}${' '.repeat(padding)}${pc.cyan('│')}
${pc.cyan('│')}   ${pc.cyan('$')} ${pc.bold('bun run dev')}                                       ${pc.cyan('│')}
${pc.cyan('│')}                                                         ${pc.cyan('│')}
${pc.cyan('│')}   ${pc.dim('Then open')} ${pc.underline(pc.blue('http://localhost:3000'))}                  ${pc.cyan('│')}
${pc.cyan('│')}                                                         ${pc.cyan('│')}
${pc.cyan('└─────────────────────────────────────────────────────────┘')}
`)
}
