import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { scaffoldProject, snapshotDirectory } from '../src/scaffold.js';
import { DEPENDENCY_VERSIONS, DEV_DEPENDENCY_VERSIONS } from '../src/version.js';

function tempSandbox() {
    const root = mkdtempSync(path.join(os.tmpdir(), 'create-zenith-scaffold-'));
    return {
        root,
        cleanup() {
            rmSync(root, { recursive: true, force: true });
        }
    };
}

describe('scaffoldProject', () => {
    test('generates deterministic basic preset snapshot', () => {
        const box = tempSandbox();
        try {
            const target = path.join(box.root, 'basic-app');
            scaffoldProject({
                projectName: 'basic-app',
                targetDir: target,
                preset: 'basic'
            });

            expect(snapshotDirectory(target)).toMatchInlineSnapshot(`
{
  ".gitignore": "node_modules
dist
coverage
",
  "package.json": "{
  "name": "basic-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "zenith dev",
    "build": "zenith build",
    "preview": "zenith preview"
  },
  "dependencies": {
    "@zenithbuild/core": "1.0.0"
  },
  "devDependencies": {
    "@zenithbuild/cli": "1.0.0"
  }
}
",
  "pages/index.zen": "<main>
  <h1>Zenith Basic</h1>
  <p>Deterministic starter preset.</p>
</main>
",
  "zenith.config.js": "export default {
  router: false
};
",
}
`);
        } finally {
            box.cleanup();
        }
    });

    test('generates deterministic router preset snapshot', () => {
        const box = tempSandbox();
        try {
            const target = path.join(box.root, 'router-app');
            scaffoldProject({
                projectName: 'router-app',
                targetDir: target,
                preset: 'router'
            });

            expect(snapshotDirectory(target)).toMatchInlineSnapshot(`
{
  ".gitignore": "node_modules
dist
coverage
",
  "package.json": "{
  "name": "router-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "zenith dev",
    "build": "zenith build",
    "preview": "zenith preview"
  },
  "dependencies": {
    "@zenithbuild/core": "1.0.0",
    "@zenithbuild/router": "1.0.0"
  },
  "devDependencies": {
    "@zenithbuild/cli": "1.0.0"
  }
}
",
  "pages/about.zen": "<main>
  <h1>About Router Preset</h1>
</main>
",
  "pages/index.zen": "<main>
  <h1>Zenith Router</h1>
  <a href="/about">About</a>
</main>
",
  "zenith.config.js": "export default {
  router: true
};
",
}
`);
        } finally {
            box.cleanup();
        }
    });

    test('writes package.json with pinned versions from version authority', () => {
        const box = tempSandbox();
        try {
            const target = path.join(box.root, 'authority-app');
            scaffoldProject({
                projectName: 'authority-app',
                targetDir: target,
                preset: 'router'
            });

            const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
            expect(pkg.dependencies['@zenithbuild/core']).toBe(DEPENDENCY_VERSIONS['@zenithbuild/core']);
            expect(pkg.dependencies['@zenithbuild/router']).toBe(DEPENDENCY_VERSIONS['@zenithbuild/router']);
            expect(pkg.devDependencies['@zenithbuild/cli']).toBe(DEV_DEPENDENCY_VERSIONS['@zenithbuild/cli']);
            expect(pkg.dependencies['@zenithbuild/core'].startsWith('^')).toBe(false);
            expect(pkg.dependencies['@zenithbuild/core'].startsWith('~')).toBe(false);
        } finally {
            box.cleanup();
        }
    });

    test('throws for invalid preset', () => {
        const box = tempSandbox();
        try {
            const target = path.join(box.root, 'bad');
            expect(() => {
                scaffoldProject({
                    projectName: 'bad',
                    targetDir: target,
                    preset: 'unknown'
                });
            }).toThrow('Unknown preset');
        } finally {
            box.cleanup();
        }
    });

    test('throws when target directory already exists', () => {
        const box = tempSandbox();
        try {
            const target = path.join(box.root, 'exists');
            fs.mkdirSync(target, { recursive: true });
            expect(() => {
                scaffoldProject({
                    projectName: 'exists',
                    targetDir: target,
                    preset: 'basic'
                });
            }).toThrow('Target directory already exists');
        } finally {
            box.cleanup();
        }
    });
});
