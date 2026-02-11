import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, '../templates');

const forbidden = [
    'Date(',
    'new Date(',
    'Math.random(',
    'process.env',
    'crypto.randomUUID('
];

function scan(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            scan(fullPath);
            continue;
        }

        const source = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of forbidden) {
            expect(source.includes(pattern)).toBe(false);
        }
    }
}

test('templates contain no forbidden primitives', () => {
    scan(templateDir);
});
