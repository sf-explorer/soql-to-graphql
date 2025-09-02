# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive Git hooks with pre-commit and pre-push validation
- Enhanced license documentation with detailed MIT license information
- Automated release workflow with NPM publishing
- Codecov integration for coverage reporting
- Performance test removal for better CI stability
- Improved build configuration with CommonJS modules

### Changed

- Updated TypeScript configuration for better module resolution
- Enhanced README with comprehensive documentation
- Improved code formatting and linting setup
- Updated dependency versions for security

### Fixed

- Resolved module resolution issues in GitHub Actions
- Fixed broken Security Audit badge link
- Corrected performance test thresholds for CI environments
- Fixed code formatting issues across the project

## [0.1.4] - 2024-12-XX

### Added

- Initial release with basic SOQL to GraphQL conversion
- TypeScript support with comprehensive type definitions
- Basic test suite with Jest
- ESLint and Prettier configuration

### Features

- SOQL query parsing and conversion
- GraphQL query generation
- Variable binding support
- Relationship and subquery handling
- WHERE clause conversion with logical operators
- ORDER BY and LIMIT support

[Unreleased]: https://github.com/sf-explorer/soql-to-graphql/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/sf-explorer/soql-to-graphql/releases/tag/v0.1.4
