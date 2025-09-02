# Publishing Guide

This guide explains how to publish the `@sf-explorer/soql-to-graphql` package to NPM.

## Overview

With the new Rollup build system, the package is built into the `dist/` directory. To publish, you need to create a `package.json` in the `dist/` directory with corrected paths.

## Publishing Methods

### Method 1: Automated Publishing (Recommended)

```bash
# Build and publish in one command
npm run publish:npm
```

This will:

1. Run the full CI pipeline (`npm run ci`)
2. Build the release (`npm run build:release`) - which now includes creating `dist/package.json`
3. Publish from the `dist/` directory

### Method 2: Manual Publishing

```bash
# Step 1: Build release (includes creating dist/package.json)
npm run build:release

# Step 2: Publish from dist directory
cd dist
npm publish --access public
```

**Alternative manual approach:**

```bash
# Step 1: Prepare the package for publishing
npm run prepare:publish

# Step 2: Publish from dist directory
cd dist
npm publish --access public
```

### Method 3: Simple Publishing

```bash
# Create dist/package.json with corrected paths
npm run publish:simple

# Then manually publish
cd dist
npm publish --access public
```

## What Gets Published

The following files are included in the published package:

- `index.cjs` - CommonJS bundle
- `index.esm.js` - ES Module bundle
- `index.d.ts` - TypeScript declarations
- `index.js.map` - Source map for CommonJS
- `index.esm.js.map` - Source map for ESM
- `Readme.md` - Documentation
- `logo.png` - Package logo
- `LICENSE` - MIT License
- `package.json` - Package metadata with corrected paths

## Package.json Paths

The published `package.json` has these corrected paths:

```json
{
  "main": "./index.cjs",
  "module": "./index.esm.js",
  "types": "./index.d.ts"
}
```

## Version Management

To update the version before publishing:

```bash
# Patch version (0.2.0 → 0.2.1)
npm run version:patch

# Minor version (0.2.0 → 0.3.0)
npm run version:minor

# Major version (0.2.0 → 1.0.0)
npm run version:major
```

## Verification

After publishing, verify the package works:

```bash
# Test CommonJS import
node -e "const pkg = require('@sf-explorer/soql-to-graphql'); console.log('CJS works:', typeof pkg.default);"

# Test ESM import
node -e "import('@sf-explorer/soql-to-graphql').then(pkg => console.log('ESM works:', typeof pkg.default));"
```

## Troubleshooting

### "Package not found" error

- Ensure you're logged into NPM: `npm login`
- Check the package name in `package.json`

### "Access denied" error

- Use `--access public` flag for scoped packages
- Ensure you have publish permissions

### "File not found" errors

- Run `npm run build:release` first
- Check that `dist/` directory exists with all files

## GitHub Actions Integration

The repository includes automated publishing via GitHub Actions:

1. **Release Workflow**: Automatically publishes when you push a git tag
2. **Manual Release**: Use GitHub's "Actions" tab to trigger a manual release
3. **Version Bumping**: Automatically updates version numbers

See `.github/workflows/release.yml` for details.
