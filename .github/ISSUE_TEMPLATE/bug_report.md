---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**SOQL Query (if applicable)**

```sql
SELECT Id, Name FROM Account WHERE Name = 'Test'
```

**Generated GraphQL (if applicable)**

```graphql
query {
  uiapi {
    query {
      Account(where: { Name: { eq: "Test" } }) {
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

**Error Message (if applicable)**

```
Paste the error message here
```

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- Package version: [e.g. 0.1.4]

**Additional context**
Add any other context about the problem here.
