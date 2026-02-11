import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEPENDENCY_VERSIONS, DEV_DEPENDENCY_VERSIONS } from './version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesRoot = path.resolve(__dirname, '../templates');

export const PRESETS = Object.freeze({
    basic: 'basic',
    router: 'router'
});

function assertValidPreset(preset) {
    if (!Object.prototype.hasOwnProperty.call(PRESETS, preset)) {
        throw new Error(`[create-zenith] Unknown preset "${preset}"`);
    }
}

function ensureTargetAvailable(targetDir) {
    if (fs.existsSync(targetDir)) {
        throw new Error(`[create-zenith] Target directory already exists: ${targetDir}`);
    }
}

function sortedDirectoryEntries(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
}

function copyDirectoryDeterministic(sourceDir, targetDir) {
    fs.mkdirSync(targetDir, { recursive: true });

    const entries = sortedDirectoryEntries(sourceDir);
    for (const entry of entries) {
        const from = path.join(sourceDir, entry.name);
        const to = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectoryDeterministic(from, to);
            continue;
        }

        if (entry.isFile()) {
            fs.copyFileSync(from, to);
        }
    }
}

function packageJsonForPreset(projectName, preset) {
    const dependencies = {
        '@zenithbuild/core': DEPENDENCY_VERSIONS['@zenithbuild/core']
    };

    if (preset === PRESETS.router) {
        dependencies['@zenithbuild/router'] = DEPENDENCY_VERSIONS['@zenithbuild/router'];
    }

    return {
        name: projectName,
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: {
            dev: 'zenith dev',
            build: 'zenith build',
            preview: 'zenith preview'
        },
        dependencies,
        devDependencies: {
            '@zenithbuild/cli': DEV_DEPENDENCY_VERSIONS['@zenithbuild/cli']
        }
    };
}

function writeGeneratedPackageJson(targetDir, projectName, preset) {
    const pkg = packageJsonForPreset(projectName, preset);
    const pkgPath = path.join(targetDir, 'package.json');
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

export function scaffoldProject({ projectName, targetDir, preset }) {
    assertValidPreset(preset);
    ensureTargetAvailable(targetDir);

    const templateDir = path.join(templatesRoot, preset);
    copyDirectoryDeterministic(templateDir, targetDir);
    writeGeneratedPackageJson(targetDir, projectName, preset);
}

export function snapshotDirectory(rootDir) {
    const output = {};

    function walk(currentDir, relativeBase) {
        const entries = sortedDirectoryEntries(currentDir);

        for (const entry of entries) {
            if (entry.name === 'node_modules') {
                continue;
            }

            const absolutePath = path.join(currentDir, entry.name);
            const relativePath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                walk(absolutePath, relativePath);
                continue;
            }

            if (entry.isFile()) {
                output[relativePath] = fs.readFileSync(absolutePath, 'utf8');
            }
        }
    }

    walk(rootDir, '');
    return output;
}
