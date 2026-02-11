import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { scaffoldProject, snapshotDirectory } from '../src/scaffold.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function sandbox(prefix) {
    const root = mkdtempSync(path.join(os.tmpdir(), prefix));
    return {
        root,
        cleanup() {
            rmSync(root, { recursive: true, force: true });
        }
    };
}

function stripStringsAndComments(source) {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/`(?:\\[\s\S]|[^\\`])*`/g, '')
        .replace(/"(?:\\.|[^"\\])*"/g, '')
        .replace(/'(?:\\.|[^'\\])*'/g, '');
}

describe('guardrails', () => {
    test('source has no forbidden @zenithbuild imports', () => {
        const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.js'));
        const importRegex = /(import|export)\s+[^;]*from\s+['"](@zenithbuild\/[^'"]+)['"]/g;

        for (const file of files) {
            const source = fs.readFileSync(path.join(srcDir, file), 'utf8');
            expect(importRegex.test(source)).toBe(false);
        }
    });

    test('generated output contains no nondeterministic/env primitives', () => {
        const box = sandbox('create-zenith-guardrails-');
        try {
            const target = path.join(box.root, 'app');
            scaffoldProject({ projectName: 'app', targetDir: target, preset: 'router' });

            const files = snapshotDirectory(target);
            const forbidden = [
                'Date(',
                'new Date(',
                'Math.random(',
                'process.env',
                'crypto.randomUUID('
            ];

            for (const content of Object.values(files)) {
                const stripped = stripStringsAndComments(content);
                for (const pattern of forbidden) {
                    expect(stripped.includes(pattern)).toBe(false);
                }
            }
        } finally {
            box.cleanup();
        }
    });
});
