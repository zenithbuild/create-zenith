/**
 * Zenith CLI Branding
 * 
 * ASCII art logo, colors, animations, and styled output.
 * Runtime-agnostic: works identically on Bun and Node.
 */

import pc from 'picocolors'
import gradient from 'gradient-string'

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

// Zenith gradient (blue to cyan)
const zenithGradient = gradient(['#3b82f6', '#06b6d4', '#22d3ee'])

// Check if running in interactive TTY mode (safe for animations)
export function isTTY(): boolean {
    return Boolean(
        process.stdout.isTTY &&
        !process.env.CI &&
        !process.env.GITHUB_ACTIONS &&
        !process.env.CONTINUOUS_INTEGRATION
    )
}

// Raw ASCII logo lines (without color) for animation
const LOGO_LINES = [
    '  ███████╗███████╗███╗   ██╗██╗████████╗██╗  ██╗',
    '  ╚══███╔╝██╔════╝████╗  ██║██║╚══██╔══╝██║  ██║',
    '    ███╔╝ █████╗  ██╔██╗ ██║██║   ██║   ███████║',
    '   ███╔╝  ██╔══╝  ██║╚██╗██║██║   ██║   ██╔══██║',
    '  ███████╗███████╗██║ ╚████║██║   ██║   ██║  ██║',
    '  ╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═╝'
]

const TAGLINE = 'The Modern Reactive Web Framework'

// ASCII Zenith logo (static, colored)
export const LOGO = `
${pc.cyan('╔' + '═'.repeat(55) + '╗')}
${pc.cyan('║')}${' '.repeat(55)}${pc.cyan('║')}
${LOGO_LINES.map(line => `${pc.cyan('║')}  ${zenithGradient(line)}  ${pc.cyan('║')}`).join('\n')}
${pc.cyan('║')}${' '.repeat(55)}${pc.cyan('║')}
${pc.cyan('║')}${' '.repeat(10)}${pc.dim(TAGLINE)}${' '.repeat(10)}${pc.cyan('║')}
${pc.cyan('║')}${' '.repeat(55)}${pc.cyan('║')}
${pc.cyan('╚' + '═'.repeat(55) + '╝')}
`

// Compact logo for smaller spaces
export const LOGO_COMPACT = `
  ${pc.bold(zenithGradient('⚡ ZENITH'))} ${pc.dim('- Modern Reactive Framework')}
`

// Glowing spinner frames
const spinnerFrames = ['◐', '◓', '◑', '◒']
const dotSpinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export class Spinner {
    private interval: ReturnType<typeof setInterval> | null = null
    private frameIndex = 0
    private message: string
    private frames: string[]

    constructor(message: string, useDots: boolean = true) {
        this.message = message
        this.frames = useDots ? dotSpinnerFrames : spinnerFrames
    }

    start(): void {
        if (!isTTY()) {
            // Non-TTY: just print the message once
            console.log(`${pc.cyan('◌')} ${this.message}`)
            return
        }

        const write = (text: string) => {
            if (process.stdout?.write) {
                process.stdout.write(text)
            }
        }

        this.interval = setInterval(() => {
            const frame = pc.cyan(this.frames[this.frameIndex])
            write(`\r${frame} ${this.message}`)
            this.frameIndex = (this.frameIndex + 1) % this.frames.length
        }, 80)
    }

    stop(finalMessage?: string): void {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = null
        }

        if (isTTY()) {
            const write = (text: string) => {
                if (process.stdout?.write) {
                    process.stdout.write(text)
                }
            }
            // Clear the line
            write('\r' + ' '.repeat(this.message.length + 5) + '\r')
        }

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

    update(message: string): void {
        this.message = message
    }
}

