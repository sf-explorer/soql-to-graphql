#!/usr/bin/env node

import fs from 'fs';

// Read the main package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Temporarily update paths for publishing
const originalMain = packageJson.main;
const originalModule = packageJson.module;
const originalTypes = packageJson.types;

packageJson.main = './index.cjs';
packageJson.module = './index.esm.js';
packageJson.types = './index.d.ts';

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

// Write updated package.json to dist
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Created dist/package.json with corrected paths');
console.log('📦 Ready to publish from dist/ directory');
console.log('');
console.log('To publish:');
console.log('  cd dist && npm publish --access public');
console.log('');
console.log('To restore original package.json paths:');
console.log('  npm run restore:package');
