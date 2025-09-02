#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the main package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Create a copy for publishing with corrected paths
const publishPackageJson = {
  ...packageJson,
  main: './index.cjs',
  module: './index.esm.js',
  types: './index.d.ts',
  files: [
    'index.cjs',
    'index.esm.js',
    'index.d.ts',
    'index.js.map',
    'index.esm.js.map',
    'Readme.md',
    'logo.png',
    'LICENSE',
  ],
  // Remove build scripts that aren't needed in published package
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
};

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Copy LICENSE file to dist directory
if (fs.existsSync('LICENSE')) {
  fs.copyFileSync('LICENSE', 'dist/LICENSE');
  console.log('✅ Copied LICENSE to dist/');
} else {
  console.log('⚠️  LICENSE file not found - skipping copy');
}

// Write the publish package.json to dist directory
fs.writeFileSync(
  'dist/package.json',
  JSON.stringify(publishPackageJson, null, 2)
);

console.log('✅ Created dist/package.json for publishing');
console.log('📦 Ready to publish from dist/ directory');
