import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const extensionDir = join(rootDir, 'chrome-extension');
const appDir = join(extensionDir, 'app');
const releaseDir = join(rootDir, 'release');
const packageJson = JSON.parse(await readFile(join(rootDir, 'package.json'), 'utf8'));
const zipName = `QR Studio Chrome Extension ${packageJson.version}.zip`;
const zipPath = join(releaseDir, zipName);

const zipEntries = [
  'manifest.json',
  'README.md',
  'background.js',
  'service-worker.js',
  'popup.html',
  'popup.css',
  'popup.js',
  'icons',
  'app',
];

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

await rm(appDir, { recursive: true, force: true });
await mkdir(appDir, { recursive: true });
await cp(join(rootDir, 'dist'), appDir, { recursive: true });
await mkdir(releaseDir, { recursive: true });
await rm(zipPath, { force: true });
await run('zip', ['-r', zipPath, ...zipEntries], { cwd: extensionDir });

console.log(`Packaged ${zipPath}`);
