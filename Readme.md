# SOQL to GraphQL

[![npm version](https://badge.fury.io/js/@sf-explorer%2Fsoql-to-graphql.svg)](https://badge.fury.io/js/@sf-explorer%2Fsoql-to-graphql)
[![CI](https://github.com/sf-explorer/soql-to-graphql/workflows/CI/badge.svg)](https://github.com/sf-explorer/soql-to-graphql/actions/workflows/ci.yml)
[![Test Coverage](https://codecov.io/gh/sf-explorer/soql-to-graphql/branch/main/graph/badge.svg)](https://codecov.io/gh/sf-explorer/soql-to-graphql)
[![Security Audit](https://github.com/sf-explorer/soql-to-graphql/workflows/Security%20Audit/badge.svg)](https://github.com/sf-explorer/soql-to-graphql/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@sf-explorer/soql-to-graphql.svg)](https://www.npmjs.com/package/@sf-explorer/soql-to-graphql)

> 🚀 **Transform your SOQL queries into GraphQL with zero learning curve**

![logo](./logo.png)

**Are you a Salesforce developer struggling with GraphQL syntax?** Already an SOQL ninja 🥷🏿? This library is your bridge between the familiar SOQL world and the powerful GraphQL ecosystem.

**Perfect for:**

- Salesforce developers migrating to GraphQL
- Teams building modern APIs with Salesforce data
- Developers who want to leverage GraphQL without learning new syntax
- Projects requiring type-safe, efficient data queries

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [📚 API Documentation](#-api-documentation)
- [🔧 Configuration](#-configuration)

- [🛠️ Troubleshooting](#️-troubleshooting)
- [🛠️ Development](#️-development)
- [Credits](#credits)

## ✨ Features

- 🔄 **Seamless Conversion**: Convert any SOQL query to GraphQL instantly
- 🎯 **Type Safety**: Full TypeScript support with comprehensive type
- 🧪 **Battle Tested**: Comprehensive test suite with 104+ test cases
- 🔧 **Developer Friendly**: Excellent error messages and debugging support
- 📚 **Well Documented**: Extensive documentation and examples
- ⚡ **Real-time**: Supports dynamic queries with variable binding

## 🎯 Quick Start

- 📺 [Watch the intro video](https://www.youtube.com/watch?v=aqj22aEKUoM&t=661s)
- 🎮 [Try the playground](https://sf-explorer.github.io/documentation/docs/Explore/GraphQL/#playground)
- 📖 [Read the documentation](#documentation)

## 📦 Installation

### npm

```bash
npm install @sf-explorer/soql-to-graphql
```

### yarn

```bash
yarn add @sf-explorer/soql-to-graphql
```

### pnpm

```bash
pnpm add @sf-explorer/soql-to-graphql
```

### CDN (Browser)

```html
<script src="https://unpkg.com/@sf-explorer/soql-to-graphql@latest/dist/index.js"></script>
```

### Requirements

- Node.js 18.x or higher
- TypeScript 5.x (optional, for type definitions)

## 🚀 Usage

### Basic Example

```javascript
import soql2graphql from '@sf-explorer/soql-to-graphql';

// Simple SOQL query
const soql = 'SELECT Id, Name FROM Account LIMIT 5';
const graphql = soql2graphql(soql);

console.log(graphql);
```

**Output:**

```graphql
query {
  uiapi {
    query {
      Account(first: 5) {
        edges {
          node {
            Id
            Name {
              value
            }
          }
        }
      }
    }
  }
}
```

### Advanced Queries with Relationships

```javascript
const soql = `
  SELECT Id, Name, Owner.Name, 
         (SELECT Id, Name, Amount FROM Opportunities WHERE StageName = 'Closed Won')
  FROM Account 
  WHERE Industry = 'Technology' 
  ORDER BY Name ASC 
  LIMIT 10
`;

const graphql = soql2graphql(soql);
```

**Output:**

```graphql
query {
  uiapi {
    query {
      Account(
        first: 10
        where: { Industry: { eq: "Technology" } }
        orderBy: { Name: { order: ASC } }
      ) {
        edges {
          node {
            Id
            Name {
              value
            }
            Owner {
              Name {
                value
              }
            }
            Opportunities(where: { StageName: { eq: "Closed Won" } }) {
              edges {
                node {
                  Id
                  Name {
                    value
                  }
                  Amount {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Dynamic Queries with Variables

```javascript
const soql = `
  SELECT Id, Name, Email 
  FROM Contact 
  WHERE AccountId = :accountId 
    AND IsActive = :isActive
  ORDER BY Name ASC
`;

const variables = {
  accountId: 'ID!',
  isActive: 'Boolean',
};

const graphql = soql2graphql(soql, variables);
```

**Output:**

```graphql
query ($accountId: ID!, $isActive: Boolean) {
  uiapi {
    query {
      Contact(
        where: {
          and: [
            { AccountId: { eq: $accountId } }
            { IsActive: { eq: $isActive } }
          ]
        }
        orderBy: { Name: { order: ASC } }
      ) {
        edges {
          node {
            Id
            Name {
              value
            }
            Email {
              value
            }
          }
        }
      }
    }
  }
}
```

### Complex WHERE Conditions

```javascript
const soql = `
  SELECT Id, Name, Amount, StageName
  FROM Opportunity
  WHERE (Amount > 10000 AND StageName = 'Closed Won')
     OR (Amount > 5000 AND StageName = 'Prospecting')
  ORDER BY Amount DESC
  LIMIT 20
`;

const graphql = soql2graphql(soql);
```

**Output:**

```graphql
query {
  uiapi {
    query {
      Opportunity(
        first: 20
        where: {
          or: [
            {
              and: [
                { Amount: { gt: 10000 } }
                { StageName: { eq: "Closed Won" } }
              ]
            }
            {
              and: [
                { Amount: { gt: 5000 } }
                { StageName: { eq: "Prospecting" } }
              ]
            }
          ]
        }
        orderBy: { Amount: { order: DESC } }
      ) {
        edges {
          node {
            Id
            Name {
              value
            }
            Amount {
              value
            }
            StageName {
              value
            }
          }
        }
      }
    }
  }
}
```

## 📚 API Documentation

### `soql2graphql(soql: string, variables?: TInput): string`

Converts a SOQL query string to GraphQL format.

#### Parameters

- **`soql`** (string, required): The SOQL query to convert
- **`variables`** (TInput, optional): Variable definitions for bind variables

#### Returns

- **`string`**: The generated GraphQL query

#### Example

```typescript
import soql2graphql, { TInput } from '@sf-explorer/soql-to-graphql';

const soql = 'SELECT Id FROM Account WHERE Name = :name';
const variables: TInput = { name: 'String' };
const graphql = soql2graphql(soql, variables);
```

### Type Definitions

```typescript
interface TInput {
  [prop: string]: string;
}

type ComparisonOperator =
  | 'eq'
  | 'ne'
  | 'like'
  | 'in'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';
type LogicalOperator = 'and' | 'or';
type OrderDirection = 'ASC' | 'DESC';
```

### Supported SOQL Features

| Feature              | Status | Example                                                  |
| -------------------- | ------ | -------------------------------------------------------- |
| Basic SELECT         | ✅     | `SELECT Id, Name FROM Account`                           |
| WHERE clauses        | ✅     | `WHERE Name = 'Test'`                                    |
| ORDER BY             | ✅     | `ORDER BY Name ASC`                                      |
| LIMIT                | ✅     | `LIMIT 10`                                               |
| Relationships        | ✅     | `SELECT Owner.Name FROM Account`                         |
| Subqueries           | ✅     | `SELECT Id, (SELECT Id FROM Opportunities) FROM Account` |
| Variable binding     | ✅     | `WHERE Name = :name`                                     |
| Logical operators    | ✅     | `WHERE A = 1 AND B = 2`                                  |
| Comparison operators | ✅     | `WHERE Amount > 1000`                                    |
| IN clauses           | ✅     | `WHERE Id IN ('001', '002')`                             |
| LIKE patterns        | ✅     | `WHERE Name LIKE '%Test%'`                               |
| Functions            | ✅     | `SELECT COUNT(Id) FROM Account`                          |

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Set custom GraphQL endpoint
GRAPHQL_ENDPOINT=https://your-instance.salesforce.com/graphql

# Optional: Enable debug mode
DEBUG=soql-to-graphql
```

### Error Handling

```javascript
try {
  const graphql = soql2graphql(invalidSoql);
} catch (error) {
  console.error('Conversion failed:', error.message);
  // Handle error appropriately
}
```

## 🛠️ Troubleshooting

### Common Issues

#### "Invalid SOQL query" Error

```javascript
// ❌ Incorrect
const soql = 'SELECT Id FROM'; // Missing table name

// ✅ Correct
const soql = 'SELECT Id FROM Account';
```

#### Variable Binding Issues

```javascript
// ❌ Incorrect
const soql = 'SELECT Id FROM Account WHERE Name = :name';
const variables = { name: 'John' }; // Missing type definition

// ✅ Correct
const soql = 'SELECT Id FROM Account WHERE Name = :name';
const variables = { name: 'String' }; // Include type
```

#### Complex WHERE Conditions

```javascript
// ❌ Incorrect - Missing parentheses
const soql = 'SELECT Id FROM Account WHERE A = 1 AND B = 2 OR C = 3';

// ✅ Correct - Proper grouping
const soql = 'SELECT Id FROM Account WHERE (A = 1 AND B = 2) OR C = 3';
```

### Debug Mode

Enable debug mode to see detailed conversion information:

```javascript
process.env.DEBUG = 'soql-to-graphql';
const graphql = soql2graphql(soql);
```

### Getting Help

1. **Check the [Issues](https://github.com/sf-explorer/soql-to-graphql/issues)** for known problems
2. **Create a new issue** with:
   - Your SOQL query
   - Expected vs actual output
   - Error messages
   - Environment details

### FAQ

**Q: Can I use this with any GraphQL client?**
A: Yes! The output is standard GraphQL that works with any client.

**Q: Does this support all SOQL features?**
A: We support the most common SOQL features. Check the [supported features table](#supported-soql-features).

**Q: How do I handle custom fields?**
A: Custom fields work the same as standard fields. Just use the API name: `SELECT Custom_Field__c FROM Account`.

**Q: Can I convert multiple queries at once?**
A: Currently, you need to convert each query individually, but you can batch the calls for efficiency.

## 🛠️ Development

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Git

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/sf-explorer/soql-to-graphql.git
cd soql-to-graphql

# Install dependencies
npm install

# Run the development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### Available Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run build`       | Build the project for production    |
| `npm run build:watch` | Build in watch mode for development |
| `npm run test`        | Run the complete test suite         |
| `npm run test:watch`  | Run tests in watch mode             |
| `npm run test:ci`     | Run tests for CI environment        |
| `npm run lint`        | Run ESLint code quality checks      |
| `npm run lint:fix`    | Fix ESLint issues automatically     |
| `npm run prettier`    | Format code with Prettier           |
| `npm run type-check`  | Run TypeScript type checking        |
| `npm run ci`          | Run complete CI pipeline locally    |

### Project Structure

```
src/
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
├── operators.ts       # SOQL operator conversion logic
├── whereConverter.ts  # WHERE clause conversion
├── fieldConverter.ts  # Field conversion logic
├── queryConverter.ts  # Main query conversion
├── converter.ts       # Main entry point
└── main.ts           # Public API

__test__/
├── unit/              # Unit tests for individual modules
├── integration/       # End-to-end integration tests

└── fixtures/          # Test data and fixtures
```

### Testing Strategy

The project includes comprehensive testing with **96%+ coverage**:

- **🧪 Unit Tests**: Individual module testing
- **🔗 Integration Tests**: End-to-end functionality

- **🛡️ Error Handling**: Edge cases and error scenarios
- **📊 Coverage Reports**: Detailed coverage analysis

### Code Quality

- **ESLint**: Code quality and style enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and IntelliSense
- **Husky**: Git hooks for quality gates
- **Jest**: Comprehensive testing framework

### Contributing Guidelines

We welcome contributions! Here's how to get started:

#### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/soql-to-graphql.git
cd soql-to-graphql
```

#### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

#### 3. Make Your Changes

- Write clean, well-documented code
- Add tests for new functionality
- Update documentation as needed
- Follow the existing code style

#### 4. Test Your Changes

```bash
npm run ci  # Run complete CI pipeline
```

#### 5. Submit a Pull Request

- Provide a clear description of your changes
- Reference any related issues
- Ensure all CI checks pass

### CI/CD Pipeline

Our GitHub Actions workflow ensures code quality:

- **🔄 Continuous Integration**: Runs on every push and PR
- **🔒 Security Audits**: Automated vulnerability scanning
- **📦 Dependency Updates**: Weekly automated updates
- **🚀 Release Automation**: Automated versioning and publishing
- **📊 Coverage Reporting**: Code coverage tracking

### Release Process

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update `CHANGELOG.md` with new features
3. **Tag Release**: Create a git tag (e.g., `v1.0.0`)
4. **Automated Build**: GitHub Actions builds and publishes
5. **NPM Publishing**: Package automatically published to NPM

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **📖 Documentation**: [Full documentation](https://github.com/sf-explorer/soql-to-graphql#readme)
- **🐛 Issues**: [Report bugs](https://github.com/sf-explorer/soql-to-graphql/issues)
- **💬 Discussions**: [Community discussions](https://github.com/sf-explorer/soql-to-graphql/discussions)
- **📧 Contact**: [ndespres@gmail.com](mailto:ndespres@gmail.com)

## 🙏 Credits

This utility would be nothing without these powerful libraries:

- [SOQL Parser JS](https://github.com/jetstreamapp/soql-parser-js) - SOQL parsing engine
- [JSON to GraphQL](https://www.npmjs.com/package/json-to-graphql-query) - GraphQL query generation

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sf-explorer/soql-to-graphql&type=Date)](https://star-history.com/#sf-explorer/soql-to-graphql&Date)

---

<div align="center">
  <strong>Made with ❤️ for the Salesforce community</strong>
  <br>
  <sub>If this project helps you, please give it a ⭐ on GitHub!</sub>
</div>
