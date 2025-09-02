# Codecov Setup Instructions

## 1. Enable Codecov for your repository

1. Go to [https://codecov.io](https://codecov.io)
2. Sign in with your GitHub account
3. Click "Add a repository"
4. Find and select `sf-explorer/soql-to-graphql`
5. Click "Add repository"

## 2. Get your Codecov token (Optional but recommended)

1. In your Codecov dashboard, go to your repository settings
2. Copy the "Repository Upload Token"
3. In your GitHub repository, go to Settings → Secrets and variables → Actions
4. Add a new repository secret:
   - Name: `CODECOV_TOKEN`
   - Value: [paste your token]

## 3. Verify the setup

The following files are already configured:

- ✅ `codecov.yml` - Codecov configuration
- ✅ `.github/workflows/ci.yml` - GitHub Actions with Codecov integration
- ✅ `Readme.md` - Codecov badge included
- ✅ `jest.config.js` - Coverage reporting configured

## 4. Test the integration

1. Push your changes to GitHub
2. Create a pull request
3. Check the Codecov status in the PR
4. Visit [https://codecov.io/gh/sf-explorer/soql-to-graphql](https://codecov.io/gh/sf-explorer/soql-to-graphql) to see your coverage reports

## 5. Coverage targets

The current configuration targets:
- **Project coverage**: 90% (threshold: 1%)
- **Patch coverage**: 80% (threshold: 1%)
- **Current coverage**: 98.19% ✅

## 6. Coverage reports

Your coverage reports will show:
- Overall project coverage
- File-by-file coverage
- Line-by-line coverage details
- Coverage trends over time
- PR coverage comparisons

## Troubleshooting

If the Codecov badge shows "unknown":
1. Ensure the repository is enabled on Codecov
2. Check that the GitHub Actions workflow is running
3. Verify the `CODECOV_TOKEN` secret is set (if using private repos)
4. Wait a few minutes for the first report to process

## Benefits

- **Visual coverage reports** with detailed line-by-line analysis
- **PR coverage comments** showing what changed
- **Coverage trends** over time
- **Coverage badges** for your README
- **Integration with GitHub** for seamless workflow
