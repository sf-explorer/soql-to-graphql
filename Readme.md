# SOQL to GraphQL

[Online demo](https://sf-explorer.github.io/documentation/docs/Query/GraphQL/#playground)

## Installation

```
npm i @sf-explorer/soql-to-graphql
```

## Usage

```js
var converter = require ('@sf-explorer/soql-to-graphql')

console.log(converter('Select Id, Name, (select Id from Opportunities) from Account limit 3'))
```

```
query {
    uiapi {
        query {
            Account (first: 3) {
                edges {
                    node {
                        Id
                        Name {
                            value
                        }
                        Opportunities {
                            edges {
                                node {
                                    Id
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

## Roadmap

 * Where clause
 * Additional tests
 * FieldRelationship
 * Query parameters