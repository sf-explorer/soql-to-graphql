# Git Hooks Setup

This project uses Git hooks to ensure code quality and consistency.

## Hooks Configured

### Pre-commit Hook

- **File**: `.husky/pre-commit`
- **Purpose**: Runs before each commit
- **Actions**:
  - Runs `lint-staged` to format and lint only staged files
  - Automatically fixes formatting issues with Prettier
  - Runs ESLint with auto-fix on TypeScript/JavaScript files

### Pre-push Hook

- **File**: `.husky/pre-push`
- **Purpose**: Runs before each push
- **Actions**:
  - Runs `npm run prettier:check` to verify all files are properly formatted
  - Prevents push if formatting issues are found
  - Provides helpful error messages

## How It Works

1. **When you commit**:

   - Only staged files are processed (faster)
   - Prettier automatically fixes formatting
   - ESLint automatically fixes linting issues
   - Commit proceeds if all checks pass

2. **When you push**:
   - All files are checked for formatting consistency
   - Push is blocked if any formatting issues are found
   - You'll get a clear error message with instructions

## Benefits

- ✅ **Consistent formatting** across all commits
- ✅ **Faster CI/CD** (no formatting failures in GitHub Actions)
- ✅ **Better code quality** with automatic linting
- ✅ **Team consistency** (everyone follows the same standards)
- ✅ **No manual formatting** required

## Troubleshooting

### If pre-commit fails:

```bash
# The hook will show you what's wrong
# Usually just run the suggested commands
npm run prettier
npm run lint:fix
```

### If pre-push fails:

```bash
# Fix formatting issues
npm run prettier

# Then try pushing again
git push
```

### To bypass hooks (not recommended):

```bash
# Skip pre-commit
git commit --no-verify

# Skip pre-push
git push --no-verify
```

## Configuration

The hooks are configured in:

- **package.json**: `lint-staged` configuration
- **.husky/**: Hook scripts
- **.prettierrc**: Prettier configuration
- **.eslintrc**: ESLint configuration