// Sleep utility
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Animated logo with progressive draw effect
export async function animateLogo(): Promise<void> {
    if (!isTTY()) {
        showLogo()
        return
    }

    console.clear()

    // Draw border first
    console.log(pc.cyan('╔' + '═'.repeat(55) + '╗'))
    console.log(pc.cyan('║') + ' '.repeat(55) + pc.cyan('║'))

    // Progressive reveal of each logo line
    for (let i = 0; i < LOGO_LINES.length; i++) {
        const line = LOGO_LINES[i]
        process.stdout.write(pc.cyan('║') + '  ')

        // Reveal characters progressively
        const chars = [...line]
        const chunkSize = Math.ceil(chars.length / 8) // Reveal in 8 chunks for speed

        for (let j = 0; j < chars.length; j += chunkSize) {
            const chunk = chars.slice(j, j + chunkSize).join('')
            process.stdout.write(zenithGradient(chunk))
            await sleep(30)
        }

        console.log('  ' + pc.cyan('║'))
    }

    // Complete the box
    console.log(pc.cyan('║') + ' '.repeat(55) + pc.cyan('║'))

    // Animate tagline
    process.stdout.write(pc.cyan('║') + ' '.repeat(10))
    const taglineChars = [...TAGLINE]
    for (let i = 0; i < taglineChars.length; i += 4) {
        const chunk = taglineChars.slice(i, i + 4).join('')
        process.stdout.write(pc.dim(chunk))
        await sleep(20)
    }
    console.log(' '.repeat(10) + pc.cyan('║'))

    console.log(pc.cyan('║') + ' '.repeat(55) + pc.cyan('║'))
    console.log(pc.cyan('╚' + '═'.repeat(55) + '╝'))

    await sleep(150)
}

// Show static logo
export function showLogo(): void {
    console.log(LOGO)
}

export function showCompactLogo(): void {
    console.log(LOGO_COMPACT)
}

// Completion animation with pulse effect
export async function showCompletionAnimation(): Promise<void> {
    if (!isTTY()) {
        console.log(`${pc.green('✓')} ${pc.bold('Done!')}`)
        return
    }

    const frames = ['✓', '✨', '✓', '✨', '✓']
    const colors = [pc.green, pc.yellow, pc.green, pc.yellow, pc.green]

    for (let i = 0; i < frames.length; i++) {
        process.stdout.write(`\r${colors[i](frames[i])} ${pc.bold('Done!')}`)
        await sleep(100)
    }
    console.log()
}

// Styled output functions
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

// Animated intro sequence
export async function showIntro(): Promise<void> {
    await animateLogo()
}

// Next steps box with dynamic package manager
export function showNextSteps(projectName: string, packageManager: string = 'bun'): void {
    const pm = packageManager
    const runCmd = pm === 'npm' ? 'npm run dev' : `${pm} run dev`

    // Calculate padding for alignment
    const cdLine = `cd ${projectName}`
    const maxLineLen = 45
    const cdPadding = Math.max(1, maxLineLen - cdLine.length - 6)
    const runPadding = Math.max(1, maxLineLen - runCmd.length - 6)

    console.log(`
${pc.cyan('┌' + '─'.repeat(50) + '┐')}
${pc.cyan('│')}${' '.repeat(50)}${pc.cyan('│')}
${pc.cyan('│')}   ${pc.green('✨')} ${zenithGradient.multiline(pc.bold('Your Zenith app is ready!'))}${' '.repeat(17)}${pc.cyan('│')}
${pc.cyan('│')}${' '.repeat(50)}${pc.cyan('│')}
${pc.cyan('│')}   ${pc.dim('Next steps:')}${' '.repeat(36)}${pc.cyan('│')}
${pc.cyan('│')}${' '.repeat(50)}${pc.cyan('│')}
${pc.cyan('│')}   ${pc.cyan('$')} ${pc.bold(cdLine)}${' '.repeat(cdPadding)}${pc.cyan('│')}
${pc.cyan('│')}   ${pc.cyan('$')} ${pc.bold(runCmd)}${' '.repeat(runPadding)}${pc.cyan('│')}
${pc.cyan('│')}${' '.repeat(50)}${pc.cyan('│')}
${pc.cyan('│')}   ${pc.dim('Then open')} ${pc.underline(pc.blue('http://localhost:3000'))}${' '.repeat(9)}${pc.cyan('│')}
${pc.cyan('│')}${' '.repeat(50)}${pc.cyan('│')}
${pc.cyan('└' + '─'.repeat(50) + '┘')}
`)
}
