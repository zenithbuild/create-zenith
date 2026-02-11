#!/usr/bin/env node

import path from 'node:path';
import { stdin, stdout } from 'node:process';
import readline from 'node:readline/promises';
import { PRESETS, scaffoldProject } from './scaffold.js';

function parseArgs(argv) {
    const args = [...argv];
    let projectName = null;
    let preset = PRESETS.basic;

    for (let i = 0; i < args.length; i++) {
        const token = args[i];

        if (token === '--help' || token === '-h') {
            return { help: true };
        }

        if (token === '--preset') {
            const next = args[i + 1];
            if (!next) {
                throw new Error('[create-zenith] --preset requires a value');
            }
            preset = next;
            i++;
            continue;
        }

        if (!projectName) {
            projectName = token;
        }
    }

    return { help: false, projectName, preset };
}

function printHelp() {
    stdout.write(
        [
            'create-zenith',
            '',
            'Usage:',
            '  create-zenith <project-name> [--preset basic|router]',
            '',
            'Examples:',
            '  create-zenith my-app',
            '  create-zenith my-app --preset router',
            ''
        ].join('\n')
    );
}

async function promptForMissingValues(input) {
    const rl = readline.createInterface({ input: stdin, output: stdout });

    try {
        let projectName = input.projectName;
        let preset = input.preset;

        if (!projectName) {
            const answer = await rl.question('Project name: ');
            projectName = answer.trim();
        }

        if (!Object.prototype.hasOwnProperty.call(PRESETS, preset)) {
            const answer = await rl.question('Preset (basic/router): ');
            preset = answer.trim() || PRESETS.basic;
        }

        return { projectName, preset };
    } finally {
        rl.close();
    }
}

export async function run(argv = process.argv.slice(2), cwd = process.cwd()) {
    const parsed = parseArgs(argv);

    if (parsed.help) {
        printHelp();
        return 0;
    }

    const { projectName, preset } = await promptForMissingValues(parsed);

    if (!projectName) {
        throw new Error('[create-zenith] Project name is required');
    }

    if (!Object.prototype.hasOwnProperty.call(PRESETS, preset)) {
        throw new Error(`[create-zenith] Unknown preset "${preset}"`);
    }

    const targetDir = path.resolve(cwd, projectName);
    scaffoldProject({ projectName, targetDir, preset });

    stdout.write(
        [
            `Created ${projectName} with preset "${preset}".`,
            '',
            'Next steps:',
            `  cd ${projectName}`,
            '  npm install',
            '  npm run dev',
            ''
        ].join('\n')
    );

    return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run().catch((error) => {
        stdout.write(`${error.message}\n`);
        process.exit(1);
    });
}
