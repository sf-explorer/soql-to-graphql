---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**SOQL Example (if applicable)**

```sql
SELECT Id, Name FROM Account WHERE CustomField__c = 'Value'
```

**Expected GraphQL Output (if applicable)**

```graphql
query {
  uiapi {
    query {
      Account(where: { CustomField__c: { eq: "Value" } }) {
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

**Additional context**
Add any other context or screenshots about the feature request here.
