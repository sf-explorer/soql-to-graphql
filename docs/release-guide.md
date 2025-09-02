# Release Guide

This guide explains how to create releases for the SOQL to GraphQL project.

## 🚀 Release Process

### Automatic Release (Recommended)

The project uses GitHub Actions for automated releases. You can trigger a release in two ways:

#### 1. Manual Release via GitHub Actions

1. Go to the [Actions tab](https://github.com/sf-explorer/soql-to-graphql/actions)
2. Select the "Release" workflow
3. Click "Run workflow"
4. Choose the version type:
   - **patch**: Bug fixes (0.1.4 → 0.1.5)
   - **minor**: New features (0.1.4 → 0.2.0)
   - **major**: Breaking changes (0.1.4 → 1.0.0)
5. Optionally check "Create a prerelease" for beta versions
6. Click "Run workflow"

#### 2. Git Tag Release

```bash
# Create and push a tag
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

### Manual Release (Local)

If you prefer to release manually:

```bash
# 1. Update version
npm run version:minor  # or version:patch, version:major

# 2. Run tests and build
npm run ci

# 3. Create release build
npm run build:release

# 4. Publish to NPM
npm run publish:npm

# 5. Push changes and tags
git push origin main --tags
```

## 📋 Pre-Release Checklist

Before creating a release, ensure:

- [ ] All tests pass (`npm run ci`)
- [ ] Code is properly formatted (`npm run prettier`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version number is appropriate

## 🏷️ Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Examples

- `0.1.4` → `0.1.5` (patch: bug fix)
- `0.1.4` → `0.2.0` (minor: new feature)
- `0.1.4` → `1.0.0` (major: breaking change)

## 📦 What Happens During Release

The automated release process:

1. **Runs Tests**: Ensures all tests pass
2. **Builds Project**: Creates production build
3. **Updates Version**: Increments version in package.json
4. **Generates Changelog**: Creates release notes
5. **Publishes to NPM**: Makes package available
6. **Creates GitHub Release**: Documents the release
7. **Updates Documentation**: Updates badges and links

## 🔧 NPM Configuration

### NPM Token Setup

To enable automated NPM publishing:

1. Go to [NPM Account Settings](https://www.npmjs.com/settings/tokens)
2. Create a new "Automation" token
3. Add the token as a GitHub secret named `NPM_TOKEN`

### Package Configuration

The package is configured for public publishing:

```json
{
  "name": "@sf-explorer/soql-to-graphql",
  "publishConfig": {
    "access": "public"
  }
}
```

## 📝 Release Notes

Release notes are automatically generated from:

- Git commit messages since the last release
- CHANGELOG.md updates
- Pull request descriptions

### Writing Good Commit Messages

Use conventional commit format:

```
feat: add new SOQL operator support
fix: resolve WHERE clause parsing issue
docs: update API documentation
chore: update dependencies
```

## 🐛 Troubleshooting

### Common Issues

**Release fails with "NPM_TOKEN not found"**

- Ensure NPM_TOKEN is set in GitHub repository secrets

**Version already exists**

- Check if the version was already published
- Use a different version number

**Tests fail during release**

- Fix failing tests before releasing
- Check CI logs for specific errors

**Build fails**

- Ensure all dependencies are installed
- Check TypeScript compilation errors

### Rollback Process

If a release needs to be rolled back:

```bash
# 1. Unpublish from NPM (within 24 hours)
npm unpublish @sf-explorer/soql-to-graphql@0.2.0

# 2. Delete the GitHub release
# Go to GitHub releases page and delete the release

# 3. Delete the git tag
git tag -d v0.2.0
git push origin :refs/tags/v0.2.0
```

## 📊 Release Monitoring

After a release:

- [ ] Verify package is available on NPM
- [ ] Check GitHub release page
- [ ] Monitor for any issues or feedback
- [ ] Update documentation if needed

## 🔗 Useful Links

- [NPM Package](https://www.npmjs.com/package/@sf-explorer/soql-to-graphql)
- [GitHub Releases](https://github.com/sf-explorer/soql-to-graphql/releases)
- [GitHub Actions](https://github.com/sf-explorer/soql-to-graphql/actions)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
