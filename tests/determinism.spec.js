import os from 'node:os';
import path from 'node:path';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { scaffoldProject, snapshotDirectory } from '../src/scaffold.js';

function sandbox(prefix) {
    const root = mkdtempSync(path.join(os.tmpdir(), prefix));
    return {
        root,
        cleanup() {
            rmSync(root, { recursive: true, force: true });
        }
    };
}

describe('determinism', () => {
    test('two runs produce identical output (file tree + content)', () => {
        const box = sandbox('create-zenith-determinism-');
        try {
            const first = path.join(box.root, 'run-a');
            const second = path.join(box.root, 'run-b');

            scaffoldProject({ projectName: 'demo', targetDir: first, preset: 'basic' });
            scaffoldProject({ projectName: 'demo', targetDir: second, preset: 'basic' });

            expect(snapshotDirectory(first)).toEqual(snapshotDirectory(second));
        } finally {
            box.cleanup();
        }
    });

    test('determinism boundary excludes node_modules/install artifacts', () => {
        const box = sandbox('create-zenith-boundary-');
        try {
            const first = path.join(box.root, 'run-a');
            const second = path.join(box.root, 'run-b');

            scaffoldProject({ projectName: 'demo', targetDir: first, preset: 'router' });
            scaffoldProject({ projectName: 'demo', targetDir: second, preset: 'router' });

            mkdirSync(path.join(first, 'node_modules', 'x'), { recursive: true });
            mkdirSync(path.join(second, 'node_modules', 'y'), { recursive: true });
            writeFileSync(path.join(first, 'node_modules', 'x', 'index.js'), 'A');
            writeFileSync(path.join(second, 'node_modules', 'y', 'index.js'), 'B');

            expect(snapshotDirectory(first)).toEqual(snapshotDirectory(second));
        } finally {
            box.cleanup();
        }
    });

    test('output is package-manager neutral', () => {
        const box = sandbox('create-zenith-pm-neutral-');
        const originalUserAgent = process.env.npm_config_user_agent;

        try {
            const npmRun = path.join(box.root, 'npm-run');
            const pnpmRun = path.join(box.root, 'pnpm-run');

            process.env.npm_config_user_agent = 'npm/10.0.0 node/v22.0.0';
            scaffoldProject({ projectName: 'demo', targetDir: npmRun, preset: 'basic' });

            process.env.npm_config_user_agent = 'pnpm/9.0.0 node/v22.0.0';
            scaffoldProject({ projectName: 'demo', targetDir: pnpmRun, preset: 'basic' });

            expect(snapshotDirectory(npmRun)).toEqual(snapshotDirectory(pnpmRun));
        } finally {
            process.env.npm_config_user_agent = originalUserAgent;
            box.cleanup();
        }
    });
});
