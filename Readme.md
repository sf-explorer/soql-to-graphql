# SOQL to GraphQL

This library combines 2 powerful libraries:
- [SOQL Parser JS](https://github.com/jetstreamapp/soql-parser-js) 
- [JSON to GraphQL](https://www.npmjs.com/package/json-to-graphql-query)
To transform your SOQL into GraphQL

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
 * Query parameters